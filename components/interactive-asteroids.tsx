"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"

/**
 * Real 3D asteroid field — instanced, normal-mapped rocks lit by directional
 * lights and tumbled on all three axes, so new craters swing into view as
 * they rotate instead of a flat sprite just spinning in the screen plane.
 *
 * SHAPE VARIETY: rocks are split across three geometry "recipes" (chunky,
 * elongated, jagged) instead of one shared silhouette. Each recipe gets its
 * own THREE.InstancedMesh, so the whole field is still only 3 draw calls
 * total — not one per rock — and all three share a single baked material
 * (one albedo map + one normal map), so there's no extra texture memory
 * cost for the variety.
 *
 * Interaction: hovering over a rock for a short dwell (HOVER_BREAK_MS)
 * breaks it into fragments, which are handed out to whichever shape group
 * has a free slot — so debris reads as a natural mix of rock types, not
 * clones of the parent.
 *
 * Install:  npm install three @react-three/fiber
 *
 * Usage (swap in for the old <InteractiveAsteroids />):
 *   import dynamic from "next/dynamic"
 *   const InteractiveAsteroids3D = dynamic(
 *     () => import("@/components/interactive-asteroids-3d").then(m => m.InteractiveAsteroids3D),
 *     { ssr: false } // WebGL is client-only
 *   )
 *   <div className="absolute inset-0"><InteractiveAsteroids3D /></div>
 */

const NUM_ASTEROIDS = 26
const MIN_RADIUS = 6
const MAX_RADIUS = 28
const GRAVITY_RADIUS = 180
const GRAVITY_STRENGTH = 0.045
const SPLIT_FRAGMENTS = 3
const MIN_SPLIT_RADIUS = 9
const HOVER_BREAK_MS = 150 // cursor dwell time (ms) before a hovered rock breaks
const SHAPE_GROUPS = 3
const POOL_PER_GROUP = Math.ceil((NUM_ASTEROIDS * 2.5) / SHAPE_GROUPS) // headroom for fragments, per shape

type Rock = {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  rx: number
  ry: number
  rz: number
  rvx: number
  rvy: number
  rvz: number
  alive: boolean
  canSplit: boolean
  hover: number
}

function makeRock(
  width: number,
  height: number,
  opts?: Partial<Pick<Rock, "x" | "y" | "vx" | "vy" | "radius">>,
  spawnMode: "random" | "edge" = "edge"
): Rock {
  const radius = opts?.radius ?? Math.random() * (MAX_RADIUS - MIN_RADIUS) + MIN_RADIUS
  let x = opts?.x
  let y = opts?.y
  if (x === undefined || y === undefined) {
    if (spawnMode === "random") {
      x = Math.random() * width
      y = Math.random() * height
    } else if (Math.random() > 0.5) {
      x = Math.random() > 0.5 ? -radius : width + radius
      y = Math.random() * height
    } else {
      x = Math.random() * width
      y = Math.random() > 0.5 ? -radius : height + radius
    }
  }
  return {
    x,
    y,
    vx: opts?.vx ?? (Math.random() - 0.5) * 0.5,
    vy: opts?.vy ?? (Math.random() - 0.5) * 0.5,
    radius,
    rx: Math.random() * Math.PI * 2,
    ry: Math.random() * Math.PI * 2,
    rz: Math.random() * Math.PI * 2,
    rvx: (Math.random() - 0.5) * 0.008,
    rvy: (Math.random() - 0.5) * 0.008,
    rvz: (Math.random() - 0.5) * 0.008,
    alive: true,
    canSplit: radius >= MIN_SPLIT_RADIUS,
    hover: 0,
  }
}

type ShapeRecipe = {
  detail: number
  lobeCount: number
  ampMin: number
  ampMax: number
  stretch: [number, number, number]
}

// Three distinct silhouettes: a chunky round rock, an elongated oblong one,
// and a jagged low-lobe-count one. Varying detail/lobe-count/stretch (rather
// than just amplitude) is what makes them read as different rock *types*
// instead of the same rock scaled differently.
const SHAPE_RECIPES: ShapeRecipe[] = [
  { detail: 3, lobeCount: 6, ampMin: 0.22, ampMax: 0.34, stretch: [1, 1, 1] },
  { detail: 2, lobeCount: 5, ampMin: 0.2, ampMax: 0.3, stretch: [1.45, 0.85, 1] },
  { detail: 2, lobeCount: 4, ampMin: 0.35, ampMax: 0.5, stretch: [1, 1, 1.2] },
]

/** Perturbs an icosahedron along a few random noise "lobes", then applies a
 *  non-uniform stretch, so each recipe produces a distinct irregular rock
 *  silhouette without needing a noise library or external assets. */
function createRockGeometry(recipe: ShapeRecipe) {
  const geo = new THREE.IcosahedronGeometry(1, recipe.detail)
  const pos = geo.attributes.position
  const v = new THREE.Vector3()
  const lobes = Array.from({ length: recipe.lobeCount }, () => ({
    dir: new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize(),
    amp: (Math.random() * (recipe.ampMax - recipe.ampMin) + recipe.ampMin) * (Math.random() < 0.5 ? -1 : 1),
    freq: 1.5 + Math.random() * 2.5,
  }))
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i)
    const n = v.clone().normalize()
    let disp = 0
    for (const lobe of lobes) disp += Math.sin((n.dot(lobe.dir) + 1) * lobe.freq * Math.PI) * lobe.amp
    disp += (Math.sin(v.x * 23.1) + Math.sin(v.y * 19.7) + Math.sin(v.z * 17.3)) * 0.015
    v.multiplyScalar(1 + disp)
    v.x *= recipe.stretch[0]
    v.y *= recipe.stretch[1]
    v.z *= recipe.stretch[2]
    pos.setXYZ(i, v.x, v.y, v.z)
  }
  geo.computeVertexNormals()
  return geo
}

/** Bakes an albedo map + a normal map from the same crater heightfield, so
 *  lighting reacts correctly to every dent as the rock tumbles in 3D. Shared
 *  by every shape group — one texture pair total, regardless of variety. */
function createRockTextures(size = 512) {
  const heightCanvas = document.createElement("canvas")
  heightCanvas.width = heightCanvas.height = size
  const hctx = heightCanvas.getContext("2d")!
  hctx.fillStyle = "#808080"
  hctx.fillRect(0, 0, size, size)

  const craterCount = 46
  for (let i = 0; i < craterCount; i++) {
    const x = Math.random() * size
    const y = Math.random() * size
    const r = Math.random() * size * 0.07 + size * 0.015
    const grad = hctx.createRadialGradient(x, y, 0, x, y, r)
    grad.addColorStop(0, "#2e2e2e")
    grad.addColorStop(0.7, "#5c5c5c")
    grad.addColorStop(1, "#808080")
    hctx.fillStyle = grad
    hctx.beginPath()
    hctx.arc(x, y, r, 0, Math.PI * 2)
    hctx.fill()
    hctx.strokeStyle = "rgba(190,190,190,0.35)"
    hctx.lineWidth = Math.max(1, r * 0.08)
    hctx.beginPath()
    hctx.arc(x, y, r * 1.05, 0, Math.PI * 2)
    hctx.stroke()
  }

  const field = hctx.getImageData(0, 0, size, size)
  for (let i = 0; i < field.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 18
    field.data[i] += n
    field.data[i + 1] += n
    field.data[i + 2] += n
  }
  hctx.putImageData(field, 0, 0)

  const src = hctx.getImageData(0, 0, size, size).data
  const heightAt = (x: number, y: number) => {
    const xx = (x + size) % size
    const yy = (y + size) % size
    return src[(yy * size + xx) * 4] / 255
  }

  const normalCanvas = document.createElement("canvas")
  normalCanvas.width = normalCanvas.height = size
  const nctx = normalCanvas.getContext("2d")!
  const normalImg = nctx.createImageData(size, size)
  const strength = 2.2
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const l = heightAt(x - 1, y)
      const r = heightAt(x + 1, y)
      const u = heightAt(x, y - 1)
      const d = heightAt(x, y + 1)
      const dx = (l - r) * strength
      const dy = (u - d) * strength
      const dz = 1
      const len = Math.sqrt(dx * dx + dy * dy + dz * dz)
      const idx = (y * size + x) * 4
      normalImg.data[idx] = ((dx / len) * 0.5 + 0.5) * 255
      normalImg.data[idx + 1] = ((dy / len) * 0.5 + 0.5) * 255
      normalImg.data[idx + 2] = ((dz / len) * 0.5 + 0.5) * 255
      normalImg.data[idx + 3] = 255
    }
  }
  nctx.putImageData(normalImg, 0, 0)

  const albedoCanvas = document.createElement("canvas")
  albedoCanvas.width = albedoCanvas.height = size
  const actx = albedoCanvas.getContext("2d")!
  const albedoImg = actx.createImageData(size, size)
  for (let i = 0; i < src.length; i += 4) {
    const t = src[i] / 255
    albedoImg.data[i] = Math.round(26 + t * 120)
    albedoImg.data[i + 1] = Math.round(22 + t * 100)
    albedoImg.data[i + 2] = Math.round(40 + t * 84)
    albedoImg.data[i + 3] = 255
  }
  actx.putImageData(albedoImg, 0, 0)

  const map = new THREE.CanvasTexture(albedoCanvas)
  const normalMap = new THREE.CanvasTexture(normalCanvas)
  map.wrapS = map.wrapT = THREE.RepeatWrapping
  normalMap.wrapS = normalMap.wrapT = THREE.RepeatWrapping
  map.colorSpace = THREE.SRGBColorSpace
  return { map, normalMap }
}

function Field({
  width,
  height,
  mouseRef,
}: {
  width: number
  height: number
  mouseRef: { current: { x: number; y: number } }
}) {
  const meshRef0 = useRef<THREE.InstancedMesh>(null!)
  const meshRef1 = useRef<THREE.InstancedMesh>(null!)
  const meshRef2 = useRef<THREE.InstancedMesh>(null!)
  const meshRefs = useMemo(() => [meshRef0, meshRef1, meshRef2], [])
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const groupsRef = useRef<Rock[][]>([[], [], []])

  // Geometries (one per shape recipe) and the shared material are baked
  // ONCE and reused for every instance in their group.
  const geometries = useMemo(() => SHAPE_RECIPES.map(createRockGeometry), [])
  const { map, normalMap } = useMemo(() => createRockTextures(512), [])
  const material = useMemo(
    () => new THREE.MeshStandardMaterial({ map, normalMap, roughness: 0.95, metalness: 0.05 }),
    [map, normalMap]
  )

  useEffect(() => {
    meshRefs.forEach((ref) => ref.current?.instanceMatrix.setUsage(THREE.DynamicDrawUsage))
  }, [meshRefs])

  useEffect(() => {
    const groups: Rock[][] = [[], [], []]
    for (let i = 0; i < NUM_ASTEROIDS; i++) {
      const g = i % SHAPE_GROUPS
      groups[g].push(makeRock(width, height, undefined, "random"))
    }
    for (let g = 0; g < SHAPE_GROUPS; g++) {
      while (groups[g].length < POOL_PER_GROUP) {
        const dead = makeRock(width, height, { x: -9999, y: -9999, vx: 0, vy: 0 })
        dead.alive = false
        groups[g].push(dead)
      }
    }
    groupsRef.current = groups
  }, [width, height])

  const findFreeSlot = (groups: Rock[][]): [number, number] | null => {
    const order = [0, 1, 2].sort(() => Math.random() - 0.5)
    for (const g of order) {
      const idx = groups[g].findIndex((r) => !r.alive)
      if (idx !== -1) return [g, idx]
    }
    return null
  }

  const breakRock = (groupIdx: number, index: number, groups: Rock[][]) => {
    const hit = groups[groupIdx][index]
    hit.alive = false
    if (!hit.canSplit) return
    for (let i = 0; i < SPLIT_FRAGMENTS; i++) {
      const slot = findFreeSlot(groups)
      if (!slot) break
      const [g, idx] = slot
      const angle = (Math.PI * 2 * i) / SPLIT_FRAGMENTS + Math.random() * 0.5
      const speed = 1.2 + Math.random() * 1.5
      groups[g][idx] = makeRock(width, height, {
        x: hit.x,
        y: hit.y,
        radius: hit.radius * (0.4 + Math.random() * 0.25),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
      })
    }
  }

  useFrame((_, delta) => {
    const groups = groupsRef.current
    if (!groups[0]?.length) return
    const dtMs = delta * 1000
    const mouse = mouseRef.current

    for (let g = 0; g < SHAPE_GROUPS; g++) {
      const mesh = meshRefs[g].current
      const rocks = groups[g]
      if (!mesh) continue

      for (let i = 0; i < rocks.length; i++) {
        const rock = rocks[i]

        if (rock.alive) {
          const dx = mouse.x - rock.x
          const dy = mouse.y - rock.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < GRAVITY_RADIUS && dist > 1) {
            const pull = (1 - dist / GRAVITY_RADIUS) * GRAVITY_STRENGTH
            rock.vx += (dx / dist) * pull * 0.4 + (-dy / dist) * pull * 0.6
            rock.vy += (dy / dist) * pull * 0.4 + (dx / dist) * pull * 0.6
          }
          rock.vx *= 0.995
          rock.vy *= 0.995
          rock.x += rock.vx
          rock.y += rock.vy
          rock.rx += rock.rvx
          rock.ry += rock.rvy
          rock.rz += rock.rvz

          if (
            rock.x < -rock.radius * 2 ||
            rock.x > width + rock.radius * 2 ||
            rock.y < -rock.radius * 2 ||
            rock.y > height + rock.radius * 2
          ) {
            rocks[i] = makeRock(width, height, { radius: rock.radius }, "edge")
          } else {
            const hovered = dist <= rock.radius
            rock.hover = hovered ? rock.hover + dtMs : 0
            if (hovered && rock.hover >= HOVER_BREAK_MS) breakRock(g, i, groups)
          }
        }

        const scale = rock.alive ? rock.radius : 0
        dummy.position.set(rock.x, height - rock.y, 0)
        dummy.rotation.set(rock.rx, rock.ry, rock.rz)
        dummy.scale.setScalar(scale)
        dummy.updateMatrix()
        mesh.setMatrixAt(i, dummy.matrix)
      }
      mesh.instanceMatrix.needsUpdate = true
    }
  })

  return (
    <>
      {geometries.map((geo, g) => (
        <instancedMesh key={g} ref={meshRefs[g]} args={[geo, material, POOL_PER_GROUP]} frustumCulled={false} />
      ))}
    </>
  )
}

export function InteractiveAsteroids3D({ className = "" }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const updateSize = () => setSize({ width: el.offsetWidth, height: el.offsetHeight })
    updateSize()
    const ro = new ResizeObserver(updateSize)
    ro.observe(el)

    const handleMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    const handleLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 }
    }
    el.addEventListener("pointermove", handleMove)
    el.addEventListener("pointerleave", handleLeave)

    return () => {
      ro.disconnect()
      el.removeEventListener("pointermove", handleMove)
      el.removeEventListener("pointerleave", handleLeave)
    }
  }, [])

  return (
    <div ref={containerRef} className={`absolute inset-0 w-full h-full ${className}`} style={{ pointerEvents: "auto" }}>
      {size.width > 0 && size.height > 0 && (
        <Canvas
          orthographic
          camera={{ left: 0, right: size.width, top: size.height, bottom: 0, near: 0.1, far: 1000, position: [0, 0, 500] }}
          gl={{ alpha: true, antialias: true }}
          style={{ background: "transparent" }}
          dpr={[1, 1.5]}
        >
          <ambientLight intensity={0.35} color="#3a3550" />
          <directionalLight position={[-120, 160, 200]} intensity={1.4} color="#ffcf9a" />
          <directionalLight position={[150, -100, 100]} intensity={0.25} color="#5b6fff" />
          <Field width={size.width} height={size.height} mouseRef={mouseRef} />
        </Canvas>
      )}
    </div>
  )
}
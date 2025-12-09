"use client"

import { useRef, useEffect, useState, useMemo } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Stars } from "@react-three/drei"
import * as THREE from "three"

function ParallaxStars() {
  const starsRef = useRef<THREE.Points>(null)

  useFrame(() => {
    if (starsRef.current) {
      starsRef.current.rotation.x += 0.00008
      starsRef.current.rotation.y += 0.00005
    }
  })

  return <Stars ref={starsRef} radius={200} depth={100} count={2000} factor={4} saturation={0} fade speed={0.3} />
}

function FloatingOrbs() {
  const count = 15
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const orbData = useMemo(
    () =>
      new Array(count).fill(0).map(() => ({
        x: THREE.MathUtils.randFloatSpread(60),
        y: THREE.MathUtils.randFloatSpread(40),
        z: THREE.MathUtils.randFloat(-30, -5),
        speedX: THREE.MathUtils.randFloat(0.005, 0.02),
        speedY: THREE.MathUtils.randFloat(0.003, 0.015),
        phase: Math.random() * Math.PI * 2,
        scale: THREE.MathUtils.randFloat(0.3, 0.8),
      })),
    [],
  )

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    orbData.forEach((orb, i) => {
      const x = orb.x + Math.sin(t * orb.speedX + orb.phase) * 8
      const y = orb.y + Math.cos(t * orb.speedY + orb.phase) * 6

      dummy.position.set(x, y, orb.z)
      dummy.scale.setScalar(orb.scale * (1 + Math.sin(t * 0.5 + orb.phase) * 0.2))
      dummy.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.matrix)
    })
    meshRef.current!.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.08} blending={THREE.AdditiveBlending} />
    </instancedMesh>
  )
}

function ShootingStars() {
  const count = 40
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const starData = useMemo(
    () =>
      new Array(count).fill(0).map(() => ({
        x: THREE.MathUtils.randFloatSpread(80),
        y: THREE.MathUtils.randFloatSpread(60),
        z: THREE.MathUtils.randFloat(-50, -10),
        speed: THREE.MathUtils.randFloat(0.15, 0.4), // Faster speed
        angle: THREE.MathUtils.randFloat(-0.3, 0.3),
        length: THREE.MathUtils.randFloat(0.5, 2),
      })),
    [],
  )

  useFrame(() => {
    starData.forEach((star, i) => {
      star.x += star.speed
      star.y -= star.speed * 0.3

      if (star.x > 40) {
        star.x = THREE.MathUtils.randFloat(-50, -40)
        star.y = THREE.MathUtils.randFloat(20, 40)
      }

      dummy.position.set(star.x, star.y, star.z)
      dummy.rotation.z = -Math.PI / 4 + star.angle
      dummy.scale.set(star.length, 0.02, 0.02)
      dummy.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.matrix)
    })
    meshRef.current!.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.7} blending={THREE.AdditiveBlending} />
    </instancedMesh>
  )
}

function Constellations() {
  const linesRef = useRef<THREE.LineSegments>(null)

  const positions = useMemo(() => {
    const pts: number[] = []
    for (let i = 0; i < 20; i++) {
      const x1 = THREE.MathUtils.randFloatSpread(40)
      const y1 = THREE.MathUtils.randFloatSpread(30)
      const z1 = THREE.MathUtils.randFloat(-40, -20)

      const x2 = x1 + THREE.MathUtils.randFloat(-2, 2)
      const y2 = y1 + THREE.MathUtils.randFloat(-2, 2)
      const z2 = z1 + THREE.MathUtils.randFloat(-0.5, 0.5)

      pts.push(x1, y1, z1, x2, y2, z2)
    }
    return new Float32Array(pts)
  }, [])

  useFrame(({ clock }) => {
    if (!linesRef.current) return
    const t = clock.getElapsedTime()
    ;(linesRef.current.material as THREE.LineBasicMaterial).opacity = 0.2 + Math.sin(t * 0.8) * 0.1
  })

  return (
    <lineSegments ref={linesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={positions.length / 3} itemSize={3} />
      </bufferGeometry>
      <lineBasicMaterial color="#ffb080" opacity={0.25} transparent />
    </lineSegments>
  )
}

function CosmicHazePlane({
  position,
  scale,
  color1,
  color2,
  pulseSpeed = 0.3,
}: { position: [number, number, number]; scale: number; color1: string; color2: string; pulseSpeed?: number }) {
  const meshRef = useRef<THREE.Mesh>(null)

  const texture = useMemo(() => {
    const canvas = document.createElement("canvas")
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext("2d")!

    const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256)
    gradient.addColorStop(0, color1)
    gradient.addColorStop(0.4, color2)
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)")

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 512, 512)

    return new THREE.CanvasTexture(canvas)
  }, [color1, color2])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.elapsedTime
    meshRef.current.rotation.z = Math.sin(t * 0.02) * 0.03
    ;(meshRef.current.material as THREE.MeshBasicMaterial).opacity = 0.12 + Math.sin(t * pulseSpeed) * 0.04
  })

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[35 * scale, 25 * scale]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={0.12}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  )
}

function NebulaPlane({
  position,
  scale,
  opacity,
}: { position: [number, number, number]; scale: number; opacity: number }) {
  const meshRef = useRef<THREE.Mesh>(null)

  const texture = useMemo(() => {
    const canvas = document.createElement("canvas")
    canvas.width = 600
    canvas.height = 600
    const ctx = canvas.getContext("2d")!

    const gradient = ctx.createRadialGradient(300, 300, 0, 300, 300, 300)
    gradient.addColorStop(0, "rgba(255, 140, 80, 0.25)")
    gradient.addColorStop(0.3, "rgba(255, 100, 60, 0.15)")
    gradient.addColorStop(0.6, "rgba(180, 80, 60, 0.08)")
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)")

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 600, 600)

    return new THREE.CanvasTexture(canvas)
  }, [])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.elapsedTime

    meshRef.current.rotation.z = Math.sin(t * 0.03) * 0.03
    ;(meshRef.current.material as THREE.MeshBasicMaterial).opacity = opacity + Math.sin(t * 0.5) * 0.03
  })

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[45 * scale, 35 * scale]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={opacity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  )
}

function CameraDolly() {
  const { camera } = useThree()

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    camera.position.z = 12 + Math.sin(t * 0.05) * 0.5
    camera.position.x = Math.sin(t * 0.03) * 0.4
    camera.position.y = Math.cos(t * 0.02) * 0.3
  })

  return null
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.4} color="#ffb060" />
      <pointLight position={[-10, -10, -5]} intensity={0.3} color="#ff6040" />

      <CameraDolly />
      <ParallaxStars />
      <Constellations />
      <ShootingStars />
      <FloatingOrbs />

      {/* Nebula layers */}
      <NebulaPlane position={[0, 0, -45]} scale={2.5} opacity={0.12} />
      <NebulaPlane position={[12, 5, -35]} scale={1.8} opacity={0.1} />
      <NebulaPlane position={[-10, -5, -30]} scale={1.5} opacity={0.08} />

      {/* Orange/Gold/Red cosmic haze fog planes */}
      <CosmicHazePlane
        position={[-12, 8, -25]}
        scale={2}
        color1="rgba(255, 120, 60, 0.2)"
        color2="rgba(255, 80, 40, 0.1)"
        pulseSpeed={0.25}
      />
      <CosmicHazePlane
        position={[15, -5, -30]}
        scale={2.2}
        color1="rgba(255, 180, 80, 0.18)"
        color2="rgba(255, 140, 60, 0.08)"
        pulseSpeed={0.35}
      />
      <CosmicHazePlane
        position={[0, 12, -20]}
        scale={1.8}
        color1="rgba(255, 100, 50, 0.15)"
        color2="rgba(200, 60, 40, 0.06)"
        pulseSpeed={0.4}
      />
      <CosmicHazePlane
        position={[-8, -10, -35]}
        scale={2.5}
        color1="rgba(255, 160, 100, 0.12)"
        color2="rgba(255, 120, 80, 0.05)"
        pulseSpeed={0.2}
      />
    </>
  )
}

export function CosmicBackground() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }} gl={{ antialias: true, alpha: true }}>
        <Scene />
      </Canvas>
    </div>
  )
}

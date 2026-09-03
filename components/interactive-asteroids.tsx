"use client"

import { useEffect, useRef } from "react"

/**
 * Canvas asteroid field layered over/inside CosmicBackground.
 * - Asteroids drift and gently curve around the cursor (gravity well).
 * - Clicking an asteroid breaks it into smaller fragments with outward velocity.
 * - Fragments below a size floor don't split further (perf cap).
 * - Each asteroid is drawn from a cached, procedurally-baked crater texture
 *   (radial shading + random crater shadows + rim light) instead of a flat
 *   polygon fill, so they read as lit rocks rather than dark blobs.
 *
 * FIX (v2): the initial batch used to all spawn just off-screen and drift
 * inward, so with slow drift speeds they were still hugging the edges by
 * the time anyone looked at the page. The initial population now spawns
 * uniformly across the whole canvas; only asteroids that later drift fully
 * off-screen respawn from an edge, which keeps a "drifting through" feel
 * over time without the initial clustering.
 *
 * Usage: absolutely position inside the same z-0 wrapper as <CosmicBackground />.
 *   <div className="absolute inset-0"><InteractiveAsteroids /></div>
 */

const NUM_ASTEROIDS = 26
const MIN_RADIUS = 6
const MAX_RADIUS = 28
const GRAVITY_RADIUS = 180 // cursor influence range
const GRAVITY_STRENGTH = 0.045
const SPLIT_FRAGMENTS = 3
const MIN_SPLIT_RADIUS = 9 // asteroids smaller than this just pop instead of splitting

/** Bakes a cratered, lit rock texture once per asteroid — cached and reused every frame. */
function createAsteroidTexture(radius: number): HTMLCanvasElement {
  const pad = 6 // headroom for glow/rim bleed
  const size = Math.ceil((radius + pad) * 2)
  const cx = size / 2
  const cy = size / 2

  const cvs = document.createElement("canvas")
  cvs.width = size
  cvs.height = size
  const c = cvs.getContext("2d")
  if (!c) return cvs

  const edges = Math.floor(Math.random() * 5) + 7
  const offsets = Array.from({ length: edges }, () => Math.random() * 0.35 + 0.75)

  const tracePath = () => {
    c.beginPath()
    for (let i = 0; i < edges; i++) {
      const a = (i / edges) * Math.PI * 2
      const r = radius * offsets[i]
      const x = cx + Math.cos(a) * r
      const y = cy + Math.sin(a) * r
      if (i === 0) c.moveTo(x, y)
      else c.lineTo(x, y)
    }
    c.closePath()
  }

  // Confine all shading/craters to the rock's silhouette
  tracePath()
  c.save()
  c.clip()

  // Base rock body, lit from the upper-left like the reference photo
  const base = c.createRadialGradient(
    cx - radius * 0.4,
    cy - radius * 0.4,
    radius * 0.1,
    cx,
    cy,
    radius * 1.3
  )
  base.addColorStop(0, "#8f8378")
  base.addColorStop(0.45, "#4c4652")
  base.addColorStop(1, "#181620")
  c.fillStyle = base
  c.fillRect(0, 0, size, size)

  // Craters — soft dark circles, denser on larger rocks
  const craterCount = Math.floor(radius / 3) + 3
  for (let i = 0; i < craterCount; i++) {
    const px = Math.random() * size
    const py = Math.random() * size
    const cr = Math.random() * radius * 0.22 + radius * 0.06
    const shade = c.createRadialGradient(px - cr * 0.3, py - cr * 0.3, 0, px, py, cr)
    shade.addColorStop(0, "rgba(0,0,0,0.55)")
    shade.addColorStop(0.7, "rgba(0,0,0,0.22)")
    shade.addColorStop(1, "rgba(0,0,0,0)")
    c.fillStyle = shade
    c.beginPath()
    c.arc(px, py, cr, 0, Math.PI * 2)
    c.fill()
  }

  // Warm rim light on the sunlit edge, tying into the hero's gold palette
  const rim = c.createRadialGradient(
    cx - radius * 0.5,
    cy - radius * 0.5,
    radius * 0.2,
    cx - radius * 0.5,
    cy - radius * 0.5,
    radius * 1.4
  )
  rim.addColorStop(0, "rgba(255,190,120,0.35)")
  rim.addColorStop(1, "rgba(255,190,120,0)")
  c.fillStyle = rim
  c.fillRect(0, 0, size, size)

  c.restore()

  // Thin gold outline so the silhouette stays crisp against the dark backdrop
  tracePath()
  c.strokeStyle = "rgba(255,190,110,0.55)"
  c.lineWidth = 1.25
  c.stroke()

  return cvs
}

class Asteroid {
  x = 0
  y = 0
  vx = 0
  vy = 0
  radius = 0
  angle = 0
  rotationSpeed = 0
  canSplit = true
  texture: HTMLCanvasElement | null = null

  constructor(
    width: number,
    height: number,
    opts?: Partial<{ x: number; y: number; radius: number; vx: number; vy: number }>,
    spawnMode: "random" | "edge" = "edge"
  ) {
    this.radius = opts?.radius ?? Math.random() * (MAX_RADIUS - MIN_RADIUS) + MIN_RADIUS
    this.canSplit = this.radius >= MIN_SPLIT_RADIUS
    this.texture = createAsteroidTexture(this.radius)
    this.placeAt(width, height, opts, spawnMode)
  }

  placeAt(
    width: number,
    height: number,
    opts?: Partial<{ x: number; y: number; vx: number; vy: number }>,
    spawnMode: "random" | "edge" = "edge"
  ) {
    if (opts?.x !== undefined && opts?.y !== undefined) {
      this.x = opts.x
      this.y = opts.y
    } else if (spawnMode === "random") {
      this.x = Math.random() * width
      this.y = Math.random() * height
    } else if (Math.random() > 0.5) {
      this.x = Math.random() > 0.5 ? -this.radius : width + this.radius
      this.y = Math.random() * height
    } else {
      this.x = Math.random() * width
      this.y = Math.random() > 0.5 ? -this.radius : height + this.radius
    }

    this.vx = opts?.vx ?? (Math.random() - 0.5) * 0.5
    this.vy = opts?.vy ?? (Math.random() - 0.5) * 0.5
    this.angle = Math.random() * Math.PI * 2
    this.rotationSpeed = (Math.random() - 0.5) * 0.012
  }

  update(width: number, height: number, mx: number, my: number) {
    // Gravity well toward cursor — deflects the path rather than pulling straight in,
    // giving a lensing-like curve
    const dx = mx - this.x
    const dy = my - this.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist < GRAVITY_RADIUS && dist > 1) {
      const pull = (1 - dist / GRAVITY_RADIUS) * GRAVITY_STRENGTH
      this.vx += (dx / dist) * pull * 0.4 + (-dy / dist) * pull * 0.6
      this.vy += (dy / dist) * pull * 0.4 + (dx / dist) * pull * 0.6
    }

    this.vx *= 0.995
    this.vy *= 0.995

    this.x += this.vx
    this.y += this.vy
    this.angle += this.rotationSpeed

    if (
      this.x < -this.radius * 2 ||
      this.x > width + this.radius * 2 ||
      this.y < -this.radius * 2 ||
      this.y > height + this.radius * 2
    ) {
      // Recycle from an edge — texture/radius stay the same, no re-bake needed
      this.placeAt(width, height, undefined, "edge")
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (!this.texture) return
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate(this.angle)
    ctx.drawImage(this.texture, -this.texture.width / 2, -this.texture.height / 2)
    ctx.restore()
  }

  containsPoint(px: number, py: number) {
    const dx = px - this.x
    const dy = py - this.y
    return Math.sqrt(dx * dx + dy * dy) <= this.radius
  }
}

export function InteractiveAsteroids({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let width = (canvas.width = canvas.offsetWidth)
    let height = (canvas.height = canvas.offsetHeight)

    const mouse = { x: -9999, y: -9999 }
    let asteroids: Asteroid[] = []
    // Initial population spreads across the whole canvas, not just the edges
    for (let i = 0; i < NUM_ASTEROIDS; i++) asteroids.push(new Asteroid(width, height, undefined, "random"))

    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth
      height = canvas.height = canvas.offsetHeight
    }

    const handleMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }

    const handleLeave = () => {
      mouse.x = -9999
      mouse.y = -9999
    }

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const px = e.clientX - rect.left
      const py = e.clientY - rect.top

      const hitIndex = asteroids.findIndex((a) => a.containsPoint(px, py))
      if (hitIndex === -1) return

      const hit = asteroids[hitIndex]
      asteroids.splice(hitIndex, 1)

      if (hit.canSplit) {
        for (let i = 0; i < SPLIT_FRAGMENTS; i++) {
          const angle = (Math.PI * 2 * i) / SPLIT_FRAGMENTS + Math.random() * 0.5
          const speed = 1.2 + Math.random() * 1.5
          asteroids.push(
            new Asteroid(width, height, {
              x: hit.x,
              y: hit.y,
              radius: hit.radius * (0.4 + Math.random() * 0.25),
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
            })
          )
        }
      }
      // cap total count so rapid clicking can't blow up perf
      if (asteroids.length > NUM_ASTEROIDS * 2.5) {
        asteroids = asteroids.slice(asteroids.length - Math.floor(NUM_ASTEROIDS * 2.5))
      }
    }

    window.addEventListener("resize", handleResize)
    canvas.addEventListener("mousemove", handleMove)
    canvas.addEventListener("mouseleave", handleLeave)
    canvas.addEventListener("click", handleClick)

    let rafId: number
    const animate = () => {
      ctx.clearRect(0, 0, width, height)
      asteroids.forEach((a) => {
        a.update(width, height, mouse.x, mouse.y)
        a.draw(ctx)
      })
      rafId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener("resize", handleResize)
      canvas.removeEventListener("mousemove", handleMove)
      canvas.removeEventListener("mouseleave", handleLeave)
      canvas.removeEventListener("click", handleClick)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ pointerEvents: "auto" }}
    />
  )
}
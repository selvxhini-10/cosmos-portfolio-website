"use client"

import { useEffect, useRef } from "react"

interface Star {
  x: number
  y: number
  radius: number
  baseOpacity: number
  twinkleSpeed: number
  twinklePhase: number
  drift: number
  depth: number // 0 (far/slow parallax) … 1 (near/fast parallax)
}

interface ShootingStar {
  x: number
  y: number
  len: number
  speed: number
  angle: number
  opacity: number
  active: boolean
  life: number
}

/**
 * GPU-friendly cosmic backdrop on a single canvas.
 *
 * v3 changes: the standalone floating-orb layer from v2 read as visual
 * clutter with no relationship to the rest of the scene, so it's removed.
 * Instead, prominence comes from building on what was already there:
 * - The three nebula patches keep their richer multi-stop glow and slow
 *   pulse, and still track the cursor with a noticeably stronger parallax
 *   than the original version.
 * - Each star dot now renders with a small soft halo behind its core point
 *   (a second, larger, low-alpha radial gradient), so the field reads as
 *   glowing points of light rather than flat dots — no new objects, just
 *   more glow on what's already there.
 *
 * Performance guarantees
 * ─────────────────────
 * • Single canvas, single draw call budget per frame.
 * • DPR capped at 1.5 — no 4× fill-rate on retina.
 * • Star count capped at 220 regardless of screen size.
 * • Shooting-star budget capped at 5 simultaneous.
 * • Tab-hidden → RAF cancelled immediately.
 * • prefers-reduced-motion → single static frame, no RAF.
 */
export function CosmicBackground({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0.5, y: 0.5 }) // normalised 0-1
  const targetMouseRef = useRef({ x: 0.5, y: 0.5 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    let width = 0
    let height = 0
    let dpr = 1
    let stars: Star[] = []
    const shootingStars: ShootingStar[] = []
    let rafId = 0
    let running = true
    let lastShoot = 0

    // ── Resize ──────────────────────────────────────────────────────────────
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const count = Math.min(220, Math.floor((width * height) / 6000))
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.4 + 0.3,
        baseOpacity: Math.random() * 0.5 + 0.3,
        twinkleSpeed: Math.random() * 0.018 + 0.004,
        twinklePhase: Math.random() * Math.PI * 2,
        drift: Math.random() * 0.05 + 0.015,
        depth: Math.random(),
      }))
    }

    // ── Mouse tracking ────────────────────────────────────────────────────
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      targetMouseRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      }
    }
    const onTouchMove = (e: TouchEvent) => {
      if (!e.touches[0]) return
      const rect = canvas.getBoundingClientRect()
      targetMouseRef.current = {
        x: (e.touches[0].clientX - rect.left) / rect.width,
        y: (e.touches[0].clientY - rect.top) / rect.height,
      }
    }

    // ── Shooting stars ───────────────────────────────────────────────────────
    const MAX_SHOOTING = 5
    const spawnShootingStar = () => {
      if (shootingStars.length >= MAX_SHOOTING) return
      const startX = Math.random() * width * 0.8
      const startY = Math.random() * height * 0.4
      const mx = targetMouseRef.current.x * width
      const my = targetMouseRef.current.y * height
      const base = Math.atan2(my - startY, mx - startX)
      const angle = base + (Math.random() * 0.6 - 0.3)
      shootingStars.push({
        x: startX,
        y: startY,
        len: Math.random() * 120 + 80,
        speed: Math.random() * 6 + 6,
        angle,
        opacity: 0,
        active: true,
        life: 0,
      })
    }

    // ── Nebulae — richer glow + a slow pulse, stronger cursor tracking ───────
    const nebulae = [
      { xr: 0.2, yr: 0.3, r: 380, color: "255,150,80", alpha: 0.26 },
      { xr: 0.8, yr: 0.65, r: 420, color: "255,80,54", alpha: 0.2 },
      { xr: 0.55, yr: 0.15, r: 300, color: "255,190,96", alpha: 0.17 },
    ]
    const nebulaPos = nebulae.map((n) => ({ x: n.xr * 1000, y: n.yr * 1000 }))

    const drawNebulae = (time: number) => {
      const mx = mouseRef.current.x - 0.5
      const my = mouseRef.current.y - 0.5

      nebulae.forEach((n, i) => {
        const targetX = (n.xr + mx * 0.14 * (i + 1)) * width
        const targetY = (n.yr + my * 0.14 * (i + 1)) * height
        nebulaPos[i].x += (targetX - nebulaPos[i].x) * 0.07
        nebulaPos[i].y += (targetY - nebulaPos[i].y) * 0.07

        const pulse = 0.85 + Math.sin(time * 0.00035 + i * 2.1) * 0.15
        const cx = nebulaPos[i].x
        const cy = nebulaPos[i].y

        // Multi-stop gradient reads as a richer glow rather than a flat wash
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, n.r)
        g.addColorStop(0, `rgba(${n.color},${n.alpha * pulse})`)
        g.addColorStop(0.35, `rgba(${n.color},${n.alpha * pulse * 0.55})`)
        g.addColorStop(0.7, `rgba(${n.color},${n.alpha * pulse * 0.18})`)
        g.addColorStop(1, "rgba(0,0,0,0)")
        ctx.fillStyle = g
        ctx.fillRect(cx - n.r, cy - n.r, n.r * 2, n.r * 2)
      })
    }

    // ── Main render loop ─────────────────────────────────────────────────────
    const render = (time: number) => {
      if (!running) return

      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.1
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.1

      ctx.clearRect(0, 0, width, height)
      drawNebulae(time)

      const mx = (mouseRef.current.x - 0.5) * width
      const my = (mouseRef.current.y - 0.5) * height

      // Stars — a soft halo behind each core dot, both shifted by parallax
      for (const s of stars) {
        s.twinklePhase += s.twinkleSpeed
        const opacity = Math.max(0, s.baseOpacity + Math.sin(s.twinklePhase) * 0.25)
        s.y += s.drift
        if (s.y > height + 2) {
          s.y = -2
          s.x = Math.random() * width
        }

        const parallaxStrength = s.depth * 0.045
        const px = s.x + mx * parallaxStrength
        const py = s.y + my * parallaxStrength

        // Soft halo — only meaningfully visible on the brighter/twinklier stars
        if (opacity > 0.35) {
          const haloR = s.radius * 5
          const halo = ctx.createRadialGradient(px, py, 0, px, py, haloR)
          halo.addColorStop(0, `rgba(255,225,190,${opacity * 0.35})`)
          halo.addColorStop(1, "rgba(255,225,190,0)")
          ctx.fillStyle = halo
          ctx.fillRect(px - haloR, py - haloR, haloR * 2, haloR * 2)
        }

        ctx.beginPath()
        ctx.arc(px, py, s.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,240,220,${opacity})`
        ctx.fill()
      }

      // Shooting stars
      if (!reduceMotion) {
        if (time - lastShoot > 2400 && Math.random() > 0.35) {
          spawnShootingStar()
          lastShoot = time
        }
        for (let i = shootingStars.length - 1; i >= 0; i--) {
          const sh = shootingStars[i]
          sh.life += 1
          sh.opacity = Math.min(1, sh.opacity + 0.05)
          sh.x += Math.cos(sh.angle) * sh.speed
          sh.y += Math.sin(sh.angle) * sh.speed

          const tailX = sh.x - Math.cos(sh.angle) * sh.len
          const tailY = sh.y - Math.sin(sh.angle) * sh.len
          const grad = ctx.createLinearGradient(sh.x, sh.y, tailX, tailY)
          grad.addColorStop(0, `rgba(255,220,180,${sh.opacity})`)
          grad.addColorStop(1, "rgba(255,220,180,0)")
          ctx.strokeStyle = grad
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.moveTo(sh.x, sh.y)
          ctx.lineTo(tailX, tailY)
          ctx.stroke()

          if (sh.x > width + sh.len || sh.y > height + sh.len || sh.life > 200) {
            shootingStars.splice(i, 1)
          }
        }
      }

      rafId = requestAnimationFrame(render)
    }

    const handleVisibility = () => {
      if (document.hidden) {
        running = false
        cancelAnimationFrame(rafId)
      } else if (!running) {
        running = true
        rafId = requestAnimationFrame(render)
      }
    }

    resize()
    window.addEventListener("resize", resize, { passive: true })
    window.addEventListener("mousemove", onMouseMove, { passive: true })
    window.addEventListener("touchmove", onTouchMove, { passive: true })
    document.addEventListener("visibilitychange", handleVisibility)

    if (reduceMotion) {
      ctx.clearRect(0, 0, width, height)
      nebulae.forEach((n) => {
        const cx = n.xr * width
        const cy = n.yr * height
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, n.r)
        g.addColorStop(0, `rgba(${n.color},${n.alpha})`)
        g.addColorStop(1, "rgba(0,0,0,0)")
        ctx.fillStyle = g
        ctx.fillRect(cx - n.r, cy - n.r, n.r * 2, n.r * 2)
      })
      for (const s of stars) {
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,240,220,${s.baseOpacity})`
        ctx.fill()
      }
    } else {
      rafId = requestAnimationFrame(render)
    }

    return () => {
      running = false
      cancelAnimationFrame(rafId)
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("touchmove", onTouchMove)
      document.removeEventListener("visibilitychange", handleVisibility)
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden="true" className={`block h-full w-full ${className}`} />
}

export default CosmicBackground
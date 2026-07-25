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
 * Lightweight, GPU-friendly cosmic backdrop rendered on a single canvas.
 * Replaces multi-megabyte GIFs/videos with a near-zero-weight animation:
 *  - drifting, twinkling starfield
 *  - occasional dramatic shooting stars
 *  - soft nebula glows drawn once per frame
 * Honors prefers-reduced-motion and pauses when the tab is hidden.
 */
export function CosmicBackground({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

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

    const resize = () => {
      // Cap DPR at 1.5 to keep fill-rate low on retina screens.
      dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // Density scales with area but is capped for performance.
      const count = Math.min(220, Math.floor((width * height) / 6000))
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.3 + 0.3,
        baseOpacity: Math.random() * 0.5 + 0.3,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
        drift: Math.random() * 0.06 + 0.02,
      }))
    }

    const spawnShootingStar = () => {
      const startX = Math.random() * width * 0.8
      const startY = Math.random() * height * 0.4
      shootingStars.push({
        x: startX,
        y: startY,
        len: Math.random() * 120 + 80,
        speed: Math.random() * 6 + 6,
        angle: Math.PI / 5 + (Math.random() * 0.3 - 0.15),
        opacity: 0,
        active: true,
        life: 0,
      })
    }

    // Static nebula glows — drawn each frame but cheap (a few radial gradients).
    const nebulae = [
      { xr: 0.2, yr: 0.3, r: 320, color: "255,140,80", alpha: 0.1 },
      { xr: 0.8, yr: 0.65, r: 380, color: "255,65,54", alpha: 0.07 },
      { xr: 0.55, yr: 0.15, r: 260, color: "255,180,96", alpha: 0.06 },
    ]

    const drawNebulae = () => {
      for (const n of nebulae) {
        const cx = n.xr * width
        const cy = n.yr * height
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, n.r)
        g.addColorStop(0, `rgba(${n.color},${n.alpha})`)
        g.addColorStop(1, "rgba(0,0,0,0)")
        ctx.fillStyle = g
        ctx.fillRect(cx - n.r, cy - n.r, n.r * 2, n.r * 2)
      }
    }

    const render = (time: number) => {
      if (!running) return
      ctx.clearRect(0, 0, width, height)

      drawNebulae()

      // Stars
      for (const s of stars) {
        s.twinklePhase += s.twinkleSpeed
        const opacity = s.baseOpacity + Math.sin(s.twinklePhase) * 0.25
        s.y += s.drift
        if (s.y > height + 2) {
          s.y = -2
          s.x = Math.random() * width
        }
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,240,220,${Math.max(0, opacity)})`
        ctx.fill()
      }

      // Shooting stars (skipped entirely under reduced motion)
      if (!reduceMotion) {
        if (time - lastShoot > 2600 && Math.random() > 0.4) {
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
    window.addEventListener("resize", resize)
    document.addEventListener("visibilitychange", handleVisibility)

    if (reduceMotion) {
      // Draw a single static frame instead of animating.
      ctx.clearRect(0, 0, width, height)
      drawNebulae()
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
      document.removeEventListener("visibilitychange", handleVisibility)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`block h-full w-full ${className}`}
    />
  )
}

export default CosmicBackground

"use client"

import { useRef, useEffect } from "react"
import { motion } from "framer-motion"

interface CosmicHazeDividerProps {
  variant?: "orange" | "gold" | "red" | "mixed"
  className?: string
}

export function CosmicHazeDivider({ variant = "mixed", className = "" }: CosmicHazeDividerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")!

    let raf = 0
    let t = 0
    const w = (canvas.width = canvas.offsetWidth)
    const h = (canvas.height = canvas.offsetHeight)

    const draw = () => {
      t += 0.006
      ctx.clearRect(0, 0, w, h)

      // Background gradient glow
      const grad = ctx.createLinearGradient(0, 0, w, 0)
      grad.addColorStop(0, "rgba(255,180,120,0.05)")
      grad.addColorStop(0.5, "rgba(255,120,80,0.06)")
      grad.addColorStop(1, "rgba(255,180,120,0.05)")
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, w, h)

      // Aurora bands using sin noise
      for (let band = 0; band < 3; band++) {
        const alpha = 0.18 - band * 0.04
        ctx.beginPath()
        for (let x = 0; x <= w; x += 8) {
          const y =
            h / 2 +
            Math.sin(x * 0.01 + t * (0.8 + band * 0.2)) * 12 +
            Math.sin(x * 0.02 + t * (1.2 + band * 0.3)) * 6
          if (x === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.lineTo(w, h)
        ctx.lineTo(0, h)
        ctx.closePath()
        ctx.fillStyle = `rgba(${255 - band * 35}, ${120 - band * 20}, ${80 - band * 10}, ${alpha})`
        ctx.fill()
      }

      // Shooting sparkles
      ctx.globalCompositeOperation = "lighter"
      for (let i = 0; i < 30; i++) {
        const x = ((i * 97) % w) + ((Math.sin(t * (0.6 + i * 0.02)) + 1) * 0.5) * 40
        const y = h * 0.35 + Math.sin(t * (1.2 + i * 0.03) + i) * 20
        ctx.fillStyle = "rgba(255,255,255,0.08)"
        ctx.fillRect(x, y, 2, 1)
      }
      ctx.globalCompositeOperation = "source-over"

      raf = requestAnimationFrame(draw)
    }

    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className={`relative h-32 w-full overflow-hidden ${className}`}>
      {/* Subtle moving gradient overlay via framer-motion */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0.25 }}
        animate={{ opacity: 0.35 }}
        transition={{ duration: 2, ease: "easeInOut" }}
        style={{
          background:
            "radial-gradient(ellipse at 30% 50%, rgba(255,180,120,0.20), transparent 50%)," +
            "radial-gradient(ellipse at 70% 50%, rgba(255,120,80,0.15), transparent 55%)",
          filter: "blur(8px)",
        }}
      />

      {/* Animated aurora canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Fine star dust */}
      <motion.div
        className="absolute inset-0 opacity-10"
        initial={{ backgroundPositionX: 0 }}
        animate={{ backgroundPositionX: 40 }}
        transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
        style={{
          backgroundImage: "radial-gradient(white 1px, transparent 1px)",
          backgroundSize: "3px 3px",
        }}
      />
    </div>
  )
}

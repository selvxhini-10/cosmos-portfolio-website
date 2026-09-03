"use client"

import { useEffect, useRef } from "react"

/**
 * Wraps children text in per-character spans and bends/magnifies letters
 * near the cursor, mimicking gravitational lensing around a massive body.
 *
 * FIX (v2): the previous version tried to fake a continuous gradient by
 * slicing a shared background-image across each letter's measured offset.
 * That depends on scrollWidth/offsetLeft being measured after the real font
 * has loaded and laid out — timing that's easy to get wrong, and when it's
 * wrong every letter silently renders with no fill at all.
 *
 * This version sidesteps background-clip entirely: each letter gets a
 * plain solid `color`, linearly interpolated between the gradient's two
 * endpoints based on the letter's index in the string. No measurement, no
 * font-load race, no background-clip inheritance quirks — just a color.
 *
 * Usage:
 *   <GravitationalLensText className="block mb-2 text-cosmic-white uppercase tracking-[0.15em]">
 *     Hi, I'm
 *   </GravitationalLensText>
 *
 *   <GravitationalLensText gradient className="block tracking-wide">
 *     Selvahini Kamalarajan
 *   </GravitationalLensText>
 */

const LENS_RADIUS = 160 // px — cursor influence radius
const MAX_PULL = 14 // px — max displacement toward cursor
const MAX_SCALE = 1.35 // max magnification at the very center

// Gradient endpoints, matching .text-gradient-red-gold in globals.css
const GRADIENT_FROM = { r: 255, g: 65, b: 54 } // #ff4136
const GRADIENT_TO = { r: 255, g: 176, b: 96 } // #ffb060

function lerpColor(t: number) {
  const r = Math.round(GRADIENT_FROM.r + (GRADIENT_TO.r - GRADIENT_FROM.r) * t)
  const g = Math.round(GRADIENT_FROM.g + (GRADIENT_TO.g - GRADIENT_FROM.g) * t)
  const b = Math.round(GRADIENT_FROM.b + (GRADIENT_TO.b - GRADIENT_FROM.b) * t)
  return `rgb(${r}, ${g}, ${b})`
}

export function GravitationalLensText({
  children,
  className = "",
  as: Tag = "span",
  gradient = false,
}: {
  children: string
  className?: string
  as?: "span" | "div"
  gradient?: boolean
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([])
  const mouse = useRef({ x: -9999, y: -9999 })
  const rafId = useRef<number | null>(null)

  const chars = children.split("")
  // Count only non-space characters for the gradient ramp so leading/trailing
  // spaces don't compress the visible color range
  const visibleCount = Math.max(1, chars.filter((c) => c !== " ").length - 1)
  let visibleIndex = -1

  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY
    }
    const handleLeave = () => {
      mouse.current.x = -9999
      mouse.current.y = -9999
    }

    window.addEventListener("pointermove", handleMove, { passive: true })
    window.addEventListener("pointerleave", handleLeave)

    const tick = () => {
      const { x: mx, y: my } = mouse.current

      letterRefs.current.forEach((el) => {
        if (!el) return
        const rect = el.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const dx = mx - cx
        const dy = my - cy
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < LENS_RADIUS) {
          const strength = 1 - dist / LENS_RADIUS
          const eased = strength * strength

          const pullX = -dx * (eased * (MAX_PULL / Math.max(dist, 1)))
          const pullY = -dy * (eased * (MAX_PULL / Math.max(dist, 1)))
          const scale = 1 + eased * (MAX_SCALE - 1)
          const blur = eased * 1.5

          el.style.transform = `translate(${pullX.toFixed(2)}px, ${pullY.toFixed(2)}px) scale(${scale.toFixed(3)})`
          el.style.filter = blur > 0.1 ? `blur(${blur.toFixed(2)}px)` : "none"
          el.style.textShadow =
            eased > 0.15
              ? `0 0 ${(eased * 20).toFixed(0)}px rgba(255, 180, 100, ${(eased * 0.8).toFixed(2)})`
              : ""
        } else {
          el.style.transform = "translate(0px, 0px) scale(1)"
          el.style.filter = "none"
          el.style.textShadow = ""
        }
      })

      rafId.current = requestAnimationFrame(tick)
    }

    rafId.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener("pointermove", handleMove)
      window.removeEventListener("pointerleave", handleLeave)
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [])

  return (
    <Tag ref={containerRef as never} className={className} style={{ display: "inline-block" }}>
      {chars.map((char, i) => {
        if (char !== " ") visibleIndex++
        const color = gradient ? lerpColor(visibleIndex / visibleCount) : undefined

        return (
          <span
            key={i}
            ref={(el) => {
              letterRefs.current[i] = el
            }}
            style={{
              display: "inline-block",
              willChange: "transform, filter",
              transition: "filter 0.1s ease-out",
              color,
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        )
      })}
    </Tag>
  )
}
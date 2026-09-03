"use client"

import { useEffect, useRef, useState } from "react"

/**
 * A flight-telemetry HUD readout, triggered by hover on a wrapping element
 * (typically the availability badge). Redesigned from a plain typewriter
 * line-list into an actual readout: key/value rows, a live clock, a signal
 * bar, corner "lock-on" brackets, and a single boot-in scan sweep (not a
 * looping one) so it reads as a deliberate reveal rather than a spinner.
 * A subtle cursor-tilt on the panel ties it to the 3D asteroid field.
 *
 * Usage:
 *   <HudTrigger
 *     readout={[
 *       { label: "Status", value: "Active" },
 *       { label: "Role sought", value: "SWE Intern" },
 *       { label: "Availability", value: "May – Aug 2026" },
 *       { label: "Location", value: "Waterloo, ON" },
 *       { type: "bar", label: "Uplink", level: 0.9 },
 *     ]}
 *   >
 *     <div className="badge">...</div>
 *   </HudTrigger>
 */

type ReadoutRow = { type: "bar"; label: string; level: number } | { type?: "text"; label: string; value: string }

export function HudTrigger({
  children,
  readout,
  typeSpeed = 22,
}: {
  children: React.ReactNode
  readout: ReadoutRow[]
  typeSpeed?: number
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = wrapRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    el.style.setProperty("--hud-tilt-x", `${(py * -6).toFixed(2)}deg`)
    el.style.setProperty("--hud-tilt-y", `${(px * 6).toFixed(2)}deg`)
  }

  return (
    <div
      ref={wrapRef}
      className="relative inline-block"
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onMouseMove={handleMove}
    >
      {children}
      {active && <HudPanel readout={readout} typeSpeed={typeSpeed} />}
    </div>
  )
}

function useClock() {
  const [time, setTime] = useState("")
  useEffect(() => {
    const tick = () => setTime(new Date().toUTCString().slice(17, 25) + " UTC")
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  return time
}

function HudPanel({ readout, typeSpeed }: { readout: ReadoutRow[]; typeSpeed: number }) {
  const [typedIdx, setTypedIdx] = useState(0)
  const [typedChars, setTypedChars] = useState<number[]>(() => readout.map(() => 0))
  const [booted, setBooted] = useState(false)
  const time = useClock()

  // Panel wipes open and brackets snap in first; text only starts typing once
  // it's "locked on" — separates the reveal into two readable beats instead
  // of one flat fade.
  useEffect(() => {
    const t = setTimeout(() => setBooted(true), 220)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!booted) return
    let cancelled = false
    let rowIdx = 0

    const typeRow = () => {
      if (cancelled || rowIdx >= readout.length) return
      const row = readout[rowIdx]
      const target = row.type === "bar" ? 1 : row.value.length
      let charIdx = 0
      setTypedIdx(rowIdx + 1)

      const step = () => {
        if (cancelled) return
        charIdx++
        setTypedChars((prev) => {
          const next = [...prev]
          next[rowIdx] = charIdx
          return next
        })
        if (charIdx < target) {
          setTimeout(step, typeSpeed)
        } else {
          rowIdx++
          setTimeout(typeRow, typeSpeed * 5)
        }
      }
      step()
    }

    typeRow()
    return () => {
      cancelled = true
    }
  }, [booted, readout, typeSpeed])

  return (
    <div
      className="absolute left-1/2 top-full mt-3 -translate-x-1/2 z-20 pointer-events-none"
      style={{
        width: "min(90vw, 320px)",
        transform: "perspective(700px) rotateX(var(--hud-tilt-x, 0deg)) rotateY(var(--hud-tilt-y, 0deg))",
      }}
    >
      <div
        className="relative overflow-hidden rounded-sm border border-cosmic-gold/40 bg-cosmic-black/90 px-4 py-3 backdrop-blur-sm shadow-[0_0_25px_rgba(255,180,100,0.15)] transition-[clip-path] duration-300 ease-out"
        style={{ clipPath: booted ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)" }}
      >
        {/* corner brackets — reads as a lock-on reticle, not a decorative box */}
        {(["top-0 left-0 border-t border-l", "top-0 right-0 border-t border-r", "bottom-0 left-0 border-b border-l", "bottom-0 right-0 border-b border-r"] as const).map(
          (pos, i) => (
            <span
              key={i}
              className={`absolute w-2.5 h-2.5 border-cosmic-gold/70 ${pos} transition-opacity duration-300`}
              style={{ opacity: booted ? 1 : 0, transitionDelay: `${i * 60}ms` }}
            />
          )
        )}

        {/* single scan sweep on reveal — not looping, so it reads as a "scan complete" beat */}
        {booted && (
          <div className="absolute inset-0 overflow-hidden">
            <div
              className="absolute left-0 right-0 h-10 bg-gradient-to-b from-transparent via-cosmic-gold/25 to-transparent animate-scanline"
              style={{ animationIterationCount: 1 }}
            />
          </div>
        )}

        {/* header: live clock gives the panel an actual reason to feel "real-time" */}
        <div className="relative flex items-center justify-between mb-2 pb-2 border-b border-cosmic-gold/20">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cosmic-gold animate-pulse" />
            <span className="font-mono text-[9px] tracking-[0.2em] text-cosmic-gold/80 uppercase">
              Operator Telemetry
            </span>
          </div>
          <span className="font-mono text-[9px] text-cosmic-white/35 tabular-nums">{time}</span>
        </div>

        {/* readout rows */}
        <div className="relative font-mono text-[10px] leading-relaxed tracking-wider">
          {readout.map((row, i) => {
            const started = i < typedIdx

            if (row.type === "bar") {
              const filled = started ? Math.round(row.level * 5) : 0
              return (
                <div key={i} className="flex items-center justify-between py-0.5">
                  <span className="text-cosmic-white/40 uppercase">{row.label}</span>
                  <span className="text-cosmic-gold tracking-[2px]">
                    {"▮".repeat(filled)}
                    {"▯".repeat(5 - filled)}
                  </span>
                </div>
              )
            }

            const chars = typedChars[i] ?? 0
            const value = started ? row.value.slice(0, chars) : ""
            const done = value.length === row.value.length

            return (
              <div key={i} className="flex items-baseline gap-2 py-0.5">
                <span className="text-cosmic-white/40 uppercase shrink-0">{row.label}</span>
                <span className="flex-1 border-b border-dotted border-cosmic-white/10 -translate-y-0.5" />
                <span className="text-cosmic-gold shrink-0">
                  {value || "\u00A0"}
                  {started && !done && <span className="animate-pulse">▍</span>}
                </span>
              </div>
            )
          })}
        </div>

        {/* footer ties the panel to a real action on the page instead of being purely decorative */}
        <div className="relative mt-2 pt-2 border-t border-cosmic-gold/20 font-mono text-[8px] tracking-[0.15em] text-cosmic-white/30 uppercase">
          → Establish link via Get In Touch
        </div>
      </div>
    </div>
  )
}
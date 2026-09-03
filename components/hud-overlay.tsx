"use client"

import { useEffect, useRef, useState } from "react"

/**
 * A flight-log style HUD readout that streams status lines with a
 * typewriter effect and a scanline sweep, triggered by hover on a
 * wrapping element (typically the availability badge).
 *
 * Usage:
 *   <HudTrigger lines={["STATUS: ACTIVE", "TARGETING: SUMMER 2026", "LOCATION: WATERLOO, ON"]}>
 *     <div className="badge">...</div>
 *   </HudTrigger>
 */

export function HudTrigger({
  children,
  lines,
  typeSpeed = 28,
}: {
  children: React.ReactNode
  lines: string[]
  typeSpeed?: number
}) {
  const [active, setActive] = useState(false)

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
    >
      {children}
      {active && <HudPanel lines={lines} typeSpeed={typeSpeed} />}
    </div>
  )
}

function HudPanel({ lines, typeSpeed }: { lines: string[]; typeSpeed: number }) {
  const [rendered, setRendered] = useState<string[]>([])
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    let lineIdx = 0
    let charIdx = 0
    const buffer: string[] = []

    const typeNext = () => {
      if (lineIdx >= lines.length) return

      if (charIdx === 0) buffer.push("")
      buffer[lineIdx] = lines[lineIdx].slice(0, charIdx + 1)
      setRendered([...buffer])
      charIdx++

      if (charIdx <= lines[lineIdx].length) {
        timeoutRef.current = setTimeout(typeNext, typeSpeed)
      } else {
        lineIdx++
        charIdx = 0
        if (lineIdx < lines.length) {
          timeoutRef.current = setTimeout(typeNext, typeSpeed * 4) // pause between lines
        }
      }
    }

    typeNext()

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [lines, typeSpeed])

  return (
    <div
      className="absolute left-1/2 top-full mt-3 -translate-x-1/2 z-20 pointer-events-none"
      style={{ width: "min(90vw, 340px)" }}
    >
      <div className="relative overflow-hidden rounded-md border border-cosmic-gold/40 bg-cosmic-black/85 px-4 py-3 backdrop-blur-sm">
        {/* Scanline sweep */}
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <div
            className="absolute left-0 right-0 h-8 bg-gradient-to-b from-transparent via-cosmic-gold/40 to-transparent animate-scanline"
          />
        </div>

        <div className="relative font-mono text-[10px] leading-relaxed tracking-wider text-cosmic-gold/90">
          {lines.map((line, i) => (
            <div key={i} className="whitespace-pre">
              {rendered[i] !== undefined ? (
                <>
                  <span className="text-cosmic-white/40">{"> "}</span>
                  {rendered[i]}
                  {rendered[i].length < line.length && (
                    <span className="animate-pulse text-cosmic-gold">▍</span>
                  )}
                </>
              ) : (
                "\u00A0"
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

/* ============================================================
   Timing constants (ms)
============================================================ */
const TERMINAL_FADE_MS   = 1100   // terminal exit fade
const STARFIELD_PAUSE_MS = 3000   // pure float before warp
const WARP_DURATION_MS   = 3600   // warp burst total
const WARP_PEAK_SPEED    = 9      // px/frame peak — kept moderate so lines stay short
const BASE_SPEED         = 0.8    // px/frame floating

/* ============================================================
   Terminal lines — pilot name injected as last prompt
============================================================ */
const BOOT_LINES = [
  { prefix: "$",  text: " boot  selva_os --mode=portfolio" },
  { prefix: ">>", text: " Scanning local star systems..." },
  { prefix: ">>", text: " Compiling creative modules  [████████] 100%" },
  { prefix: ">>", text: " Establishing deep-space link..." },
  { prefix: "OK", text: " Systems nominal. Identify yourself, pilot." },
]

/* ============================================================
   Starfield
============================================================ */
const STAR_COUNT = 900
const WARP_DEPTH = 1000
const FOV        = 300

type Star = { x: number; y: number; z: number; ppx: number; ppy: number; brightness: number }

function makeStars(): Star[] {
  return Array.from({ length: STAR_COUNT }, () => ({
    x: (Math.random() - 0.5) * WARP_DEPTH * 2,
    y: (Math.random() - 0.5) * WARP_DEPTH * 2,
    z: Math.random() * WARP_DEPTH,
    ppx: 0, ppy: 0,
    brightness: 0.35 + Math.random() * 0.65,
  }))
}

// warp     = true during the burst phase (ramps speed up then back down)
// postWarp = true once warp ends — canvas keeps running at BASE_SPEED forever
function StarCanvas({ warp, postWarp }: { warp: boolean; postWarp: boolean }) {
  const canvasRef   = useRef<HTMLCanvasElement>(null)
  const starsRef    = useRef<Star[]>(makeStars())
  const animRef     = useRef<number>(0)
  const warpRef     = useRef(false)
  const postWarpRef = useRef(false)
  const warpStartMs = useRef<number | null>(null)

  useEffect(() => {
    warpRef.current = warp
    if (warp) warpStartMs.current = performance.now()
  }, [warp])

  useEffect(() => {
    postWarpRef.current = postWarp
  }, [postWarp])

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx    = canvas.getContext("2d")!
    let running  = true

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener("resize", resize)

    const tick = () => {
      if (!running) return
      const W = canvas.width, H = canvas.height
      const cx = W / 2, cy = H / 2

      let speed = BASE_SPEED
      let warpT = 0
      if (warpRef.current && warpStartMs.current !== null) {
        const elapsed = performance.now() - warpStartMs.current
        warpT = Math.min(elapsed / WARP_DURATION_MS, 1)
        // gentle bell: slow ramp-in (0→0.3), plateau (0.3→0.7), ease-out (0.7→1)
        const curve =
          warpT < 0.3 ? warpT / 0.3
          : warpT < 0.7 ? 1
          : 1 - (warpT - 0.7) / 0.3
        speed = BASE_SPEED + (WARP_PEAK_SPEED - BASE_SPEED) * curve
      }
      // postWarp: warp ended — drift at base speed, no streak coloring
      if (postWarpRef.current && !warpRef.current) {
        speed = BASE_SPEED
        warpT = 0
      }

      // Higher trail alpha = shorter streak tails — keeps lines tight even at speed
      const trailAlpha = 0.22 + 0.14 * (speed / WARP_PEAK_SPEED)
      ctx.fillStyle = `rgba(4,4,14,${trailAlpha})`
      ctx.fillRect(0, 0, W, H)

      for (const s of starsRef.current) {
        const prevX = (s.x / s.z) * FOV + cx
        const prevY = (s.y / s.z) * FOV + cy

        s.z -= speed
        if (s.z <= 1) {
          s.x = (Math.random() - 0.5) * WARP_DEPTH * 2
          s.y = (Math.random() - 0.5) * WARP_DEPTH * 2
          s.z = WARP_DEPTH
          continue
        }

        const nx = (s.x / s.z) * FOV + cx
        const ny = (s.y / s.z) * FOV + cy
        if (nx < 0 || nx > W || ny < 0 || ny > H) continue

        const near  = 1 - s.z / WARP_DEPTH
        const size  = Math.max(0.3, near * 2.2)
        const alpha = s.brightness * (0.4 + 0.6 * near)

        // blue-white → very subtle warm tint at warp (stays restrained)
        const r = Math.round(185 + 40 * warpT)
        const g = Math.round(205 - 20 * warpT)
        const b = 255

        ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`
        ctx.lineWidth   = size
        ctx.beginPath()

        // Only streak when speed meaningful and gap large enough; cap streak length at 18px
        const dx = nx - prevX, dy = ny - prevY
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (speed > 2.5 && dist > 1.2) {
          const maxStreak = 18
          if (dist > maxStreak) {
            const ratio = maxStreak / dist
            ctx.moveTo(nx - dx * ratio, ny - dy * ratio)
          } else {
            ctx.moveTo(prevX, prevY)
          }
          ctx.lineTo(nx, ny)
        } else {
          ctx.moveTo(nx - 0.1, ny)
          ctx.lineTo(nx + 0.1, ny)
        }
        ctx.stroke()
      }
      animRef.current = requestAnimationFrame(tick)
    }
    tick()

    return () => {
      running = false
      cancelAnimationFrame(animRef.current)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ display: "block" }} />
}

/* ============================================================
   Phases:  "terminal" → "starfield" → "warp" → "title"
============================================================ */
type Phase = "terminal" | "starfield" | "warp" | "title"

export function Loading() {
  const [phase,      setPhase]      = useState<Phase>("terminal")
  const [lineIndex,  setLineIndex]  = useState(0)
  const [pilotName,  setPilotName]  = useState("")
  const [submitted,  setSubmitted]  = useState(false)
  const [postWarp,   setPostWarp]   = useState(false)

  // Called when user submits their name — kicks off rest of sequence
  const handleLaunch = (name: string) => {
    if (!name.trim()) return
    setPilotName(name.trim())
    setSubmitted(true)
    setTimeout(() => {
      setPhase("starfield")
      setTimeout(() => {
        setPhase("warp")
        setTimeout(() => {
          // warp ends: stars revert to drift, title appears
          setPostWarp(true)
          setPhase("title")
        }, WARP_DURATION_MS)
      }, STARFIELD_PAUSE_MS)
    }, TERMINAL_FADE_MS + 200)
  }

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0" style={{ backgroundColor: "#03030d" }} />

      {/* Stars always running — warp=true only during burst, postWarp keeps them alive at drift speed */}
      <StarCanvas warp={phase === "warp"} postWarp={postWarp} />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 65% at 50% 50%, transparent 35%, rgba(3,3,13,0.78) 100%)" }}
      />

      {/* ─── PHASE: terminal ─── */}
      <AnimatePresence>
        {phase === "terminal" && (
          <motion.div
            key="terminal"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: TERMINAL_FADE_MS / 1000, ease: "easeInOut" } }}
            transition={{ duration: 0.75, ease: "easeOut" }}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 1.5rem",
            }}
          >
            <div style={{ width: "100%", maxWidth: "42rem" }}>
              <TerminalWindow
                lineIndex={lineIndex}
                setLineIndex={setLineIndex}
                submitted={submitted}
                onLaunch={handleLaunch}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── PHASE: starfield — absolutely centered, independent of flex siblings ─── */}
      <AnimatePresence>
        {phase === "starfield" && (
          <motion.div
            key="starfield-label"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1.2, ease: "easeInOut" } }}
            transition={{ duration: 1.4, delay: 0.5 }}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            <GlowText size="xs" dim>preparing launch sequence</GlowText>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── PHASE: title ─── */}
      <AnimatePresence>
        {phase === "title" && (
          <motion.div
            key="title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 1.5rem",
            }}
          >
          <div style={{ width: "100%", maxWidth: "64rem", textAlign: "center" }}
          >
            {/* Scan-line */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0.9 }}
              animate={{ scaleX: 1, opacity: 0 }}
              transition={{ duration: 1.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              style={{
                height: "1px",
                marginBottom: "2.5rem",
                background: "linear-gradient(90deg, transparent, #FFB460, transparent)",
                transformOrigin: "left",
              }}
            />

            {/* Pilot greeting — glows */}
            {pilotName && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 1.0 }}
                className="font-mono text-xs tracking-[0.28em] uppercase mb-4"
                style={{ color: "rgba(255,180,96,0.5)" }}
              >
                <GlowText size="xs" dim>welcome aboard, pilot {pilotName}</GlowText>
              </motion.p>
            )}

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, letterSpacing: "0.55em", y: 28 }}
              animate={{ opacity: 1, letterSpacing: "0.06em", y: 0 }}
              transition={{ delay: 0.3, duration: 1.7, ease: [0.22, 1, 0.36, 1] }}
              className="font-bold"
              style={{
                fontSize: "clamp(2rem, 6vw, 4.5rem)",
                background: "linear-gradient(90deg,#ff4136 0%,#ff851b 28%,#ffb460 55%,#ff851b 80%,#ff4136 100%)",
                backgroundSize: "200% 200%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                animation: "gradientShift 4.5s ease infinite",
              }}
            >
              SELVAHINI KAMALARAJAN
            </motion.h1>

            {/* Subtitle with glow blink */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 1.0 }}
              className="mt-5"
            >
              <GlowText size="xs" dim>A Portfolio Inspired by Interstellar</GlowText>
            </motion.div>

            {/* Rule */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.9, duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
              style={{
                height: "1px",
                marginTop: "2rem",
                background: "linear-gradient(90deg, transparent, rgba(255,180,96,0.4), transparent)",
                transformOrigin: "center",
              }}
            />

            {/* Explore pill */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.5, duration: 0.9 }}
              className="mt-10 flex justify-center"
            >
              <PillLink href="/home" primary>
                Begin Mission &nbsp;→
              </PillLink>
            </motion.div>
          </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Skip Intro ─── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1.0 }}
        className="absolute bottom-8 right-8"
      >
        <PillLink href="/home">Skip Intro</PillLink>
      </motion.div>

      <style jsx>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50%       { background-position: 100% 50%; }
        }
        @keyframes textGlowPulse {
          0%, 100% { opacity: 0.45; text-shadow: 0 0 8px rgba(255,180,96,0.0); }
          50%       { opacity: 0.75; text-shadow: 0 0 14px rgba(255,180,96,0.35), 0 0 28px rgba(255,140,60,0.15); }
        }
        @keyframes pingGlow {
          0%   { transform: scale(1);   opacity: 1; box-shadow: 0 0 0 0 rgba(40,200,64,0.7); }
          70%  { transform: scale(1.5); opacity: 0; box-shadow: 0 0 0 8px rgba(40,200,64,0); }
          100% { transform: scale(1);   opacity: 0; }
        }
        @keyframes dotPulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>
    </div>
  )
}

/* ============================================================
   GlowText — ambient pulse glow on mono labels
============================================================ */
function GlowText({
  children,
  size = "xs",
  dim = false,
}: {
  children: React.ReactNode
  size?: "xs" | "sm"
  dim?: boolean
}) {
  return (
    <span
      className={`font-mono uppercase tracking-[0.3em] ${size === "xs" ? "text-xs" : "text-sm"}`}
      style={{ animation: "textGlowPulse 3s ease-in-out infinite" }}
    >
      {children}
    </span>
  )
}

/* ============================================================
   Terminal Window
============================================================ */
function TerminalWindow({
  lineIndex,
  setLineIndex,
  submitted,
  onLaunch,
}: {
  lineIndex: number
  setLineIndex: React.Dispatch<React.SetStateAction<number>>
  submitted: boolean
  onLaunch: (name: string) => void
}) {
  const allLinesTyped = lineIndex >= BOOT_LINES.length

  return (
    <div
      style={{
        border: "1px solid rgba(255,180,96,0.28)",
        borderRadius: "12px",
        backgroundColor: "rgba(3,3,18,0.78)",
        backdropFilter: "blur(14px)",
        boxShadow: "0 0 40px rgba(255,140,60,0.07), 0 0 80px rgba(80,80,200,0.05)",
        overflow: "hidden",
      }}
    >
      {/* Title bar */}
      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{
          borderBottom: "1px solid rgba(255,180,96,0.13)",
          backgroundColor: "rgba(255,180,96,0.025)",
        }}
      >
        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "#ff5f57" }} />
        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "#febc2e" }} />
        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "#28c840" }} />
        <span
          className="ml-4 font-mono text-xs"
          style={{ color: "rgba(255,180,96,0.38)", letterSpacing: "0.08em" }}
        >
          selva_os — transmission_terminal.exe
        </span>

        {/* Ping dot LIVE indicator */}
        <span className="ml-auto flex items-center gap-2">
          <span className="relative flex items-center justify-center w-3 h-3">
            {/* Outer ping ring */}
            <span
              className="absolute w-3 h-3 rounded-full"
              style={{
                backgroundColor: "rgba(40,200,64,0.35)",
                animation: "pingGlow 1.8s ease-out infinite",
              }}
            />
            {/* Inner solid dot */}
            <span
              className="relative w-1.5 h-1.5 rounded-full"
              style={{
                backgroundColor: "#28c840",
                animation: "dotPulse 1.8s ease-in-out infinite",
              }}
            />
          </span>
          <span className="font-mono text-xs" style={{ color: "rgba(255,255,255,0.22)" }}>
            LIVE
          </span>
        </span>
      </div>

      {/* Body */}
      <div className="px-5 py-5 space-y-2.5" style={{ minHeight: "190px" }}>
        {BOOT_LINES.slice(0, lineIndex + 1).map((line, i) => (
          <TerminalLine
            key={i}
            prefix={line.prefix}
            text={line.text}
            speed={40}
            showCursor={i === lineIndex && !allLinesTyped}
            onComplete={() => {
              if (i === lineIndex) setTimeout(() => setLineIndex((p) => p + 1), 340)
            }}
          />
        ))}

        {/* Pilot name input — appears after all lines typed, if not submitted */}
        <AnimatePresence>
          {allLinesTyped && !submitted && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <PilotInput onSubmit={onLaunch} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Confirmed launch line */}
        <AnimatePresence>
          {submitted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="font-mono text-sm flex"
            >
              <span className="mr-2 font-bold" style={{ color: "#28c840", minWidth: "1.6rem" }}>OK</span>
              <span style={{ color: "rgba(255,255,255,0.55)" }}>
                Identity confirmed. Initiating launch sequence...
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-between px-5 py-2"
        style={{
          borderTop: "1px solid rgba(255,180,96,0.09)",
          backgroundColor: "rgba(255,180,96,0.015)",
        }}
      >
        <span className="font-mono text-xs" style={{ color: "rgba(255,180,96,0.2)" }}>
          SECTOR: DEVELOPER QUADRANT
        </span>
        <span className="font-mono text-xs" style={{ color: "rgba(255,180,96,0.2)" }}>
          ORIGIN: EARTH — STATUS: ACTIVE
        </span>
      </div>
    </div>
  )
}

/* ============================================================
   Pilot name input row
============================================================ */
function PilotInput({ onSubmit }: { onSubmit: (name: string) => void }) {
  const [value, setValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Small delay so the row finishes animating in before focus
    const t = setTimeout(() => inputRef.current?.focus(), 120)
    return () => clearTimeout(t)
  }, [])

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onSubmit(value)
  }

  return (
    <div className="font-mono text-sm flex items-center gap-0">
      {/* Prefix */}
      <span className="select-none font-bold mr-2" style={{ color: "#FFB460", minWidth: "1.6rem" }}>
        &gt;_
      </span>
      {/* Prompt label */}
      <span style={{ color: "rgba(255,180,96,0.5)", marginRight: "8px", whiteSpace: "nowrap" }}>
        PILOT_ID:
      </span>
      {/* Text input styled as terminal field */}
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKey}
        placeholder="enter callsign..."
        maxLength={32}
        style={{
          background: "transparent",
          border: "none",
          outline: "none",
          color: "rgba(255,255,255,0.85)",
          fontFamily: "inherit",
          fontSize: "inherit",
          letterSpacing: "0.04em",
          caretColor: "#FFB460",
          flex: 1,
          minWidth: 0,
        }}
      />
      {/* Enter hint */}
      {value && (
        <motion.button
          initial={{ opacity: 0, x: 4 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => onSubmit(value)}
          style={{
            background: "transparent",
            border: "1px solid rgba(255,180,96,0.3)",
            borderRadius: "4px",
            color: "rgba(255,180,96,0.6)",
            fontFamily: "inherit",
            fontSize: "0.65rem",
            letterSpacing: "0.1em",
            padding: "1px 8px",
            cursor: "pointer",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          ENTER ↵
        </motion.button>
      )}
    </div>
  )
}

/* ============================================================
   Terminal Line
============================================================ */
function TerminalLine({
  prefix, text, speed, showCursor, onComplete,
}: {
  prefix: string; text: string; speed: number; showCursor: boolean; onComplete: () => void
}) {
  const [displayed, setDisplayed] = useState("")

  useEffect(() => {
    let i = 0
    const iv = setInterval(() => {
      if (i <= text.length) { setDisplayed(text.slice(0, i)); i++ }
      else { clearInterval(iv); onComplete() }
    }, speed)
    return () => clearInterval(iv)
  }, [text, speed])

  const prefixColor =
    prefix === "OK" ? "#28c840"
    : prefix === ">>" ? "rgba(255,180,96,0.5)"
    : "#FFB460"

  return (
    <div className="font-mono text-sm leading-relaxed flex">
      <span className="select-none mr-2 font-bold" style={{ color: prefixColor, minWidth: "1.6rem" }}>
        {prefix}
      </span>
      <span style={{ color: "rgba(255,255,255,0.7)" }}>
        {displayed}
        {showCursor && (
          <span style={{ color: "#FFB460", animation: "cursorBlink 0.85s step-start infinite" }}>▌</span>
        )}
      </span>
    </div>
  )
}

/* ============================================================
   Pill Link
============================================================ */
function PillLink({
  href, children, primary = false,
}: {
  href: string; children: React.ReactNode; primary?: boolean
}) {
  return (
    <a
      href={href}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        borderRadius: "9999px",
        padding: primary ? "0.6rem 2rem" : "0.45rem 1.25rem",
        fontSize: primary ? "0.78rem" : "0.68rem",
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        textDecoration: "none",
        transition: "all 0.25s ease",
        color: primary ? "#FFB460" : "rgba(255,180,96,0.42)",
        border: primary ? "1px solid rgba(255,180,96,0.38)" : "1px solid rgba(255,180,96,0.18)",
        backgroundColor: primary ? "rgba(255,180,96,0.05)" : "transparent",
      }}
      onMouseEnter={(e) => Object.assign(e.currentTarget.style, {
        color: "#FFB460",
        borderColor: "rgba(255,180,96,0.62)",
        backgroundColor: "rgba(255,180,96,0.1)",
        boxShadow: primary ? "0 0 22px rgba(255,140,60,0.13)" : "none",
      })}
      onMouseLeave={(e) => Object.assign(e.currentTarget.style, {
        color: primary ? "#FFB460" : "rgba(255,180,96,0.42)",
        borderColor: primary ? "rgba(255,180,96,0.38)" : "rgba(255,180,96,0.18)",
        backgroundColor: primary ? "rgba(255,180,96,0.05)" : "transparent",
        boxShadow: "none",
      })}
    >
      {children}
    </a>
  )
}
"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

/* ============================================================
   Timing (ms)
============================================================ */
const TERMINAL_FADE_MS    = 1100
const FLOAT_BEFORE_MS     = 4000   // float after terminal fades — feel the space
const WARP_RAMP_MS        = 900    // fast ramp to peak
const WARP_PEAK_MS        = 1200   // brief intense peak
const WARP_DECEL_MS       = 3200   // long cinematic slowdown — stars become shooting stars
const BASE_SPEED          = 0.8    // px/frame float
const WARP_PEAK_SPEED     = 22     // match original's WARP_SPEED for full intensity

/* ============================================================
   Boot lines
============================================================ */
const BOOT_LINES = [
  { prefix: "$",  text: " boot  vahini_os --mode=portfolio" },
  { prefix: ">>", text: " Compiling creative modules  [████████] 100%" },
  { prefix: ">>", text: " Establishing deep-space link..." },
  { prefix: "OK", text: " Systems nominal. Identify yourself, pilot." },
]

/* ============================================================
   Starfield — single canvas, never unmounts.

   Stars store their own ppx/ppy (previous projected position)
   exactly like the original — so prev positions are ALWAYS valid
   regardless of speed changes, and stars persist as shooting-star
   trails forever after warp ends.

   Speed curve (driven by a single timestamp, no React state):
     float (BASE_SPEED) → fast ramp → PEAK → long cinematic decel → float ∞
   Trail alpha INVERTS with speed:
     fast warp  → low alpha  (0.10) → long comet tails
     slow float → high alpha (0.28) → stars fade quickly, feel like points
============================================================ */
const STAR_COUNT   = 900
const WARP_DEPTH   = 1000
const FOV          = 300

type Star = {
  x: number; y: number; z: number
  ppx: number; ppy: number   // previous projected — always kept fresh
  brightness: number
}

function makeStars(): Star[] {
  return Array.from({ length: STAR_COUNT }, () => {
    const z = Math.random() * WARP_DEPTH
    return {
      x: (Math.random() - 0.5) * WARP_DEPTH * 2,
      y: (Math.random() - 0.5) * WARP_DEPTH * 2,
      z,
      ppx: 0, ppy: 0,
      brightness: 0.4 + Math.random() * 0.6,
    }
  })
}

// Module-level — set once when pilot confirms name, never reset
let warpStartTs: number | null = null
function triggerWarp() { warpStartTs = performance.now() }

function StarCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const starsRef  = useRef<Star[]>(makeStars())
  const animRef   = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx    = canvas.getContext("2d")!
    let running  = true

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    const tick = () => {
      if (!running) return
      const W = canvas.width, H = canvas.height
      const cx = W / 2, cy = H / 2

      // ── Speed + warpT ────────────────────────────────────────
      // warpT: 0 = full float, 1 = peak warp (used for trail & color)
      let speed = BASE_SPEED
      let warpT = 0

      if (warpStartTs !== null) {
        const elapsed = performance.now() - warpStartTs
        const T1 = WARP_RAMP_MS
        const T2 = T1 + WARP_PEAK_MS
        const T3 = T2 + WARP_DECEL_MS

        if (elapsed < T1) {
          // cubic ease-in ramp
          const t    = elapsed / T1
          warpT = t * t * (3 - 2 * t)
          speed = BASE_SPEED + (WARP_PEAK_SPEED - BASE_SPEED) * warpT
        } else if (elapsed < T2) {
          // plateau
          warpT = 1
          speed = WARP_PEAK_SPEED
        } else if (elapsed < T3) {
          // long cubic ease-out decel — stars slow like a ship dropping from hyperspace
          const t    = (elapsed - T2) / WARP_DECEL_MS
          const ease = 1 - Math.pow(1 - t, 3)
          warpT = 1 - ease
          speed = WARP_PEAK_SPEED + (BASE_SPEED - WARP_PEAK_SPEED) * ease
        }
        // else: elapsed >= T3 → warpT stays 0, speed stays BASE_SPEED (float forever)
      }

      // ── Trail alpha ──────────────────────────────────────────
      // Float: 0.45 — high alpha means each frame nearly erases the last,
      //   so slow-moving stars look like crisp drifting particles, no tails
      // Peak warp: 0.10 — low alpha = long comet tails
      const trailAlpha = 0.45 - 0.35 * warpT
      ctx.fillStyle = `rgba(4,4,14,${trailAlpha})`
      ctx.fillRect(0, 0, W, H)

      // ── Stars ────────────────────────────────────────────────
      for (const s of starsRef.current) {
        const curPx = (s.x / s.z) * FOV + cx
        const curPy = (s.y / s.z) * FOV + cy

        s.z -= speed
        if (s.z <= 1) {
          s.x = (Math.random() - 0.5) * WARP_DEPTH * 2
          s.y = (Math.random() - 0.5) * WARP_DEPTH * 2
          s.z = WARP_DEPTH
          s.ppx = (s.x / s.z) * FOV + cx
          s.ppy = (s.y / s.z) * FOV + cy
          continue
        }

        const nx = (s.x / s.z) * FOV + cx
        const ny = (s.y / s.z) * FOV + cy
        s.ppx = nx
        s.ppy = ny

        if (nx < 0 || nx > W || ny < 0 || ny > H) continue

        const near  = 1 - s.z / WARP_DEPTH
        const size  = Math.max(0.5, near * 2.4)
        const alpha = s.brightness * (0.5 + 0.5 * near)

        const r = Math.round(200 + 55 * warpT)
        const g = Math.round(210 - 30 * warpT)
        const b = 255

        const dx   = nx - curPx
        const dy   = ny - curPy
        const dist = Math.sqrt(dx * dx + dy * dy)

        // Only streak during meaningful warp; cap tail to 12px so lines stay crisp
        if (warpT > 0.15 && dist > 1.0) {
          const MAX_TAIL = 12
          const tailLen  = Math.min(dist, MAX_TAIL)
          const ratio    = tailLen / dist
          ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`
          ctx.lineWidth   = size
          ctx.beginPath()
          ctx.moveTo(nx - dx * ratio, ny - dy * ratio)
          ctx.lineTo(nx, ny)
          ctx.stroke()
        } else {
          // Pure particle dot — filled circle, no tail
          ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`
          ctx.beginPath()
          ctx.arc(nx, ny, size * 0.75, 0, Math.PI * 2)
          ctx.fill()
        }
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

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: "block" }}
    />
  )
}

/* ============================================================
   RadarCanvas — amber sonar sweep that plays once on title reveal.
   Drawn on a transparent canvas overlaid on the title.
   One full sweep (360°) over ~2.8s, then fades out.
============================================================ */
function RadarCanvas({ active }: { active: boolean }) {
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const animRef    = useRef<number>(0)
  const startRef   = useRef<number | null>(null)

  const SWEEP_MS   = 2800   // one full rotation
  const LINGER_MS  = 600    // hold after sweep before fade
  const FADE_MS    = 900

  useEffect(() => {
    if (!active) return
    const canvas = canvasRef.current!
    const ctx    = canvas.getContext("2d")!
    let running  = true
    startRef.current = performance.now()

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    const tick = () => {
      if (!running) return
      const elapsed = performance.now() - (startRef.current ?? 0)
      const W = canvas.width, H = canvas.height
      const cx = W / 2, cy = H / 2
      // Radius reaches ~40% of the smaller dimension
      const R = Math.min(W, H) * 0.40

      ctx.clearRect(0, 0, W, H)

      // Overall opacity — fade out after sweep + linger
      let masterAlpha = 1
      if (elapsed > SWEEP_MS + LINGER_MS) {
        masterAlpha = 1 - Math.min((elapsed - SWEEP_MS - LINGER_MS) / FADE_MS, 1)
      }
      if (masterAlpha <= 0) {
        cancelAnimationFrame(animRef.current)
        return
      }

      const sweepT   = Math.min(elapsed / SWEEP_MS, 1)               // 0→1 over sweep
      const sweepAng = sweepT * Math.PI * 2 - Math.PI / 2            // starts at top

      // ── Concentric rings ────────────────────────────────────
      for (let ring = 1; ring <= 3; ring++) {
        const rr = R * (ring / 3)
        ctx.beginPath()
        ctx.arc(cx, cy, rr, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(255,180,96,${0.12 * masterAlpha})`
        ctx.lineWidth   = 0.5
        ctx.stroke()
      }

      // ── Cross-hairs ─────────────────────────────────────────
      ctx.strokeStyle = `rgba(255,180,96,${0.1 * masterAlpha})`
      ctx.lineWidth   = 0.5
      ctx.beginPath(); ctx.moveTo(cx - R, cy); ctx.lineTo(cx + R, cy); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(cx, cy - R); ctx.lineTo(cx, cy + R); ctx.stroke()

      // ── Sweep wedge ─────────────────────────────────────────
      const wedge = Math.PI * 0.28   // ~50° trailing glow
      // Wedge as arc fill — radial sweep fan
      ctx.save()
      ctx.globalAlpha = masterAlpha
      const wedgeGrad = ctx.createLinearGradient(
        cx + Math.cos(sweepAng - wedge) * R,
        cy + Math.sin(sweepAng - wedge) * R,
        cx + Math.cos(sweepAng) * R,
        cy + Math.sin(sweepAng) * R,
      )
      wedgeGrad.addColorStop(0, "rgba(255,180,96,0)")
      wedgeGrad.addColorStop(1, "rgba(255,180,96,0.18)")

      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.arc(cx, cy, R, sweepAng - wedge, sweepAng)
      ctx.closePath()
      ctx.fillStyle = wedgeGrad
      ctx.fill()
      ctx.restore()

      // ── Leading edge — bright line ──────────────────────────
      ctx.save()
      ctx.globalAlpha = masterAlpha * 0.85
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.lineTo(
        cx + Math.cos(sweepAng) * R,
        cy + Math.sin(sweepAng) * R,
      )
      ctx.strokeStyle = "rgba(255,180,96,0.7)"
      ctx.lineWidth   = 1.2
      ctx.stroke()
      ctx.restore()

      // ── Center dot ──────────────────────────────────────────
      ctx.save()
      ctx.globalAlpha = masterAlpha * 0.6
      ctx.beginPath()
      ctx.arc(cx, cy, 3, 0, Math.PI * 2)
      ctx.fillStyle = "#FFB460"
      ctx.fill()
      ctx.restore()

      // ── Blip pings where sweep has passed — scattered dots ──
      // Seeded positions so they're stable across frames
      const BLIPS = [
        { a: 0.8,  r: 0.55 }, { a: 1.9, r: 0.72 }, { a: 3.3, r: 0.40 },
        { a: 4.5,  r: 0.62 }, { a: 5.2, r: 0.30 }, { a: 2.6, r: 0.85 },
        { a: 0.3,  r: 0.78 }, { a: 4.1, r: 0.50 },
      ]
      const normalised = ((sweepAng + Math.PI / 2 + Math.PI * 2) % (Math.PI * 2))
      for (const blip of BLIPS) {
        const blipAng = blip.a
        // Has the sweep passed this blip this rotation?
        if (blipAng > normalised) continue
        const age    = (normalised - blipAng) / (Math.PI * 2)   // 0 = just hit, 1 = old
        const bAlpha = masterAlpha * Math.max(0, 1 - age * 3.5) // fades out quickly
        if (bAlpha <= 0) continue
        const bx = cx + Math.cos(blipAng - Math.PI / 2) * R * blip.r
        const by = cy + Math.sin(blipAng - Math.PI / 2) * R * blip.r
        ctx.save()
        ctx.globalAlpha = bAlpha
        ctx.beginPath()
        ctx.arc(bx, by, 2.5, 0, Math.PI * 2)
        ctx.fillStyle = "#FFB460"
        ctx.fill()
        // Glow ring
        ctx.beginPath()
        ctx.arc(bx, by, 5, 0, Math.PI * 2)
        ctx.strokeStyle = "rgba(255,180,96,0.4)"
        ctx.lineWidth   = 1
        ctx.stroke()
        ctx.restore()
      }

      animRef.current = requestAnimationFrame(tick)
    }

    tick()
    return () => {
      running = false
      cancelAnimationFrame(animRef.current)
      window.removeEventListener("resize", resize)
    }
  }, [active])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ display: "block" }}
    />
  )
}

/* ============================================================
   Phases
============================================================ */
type Phase = "terminal" | "starfield" | "warp" | "title"

export function Loading() {
  const [phase,       setPhase]       = useState<Phase>("terminal")
  const [lineIndex,   setLineIndex]   = useState(0)
  const [pilotName,   setPilotName]   = useState("")
  const [submitted,   setSubmitted]   = useState(false)
  const [radarActive, setRadarActive] = useState(false)

  const handleLaunch = (name: string) => {
    if (!name.trim()) return
    setPilotName(name.trim())
    setSubmitted(true)

    setTimeout(() => {
      setPhase("starfield")
      setTimeout(() => {
        triggerWarp()
        setPhase("warp")
        setTimeout(() => {
          setPhase("title")
          setRadarActive(true)
        }, WARP_RAMP_MS + WARP_PEAK_MS + 800)
      }, FLOAT_BEFORE_MS)
    }, TERMINAL_FADE_MS + 200)
  }

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0" style={{ backgroundColor: "#03030d" }} />

      {/* ── Starfield — NEVER unmounts ── */}
      <StarCanvas />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 65% at 50% 50%, transparent 35%, rgba(3,3,13,0.76) 100%)",
        }}
      />

      {/* ── Terminal ── */}
      <AnimatePresence>
        {phase === "terminal" && (
          <motion.div
            key="terminal"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: TERMINAL_FADE_MS / 1000, ease: "easeInOut" } }}
            transition={{ duration: 0.75, ease: "easeOut" }}
            style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
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

      {/* ── Starfield label — absolutely centered, mounts only after terminal gone ── */}
      <AnimatePresence>
        {phase === "starfield" && (
          <motion.div
            key="starfield-label"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1.0, ease: "easeInOut" } }}
            transition={{ duration: 1.2, delay: 0.6 }}
            style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            <GlowText>preparing launch sequence</GlowText>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Title — stars still floating behind it ── */}
      <AnimatePresence>
        {phase === "title" && (
          <motion.div
            key="title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: "0 1.5rem",
            }}
          >
            {/* Radar sweeps once behind everything */}
            <RadarCanvas active={radarActive} />

            <div style={{ width: "100%", maxWidth: "64rem", textAlign: "center", position: "relative" }}>

              {/* Scan-line */}
              <motion.div
                initial={{ scaleX: 0, opacity: 0.9 }}
                animate={{ scaleX: 1, opacity: 0 }}
                transition={{ duration: 1.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  height: "1px", marginBottom: "2.5rem",
                  background: "linear-gradient(90deg, transparent, #FFB460, transparent)",
                  transformOrigin: "left",
                }}
              />

              {/* Pilot greeting */}
              {pilotName && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 1.0 }}
                  style={{ marginBottom: "1rem" }}
                >
                  <GlowText>welcome aboard, pilot {pilotName}</GlowText>
                </motion.div>
              )}

              {/* Name */}
              <motion.h1
                initial={{ opacity: 0, letterSpacing: "0.55em", y: 28 }}
                animate={{ opacity: 1, letterSpacing: "0.06em", y: 0 }}
                transition={{ delay: 0.35, duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  fontSize: "clamp(2rem, 6vw, 4.5rem)",
                  fontWeight: 700,
                  background:
                    "linear-gradient(90deg,#ff4136 0%,#ff851b 28%,#ffb460 55%,#ff851b 80%,#ff4136 100%)",
                  backgroundSize: "200% 200%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  animation: "gradientShift 4.5s ease infinite",
                }}
              >
                SELVAHINI KAMALARAJAN
              </motion.h1>

              {/* Subtitle */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 1.0 }}
                style={{ marginTop: "1.25rem" }}
              >
                <GlowText dim>A Portfolio Inspired by Interstellar</GlowText>
              </motion.div>

              {/* Rule */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 2.0, duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  height: "1px", marginTop: "2rem",
                  background: "linear-gradient(90deg, transparent, rgba(255,180,96,0.4), transparent)",
                  transformOrigin: "center",
                }}
              />

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.6, duration: 0.9 }}
                style={{ marginTop: "2.5rem", display: "flex", justifyContent: "center" }}
              >
                <PillLink href="/home" primary>Begin Mission &nbsp;→</PillLink>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skip Intro */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1.0 }}
        style={{ position: "absolute", bottom: "2rem", right: "2rem" }}
      >
        <PillLink href="/home">Skip Intro</PillLink>
      </motion.div>

      <style jsx>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50%       { background-position: 100% 50%; }
        }
        @keyframes textGlowPulse {
          0%, 100% { opacity: 0.42; text-shadow: none; }
          50%       { opacity: 0.72; text-shadow: 0 0 12px rgba(255,180,96,0.3), 0 0 24px rgba(255,140,60,0.12); }
        }
        @keyframes pingRing {
          0%   { transform: scale(1);   opacity: 0.9; }
          80%  { transform: scale(2.2); opacity: 0;   }
          100% { transform: scale(2.2); opacity: 0;   }
        }
        @keyframes dotBreath {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
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
   GlowText
============================================================ */
function GlowText({ children, dim = false }: { children: React.ReactNode; dim?: boolean }) {
  return (
    <span
      className="font-mono text-xs uppercase tracking-[0.3em]"
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
  lineIndex, setLineIndex, submitted, onLaunch,
}: {
  lineIndex: number
  setLineIndex: React.Dispatch<React.SetStateAction<number>>
  submitted: boolean
  onLaunch: (name: string) => void
}) {
  const allTyped = lineIndex >= BOOT_LINES.length

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
        style={{
          display: "flex", alignItems: "center", gap: "8px",
          padding: "10px 16px",
          borderBottom: "1px solid rgba(255,180,96,0.13)",
          backgroundColor: "rgba(255,180,96,0.025)",
        }}
      >
        <span style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#ff5f57", display: "inline-block" }} />
        <span style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#febc2e", display: "inline-block" }} />
        <span style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#28c840", display: "inline-block" }} />
        <span
          className="font-mono text-xs"
          style={{ marginLeft: "1rem", color: "rgba(255,180,96,0.38)", letterSpacing: "0.08em" }}
        >
          vahini_os — transmission_terminal.exe
        </span>

        {/* Ping dot */}
        <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ position: "relative", width: 12, height: 12, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            <span
              style={{
                position: "absolute",
                width: 12, height: 12,
                borderRadius: "50%",
                backgroundColor: "rgba(40,200,64,0.4)",
                animation: "pingRing 1.8s ease-out infinite",
              }}
            />
            <span
              style={{
                position: "relative",
                width: 6, height: 6,
                borderRadius: "50%",
                backgroundColor: "#28c840",
                animation: "dotBreath 1.8s ease-in-out infinite",
              }}
            />
          </span>
          <span className="font-mono text-xs" style={{ color: "rgba(255,255,255,0.22)" }}>LIVE</span>
        </span>
      </div>

      {/* Body */}
      <div style={{ padding: "20px", minHeight: "190px", display: "flex", flexDirection: "column", gap: "10px" }}>
        {BOOT_LINES.slice(0, lineIndex + 1).map((line, i) => (
          <TerminalLine
            key={i}
            prefix={line.prefix}
            text={line.text}
            speed={40}
            showCursor={i === lineIndex && !allTyped}
            onComplete={() => {
              if (i === lineIndex) setTimeout(() => setLineIndex(p => p + 1), 340)
            }}
          />
        ))}

        <AnimatePresence>
          {allTyped && !submitted && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
            >
              <PilotInput onSubmit={onLaunch} />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {submitted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              style={{ display: "flex", fontFamily: "monospace", fontSize: "0.875rem" }}
            >
              <span style={{ color: "#28c840", fontWeight: 700, minWidth: "1.6rem", marginRight: "8px" }}>OK</span>
              <span style={{ color: "rgba(255,255,255,0.55)" }}>Identity confirmed. Initiating launch sequence...</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex", justifyContent: "space-between", padding: "6px 20px",
          borderTop: "1px solid rgba(255,180,96,0.09)",
          backgroundColor: "rgba(255,180,96,0.015)",
        }}
      >
        <span className="font-mono text-xs" style={{ color: "rgba(255,180,96,0.2)" }}>SECTOR: DEVELOPER QUADRANT</span>
        <span className="font-mono text-xs" style={{ color: "rgba(255,180,96,0.2)" }}>ORIGIN: EARTH — STATUS: ACTIVE</span>
      </div>
    </div>
  )
}

/* ============================================================
   Pilot Input
============================================================ */
function PilotInput({ onSubmit }: { onSubmit: (name: string) => void }) {
  const [value, setValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 120)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{ display: "flex", alignItems: "center", fontFamily: "monospace", fontSize: "0.875rem" }}>
      <span style={{ color: "#FFB460", fontWeight: 700, minWidth: "1.6rem", marginRight: "8px" }}>&gt;_</span>
      <span style={{ color: "rgba(255,180,96,0.5)", marginRight: "8px", whiteSpace: "nowrap" }}>PILOT_ID:</span>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter") onSubmit(value) }}
        placeholder="enter callsign..."
        maxLength={32}
        style={{
          background: "transparent", border: "none", outline: "none",
          color: "rgba(255,255,255,0.85)", fontFamily: "inherit", fontSize: "inherit",
          letterSpacing: "0.04em", caretColor: "#FFB460", flex: 1, minWidth: 0,
        }}
      />
      {value && (
        <motion.button
          initial={{ opacity: 0, x: 4 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => onSubmit(value)}
          style={{
            background: "transparent", border: "1px solid rgba(255,180,96,0.3)",
            borderRadius: "4px", color: "rgba(255,180,96,0.6)", fontFamily: "inherit",
            fontSize: "0.65rem", letterSpacing: "0.1em", padding: "1px 8px",
            cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
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
function TerminalLine({ prefix, text, speed, showCursor, onComplete }: {
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
    prefix === "OK" ? "#28c840" : prefix === ">>" ? "rgba(255,180,96,0.5)" : "#FFB460"

  return (
    <div style={{ display: "flex", fontFamily: "monospace", fontSize: "0.875rem", lineHeight: 1.6 }}>
      <span style={{ color: prefixColor, fontWeight: 700, minWidth: "1.6rem", marginRight: "8px" }}>{prefix}</span>
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
function PillLink({ href, children, primary = false }: {
  href: string; children: React.ReactNode; primary?: boolean
}) {
  return (
    <a
      href={href}
      style={{
        display: "inline-flex", alignItems: "center", gap: "6px",
        borderRadius: "9999px",
        padding: primary ? "0.6rem 2rem" : "0.45rem 1.25rem",
        fontSize: primary ? "0.78rem" : "0.68rem",
        letterSpacing: "0.14em", textTransform: "uppercase", textDecoration: "none",
        transition: "all 0.25s ease",
        color: primary ? "#FFB460" : "rgba(255,180,96,0.42)",
        border: primary ? "1px solid rgba(255,180,96,0.38)" : "1px solid rgba(255,180,96,0.18)",
        backgroundColor: primary ? "rgba(255,180,96,0.05)" : "transparent",
      }}
      onMouseEnter={e => Object.assign(e.currentTarget.style, {
        color: "#FFB460", borderColor: "rgba(255,180,96,0.62)",
        backgroundColor: "rgba(255,180,96,0.1)",
        boxShadow: primary ? "0 0 22px rgba(255,140,60,0.13)" : "none",
      })}
      onMouseLeave={e => Object.assign(e.currentTarget.style, {
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
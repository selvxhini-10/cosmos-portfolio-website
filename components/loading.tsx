"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

/* ============================================================
   Terminal Boot Lines
============================================================ */

const TERMINAL_LINES = [
  "$ loading_portfolio.exe",
  ">> Initializing runtime environment...",
  ">> Boot sequence complete."
]

/* ============================================================
   Loading Screen (Overlay-safe)
============================================================ */

export function Loading() {
  const [lineIndex, setLineIndex] = useState(0)
  const [terminalComplete, setTerminalComplete] = useState(false)

  useEffect(() => {
    if (lineIndex === TERMINAL_LINES.length) {
      const t = setTimeout(() => setTerminalComplete(true), 700)
      return () => clearTimeout(t)
    }
  }, [lineIndex])

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-auto"
    >
      {/* Optional cinematic scrim (safe over video) */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(10,10,20,0.65)" }}
      />

      <div className="relative w-full max-w-4xl px-6">

        {/* ================= TERMINAL PHASE ================= */}
        <AnimatePresence>
          {!terminalComplete && (
            <motion.div
              initial={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.9, ease: "easeInOut" }}
              className="space-y-2 text-left"
              style={{ color: "rgba(255,255,255,0.75)" }}
            >
              {TERMINAL_LINES.slice(0, lineIndex + 1).map((line, i) => (
                <TypeWriter
                  key={i}
                  text={line}
                  speed={60}
                  showCursor={i === lineIndex}
                  onComplete={() => {
                    if (i === lineIndex) {
                      setTimeout(() => setLineIndex(prev => prev + 1), 450)
                    }
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ================= CINEMATIC TITLE ================= */}
        <AnimatePresence>
          {terminalComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 1.6,
                ease: [0.22, 1, 0.36, 1]
              }}
              className="text-center"
            >
              <motion.h1
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.35,
                  duration: 1.2,
                  ease: [0.22, 1, 0.36, 1]
                }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold"
                style={{
                  background:
                    "linear-gradient(90deg,#ff4136 0%,#ff851b 33%,#ffb460 66%,#ff851b 100%)",
                  backgroundSize: "200% 200%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  animation: "gradientShift 3s ease infinite",
                  textShadow: "0 0 60px rgba(255,120,80,0.35)",
                  letterSpacing: "0.04em"
                }}
              >
                SELVAHINI KAMALARAJAN
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6, duration: 0.8 }}
                className="mt-8 tracking-[0.35em]"
                style={{ color: "#FFB460" }}
              >
                A PORTFOLIO INSPIRED BY INTERSTELLAR
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ================= SKIP INTRO ================= */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        className="absolute bottom-8 right-8"
      >
        <a
          href="/home"
          className="text-sm uppercase tracking-wider px-4 py-2 rounded-full transition-all duration-200"
          style={{
            color: "rgba(255, 180, 96, 0.6)",
            borderWidth: "1px",
            borderColor: "rgba(255, 180, 96, 0.3)",
            backgroundColor: "rgba(255, 180, 96, 0.05)"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#FFB460"
            e.currentTarget.style.borderColor = "rgba(255, 180, 96, 0.6)"
            e.currentTarget.style.backgroundColor = "rgba(255, 180, 96, 0.1)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "rgba(255, 180, 96, 0.6)"
            e.currentTarget.style.borderColor = "rgba(255, 180, 96, 0.3)"
            e.currentTarget.style.backgroundColor = "rgba(255, 180, 96, 0.05)"
          }}
        >
          Skip Intro
        </a>
      </motion.div>

      <style jsx>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  )
}

/* ============================================================
   TypeWriter
============================================================ */

function TypeWriter({
  text,
  speed = 70,
  showCursor = false,
  onComplete
}: {
  text: string
  speed?: number
  showCursor?: boolean
  onComplete?: () => void
}) {
  const [displayed, setDisplayed] = useState("")

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      if (i <= text.length) {
        setDisplayed(text.slice(0, i))
        i++
      } else {
        clearInterval(interval)
        onComplete?.()
      }
    }, speed)

    return () => clearInterval(interval)
  }, [text, speed])

  return (
    <div className="font-mono text-[1rem]">
      {displayed}
      {showCursor && <span className="ml-1 animate-pulse">▌</span>}
    </div>
  )
}

"use client"

import type React from "react"
import { useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { PaperPlaneIcon } from "@radix-ui/react-icons"
import dynamic from "next/dynamic"

// Lazy — Spline's WebGL runtime is ~800 KB; defer until section is in view
const Spline = dynamic(() => import("@splinetool/react-spline"), { ssr: false })

export function ContactSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  const [formState, setFormState] = useState({ name: "", email: "", message: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSuccess(false)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      })
      if (!res.ok) throw new Error("Failed")
      setFormState({ name: "", email: "", message: "" })
      setSuccess(true)
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" ref={ref} className="relative z-10 py-24">
      <div className="absolute inset-0 bg-cosmic-black/40 -z-10" />

      <div className="relative max-w-7xl mx-auto px-6">

        {/* ── Header ───────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-cosmic-white">
            CONTACT <span className="text-gradient-red-gold">ME</span>
          </h2>
          <p className="mt-4 mx-auto max-w-2xl text-cosmic-white/70 text-base leading-relaxed">
            Open to collaborations, co-ops, and conversations. Reach out below.
          </p>
        </motion.div>

        {/* ── Terminal status — full-width top bar ──────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-8 rounded-xl border border-cosmic-gold/25 bg-cosmic-black/60 overflow-hidden"
          style={{ boxShadow: "0 0 24px rgba(255,180,100,0.08), inset 0 1px 0 rgba(255,255,255,0.03)" }}
        >
          {/* title bar */}
          <div className="flex items-center gap-2 px-5 py-3 border-b border-cosmic-gold/15 bg-cosmic-black/40">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
            <span className="ml-3 text-cosmic-white/30 text-xs font-mono tracking-widest">
              secure_link.sys — LIVE
            </span>
            <span className="ml-auto flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cosmic-gold animate-pulse" />
              <span className="text-cosmic-gold/60 text-xs font-mono">CONNECTED</span>
            </span>
          </div>
          {/* readout row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-cosmic-gold/10 text-center">
            {[
              { label: "SIGNAL",     value: "STRONG",   color: "text-green-400" },
              { label: "ENCRYPTION", value: "AES-256",  color: "text-cosmic-gold" },
              { label: "LATENCY",    value: "< 2 ms",   color: "text-cosmic-gold" },
              { label: "STATUS",     value: "READY",    color: "text-green-400" },
            ].map(({ label, value, color }) => (
              <div key={label} className="px-4 py-4">
                <p className="text-cosmic-white/30 text-[0.6rem] tracking-[0.2em] uppercase mb-1">{label}</p>
                <p className={`text-sm font-mono font-bold ${color}`}>{value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Two-column: UFO model left · form right ───────────────── */}
        <div className="grid lg:grid-cols-2 gap-8 items-stretch">

          {/* LEFT — Spline UFO */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="relative rounded-2xl border border-cosmic-gold/20 bg-cosmic-black/40 overflow-hidden min-h-[420px]"
          >
            {/* Only mount Spline after the section is visible */}
            {isInView && (
              <Spline
                scene="https://prod.spline.design/bRYq5NjKXuiOAAG8/scene.splinecode"
                className="absolute inset-0 w-full h-full"
              />
            )}
            {/* Thin edge blend — single gradient per edge, not stacked */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-cosmic-black/60 to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-cosmic-black/60 to-transparent" />

            {/* Corner label */}
            <div className="absolute top-4 left-4 pointer-events-none">
              <span className="text-[0.6rem] font-mono tracking-widest text-cosmic-white/25 uppercase">
                // MANIPULATOR
              </span>
            </div>
          </motion.div>

          {/* RIGHT — Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <form
              onSubmit={handleSubmit}
              className="h-full p-8 border border-cosmic-gold/20 rounded-2xl bg-cosmic-black/50 flex flex-col gap-5"
            >
              <div>
                <label className="block text-cosmic-white/50 text-xs mb-2 uppercase tracking-widest font-mono">
                  // NAME
                </label>
                <input
                  type="text"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-cosmic-black/60 border border-cosmic-gold/20 rounded-lg text-cosmic-white placeholder-cosmic-white/20 focus:outline-none focus:border-cosmic-gold/60 transition-colors text-sm font-mono"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-cosmic-white/50 text-xs mb-2 uppercase tracking-widest font-mono">
                  // EMAIL
                </label>
                <input
                  type="email"
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-cosmic-black/60 border border-cosmic-gold/20 rounded-lg text-cosmic-white placeholder-cosmic-white/20 focus:outline-none focus:border-cosmic-gold/60 transition-colors text-sm font-mono"
                  placeholder="your.email@example.com"
                />
              </div>

              <div className="flex-1 flex flex-col">
                <label className="block text-cosmic-white/50 text-xs mb-2 uppercase tracking-widest font-mono">
                  // MESSAGE
                </label>
                <textarea
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  required
                  rows={5}
                  className="flex-1 w-full px-4 py-3 bg-cosmic-black/60 border border-cosmic-gold/20 rounded-lg text-cosmic-white placeholder-cosmic-white/20 focus:outline-none focus:border-cosmic-gold/60 transition-colors resize-none text-sm font-mono"
                  placeholder="Your message..."
                />
              </div>

              {success && (
                <div className="rounded-lg border border-green-400/30 bg-green-400/10 px-4 py-3 text-center text-green-300 text-sm font-mono">
                  {">> Transmission received. I'll respond soon."}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-cosmic-gold to-cosmic-orange text-cosmic-black font-bold rounded-lg tracking-widest uppercase text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-[0_0_24px_rgba(255,180,100,0.4)] hover:scale-[1.01] active:scale-[0.99]"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-cosmic-black/30 border-t-cosmic-black rounded-full animate-spin" />
                    SENDING...
                  </>
                ) : (
                  <>
                    <PaperPlaneIcon className="w-4 h-4" />
                    TRANSMIT
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

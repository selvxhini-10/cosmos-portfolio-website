"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Cpu, Users, Globe, Code2, Zap, Star } from "lucide-react"

/**
 * ImpactSection — Accretion Disk showcase
 *
 * Design concept (BlackQuantum-inspired):
 * - Full-width accretion disk video as atmospheric backdrop
 * - Dark glass card centred over it, like data readouts floating in space
 * - Two rows of metrics + a horizontal tech bar — all real numbers from the portfolio
 * - Pure CSS hover transitions, zero Framer overhead on the cards
 */

const metrics = [
  { label: "Students Reached",    value: "1,800+", icon: Users,  desc: "STEM outreach across KW" },
  { label: "AI Participants",      value: "700+",   icon: Globe,  desc: "GenAI booth engagements" },
  { label: "Projects Shipped",     value: "10+",    icon: Code2,  desc: "Full-stack & embedded" },
  { label: "Stack Depth",          value: "30+",    icon: Cpu,    desc: "Languages & frameworks" },
  { label: "Cloud Platforms",      value: "Azure",  icon: Zap,    desc: "Functions · Blob · AI Foundry" },
  { label: "Recognition",          value: "Dean's", icon: Star,   desc: "Honours List — UWaterloo" },
]

export function ImpactSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section
      ref={ref}
      id="impact"
      className="relative z-10 py-0 overflow-hidden"
      style={{ minHeight: "520px" }}
    >
      {/* ── Accretion disk video backdrop ───────────────────────────────── */}
      {/* preload="none" + isInView gate → zero network cost until scrolled in */}
      <div className="absolute inset-0 -z-10">
        {isInView && (
          <video
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            style={{ filter: "brightness(0.55) saturate(1.3)" }}
          >
            <source src="/videos/accretion_disk.mp4" type="video/mp4" />
          </video>
        )}
        {/* Vignette: darkens edges so the glass card pops */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,transparent_30%,rgba(5,3,10,0.85)_100%)]" />
        {/* Top + bottom fades blend into adjacent sections */}
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-cosmic-black to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-cosmic-black to-transparent" />
      </div>

      {/* ── Glass card ──────────────────────────────────────────────────── */}
      <div className="relative max-w-5xl mx-auto px-6 py-20 flex flex-col items-center">

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="w-full rounded-2xl border border-white/10 overflow-hidden"
          style={{
            background: "linear-gradient(135deg,rgba(10,8,20,0.82) 0%,rgba(20,12,28,0.78) 100%)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            boxShadow: "0 0 0 1px rgba(255,180,100,0.08), 0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
        >
          {/* Card header */}
          <div className="px-8 pt-8 pb-6 border-b border-white/[0.06]">
            {/* macOS-style traffic lights */}
            <div className="flex items-center gap-2 mb-5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
              <div className="w-3 h-3 rounded-full bg-green-400/80" />
              <span className="ml-3 text-white/30 text-xs font-mono tracking-widest">portfolio_metrics.sys</span>
            </div>

            <p className="text-white/40 text-xs tracking-[0.3em] uppercase mb-1">Impact at a glance</p>
            <h2 className="text-2xl md:text-3xl font-bold text-cosmic-white">
              BY THE <span className="text-gradient-red-gold">NUMBERS</span>
            </h2>
          </div>

          {/* Metric grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 divide-x divide-y divide-white/[0.05]">
            {metrics.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: 0.2 + i * 0.07, ease: "easeOut" }}
                className="group px-6 py-7 flex flex-col gap-2 transition-colors duration-200 hover:bg-white/[0.04] cursor-default"
              >
                <div className="flex items-center gap-2">
                  <m.icon className="w-4 h-4 text-cosmic-gold/60 group-hover:text-cosmic-gold transition-colors duration-200" />
                  <span className="text-white/40 text-[0.65rem] tracking-[0.2em] uppercase">{m.label}</span>
                </div>
                <p className="text-2xl md:text-3xl font-bold text-cosmic-white group-hover:text-cosmic-gold transition-colors duration-200 leading-none">
                  {m.value}
                </p>
                <p className="text-white/35 text-xs leading-relaxed">{m.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Bottom bar — live indicator */}
          <div className="px-8 py-4 border-t border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cosmic-gold animate-pulse" />
              <span className="text-white/30 text-xs font-mono">Seeking Summer 2026 Co-op</span>
            </div>
            <span className="text-white/20 text-xs font-mono">UWaterloo · 2025</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

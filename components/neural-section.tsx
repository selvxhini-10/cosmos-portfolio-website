"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import dynamic from "next/dynamic"

// Canvas is client-only (uses window + RAF) — dynamic + ssr:false is correct here
const NeuralNetworkCanvas = dynamic(
  () => import("@/components/neural-network-canvas").then((m) => m.NeuralNetworkCanvas),
  { ssr: false }
)

/**
 * NeuralSection — "AI SYSTEMS" panel
 *
 * Slots between Skills and Projects in the home page.
 * Presents the interactive neural network canvas alongside a short description
 * of Selvahini's AI/CE work — acts as a meaningful technical visual in the
 * mission-control aesthetic, not decoration.
 *
 * The canvas itself is the content: hover any node to fire it and watch the
 * signal propagate. Each layer maps to a real stage of an ML pipeline:
 *   INPUT → HIDDEN·1 → HIDDEN·2 → OUTPUT
 */
export function NeuralSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section ref={ref} id="neural" className="relative z-10 py-16">
      <div className="absolute inset-0 bg-cosmic-black/40 -z-10" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8"
        >
          <div>
            <p className="text-cosmic-white/30 text-xs tracking-[0.3em] uppercase font-mono mb-2">
              // AI SYSTEMS · INTERACTIVE
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-cosmic-white">
              NEURAL{" "}
              <span className="text-gradient-red-gold">NETWORK</span>
            </h2>
          </div>
          <p className="text-cosmic-white/50 text-sm max-w-md leading-relaxed lg:text-right font-mono">
            Hover any node to fire it. Signals propagate forward through the network —
            gold edges are excitatory, red are inhibitory.
          </p>
        </motion.div>

        {/* Two-column layout: canvas left, annotation right */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="grid lg:grid-cols-3 gap-6 items-start"
        >
          {/* Canvas — takes 2 of 3 columns */}
          <div className="lg:col-span-2">
            {isInView && <NeuralNetworkCanvas />}
          </div>

          {/* Annotation panel — telemetry readout style */}
          <div className="space-y-3">
            {[
              { label: "ARCHITECTURE",  value: "3 › 5 › 5 › 3",   sub: "Fully connected" },
              { label: "ACTIVATION",    value: "ReLU",             sub: "Hidden layers" },
              { label: "OUTPUT",        value: "Softmax",          sub: "Classification" },
              { label: "SIGNAL TYPE",   value: "Forward pass",     sub: "No backprop" },
              { label: "APPLICATIONS",  value: "TensorFlow · Keras", sub: "Pytorch · sklearn" },
            ].map(({ label, value, sub }) => (
              <div
                key={label}
                className="px-4 py-3 rounded-lg border border-cosmic-gold/15 bg-cosmic-black/50"
              >
                <p className="text-[0.6rem] font-mono text-cosmic-white/30 tracking-widest uppercase mb-1">
                  {label}
                </p>
                <p className="text-sm font-mono text-cosmic-gold font-semibold leading-tight">
                  {value}
                </p>
                <p className="text-[0.65rem] font-mono text-cosmic-white/35 mt-0.5">{sub}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

"use client"

import { useRef, useState } from "react"
import dynamic from "next/dynamic"

const NeuralNetworkCanvas = dynamic(
  () => import("@/components/neural-network-canvas").then((m) => m.NeuralNetworkCanvas),
  { ssr: false }
)

const readouts = [
  { label: "ARCHITECTURE", value: "3 › 5 › 5 › 3",      sub: "Fully connected" },
  { label: "ACTIVATION",   value: "ReLU",                 sub: "Hidden layers" },
  { label: "OUTPUT",       value: "Softmax",              sub: "Classification" },
  { label: "SIGNAL TYPE",  value: "Forward pass",         sub: "No backprop" },
  { label: "APPLICATIONS", value: "TensorFlow · Keras",   sub: "PyTorch · sklearn" },
]

export function NeuralSection() {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  const onRef = (el: HTMLElement | null) => {
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.08 }
    )
    obs.observe(el)
  }

  return (
    <section
      id="neural"
      ref={(el) => { (ref as React.MutableRefObject<HTMLElement | null>).current = el; onRef(el) }}
      className="relative z-10 py-16"
    >
      <div className="absolute inset-0 bg-cosmic-black/40 -z-10" />
      <div className="relative max-w-7xl mx-auto px-6">

        {/* Header */}
        <div
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8 transition-all duration-500 ease-out"
          style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(20px)" }}
        >
          <div>
            <p className="text-cosmic-white/30 text-xs tracking-[0.3em] uppercase font-mono mb-2">
              // AI SYSTEMS · INTERACTIVE
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-cosmic-white">
              NEURAL <span className="text-gradient-red-gold">NETWORK</span>
            </h2>
          </div>
          <p className="text-cosmic-white/45 text-sm max-w-md leading-relaxed lg:text-right font-mono">
            Hover any node to fire it — signals propagate forward through the network.
            Gold edges are excitatory, red are inhibitory.
          </p>
        </div>

        {/* Canvas + readout */}
        <div
          className="grid lg:grid-cols-3 gap-6 items-start transition-all duration-500 ease-out"
          style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(24px)", transitionDelay: "80ms" }}
        >
          <div className="lg:col-span-2">
            {visible && <NeuralNetworkCanvas />}
          </div>

          <div className="space-y-3">
            {readouts.map(({ label, value, sub }) => (
              <div key={label} className="px-4 py-3 rounded-lg border border-cosmic-gold/15 bg-cosmic-black/50">
                <p className="text-[0.6rem] font-mono text-cosmic-white/30 tracking-widest uppercase mb-1">{label}</p>
                <p className="text-sm font-mono text-cosmic-gold font-semibold">{value}</p>
                <p className="text-[0.65rem] font-mono text-cosmic-white/35 mt-0.5">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

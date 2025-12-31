"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Users, Sparkles, Heart, GraduationCap } from "lucide-react"
import Spline from "@splinetool/react-spline"

const initiatives = [
  {
    title: "HiveMind Program",
    description: "Mentoring youth in science, math, technology and engineering subjects",
    impact: "15+ students tutored",
    icon: Users,
  },
  {
    title: "GenAI Booths",
    description: "Sparked insightful conversations about AI technology on campus",
    impact: "700+ participants engaged",
    icon: Sparkles,
  },
  {
    title: "WiE Catalyst Conference",
    description: "Facilitated hands-on technical workshops and panels",
    impact: "50+ attendees inspired",
    icon: Heart,
  },
  {
    title: "STEM Nights",
    description: "Bringing science and technology excitement to schools across Kitchener-Waterloo",
    impact: "1800+ students reached",
    icon: GraduationCap,
  },
]

export function LeadershipSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-120px" })

  return (
    <section id="leadership" className="relative py-24 overflow-hidden">
  {/* Section Background */}
  <div className="absolute inset-0 bg-cosmic-black/60 -z-20" />

  <div className="relative max-w-7xl mx-auto px-6">
    
    {/* Header */}
    <div className="text-center mb-12">
      <span className="text-cosmic-gold/60 text-sm tracking-[0.3em] uppercase">
        Community Impact
      </span>
      <h2 className="text-4xl md:text-5xl font-bold text-cosmic-white mt-2">
        LEADERSHIP &{" "}
        <span className="text-gradient-red-gold animate-text-glow-gradient">
          MENTORSHIP
        </span>
      </h2>
    </div>

    {/* ───────── INTERACTIVE MODEL ZONE ───────── */}
    <div className="relative w-full h-[420px] md:h-[560px]">
      
      {/* Spline Canvas (interactive)  */}
      <Spline
        scene="https://prod.spline.design/cxk6FWHBLJBTmXfI/scene.splinecode"
        className="absolute inset-0 w-full h-full"
      />
       

      {/* Edge blending ONLY (no pointer blocking) */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-cosmic-black to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cosmic-black to-transparent pointer-events-none" />

      {/* Optional subtle glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,140,80,0.12),transparent_65%)] pointer-events-none" />
    </div>

    {/* ───────── INITIATIVES (CONTENT ZONE) ───────── */}
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {initiatives.map((initiative, index) => (
        <div
          key={index}
          className="group rounded-xl p-6 border border-cosmic-gold/20 bg-cosmic-black/60 transition-all hover:border-cosmic-gold/40 hover:shadow-[0_0_25px_rgba(255,140,80,0.25)]"
        >
          <div className="w-12 h-12 mb-4 rounded-lg border border-cosmic-gold/40 flex items-center justify-center">
            <initiative.icon className="w-6 h-6 text-cosmic-gold" />
          </div>

          <h3 className="text-lg font-bold text-cosmic-white mb-2 group-hover:text-cosmic-gold">
            {initiative.title}
          </h3>

          <p className="text-sm text-cosmic-white/70 mb-4">
            {initiative.description}
          </p>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cosmic-gold/10 border border-cosmic-gold/30">
            <span className="text-xs font-semibold text-cosmic-gold">
              {initiative.impact}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

  )
}

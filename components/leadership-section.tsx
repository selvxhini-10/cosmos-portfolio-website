"use client"

import { useRef, useState } from "react"
import { Users, Sparkles, Heart, GraduationCap } from "lucide-react"
import dynamic from "next/dynamic"

const Spline = dynamic(() => import("@splinetool/react-spline"), { ssr: false })

const initiatives = [
  { title: "HiveMind Program",        description: "Mentoring youth in science, math, technology and engineering subjects", impact: "15+ students tutored",    icon: Users },
  { title: "GenAI Booths",            description: "Sparked insightful conversations about AI technology on campus",         impact: "700+ participants engaged", icon: Sparkles },
  { title: "WiE Catalyst Conference", description: "Facilitated hands-on technical workshops and panels",                    impact: "50+ attendees inspired",   icon: Heart },
  { title: "STEM Nights",             description: "Bringing science and technology excitement to schools across KW",         impact: "1800+ students reached",   icon: GraduationCap },
]

export function LeadershipSection() {
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
      id="leadership"
      ref={(el) => { (ref as React.MutableRefObject<HTMLElement | null>).current = el; onRef(el) }}
      className="relative py-24 overflow-hidden"
    >
      <div className="absolute inset-0 bg-cosmic-black/40 -z-10" />
      <div className="relative max-w-7xl mx-auto px-6">

        {/* Header */}
        <div
          className="text-center mb-16 transition-all duration-500 ease-out"
          style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(24px)" }}
        >
          <span className="text-cosmic-gold/55 text-xs tracking-[0.3em] uppercase font-mono">Community Impact</span>
          <h2 className="text-4xl md:text-5xl font-bold text-cosmic-white mt-2">
            LEADERSHIP & <span className="text-gradient-red-gold">MENTORSHIP</span>
          </h2>
        </div>

        {/* Spline galaxy — lazy, gated */}
        <div
          className="relative w-full mb-16 overflow-hidden transition-opacity duration-700 ease-out"
          style={{ height: "480px", opacity: visible ? 1 : 0, transitionDelay: "100ms" }}
        >
          {visible && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Spline
                scene="https://prod.spline.design/cxk6FWHBLJBTmXfI/scene.splinecode"
                className="w-full max-w-[1400px] h-full"
              />
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,140,80,0.10),transparent_65%)]" />
        </div>

        {/* Initiative cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {initiatives.map((item, i) => (
            <div
              key={item.title}
              className="group rounded-xl p-6 border border-cosmic-gold/20 bg-cosmic-black/60 hover:border-cosmic-gold/40 hover:shadow-[0_0_20px_rgba(255,140,80,0.18)] transition-all duration-200"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "none" : "translateY(20px)",
                transition: "opacity 0.4s ease-out, transform 0.4s ease-out, border-color 0.2s, box-shadow 0.2s",
                transitionDelay: `${200 + i * 70}ms`,
              }}
            >
              <div className="w-11 h-11 mb-4 rounded-lg border border-cosmic-gold/35 flex items-center justify-center">
                <item.icon className="w-5 h-5 text-cosmic-gold" />
              </div>
              <h3 className="text-base font-bold text-cosmic-white mb-2 group-hover:text-cosmic-gold transition-colors duration-200">
                {item.title}
              </h3>
              <p className="text-sm text-cosmic-white/65 mb-4 leading-relaxed">{item.description}</p>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cosmic-gold/10 border border-cosmic-gold/25 text-xs font-semibold text-cosmic-gold">
                {item.impact}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

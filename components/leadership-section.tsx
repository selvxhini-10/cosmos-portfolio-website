"use client"

import { useRef, useState } from "react"
import { Sparkles, Presentation, Users, Heart, GraduationCap } from "lucide-react"
import dynamic from "next/dynamic"

const Spline = dynamic(() => import("@splinetool/react-spline"), { ssr: false })

// Left column sits before the robot, right column after — on mobile these
// collapse into a single stack (robot first, then all four cards in order)
// via the order-* utilities below.
const leftCards = [
  {
    title: "HiveMind Program",
    description: "Mentoring youth in science, math, technology and engineering subjects",
    impact: "15+ students tutored",
    icon: Users,
    accent: "gold",
  },
  {
    title: "WiE Catalyst Conference",
    description: "Facilitated hands-on technical workshops and panels",
    impact: "50+ attendees inspired",
    icon: Heart,
    accent: "orange",
  },
] as const

const rightCards = [
  {
    title: "STEM Nights",
    description: "Bringing science and technology excitement to schools across KW",
    impact: "1800+ students reached",
    icon: GraduationCap,
    accent: "gold",
  },
  {
    title: "GenAI Booths",
    description: "Sparked insightful conversations about AI technology on campus",
    impact: "700+ participants engaged",
    icon: Sparkles,
    accent: "orange",
  },
] as const

const conferencePanel = {
  eyebrow: "Student Speaker",
  title: "UW Teaching & Learning Conference",
  description:
    "Co-authored a panel proposal and joined as a student speaker, discussing the evolving role of AI in higher education with faculty and peers — a continuation of the conversations started at the GenAI Booths.",
  icon: Presentation,
  stats: [
    { label: "Role", value: "Student Panelist" },
    { label: "Format", value: "Panel Discussion" },
    { label: "Reach", value: "700+ Engaged" },
  ],
}

const accentClasses = {
  gold: "before:bg-cosmic-gold",
  orange: "before:bg-cosmic-orange",
} as const

function InitiativeCard({
  item,
  style,
}: {
  item: (typeof leftCards)[number] | (typeof rightCards)[number]
  style: React.CSSProperties
}) {
  return (
    <div
      className={`group relative rounded-xl p-6 border border-cosmic-gold/20 bg-cosmic-black/60 hover:border-cosmic-gold/40 hover:shadow-[0_0_20px_rgba(255,140,80,0.18)] transition-all duration-200 overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] ${accentClasses[item.accent]}`}
      style={style}
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
  )
}

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
      className="relative py-16 overflow-hidden"
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

        {/* Robot flanked by two cards on each side; mobile stacks robot → left cards → right cards */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr_1fr] gap-6 md:gap-8 mb-6 md:items-center">

          {/* Left cards */}
          <div className="order-2 md:order-1 flex flex-col gap-6">
            {leftCards.map((item, i) => (
              <InitiativeCard
                key={item.title}
                item={item}
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "none" : "translateX(-24px)",
                  transition: "opacity 0.5s ease-out, transform 0.5s ease-out, border-color 0.2s, box-shadow 0.2s",
                  transitionDelay: `${260 + i * 90}ms`,
                }}
              />
            ))}
          </div>

          {/* Spline robot — untouched scene, just re-sized for the centre column */}
          <div
            className="order-1 md:order-2 relative w-full h-[340px] md:h-[560px] overflow-hidden transition-all duration-700 ease-out"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "scale(1)" : "scale(0.96)",
            }}
          >
            {visible && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Spline
                  scene="https://prod.spline.design/cxk6FWHBLJBTmXfI/scene.splinecode"
                  className="w-full h-full"
                />
              </div>
            )}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,140,80,0.10),transparent_65%)]" />
          </div>

          {/* Right cards */}
          <div className="order-3 md:order-3 flex flex-col gap-6">
            {rightCards.map((item, i) => (
              <InitiativeCard
                key={item.title}
                item={item}
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "none" : "translateX(24px)",
                  transition: "opacity 0.5s ease-out, transform 0.5s ease-out, border-color 0.2s, box-shadow 0.2s",
                  transitionDelay: `${260 + i * 90}ms`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Conference — full-width featured banner, copy on the left, stats filling the right */}
        <div
          className="relative rounded-2xl border border-cosmic-orange/25 bg-cosmic-black/60 p-7 md:p-9 overflow-hidden transition-all duration-500 ease-out bg-[radial-gradient(circle_at_top_left,rgba(255,140,80,0.08),transparent_60%)]"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(24px)",
            transitionDelay: "560ms",
          }}
        >
          <div className="flex flex-col md:flex-row md:items-center gap-7 md:gap-10">

            {/* Copy — now fills the column instead of being capped narrow */}
            <div className="flex-1 flex items-start gap-4">
              <div className="relative w-12 h-12 shrink-0 rounded-lg border border-cosmic-orange/50 flex items-center justify-center bg-cosmic-black shadow-[0_0_16px_rgba(255,140,80,0.25)]">
                <conferencePanel.icon className="w-6 h-6 text-cosmic-orange" />
                {visible && (
                  <span
                    className="absolute inset-0 rounded-lg border border-cosmic-orange animate-ring-pulse-once"
                    style={{ animationDelay: "820ms" }}
                  />
                )}
              </div>
              <div>
                <span className="text-cosmic-orange/70 text-xs tracking-[0.25em] uppercase font-mono">
                  {conferencePanel.eyebrow}
                </span>
                <h3 className="text-xl font-bold text-cosmic-white mt-1 mb-2">
                  {conferencePanel.title}
                </h3>
                <p className="text-sm text-cosmic-white/70 leading-relaxed">
                  {conferencePanel.description}
                </p>
              </div>
            </div>

            {/* Stats — fills the empty right side with real detail rather than blank space */}
            <div className="flex flex-row md:flex-col gap-5 md:gap-6 md:w-48 shrink-0 md:border-l md:border-cosmic-orange/15 md:pl-8 pt-1">
              {conferencePanel.stats.map((stat) => (
                <div key={stat.label} className="flex-1 md:flex-none">
                  <div className="text-[10px] tracking-[0.2em] uppercase font-mono text-cosmic-orange/60">
                    {stat.label}
                  </div>
                  <div className="text-sm font-semibold text-cosmic-white mt-1">
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
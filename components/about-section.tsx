"use client"

import { useRef, useState } from "react"
import { Code, Cpu, Brain, Zap } from "lucide-react"

const currentWork = [
  { title: "Multi-Agent Systems",      description: "Exploring Multi-Agent Orchestration and Physical AI with World Foundation Models (WFMs)", icon: Brain },
  { title: "Embedded Systems",         description: "Gaining hands-on experience with STM32 Nucleo Board and C++ programming", icon: Cpu },
  { title: "Full-Stack Development",   description: "Building scalable web applications with modern frameworks and cloud technologies", icon: Code },
  { title: "AI Engineering",           description: "Developing and deploying machine learning models for real-world applications", icon: Zap },
]

export function AboutSection() {
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
      id="about"
      ref={(el) => { (ref as React.MutableRefObject<HTMLElement | null>).current = el; onRef(el) }}
      className="relative z-10 py-24"
    >
      <div className="absolute inset-0 bg-cosmic-black/40 -z-10" />
      <div className="relative max-w-6xl mx-auto px-6">

        {/* Terminal header */}
        <div
          className="mb-16 transition-all duration-500 ease-out"
          style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(24px)" }}
        >
          <div className="inline-block">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="ml-4 text-cosmic-white/50 text-sm font-mono">explorer_profile.exe</span>
            </div>
            <div className="border border-cosmic-gold/40 rounded-lg p-6 bg-cosmic-black/50"
                 style={{ boxShadow: "0 0 24px rgba(255,180,100,0.12)" }}>
              <p className="font-mono text-cosmic-gold/70 text-sm mb-2">
                <span className="text-cosmic-gold">$ </span>Initializing transmission...
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-cosmic-white mb-2">
                ABOUT <span className="text-gradient-red-gold">ME</span>
              </h2>
              <p className="text-cosmic-white/50 text-sm font-mono">
                {">> Origin: Earth | Sector: Developer Quadrant | Status: Active"}
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Bio */}
          <div
            className="lg:col-span-2 transition-all duration-500 ease-out"
            style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateX(-24px)", transitionDelay: "80ms" }}
          >
            <div className="p-6 rounded-xl border border-cosmic-gold/20 bg-cosmic-black/50 h-full"
                 style={{ boxShadow: "0 0 16px rgba(255,180,100,0.08)" }}>
              <h3 className="text-xl font-bold text-cosmic-gold mb-4">Background</h3>
              <p className="leading-relaxed text-cosmic-white/80 text-sm">
                As a second-year ECE student at UWaterloo, I build scalable, innovative solutions at the intersection of software development, AI, machine learning and embedded systems.
                <br /><br />
                Beyond tech, I enjoy learning about philosophy, cognitive science and astrophysics. I published my first short story with Polar Expressions Publishing at age seven. In my free time, I practice calligraphy and read dystopian fiction.
              </p>
            </div>
          </div>

          {/* Work cards */}
          <div
            className="lg:col-span-3 transition-all duration-500 ease-out"
            style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateX(24px)", transitionDelay: "120ms" }}
          >
            <h3 className="text-xl font-bold text-cosmic-gold mb-6">What I'm Working On</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {currentWork.map((work, i) => (
                <div
                  key={work.title}
                  className="p-5 rounded-xl border border-cosmic-gold/20 bg-cosmic-black/50 transition-all duration-200 hover:border-cosmic-gold/40"
                  style={{
                    boxShadow: "0 0 12px rgba(255,180,100,0.06)",
                    transitionDelay: `${140 + i * 50}ms`,
                    opacity: visible ? 1 : 0,
                    transform: visible ? "none" : "translateY(16px)",
                  }}
                >
                  <work.icon className="w-7 h-7 mb-3 text-cosmic-gold" />
                  <h4 className="text-base font-bold text-cosmic-white mb-2">{work.title}</h4>
                  <p className="text-sm text-cosmic-white/65 leading-relaxed">{work.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

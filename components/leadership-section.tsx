"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Users, Sparkles, Heart, GraduationCap } from "lucide-react"
import { CosmicHazeDivider } from "./cosmic-haze-divider"
import Spline from '@splinetool/react-spline'

const initiatives = [
  {
    title: "Waterloo HiveMind Program",
    description: "Mentoring youth in software development and AI/ML concepts through hands-on projects",
    impact: "50+ students mentored",
    icon: Users,
  },
  {
    title: "GenAI Booths",
    description: "Interactive exhibits making AI technology accessible to diverse audiences",
    impact: "1000+ participants engaged",
    icon: Sparkles,
  },
  {
    title: "WiE Catalyst Conference",
    description: "Technical workshops and panels championing diversity in engineering",
    impact: "200+ attendees inspired",
    icon: Heart,
  },
  {
    title: "STEM Nights",
    description: "Bringing science and technology excitement to schools across Kitchener-Waterloo",
    impact: "15+ schools reached",
    icon: GraduationCap,
  },
]

export function LeadershipSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })

  return (
    <>
      <CosmicHazeDivider variant="blue" />
      <section id="leadership" ref={containerRef} className="relative py-32 z-[1]">
        <div className="absolute inset-0 bg-cosmic-black/40 backdrop-blur-sm -z-10" />

        <div className="relative max-w-7xl mx-auto px-6">
        
          {/* 3D Robot Model with Centered Overlay Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="relative text-center mb-16"
            style={{ willChange: 'opacity' }}
          >
            <span className="text-cosmic-gold/60 text-sm tracking-[0.3em] uppercase">Community Impact</span>
            <h2 className="text-4xl md:text-5xl font-bold text-cosmic-white mt-2">
              LEADERSHIP & <span className="text-gradient-red-gold animate-text-glow-gradient">MENTORSHIP</span>
            </h2>
            <div className="relative w-full h-[400px] md:h-[600px] rounded-2xl overflow-hidden border border-cosmic-gold/20 bg-cosmic-black/30 backdrop-blur-xl">
              <Spline
                scene="https://prod.spline.design/cxk6FWHBLJBTmXfI/scene.splinecode"
                className="w-full h-full"
              />
              {/* Overlay gradient for better text visibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-cosmic-black/60 via-transparent to-transparent pointer-events-none" />
            </div>
          </motion.div>

          {/* Initiatives Grid - 4 Inline Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {initiatives.map((initiative, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.05, ease: "easeOut" }}
                className="group"
                style={{ willChange: 'transform, opacity' }}
              >
                <div className="h-full p-6 border border-cosmic-gold/20 rounded-xl bg-cosmic-black/50 backdrop-blur-xl hover:border-cosmic-gold/40 hover:shadow-[0_0_20px_rgba(255,180,100,0.2)] transition-all duration-300">
                  {/* Icon */}
                  <div className="mb-4">
                    <div className="w-12 h-12 rounded-lg border border-cosmic-gold/30 flex items-center justify-center group-hover:border-cosmic-gold/50 transition-colors duration-300">
                      <initiative.icon className="w-6 h-6 text-cosmic-gold" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-cosmic-white mb-2 group-hover:text-cosmic-gold transition-colors duration-300">
                    {initiative.title}
                  </h3>

                  <p className="text-sm text-cosmic-white/60 leading-relaxed mb-4">{initiative.description}</p>

                  {/* Impact Badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cosmic-gold/10 border border-cosmic-gold/30">
                    <Sparkles className="w-3 h-3 text-cosmic-gold" />
                    <span className="text-xs font-semibold text-cosmic-gold">{initiative.impact}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

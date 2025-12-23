"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Cpu, Rocket, Brain, Terminal } from "lucide-react"

const stats = [
  { label: "Years in Orbit", value: "5+", icon: Rocket },
  { label: "Missions Completed", value: "50+", icon: Terminal },
  { label: "Technologies Mastered", value: "25+", icon: Cpu },
  { label: "AI Models Deployed", value: "15+", icon: Brain },
]

export function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-50px" })

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative py-24"
    >
      {/* Gradient fade at top */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-cosmic-black to-transparent pointer-events-none" style={{ zIndex: 20 }} />

      {/* Black Hole Video Background - Optimized */}
      <div className="absolute top-0 right-0 w-full md:w-3/4 lg:w-2/3 h-[600px] md:h-[800px] overflow-hidden" style={{ zIndex: -10 }}>
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          className="absolute top-0 right-0 w-full h-full opacity-60"
          style={{ 
            transform: 'translate3d(0, 0, 0)',
            willChange: 'auto',
            objectFit: 'cover'
          }}
        >
          <source src="/videos/blackhole.mp4" type="video/mp4" />
        </video>
        {/* Simplified gradients */}
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-cosmic-black/50 to-cosmic-black" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cosmic-black/30 to-cosmic-black" />
      </div>
      
      {/* Section Background */}
      <div className="absolute inset-0 bg-cosmic-black/40" style={{ zIndex: -20 }} />

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Terminal Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="mb-16"
        >
          <div className="inline-block">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="ml-4 text-cosmic-white/90 text-sm">explorer_profile.exe</span>
            </div>
            <div 
              className="border-2 border-cosmic-gold rounded-lg p-6 bg-cosmic-black/50"
              style={{
                boxShadow: '0 0 30px rgba(255,180,100,0.3), inset 0 0 30px rgba(255,180,100,0.05)'
              }}
            >
              <div className="text-cosmic-gold/80 text-sm mb-2">
                <span className="text-cosmic-gold">$ </span>
                <span className="animate-pulse">_</span> Initializing transmission...
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-cosmic-white mb-2">
                <span>ABOUT </span>
                <span 
                  className="text-gradient-red-gold animate-text-glow-gradient"
                  style={{ letterSpacing: '0.05em' }}
                >
                  ME
                </span>
              </h2>
              <p className="text-cosmic-white/60 text-sm" style={{ letterSpacing: '0.02em' }}>
                {">> Origin: Earth | Sector: Developer Quadrant | Status: Active"}
              </p>
            </div>
          </div>
        </motion.div>

        {/* About Content - Increased gap from gap-12 to gap-16 */}
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="space-y-6 text-cosmic-white/80 leading-relaxed" style={{ letterSpacing: '0.02em' }}>
              <p className="text-lg">
                [placeholder text] Greetings, fellow explorer. I'm a full-stack developer with a passion for building digital experiences
                that push the boundaries of what's possible.
              </p>
              <p>
                My journey through the cosmos of code began years ago, and since then, I've navigated through
                countless technologies, from the familiar territories of React and Node.js to the uncharted depths of
                machine learning and AI.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="mt-8 p-4 border-2 border-cosmic-gold rounded-lg bg-cosmic-gold/5"
              style={{
                boxShadow: '0 0 25px rgba(255,180,100,0.3), inset 0 0 20px rgba(255,180,100,0.05)'
              }}
            >
              <div className="flex items-center gap-2 text-cosmic-gold text-sm">
                <span className="w-2 h-2 bg-cosmic-gold rounded-full animate-pulse" />
                Seeking Summer 2026 Opportunities 
              </div>
            </motion.div>
          </motion.div>

          {/* Stats Grid - Optimized Animations */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="grid grid-cols-2 gap-4"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ 
                  duration: 0.3, 
                  delay: 0.3 + index * 0.05,
                  ease: [0.4, 0, 0.2, 1]
                }}
                whileHover={{ 
                  scale: 1.03,
                  transition: { duration: 0.15 }
                }}
                className="p-6 rounded-xl bg-cosmic-black/50 group border-2 border-cosmic-gold/30 hover:border-cosmic-gold/60"
                style={{
                  boxShadow: '0 0 20px rgba(255,180,100,0.2), inset 0 0 20px rgba(255,180,100,0.03)',
                  transition: 'border-color 0.2s ease-out'
                }}
              >
                <stat.icon 
                  className="w-8 h-8 text-cosmic-gold mb-4" 
                  style={{
                    transition: 'transform 0.2s ease-out'
                  }}
                />
                <div className="text-3xl font-bold text-cosmic-white mb-1">{stat.value}</div>
                <div className="text-sm text-cosmic-white/50 uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
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

// Shooting star component
const ShootingStar = ({ delay = 0, duration = 1 }) => (
  <motion.div
    initial={{ opacity: 0, x: -100, y: 100 }}
    animate={{ 
      opacity: [0, 1, 1, 0],
      x: [0, 300],
      y: [0, -300]
    }}
    transition={{
      duration: duration,
      delay: delay,
      repeat: Infinity,
      repeatDelay: Math.random() * 5 + 3,
      ease: "easeOut"
    }}
    className="absolute top-0 left-0"
    style={{
      width: '2px',
      height: '80px',
      background: 'linear-gradient(to bottom, rgba(255,180,100,0) 0%, rgba(255,180,100,1) 50%, rgba(255,180,100,0) 100%)',
      filter: 'blur(1px)',
      transform: 'rotate(-45deg)'
    }}
  />
)

export function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-50px" })

  return (
    <section id="about" ref={containerRef} className="relative py-32 z-[5]">
      {/* Gradient fade at top */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-cosmic-black to-transparent z-20 pointer-events-none" />
      
      {/* Shooting Stars Container */}
      <div className="absolute top-0 left-0 w-full h-96 overflow-hidden pointer-events-none z-10">
        <ShootingStar delay={0} duration={1.2} />
        <ShootingStar delay={2} duration={1} />
        <ShootingStar delay={4} duration={1.3} />
        <ShootingStar delay={6} duration={0.9} />
        <ShootingStar delay={8} duration={1.1} />
      </div>

      {/* Black Hole Video Background */}
      <div className="absolute top-0 right-0 w-full md:w-3/4 lg:w-2/3 h-[600px] md:h-[800px] -z-10 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="absolute top-0 right-0 w-full h-full object-cover opacity-60"
          style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
        >
          <source src="/videos/blackhole.mp4" type="video/mp4" />
        </video>
        {/* Gradient overlay to blend with background */}
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-cosmic-black/50 to-cosmic-black" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cosmic-black/30 to-cosmic-black" />
      </div>
      
      {/* Section Background */}
      <div className="absolute inset-0 bg-cosmic-black/40 backdrop-blur-sm -z-20" />

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Terminal Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mb-16"
        >
          <div className="inline-block">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="ml-4 text-cosmic-white/50 text-sm">explorer_profile.exe</span>
            </div>
            <div 
              className="border-2 border-cosmic-gold rounded-lg p-6 bg-cosmic-black/50 backdrop-blur-xl"
              style={{
                boxShadow: '0 0 30px rgba(255,180,100,0.3), inset 0 0 30px rgba(255,180,100,0.05)'
              }}
            >
              <div className="text-cosmic-gold/80 text-sm mb-2">
                <span className="text-cosmic-gold">$ </span>
                <span className="animate-pulse">_</span> Initializing transmission...
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-cosmic-white mb-2">
                <span>SIGNAL </span>
                <span 
                  className="text-gradient-red-gold animate-text-glow-gradient"
                  style={{ letterSpacing: '0.05em' }}
                >
                  RECEIVED
                </span>
              </h2>
              <p className="text-cosmic-white/60 text-sm" style={{ letterSpacing: '0.02em' }}>
                {">> Origin: Earth | Sector: Developer Quadrant | Status: Active"}
              </p>
            </div>
          </div>
        </motion.div>

        {/* About Content */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
          >
            <div className="space-y-6 text-cosmic-white/80 leading-relaxed" style={{ letterSpacing: '0.02em' }}>
              <p className="text-lg">
                Greetings, fellow explorer. I'm a full-stack developer with a passion for building digital experiences
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
              transition={{ duration: 0.4, delay: 0.3 }}
              className="mt-8 p-4 border-2 border-cosmic-gold rounded-lg bg-cosmic-gold/5"
              style={{
                boxShadow: '0 0 25px rgba(255,180,100,0.3), inset 0 0 20px rgba(255,180,100,0.05)'
              }}
            >
              <div className="flex items-center gap-2 text-cosmic-gold text-sm">
                <span className="w-2 h-2 bg-cosmic-gold rounded-full animate-pulse" />
                Current Status: Open for new missions
              </div>
            </motion.div>
          </motion.div>

          {/* Stats Grid with Faster Animations */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ 
                  duration: 0.3, 
                  delay: 0.3 + index * 0.05,
                  ease: "easeOut"
                }}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                className="p-6 rounded-xl bg-cosmic-black/50 backdrop-blur-xl group transition-all duration-200 border-2 border-cosmic-gold/30 hover:border-cosmic-gold/60"
                style={{
                  boxShadow: '0 0 20px rgba(255,180,100,0.2), inset 0 0 20px rgba(255,180,100,0.03)'
                }}
              >
                <stat.icon className="w-8 h-8 text-cosmic-gold mb-4 group-hover:scale-110 transition-transform duration-200" />
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
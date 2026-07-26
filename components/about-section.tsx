"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Code, Cpu, Brain, Zap } from "lucide-react"

const currentWork = [
  {
    id: 1,
    title: "Multi-Agent Systems",
    description: "Exploring Multi-Agent Orchestration and Physical AI with World Foundation Models (WFMs)",
    icon: Brain,
    color: "#FFB460",
  },
  {
    id: 2,
    title: "Embedded Systems",
    description: "Gaining Hands-on experience with STM32 Nucleo Board and C++ programming",
    icon: Cpu,
    color: "#FF851B",
  },
  {
    id: 3,
    title: "Full-Stack Development",
    description: "Building scalable web applications with modern frameworks and cloud technologies",
    icon: Code,
    color: "#FF4136",
  },
  {
    id: 4,
    title: "AI Engineering",
    description: "Developing and deploying machine learning models for real-world applications",
    icon: Zap,
    color: "#FFB460",
  },
]

export function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-50px" })

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative z-10 py-24"
    >
            <div className="absolute inset-0 bg-cosmic-black/40 -z-10" />

      {/* Black Hole Video Background - Optimized 
      <div className="absolute top-0 right-0 w-full md:w-3/4 lg:w-2/3 h-[600px] md:h-[800px] overflow-hidden" style={{ zIndex: -10 }}>
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute top-0 right-0 w-full h-full opacity-60"
          style={{ 
            transform: 'translate3d(0, 0, 0)',
            backfaceVisibility: 'hidden',
            objectFit: 'cover'
          }}
        >
          <source src="/videos/about.mp4" type="video/mp4" />
        </video>
          </div>
          */}
     
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
                  className="text-gradient-red-gold"
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

        {/* About Content */}
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left: Bio Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
            className="lg:col-span-2 flex flex-col"
          >
            <div 
              className="p-6 rounded-xl flex-1 flex flex-col"
              style={{
                borderWidth: '1px',
                borderColor: 'rgba(255, 180, 96, 0.2)',
                backgroundColor: 'rgba(10, 10, 20, 0.5)',
                boxShadow: '0 0 20px rgba(255,180,100,0.15)'
              }}
            >
              <h3 className="text-xl font-bold mb-4" style={{ color: '#FFB460' }}>
                Background
              </h3>
              <p className="leading-relaxed mb-6 flex-1" style={{ color: 'rgba(255, 255, 255, 0.8)', letterSpacing: '0.02em' }}>
                As a second-year ECE student at UWaterloo, I build scalable, innovative solutions at the intersection of software development, AI, machine learning and embedded systems.
<br /><br/>Beyond tech, I enjoy learning about philosophy, cognitive science and astrophysics. A fun fact about me: I published my first short story with Polar Expressions Publishing at age seven! In my free time, I practice calligraphy and read dystopian fiction.</p>

            </div>
          </motion.div>

          {/* Right: Current Work Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="lg:col-span-3"
          >
            <h3 className="text-xl font-bold mb-6" style={{ color: '#FFB460' }}>
              What I'm Working On
            </h3>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {currentWork.map((work, index) => (
                <motion.div
                  key={work.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ 
                    duration: 0.3, 
                    delay: 0.3 + index * 0.05,
                    ease: [0.4, 0, 0.2, 1]
                  }}
                  className="p-5 rounded-xl"
                  style={{
                    borderWidth: '1px',
                    borderColor: 'rgba(255, 180, 96, 0.2)',
                    backgroundColor: 'rgba(10, 10, 20, 0.5)',
                    boxShadow: '0 0 15px rgba(255,180,100,0.1)'
                  }}
                >
                  <work.icon 
                    className="w-8 h-8 mb-3" 
                    style={{ color: work.color }}
                  />
                  <h4 className="text-lg font-bold mb-2" style={{ color: '#FFFFFF' }}>
                    {work.title}
                  </h4>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    {work.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
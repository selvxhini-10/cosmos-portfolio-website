"use client"

import type React from "react"
import { useRef, useState, useCallback, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Github, Linkedin, Mail } from "lucide-react"
import { ChevronDownIcon } from "@radix-ui/react-icons"

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isClient, setIsClient] = useState(false)

  // Fix hydration by ensuring client-side only rendering for certain features
  useEffect(() => {
    setIsClient(true)
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isClient) return
    const { clientX, clientY } = e
    const { innerWidth, innerHeight } = window
    setMousePosition({
      x: (clientX / innerWidth - 0.5) * 2,
      y: (clientY / innerHeight - 0.5) * 2,
    })
  }, [isClient])

  return (
    <section
      id="home"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex flex-col overflow-hidden z-[5]"
    >
      {/* Background Video - Optimized */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-cosmic-black/70 via-cosmic-black/60 to-cosmic-black/80" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cosmic-black via-cosmic-black/80 to-transparent" />
      </div>

      {/* Main Content */}
      <div className="relative z-20 flex-1 flex flex-col px-6 max-w-6xl mx-auto w-full">
        <div className="pt-28 md:pt-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="flex justify-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-cosmic-gold bg-cosmic-gold/10 backdrop-blur-sm">
              <span 
                className="w-2 h-2 rounded-full bg-cosmic-gold animate-pulse" 
                style={{ boxShadow: '0 0 10px rgba(255,180,100,0.8)' }}
              />
              <span className="text-cosmic-gold text-sm tracking-wide">Available for opportunities</span>
            </div>
          </motion.div>
        </div>

        {/* Center Content */}
        <div className="flex-1 flex flex-col justify-center items-center text-center py-8">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight leading-[1.1] max-w-5xl"
          >
            <span className="text-cosmic-white uppercase tracking-wider block mb-2" style={{ letterSpacing: '0.15em' }}>
              Hi, I'm
            </span>
            <span 
              className="text-gradient-red-gold animate-text-glow-gradient block"
              style={{ 
                textShadow: '0 0 40px rgba(255,100,100,0.6), 0 0 80px rgba(255,180,100,0.3)',
                letterSpacing: '0.02em'
              }}
            >
              Selvahini Kamalarajan
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="text-lg md:text-xl lg:text-2xl text-cosmic-gold mb-6 tracking-wide"
            style={{ 
              textShadow: '0 0 20px rgba(255,180,100,0.4)',
              letterSpacing: '0.05em'
            }}
          >
            Computer Engineering @ University of Waterloo
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="text-sm md:text-base lg:text-lg text-cosmic-white/80 mb-10 max-w-3xl leading-relaxed px-4"
            style={{ letterSpacing: '0.02em' }}
          >
            Exploring the intersection of technology and innovation through immersive experiences. 
            Building the future, one line of code at a time.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-10"
          >
            <motion.a
              href="#projects"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative px-8 py-4 bg-gradient-to-r from-cosmic-gold to-cosmic-orange text-cosmic-black font-bold rounded-full tracking-wider uppercase transition-all duration-300 text-sm border-2 border-transparent"
              style={{
                boxShadow: '0 0 30px rgba(255,180,100,0.6), 0 0 60px rgba(255,180,100,0.3), inset 0 0 20px rgba(255,255,255,0.2)',
                letterSpacing: '0.1em'
              }}
            >
              View My Work
            </motion.a>
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative px-8 py-4 bg-transparent text-cosmic-gold rounded-full tracking-wider uppercase backdrop-blur-sm transition-all duration-300 text-sm hover:bg-cosmic-gold/10 border-2 border-cosmic-gold"
              style={{
                boxShadow: '0 0 25px rgba(255,180,100,0.5), 0 0 50px rgba(255,180,100,0.2), inset 0 0 20px rgba(255,180,100,0.08)',
                letterSpacing: '0.1em'
              }}
            >
              Get In Touch
            </motion.a>
          </motion.div>

          {/* Social Icons with Enhanced Glow */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.4 }}
            className="flex gap-5 justify-center"
          >
            {[
              { icon: Github, href: "https://github.com", label: "GitHub" },
              { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
              { icon: Mail, href: "#contact", label: "Email" },
            ].map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                whileHover={{ scale: 1.15, y: -5 }}
                whileTap={{ scale: 0.9 }}
                className="relative w-14 h-14 rounded-full flex items-center justify-center text-cosmic-gold hover:bg-cosmic-gold/20 transition-all duration-300 bg-cosmic-black/50 backdrop-blur-sm border-2 border-cosmic-gold"
                aria-label={social.label}
                style={{
                  boxShadow: '0 0 25px rgba(255,180,100,0.5), 0 0 50px rgba(255,180,100,0.2), inset 0 0 20px rgba(255,180,100,0.08)'
                }}
              >
                <social.icon className="w-6 h-6" />
              </motion.a>
            ))}
          </motion.div>
        </div>

        <div className="pb-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex flex-col items-center gap-2 text-cosmic-white/50"
            >
              <span className="text-xs text-cosmic-white/90 tracking-[0.3em] uppercase">Scroll to Explore</span>
              <ChevronDownIcon className="w-6 h-6" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
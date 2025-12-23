"use client"

import type React from "react"
import { useRef } from "react"
import { motion } from "framer-motion"
import { Github, Linkedin, Mail, ChevronDown } from "lucide-react"

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative min-h-screen flex flex-col overflow-hidden"
    >
      {/* Background Video - Maximum Performance Optimization */}
      <div className="absolute inset-0" style={{ zIndex: 0 }}>
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full"
          style={{
            objectFit: 'cover',
            transform: 'translate3d(0, 0, 0)',
            WebkitTransform: 'translate3d(0, 0, 0)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            perspective: 1000,
            WebkitPerspective: 1000
          }}
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(10, 10, 20, 0.7), transparent)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-64" style={{ background: 'linear-gradient(to top, rgba(10, 10, 20, 1), transparent)' }} />
      </div>

      {/* Main Content */}
      <div className="relative flex-1 flex flex-col px-6 max-w-6xl mx-auto w-full" style={{ zIndex: 10 }}>
        <div className="pt-28 md:pt-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
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
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.4, 0, 0.2, 1] }}
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
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7, ease: [0.4, 0, 0.2, 1] }}
            className="text-lg font-bold md:text-xl lg:text-2xl text-cosmic-gold mb-6 tracking-wide"
            style={{ 
              textShadow: '0 0 20px rgba(255,180,100,0.4)',
              letterSpacing: '0.05em'
            }}
          >
            Computer Engineering @ University of Waterloo
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="text-sm md:text-base lg:text-lg text-cosmic-white/80 mb-10 max-w-3xl leading-relaxed px-4"
            style={{ letterSpacing: '0.02em' }}
          >
            Delivering Human-Centered Solutions and User-Friendly Experiences.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9, ease: [0.4, 0, 0.2, 1] }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-10"
          >
            <motion.a
              href="#projects"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="relative px-8 py-4 bg-gradient-to-r from-cosmic-gold to-cosmic-orange text-cosmic-black font-bold rounded-full tracking-wider uppercase text-sm border-2 border-transparent"
              style={{
                boxShadow: '0 0 30px rgba(255,180,100,0.6), 0 0 60px rgba(255,180,100,0.3), inset 0 0 20px rgba(255,255,255,0.2)',
                letterSpacing: '0.1em',
                transition: 'transform 0.15s ease-out'
              }}
            >
              View My Work
            </motion.a>
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="relative px-8 py-4 bg-cosmic-black/50 font-bold text-cosmic-gold rounded-full tracking-wider uppercase text-sm border-2 border-cosmic-gold"
              style={{
                boxShadow: '0 0 25px rgba(255,180,100,0.5), 0 0 50px rgba(255,180,100,0.2), inset 0 0 20px rgba(255,180,100,0.08)',
                letterSpacing: '0.1em',
                transition: 'transform 0.15s ease-out, background-color 0.2s ease-out'
              }}
            >
              Get In Touch
            </motion.a>
          </motion.div>

          {/* Social Icons - Faster Animations */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1, ease: [0.4, 0, 0.2, 1] }}
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
                whileHover={{ scale: 1.1, y: -3 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="relative w-14 h-14 rounded-full flex items-center justify-center text-cosmic-gold hover:bg-cosmic-gold/20 bg-cosmic-black/50 border-2 border-cosmic-gold"
                aria-label={social.label}
                style={{
                  boxShadow: '0 0 25px rgba(255,180,100,0.5), 0 0 50px rgba(255,180,100,0.2), inset 0 0 20px rgba(255,180,100,0.08)',
                  transition: 'transform 0.15s ease-out, background-color 0.2s ease-out'
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
            transition={{ delay: 1.2, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center gap-2 text-cosmic-white/50"
            >
              <span className="text-xs text-cosmic-white/90 tracking-[0.3em] uppercase">Scroll to Explore</span>
              <ChevronDown className="w-6 h-6" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
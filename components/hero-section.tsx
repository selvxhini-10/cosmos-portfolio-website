"use client"

import type React from "react"

import { useRef, useState, useCallback } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Github, Linkedin, Mail} from "lucide-react"
import { ChevronDownIcon, EnvelopeClosedIcon } from "@radix-ui/react-icons"

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const { clientX, clientY } = e
    const { innerWidth, innerHeight } = window
    setMousePosition({
      x: (clientX / innerWidth - 0.5) * 2,
      y: (clientY / innerHeight - 0.5) * 2,
    })
  }, [])

  return (
    <section
      id="home"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex flex-col overflow-hidden z-[5]"
    >
      {/* Background Video - Static */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-cosmic-black/70 via-cosmic-black/60 to-cosmic-black/80" />
        {/* Fade to black at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cosmic-black via-cosmic-black/80 to-transparent" />
      </div>

      {/* Main Content */}
      <div className="relative z-20 flex-1 flex flex-col px-6 max-w-5xl mx-auto w-full">
        <div className="pt-28 md:pt-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="flex justify-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cosmic-gold/40 bg-cosmic-gold/10 backdrop-blur-sm shadow-[0_0_20px_rgba(255,180,100,0.2)]">
              <span className="w-2 h-2 rounded-full bg-cosmic-gold animate-pulse shadow-[0_0_10px_rgba(255,180,100,0.8)]" />
              <span className="text-cosmic-gold/90 text-sm tracking-wide">Available for opportunities</span>
            </div>
          </motion.div>
        </div>

        {/* Center Content */}
        <div className="flex-1 flex flex-col justify-center items-center text-center py-8">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight leading-tight"
          >
            <span className="text-cosmic-white text-pretty">HELLO, I'M</span>
            <br />
            <span className="text-gradient-red-gold animate-text-glow-gradient text-balance">YOUR NAME</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="text-xl md:text-2xl text-cosmic-gold/90 mb-4 tracking-wide"
          >
            Full-Stack Developer & Creative Technologist
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="text-base md:text-lg text-cosmic-white/60 mb-8 max-w-3xl leading-relaxed text-pretty"
          >
            Crafting immersive digital experiences through code. Specializing in modern web technologies, interactive
            interfaces, and bringing creative visions to life.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
          >
            <motion.a
              href="#projects"
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(255, 180, 100, 0.6)" }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-cosmic-gold to-cosmic-orange text-cosmic-black font-semibold rounded-full tracking-wider uppercase transition-all duration-300 shadow-lg"
            >
              View My Work
            </motion.a>
            <motion.a
              href="#contact"
              whileHover={{
                scale: 1.05,
                borderColor: "rgba(255, 180, 100, 0.8)",
                boxShadow: "0 0 20px rgba(255, 180, 100, 0.3)",
              }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border-2 border-cosmic-gold/50 text-cosmic-gold rounded-full tracking-wider uppercase backdrop-blur-sm transition-all duration-300"
            >
              Get In Touch
            </motion.a>
          </motion.div>

          {/* Social Icons */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.4 }}
            className="flex gap-4 justify-center"
          >
            {[
              { icon: Github, href: "#", label: "GitHub" },
              { icon: Linkedin, href: "#", label: "LinkedIn" },
              { icon: Mail, href: "#contact", label: "Email" },
            ].map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 rounded-full border border-cosmic-gold/40 flex items-center justify-center text-cosmic-gold hover:bg-cosmic-gold/10 hover:border-cosmic-gold transition-all duration-300"
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5" />
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
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
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

"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Cpu, Rocket, Brain, Terminal } from "lucide-react"
import { CosmicHazeDivider } from "./cosmic-haze-divider"
import { RocketIcon } from "@radix-ui/react-icons"

const stats = [
  { label: "Years in Orbit", value: "5+", icon: Rocket },
  { label: "Missions Completed", value: "50+", icon: Terminal },
  { label: "Technologies Mastered", value: "25+", icon: Cpu },
  { label: "AI Models Deployed", value: "15+", icon: Brain },
]

export function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })

  return (
    <>
      <CosmicHazeDivider variant="orange" />
      <section id="about" ref={containerRef} className="relative py-32 z-[5]">
        {/* Section Background */}
        <div className="absolute inset-0 bg-cosmic-black/40 backdrop-blur-sm" />

        <div className="relative max-w-6xl mx-auto px-6">
          {/* Terminal Header */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <div className="inline-block">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-4 text-cosmic-white/50 text-sm font-mono">explorer_profile.exe</span>
              </div>
              <div className="border border-cosmic-gold/30 rounded-lg p-6 bg-cosmic-black/50 backdrop-blur-xl">
                <div className="font-mono text-cosmic-gold/80 text-sm mb-2">
                  <span className="text-cosmic-gold">$ </span>
                  <span className="animate-pulse">_</span> Initializing transmission...
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-cosmic-white mb-2">
                  SIGNAL <span className="text-gradient-red-gold animate-text-glow-gradient">RECEIVED</span>
                </h2>
                <p className="text-cosmic-white/60 font-mono text-sm">
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
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="space-y-6 text-cosmic-white/80 leading-relaxed">
                <p className="text-lg">
                  Greetings, fellow explorer. I'm a full-stack developer with a passion for building digital experiences
                  that push the boundaries of what's possible.
                </p>
                <p>
                  My journey through the cosmos of code began years ago, and since then, I've navigated through
                  countless technologies, from the familiar territories of React and Node.js to the uncharted depths of
                  machine learning and AI.
                </p>
                <p>
                  Like the explorers who venture beyond the event horizon, I believe in taking calculated risks to
                  discover new possibilities. Every project is a new mission, every bug is an asteroid field to
                  navigate, and every successful deployment is a new world conquered.
                </p>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="mt-8 p-4 border border-cosmic-gold/20 rounded-lg bg-cosmic-gold/5"
              >
                <div className="flex items-center gap-2 text-cosmic-gold text-sm font-mono">
                  <span className="w-2 h-2 bg-cosmic-gold rounded-full animate-pulse" />
                  Current Status: Open for new missions
                </div>
              </motion.div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-2 gap-4"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.05, borderColor: "rgba(255, 180, 100, 0.5)" }}
                  className="p-6 border border-cosmic-gold/20 rounded-xl bg-cosmic-black/50 backdrop-blur-xl group transition-all duration-300"
                >
                  <stat.icon className="w-8 h-8 text-cosmic-gold mb-4 group-hover:scale-110 transition-transform" />
                  <div className="text-3xl font-bold text-cosmic-white mb-1">{stat.value}</div>
                  <div className="text-sm text-cosmic-white/50 uppercase tracking-wider">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}

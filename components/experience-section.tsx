"use client"

import { useRef, useState } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { CosmicHazeDivider } from "./cosmic-haze-divider"

const experiences = [
  {
    id: "1",
    title: "Senior Full-Stack Developer",
    company: "Stellar Technologies",
    date: "2022 - Present",
    description:
      "Leading development of AI-powered applications and cloud infrastructure solutions. Architecting scalable microservices and mentoring junior developers.",
    tech: ["React", "Node.js", "Python", "AWS", "TensorFlow"],
    color: "#ff8c00",
  },
  {
    id: "2",
    title: "Software Engineer",
    company: "Nebula Systems",
    date: "2020 - 2022",
    description:
      "Built scalable microservices and real-time data processing pipelines. Implemented CI/CD workflows and container orchestration.",
    tech: ["TypeScript", "Kubernetes", "PostgreSQL", "Redis"],
    color: "#4060ff",
  },
  {
    id: "3",
    title: "Junior Developer",
    company: "Orbit Labs",
    date: "2019 - 2020",
    description:
      "Developed responsive web applications and RESTful APIs. Collaborated with design team to implement pixel-perfect interfaces.",
    tech: ["JavaScript", "React", "Express", "MongoDB"],
    color: "#60ff80",
  },
]

function FloatingStars() {
  const stars = Array.from({ length: 25 })

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {stars.map((_, i) => (
        <motion.div
          key={i}
          initial={{
            opacity: 0,
            scale: 0.3,
            x: `${Math.random() * 100}%`,
            y: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0.1, 0.8, 0.1],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: Math.random() * 5 + 3,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "mirror",
            ease: "easeInOut",
            delay: Math.random() * 2,
          }}
          className="absolute w-1 h-1 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.8)]"
        />
      ))}
    </div>
  )
}

export function ExperienceSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <>
      <CosmicHazeDivider variant="mixed" />
      <section id="experience" ref={containerRef} className="relative py-32 z-[5]">
        <div className="absolute inset-0 bg-cosmic-black/90" />

        <div className="relative max-w-5xl mx-auto px-6">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="text-cosmic-gold/60 text-sm tracking-[0.3em] uppercase">Mission Log</span>
            <h2 className="text-4xl md:text-5xl font-bold text-cosmic-white mt-2">
              ORBITAL <span className="text-gradient-red-gold animate-text-glow-gradient">TRAJECTORY</span>
            </h2>
          </motion.div>

          {/* Cosmic Timeline */}
          <div className="relative w-full py-10">
            {/* Cosmic dust background */}
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(255,140,80,0.2),rgba(0,0,0,0))]" />

            {/* Vertical cosmic energy line */}
            <div className="absolute left-6 md:left-8 top-0 bottom-0 w-[3px] bg-gradient-to-b from-amber-500 via-orange-500 to-red-500 shadow-[0_0_12px_rgba(255,140,80,0.8)]" />

            <div className="flex flex-col gap-10 ml-14 md:ml-20">
              {experiences.map((item, index) => {
                const isHover = hovered === item.id

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 50 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.15 }}
                    className="relative group"
                    onMouseEnter={() => setHovered(item.id)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    {/* Timeline Node */}
                    <motion.div
                      animate={{
                        scale: isHover ? 1.4 : 1,
                        boxShadow: isHover ? "0 0 25px rgba(255, 140, 80, 0.9)" : "0 0 12px rgba(255, 140, 80, 0.4)",
                      }}
                      transition={{ duration: 0.3 }}
                      className="absolute -left-[3.25rem] md:-left-[4.25rem] top-6 w-5 h-5 rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 border border-white/40 shadow-lg"
                    >
                      {/* Glowing aura */}
                      <AnimatePresence>
                        {isHover && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1.5 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            className="absolute inset-0 rounded-full bg-orange-400 blur-md"
                          />
                        )}
                      </AnimatePresence>
                    </motion.div>

                    {/* Card */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="rounded-xl p-6 bg-cosmic-black/60 backdrop-blur-md border border-cosmic-gold/20 text-cosmic-white transition-all duration-300 hover:border-cosmic-gold/40 shadow-[0_0_20px_rgba(255,140,80,0.1)]"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                        <h3 className="text-xl font-bold text-cosmic-gold">{item.title}</h3>
                        <p className="text-sm text-cosmic-white/50 font-mono">{item.date}</p>
                      </div>
                      <p className="text-cosmic-orange mb-3">{item.company}</p>
                      <p className="text-sm text-cosmic-white/70 mb-4 leading-relaxed">{item.description}</p>

                      <div className="flex flex-wrap gap-2">
                        {item.tech.map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-1 text-xs font-mono text-cosmic-gold border border-cosmic-gold/30 rounded-full bg-cosmic-gold/5"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Cosmic underline shimmer */}
                      <motion.div
                        animate={{ width: isHover ? "100%" : "0%" }}
                        transition={{ duration: 0.4 }}
                        className="h-[2px] mt-4 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 shadow-[0_0_8px_rgba(255,140,80,0.8)]"
                      />
                    </motion.div>
                  </motion.div>
                )
              })}
            </div>

            {/* Floating Particles */}
            <FloatingStars />
          </div>
        </div>
      </section>
    </>
  )
}

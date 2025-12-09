"use client"

import { useRef, useState } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { CosmicHazeDivider } from "./cosmic-haze-divider"

const experiences = [
  {
    id: 1,
    title: "Engineering Outreach Facilitator",
    company_name: "Engineering Outreach, University of Waterloo",
    date: "Jan. 2025 - Apr. 2025",
    icon: "/wie.png",
    iconBg: "#6B46C1",
    skills: ["Technological Agility", "Implementation", "Critical Thinking"],
    points: [
      "Delivered 50+ hands-on Women in Engineering workshops to 1300+ students across Ontario, leveraging my strong communication and organizational skills",
      "Developed robotics, AI and programming challenges using LEGO Spike Primes, Teachable Machine, Arduino, Micro:bits, and Ozobots, increasing STEM participation",
      "Implemented documentation, budgets and oral presentations using Ontario education standards, developing 60% more innovative STEM outreach content.",
      "Debugged and troubleshooted electronic devices, circuitry and coding projects, including an AI-powered sign language detection site and Arduino clinostat to simulate microgravity.",
    ],
  },
  {
    id: 2,
    title: "Fullstack Web Developer",
    company_name: "BrandEQ Group",
    date: "Jul. 2022 - Sep. 2022",
    icon: "/brandeq.jpeg",
    iconBg: "#1E40AF",
    skills: ["Collaboration", "Problem-Solving", "Communication"],
    points: [
      "Enhanced SEO by implementing WCAG 2.0 accessibility standards, PR backlinking, responsive web design and architecture using Editor X, WordPress and JavaScript",
      "Developed and pitched website prototypes using MS Office tools and agile methodologies to improve user interaction, receiving endorsement from national brands",
      "Improved user experience, accessibility and mobile optimization by 60% by leading web development team to redesign and monitor 25+ client websites and software applications",
    ],
  },
  {
    id: 3,
    title: "Teen Ambassador",
    company_name: "Canada Learning Code",
    date: "Sep. 2022 - Jun. 2024",
    icon: "/clc.png",
    iconBg: "#FF5733",
    skills: ["Innovation", "Leadership", "Project Management"],
    points: [
      "Led cross-functional teams to build an informative website about Fast Fashion using HTML, CSS, JavaScript and Bootstrap",
      "Designed and proposed a safety application prototype using Marvel to combat youth violence and improve emergency preparedness",
      "Facilitated end-to-end project management using Kanban boards, overseeing ideation and developing workflows to ensure timely completion.",
    ],
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
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <>
      <CosmicHazeDivider variant="mixed" />
      <section id="experience" ref={containerRef} className="relative py-32">
        <div className="absolute inset-0 bg-cosmic-black/40 backdrop-blur-sm" />

        <div className="relative max-w-6xl mx-auto px-6">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-cosmic-white mb-2">
              Work{" "}
              <span className="text-gradient-red-gold animate-text-glow-gradient">Experience</span>
            </h2>
            <p className="text-cosmic-white/70 max-w-3xl mx-auto">
              Learn more about the hands-on opportunities and professional roles that shape my career journey. 
              From collaborative team environments to independent leadership, these experiences highlight my adaptability, 
              problem-solving skills and dedication to continuous growth.
            </p>
          </motion.div>

          {/* Alternating Timeline */}
          <div className="relative">
            {/* Center line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-amber-500 via-orange-500 to-red-500 shadow-[0_0_12px_rgba(255,140,80,0.8)] hidden md:block" />

            {/* Timeline Items */}
            <div className="space-y-16">
              {experiences.map((experience, index) => {
                const isLeft = index % 2 === 0
                const isHover = hovered === experience.id

                return (
                  <motion.div
                    key={experience.id}
                    initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.2 }}
                    className="relative"
                    onMouseEnter={() => setHovered(experience.id)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <div className={`flex flex-col md:flex-row items-center gap-8 ${!isLeft ? "md:flex-row-reverse" : ""}`}>
                      {/* Content Card */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="flex-1 w-full md:w-auto"
                      >
                        <div className="rounded-xl p-6 bg-cosmic-black/60 backdrop-blur-md border border-cosmic-gold/20 text-cosmic-white transition-all duration-300 hover:border-cosmic-gold/40 shadow-[0_0_20px_rgba(255,140,80,0.1)]">
                          {/* Header */}
                          <div className="flex flex-col mb-4">
                            <h3 className="text-2xl font-bold text-cosmic-gold mb-1">{experience.title}</h3>
                            <p className="text-cosmic-orange">{experience.company_name}</p>
                            <p className="text-sm text-cosmic-white/50 font-mono mt-2">{experience.date}</p>
                          </div>

                          {/* Skills */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {experience.skills.map((skill) => (
                              <span
                                key={skill}
                                className="px-3 py-1 text-xs font-mono text-cosmic-gold border border-cosmic-gold/30 rounded-full bg-cosmic-gold/5"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>

                          {/* Points */}
                          <ul className="list-disc ml-5 space-y-2">
                            {experience.points.map((point, idx) => (
                              <li key={idx} className="text-sm text-cosmic-white/70 leading-relaxed">
                                {point}
                              </li>
                            ))}
                          </ul>

                          {/* Cosmic underline */}
                          <motion.div
                            animate={{ width: isHover ? "100%" : "0%" }}
                            transition={{ duration: 0.4 }}
                            className="h-[2px] mt-4 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 shadow-[0_0_8px_rgba(255,140,80,0.8)]"
                          />
                        </div>
                      </motion.div>

                      {/* Center Icon */}
                      <motion.div
                        animate={{
                          scale: isHover ? 1.2 : 1,
                          boxShadow: isHover 
                            ? "0 0 30px rgba(255, 140, 80, 0.9)" 
                            : "0 0 15px rgba(255, 140, 80, 0.5)",
                        }}
                        transition={{ duration: 0.3 }}
                        className="relative flex-shrink-0 w-20 h-20 rounded-full border-4 border-white/40 shadow-lg overflow-hidden flex items-center justify-center z-10"
                        style={{ backgroundColor: experience.iconBg }}
                      >
                        <img
                          src={experience.icon}
                          alt={experience.company_name}
                          className="w-full h-full object-cover"
                        />

                        {/* Glowing aura */}
                        <AnimatePresence>
                          {isHover && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1.8 }}
                              exit={{ opacity: 0, scale: 0.5 }}
                              className="absolute inset-0 rounded-full bg-orange-400 blur-xl -z-10"
                            />
                          )}
                        </AnimatePresence>
                      </motion.div>

                      {/* Spacer for alternating layout */}
                      <div className="flex-1 hidden md:block" />
                    </div>
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

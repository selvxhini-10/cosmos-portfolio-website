"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"

const skillCategories = [
  {
    title: "Languages",
    skills: ["HTML", "CSS", "JavaScript", "Python", "C++", "Java", "C#"],
  },
  {
    title: "Frontend Frameworks & Libraries",
    skills: ["React.js", "React Hooks", "Next.js", "Tailwind CSS", "Bootstrap", "Axios"],
  },
  {
    title: "Backend & APIs",
    skills: ["Node.js", "Express.js", "FastAPI", "Flask", "PostgreSQL"],
  },
  {
    title: "AI & Data",
    skills: [
      "Microsoft Agent Framework",
      "Semantic Kernel",
      "TensorFlow",
      "Keras",
      "PyTorch",
      "OpenCV",
      "NumPy",
      "Pandas",
      "Matplotlib",
      "scikit-learn",
    ],
  },
  {
    title: "Embedded Systems",
    skills: ["STM32CubeIDE", "Quartus Prime", "Arduino", "ESP32", "UART", "SPI", "Soldering"],
  },
  {
    title: "Cloud & DevOps",
    skills: [
      "Azure Functions",
      "Azure Blob Storage",
      "Azure AI Foundry",
      "Container Apps",
      "GitHub Actions",
    ],
  },
]

export function SkillsSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })

  return (
  <section id="skills" ref={containerRef} className="relative z-10">
      <div className="absolute inset-0 bg-cosmic-black/40 -z-10" />

      <div className="relative max-w-7xl mx-auto px-6 text-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-cosmic-white">
            TECH{" "}
            <span className="text-gradient-red-gold">
              STACK
            </span>
          </h2>
        </motion.div>

        {/* Categories */}
        <div className="grid md:grid-cols-2 gap-12">
          {skillCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.4,
                delay: index * 0.08,
                ease: "easeOut",
              }}
              className="p-6 border border-cosmic-gold/20 rounded-xl bg-cosmic-black/50 transition-colors"
            >
              <h3 className="text-lg font-semibold text-cosmic-gold mb-4">
                {category.title}
              </h3>

              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                {category.skills.map((skill) => (
                  <motion.span
                    key={skill}
                    whileHover={{
                      backgroundColor: "rgba(255,180,100,0.15)",
                      borderColor: "rgba(255,180,100,0.6)",
                    }}
                    className="px-4 py-2 text-sm rounded-full border border-cosmic-white/20 text-cosmic-white/80 cursor-default select-none"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

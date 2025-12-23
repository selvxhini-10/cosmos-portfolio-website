"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"

// Define skill categories with structured grouping
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
    skills: ["Microsoft Agent Framework", "Semantic Kernel", "TensorFlow", "Keras", "PyTorch", "OpenCV", "NumPy", "Pandas", "Matplotlib", "Seaborn", "scikit-learn"],
  },
  {
    title: "Embedded Systems",
    skills: ["STM32CubeIDE", "Arduino", "ESP32", "UART", "SPI", "Soldering"],
  },
  {
    title: "Cloud & DevOps",
    skills: ["Azure Functions", "Azure Blob Storage", "Azure AI Foundry", "Container Apps", "GitHub Actions"],
  },
]

export function SkillsSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })

  return (
    <section id="skills" ref={containerRef} className="relative z-[1]">
      <div className="absolute inset-0 bg-cosmic-black/40 backdrop-blur-sm -z-10" />

      <div className="relative max-w-7xl mx-auto px-6 text-center">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-cosmic-white mt-2">
            TECH <span className="text-gradient-red-gold animate-text-glow-gradient">STACK</span>
          </h2>
        </motion.div>

        {/* Skill Categories */}
        <div className="grid md:grid-cols-2 gap-12">
          {skillCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className="p-6 border border-cosmic-gold/20 rounded-xl bg-cosmic-black/50 backdrop-blur-xl"
            >
              <h3 className="text-lg font-semibold text-cosmic-gold mb-4">{category.title}</h3>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                {category.skills.map((skill) => (
                  <motion.span
                    key={skill}
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 180, 100, 0.15)" }}
                    className="px-4 py-2 text-sm text-cosmic-white/80 border border-cosmic-white/20 rounded-full hover:border-cosmic-gold/50 transition-colors cursor-default"
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

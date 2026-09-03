"use client"

import { useRef, useState } from "react"

const skillCategories = [
  {
    title: "Languages",
    skills: [
      "C++",
      "C",
      "Python",
      "SQL",
      "JavaScript",
      "Java",
      "C#",
      "HTML/CSS"
    ]
  },

  {
    title: "Frontend",
    skills: [
      "React.js",
      "Next.js",
      "Vue.js",
      "Three.js",
      "React Hooks",
      "Tailwind CSS",
      "Bootstrap",
      "Axios"
    ]
  },

  {
    title: "Backend & Databases",
    skills: [
      "Node.js",
      "Express.js",
      "FastAPI",
      "Flask",
      "PostgreSQL",
      "SQLite"
    ]
  },

  {
    title: "AI & Machine Learning",
    skills: [
      "LangGraph",
      "Langfuse",
      "LiteLLM",
      "Microsoft Agent Framework",
      "Semantic Kernel",
      "PyTorch",
      "TensorFlow",
      "Keras",
      "scikit-learn",
      "OpenCV",
      "NumPy",
      "Pandas",
      "Matplotlib",
      "Lora",
      "PEFT"
    ]
  },

  {
    title: "Embedded Systems & Firmware",
    skills: [
      "ESP-IDF",
      "ESP32",
      "FreeRTOS",
      "STM32CubeIDE",
      "Embedded C/C++",
      "UART",
      "SPI",
      "I2C",
      "PWM",
      "Watchdog Timers",
      "CMake",
      "Firmware Packaging",
      "Semantic Versioning"
    ]
  },

  {
    title: "Hardware & PCB Design",
    skills: [
      "KiCad",
      "Schematic Design",
      "PCB Design",
      "PCB Footprints",
      "Quartus Prime",
      "Soldering"
    ]
  },

  {
    title: "Cloud, Infrastructure & DevOps",
    skills: [
      "Azure Functions",
      "Azure Blob Storage",
      "Azure AI Foundry",
      "Azure Container Apps",
      "Azure Key Vault",
      "Bicep",
      "GitHub Actions",
      "Managed Identity",
      "Docker",
      "CI/CD",
      "Sonatype Nexus",
      "Release Automation",
      "Artifact Management",
      "Git Submodules"    
    ]
  }
]

export function SkillsSection() {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  const onRef = (el: HTMLElement | null) => {
    if (!el) return

    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold: 0.08 }
    )

    obs.observe(el)
  }

  return (
    <section
      id="skills"
      ref={(el) => {
        (ref as React.MutableRefObject<HTMLElement | null>).current = el
        onRef(el)
      }}
      className="relative z-10 py-16"
    >
      <div className="absolute inset-0 bg-cosmic-black/40 -z-10" />

      <div className="relative max-w-7xl mx-auto px-6 text-center">

        <div
          className="mb-16 transition-all duration-500 ease-out"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(20px)"
          }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-cosmic-white">
            TECH <span className="text-gradient-red-gold">STACK</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {skillCategories.map((cat, i) => {
            const isLast = i === skillCategories.length - 1

            return (
              <div
                key={cat.title}
                className={`
                  p-6
                  border border-cosmic-gold/20
                  rounded-xl
                  bg-cosmic-black/50
                  text-left
                  transition-all duration-500 ease-out
                  hover:border-cosmic-gold/35
                  ${isLast ? "md:col-span-2" : ""}
                `}
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "none" : "translateY(16px)",
                  transitionDelay: `${i * 60}ms`
                }}
              >
                <h3 className="text-base font-semibold text-cosmic-gold mb-4">
                  {cat.title}
                </h3>

                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((skill) => (
                    <span
                      key={skill}
                      className="
                        px-3 py-1.5
                        text-xs
                        rounded-full
                        border border-cosmic-white/15
                        text-cosmic-white/75
                        hover:border-cosmic-gold/50
                        hover:text-cosmic-gold
                        transition-colors duration-150
                        cursor-default
                        select-none
                      "
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
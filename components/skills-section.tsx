"use client"

import { useRef, useState } from "react"

const skillCategories = [
  { title: "Languages",                    skills: ["HTML", "CSS", "JavaScript", "Python", "C++", "Java", "C#"] },
  { title: "Frontend Frameworks & Libraries", skills: ["React.js", "React Hooks", "Next.js", "Tailwind CSS", "Bootstrap", "Axios"] },
  { title: "Backend & APIs",               skills: ["Node.js", "Express.js", "FastAPI", "Flask", "PostgreSQL"] },
  { title: "AI & Data",                    skills: ["Microsoft Agent Framework", "Semantic Kernel", "TensorFlow", "Keras", "PyTorch", "OpenCV", "NumPy", "Pandas", "Matplotlib", "scikit-learn"] },
  { title: "Embedded Systems",             skills: ["STM32CubeIDE", "Quartus Prime", "Arduino", "ESP32", "UART", "SPI", "Soldering"] },
  { title: "Cloud & DevOps",               skills: ["Azure Functions", "Azure Blob Storage", "Azure AI Foundry", "Container Apps", "GitHub Actions"] },
]

export function SkillsSection() {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  const onRef = (el: HTMLElement | null) => {
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.08 }
    )
    obs.observe(el)
  }

  return (
    <section
      id="skills"
      ref={(el) => { (ref as React.MutableRefObject<HTMLElement | null>).current = el; onRef(el) }}
      className="relative z-10 py-24"
    >
      <div className="absolute inset-0 bg-cosmic-black/40 -z-10" />
      <div className="relative max-w-7xl mx-auto px-6 text-center">

        <div
          className="mb-16 transition-all duration-500 ease-out"
          style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(20px)" }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-cosmic-white">
            TECH <span className="text-gradient-red-gold">STACK</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {skillCategories.map((cat, i) => (
            <div
              key={cat.title}
              className="p-6 border border-cosmic-gold/20 rounded-xl bg-cosmic-black/50 text-left transition-all duration-500 ease-out hover:border-cosmic-gold/35"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "none" : "translateY(16px)",
                transitionDelay: `${i * 60}ms`,
              }}
            >
              <h3 className="text-base font-semibold text-cosmic-gold mb-4">{cat.title}</h3>
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 text-xs rounded-full border border-cosmic-white/15 text-cosmic-white/75 hover:border-cosmic-gold/50 hover:text-cosmic-gold transition-colors duration-150 cursor-default select-none"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

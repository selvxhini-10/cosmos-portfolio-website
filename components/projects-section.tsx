"use client"

import { useRef, useState, useMemo } from "react"
import { ExternalLink, Github, FileText, X, Trophy } from "lucide-react"

export interface Project {
  id: number
  title: string
  categories: string[]
  description: string
  image: string
  tech: string[]
  demoUrl?: string
  githubUrl?: string
  docsUrl?: string
  hackathon?: string // Optional hackathon banner tag
  height: "short" | "medium" | "tall"
  disabled?: boolean
}

const projects: Project[] = [
  {
    id: 1,
    title: "Summus – Terms & Conditions AI Assistant",
    categories: ["AI & ML", "Web Apps"],
    description: "Chrome extension that summarizes website terms and conditions, highlights privacy concerns, and answers user questions via an AI chatbot. Uses a FastAPI backend with transformer models and Ollama Mistral to extract, analyze, and serve content in real time.",
    image: "/images/summus.png",
    tech: ["JavaScript", "HTML/CSS", "FastAPI", "Flask-CORS", "PyTorch", "HuggingFace Transformers", "Ollama Mistral"],
    demoUrl: "#",
    githubUrl: "https://github.com/m76domi98/AI_AGENT",
    height: "tall"
  },
  {
    id: 2,
    title: "AgriVision – Smart Farming Assistant",
    categories: ["AI & ML", "Embedded Systems"],
    description: "Features a YOLOv8 object detection model for plant disease classification and a GPT chatbot for farming advice. Hardware integration includes an Arduino-based soil moisture sensor and relay control system for automatic irrigation.",
    image: "/images/agrivision.png",
    tech: ["React", "Google Colab", "TailwindCSS", "YOLOv8", "OpenCV", "NumPy", "Pillow (PIL)", "Flask-RESTful", "Flask-CORS", "LangChain", "OpenAI API", "Arduino"],
    demoUrl: "https://ai-sustainability-app.vercel.app/",
    githubUrl: "https://github.com/selvxhini-10/AI-Sustainability-App",
    height: "short"
  },
  {
    id: 3,
    title: "Schema Sync: GitHub Copilot for Bank Data",
    categories: ["AI & ML", "Web Apps"],
    description: "Two banks, two schemas, one click. Uses SBERT embeddings and cosine similarity to map fields, merge mismatched bank datasets, and generate completeness reports, audit logs, and one-click Excel/PPT exports.",
    image: "/images/schema.jpg",
    tech: ["React (Next.js)", "TypeScript", "SQLite", "FastAPI", "SBERT", "Snowflake", "openpyxl", "python-pptx", "Docker"],
    githubUrl: "#",
    docsUrl: "#",
    hackathon: "Hack the Valley X",
    height: "medium"
  },
  {
    id: 4,
    title: "SnowSense IoT Network – Sidewalk Hazard Detection",
    categories: ["Embedded Systems", "AI & ML", "Web Apps"],
    description: "IoT sidewalk hazard detection system. Features Arduino hardware (ultrasonic/temperature sensors, LED alerts, servo barrier) paired with a live Flask dashboard powered by a sigmoid AI Risk Score and LOF anomaly intelligence.",
    image: "/images/sidewalk.png",
    tech: ["Arduino", "HC-SR04", "DHT11", "Flask", "Leaflet.js", "Open-Meteo API", "Scikit-learn", "Logistic Regression"],
    githubUrl: "#",
    docsUrl: "#",
    height: "tall"
  },
  {
    id: 5,
    title: "ESP32 Retro Arcade Handheld",
    categories: ["Embedded Systems", "Game Dev"],
    description: "Self-contained retro arcade handheld built on an ESP32 microcontroller in C using FreeRTOS. Features a TFT display, custom joystick/button input, PWM buzzer audio state machine, and 5 built-in games (Pong, Breakout, Flappy Bird, Space Invaders, Maze).",
    image: "/images/game.jpg",
    tech: ["ESP32", "C", "FreeRTOS", "ESP-IDF v6", "PWM Audio", "SPI TFT"],
    githubUrl: "https://github.com/selvxhini-10/esp32-game-console",
    height: "medium"
  },
  {
    id: 6,
    title: "Pneumonia Classifier Web App",
    categories: ["AI & ML", "Web Apps"],
    description: "A deep learning model deployed with Streamlit to classify chest X-ray images as normal or pneumonia-affected. Trained on 5,000+ X-ray images to assist with early pneumonia detection and reliable medical diagnosis.",
    image: "/images/pneumonia.png",
    tech: ["Keras", "NumPy", "Streamlit", "Google Teachable Machine", "Python"],
    demoUrl: "#",
    githubUrl: "https://github.com/selvxhini-10/Computer-Vision",
    height: "tall"
  },
  {
    id: 7,
    title: "Intelligent Traffic Flow Optimization",
    categories: ["AI & ML"],
    description: "Developed an AI model to predict traffic flow using the METR-LA dataset. Performed SHAP analysis to interpret feature importance. Created data visualizations to explore traffic trends and built both linear regression and neural network models for prediction.",
    image: "/images/traffic.png",
    tech: ["Streamlit", "Python", "Pandas", "NumPy", "SHAP", "Matplotlib", "Seaborn", "TensorFlow", "Keras"],
    demoUrl: "#",
    githubUrl: "https://github.com/selvxhini-10/Computer-Vision",
    height: "short"
  },
  {
    id: 8,
    title: "Bad Ice Cream Game",
    categories: ["Game Dev"],
    description: "Recreated the two-player Bad Ice Cream arcade-style game using Java and core OOP principles including inheritance, encapsulation, and polymorphism. Visualized with UML diagrams.",
    image: "/images/badicecream.png",
    tech: ["Java", "Eclipse", "OOP", "UML"],
    demoUrl: "#",
    githubUrl: "https://github.com/selvxhini-10/BadIceCream",
    height: "tall"
  },
  {
    id: 9,
    title: "Medical Pager Application",
    categories: ["Web Apps"],
    description: "Built a full-stack real-time chat application for medical communication using Stream APIs. Integrated user authentication and session management with Express and Axios.",
    image: "/images/chat.png",
    tech: ["React", "TailwindCSS", "JavaScript", "Stream API", "Express", "Axios", "Universal-Cookies"],
    demoUrl: "#",
    githubUrl: "https://github.com/selvxhini-10/Covid-Tracker",
    height: "short"
  },
  {
    id: 10,
    title: "Plastic Frenzy – Ocean Cleanup Game",
    categories: ["Game Dev"],
    description: "An underwater adventure game built in Unity to promote plastic pollution awareness. Players collect virtual ocean waste, with real-world cleanup tied to engagement.",
    image: "/images/plastic.jpg",
    tech: ["Unity", "C#"],
    demoUrl: "https://devpost.com/software/depth-defenders",
    githubUrl: "https://github.com/anusha-saxena/Plastic-Frenzy",
    height: "medium"
  },
  {
    id: 11,
    title: "AssistWave – Medical Assistive Device",
    categories: ["Embedded Systems"],
    description: "Ultrasonic sensor tracks hand movements within distance thresholds. An STM32 microcontroller transmits data via UART in Single Wire Half-Duplex Mode to a receiving Nucleo board. Output actions include LEDs, fans, and servo-controlled doors.",
    image: "/images/uart.jpg",
    tech: ["STM32CubeIDE", "UML and I/O Diagrams", "C++", "KiCad Schematics"],
    demoUrl: "#",
    githubUrl: "https://github.com/selvxhini-10/AssistWave-STM32-TX-",
    height: "tall"
  },
  {
    id: 12,
    title: "Simulated FPGA Traffic Light Controller",
    categories: ["Hardware & FPGA", "Embedded Systems"],
    description: "Designed and simulated a traffic light controller on an Altera MAX-10 FPGA using a Moore State machine. Implemented combinational and sequential logic using behavioural VHDL.",
    image: "/images/fpga.jpg",
    tech: ["VHDL", "Intel Quartus Prime"],
    demoUrl: "#",
    githubUrl: "#",
    height: "tall"
  },
  {
    id: 13,
    title: "Fine-Tuned Sentiment Analysis (LoRA/PEFT)",
    categories: ["AI & ML"],
    description: "Fine-tuned DistilBERT on IMDb using Hugging Face Transformers and the Trainer API with CUDA-accelerated PyTorch. Achieved 89.19% accuracy on the test split.",
    image: "/images/imdb.jpg",
    tech: ["DistilBERT", "LoRA", "PEFT", "Hugging Face Transformers", "PyTorch", "CUDA"],
    demoUrl: "https://finetuned-sentiment-analysis.streamlit.app/",
    githubUrl: "https://github.com/selvxhini-10/Finetuned-Sentiment-Analysis",
    height: "medium"
  },
  {
    id: 14,
    title: "Simulated FPGA Home Energy Monitor",
    categories: ["Hardware & FPGA", "Embedded Systems"],
    description: "Designed and simulated an HVAC system on an Altera MAX-10 FPGA using VHDL and D flip-flops. Utilized Intel Quartus Prime to implement magnitude comparators, multiplexers, adders and shift registers.",
    image: "/images/fpga.jpg",
    tech: ["VHDL", "Intel Quartus Prime"],
    demoUrl: "#",
    githubUrl: "#",
    height: "medium"
  },
  {
    id: 15,
    title: "Smart Navigation Cane for Visually Impaired",
    categories: ["Embedded Systems", "AI & ML", "Web Apps"],
    description: "ESP32-CAM captures live images over WiFi to a FastAPI backend. YOLOv11 (COCO dataset) identifies obstacles and returns audio feedback via Google TTS. Results displayed in a React web app.",
    image: "/images/cane.png",
    tech: ["Arduino", "ESP32-CAM", "Google TTS", "YOLOv11", "FastAPI", "React"],
    demoUrl: "#",
    githubUrl: "https://github.com/selvxhini-10/AI-Navigation-Guide",
    height: "short"
  },
  {
    id: 16,
    title: "Helio – Early AI Wildfire Detection",
    categories: ["Embedded Systems", "AI & ML", "Web Apps"],
    description: "YOLOv8 trained on satellite imagery detects wildfire events. An autonomous SparkFun RedBoard rover navigates affected regions. Features a Canadian wildfire map and Twilio-powered resident alerts.",
    image: "/images/fire.png",
    tech: ["SparkFun RedBoard", "Motor Driver", "PyTorch", "Pillow (PIL)", "Twilio API", "Next.js", "TailwindCSS"],
    demoUrl: "https://wildfire-detection.vercel.app/",
    githubUrl: "https://github.com/selvxhini-10/Wildfire-Detection",
    hackathon: "Hack the North 2025",
    height: "tall"
  },
  {
    id: 17,
    title: "Personal Portfolio v1 – Space-Themed",
    categories: ["Web Apps"],
    description: "Space-themed personal portfolio featuring Framer Motion animations, interactive Spline 3D models and a responsive UI with Radix UI.",
    image: "/images/portfolio.png",
    tech: ["React.js", "TailwindCSS", "Framer Motion", "Spline", "JavaScript", "Radix UI", "Lucide React"],
    demoUrl: "http://skamalarajan.vercel.app/",
    githubUrl: "https://github.com/selvxhini-10/Personal-Portfolio",
    height: "medium"
  },
  {
    id: 18,
    title: "Personal Portfolio v2 – Cinematic",
    categories: ["Web Apps"],
    description: "A cinematic developer portfolio inspired by Interstellar, featuring 3D elements, parallax backgrounds and GPU-optimized animations. Includes a blog page with dynamic slug-based routing.",
    image: "/images/v2.png",
    tech: ["TypeScript", "Framer Motion", "Three.js", "React Three Fiber", "Next.js", "Spline"],
    demoUrl: "http://selvahinik.vercel.app/",
    githubUrl: "https://github.com/selvxhini-10/cosmos-portfolio-website",
    height: "short"
  },
  {
    id: 19,
    title: "ESP32 Automated Irrigation System",
    categories: ["Embedded Systems"],
    description: "Automated closed-loop irrigation system utilizing ESP32 microcontrollers, moisture sensors, and dynamic watering thresholds. (Currently In Development)",
    image: "/images/irrigation.jpg",
    githubUrl: "https://github.com/selvxhini-10/esp32-smart-irrigation",
    tech: ["ESP32", "C++", "Sensors", "MQTT"],
    height: "short",
  },
   {
    id: 19,
    title: "Bracket Bot Sock Matchmaker",
    categories: ["Embedded Systems"],
    description: "Automated closed-loop irrigation system utilizing ESP32 microcontrollers, moisture sensors, and dynamic watering thresholds. (Currently In Development)",
    image: "/images/bracketbot.png",
    githubUrl: "https://github.com/selvxhini-10/SoleMates",
    tech: ["ESP32", "C++", "Sensors", "MQTT"],
    height: "medium",
    disabled: true
  }
]

const categories = ["All", "AI & ML", "Embedded Systems", "Hardware & FPGA", "Web Apps", "Game Dev"]

const heightClass: Record<string, string> = { short: "h-56", medium: "h-72", tall: "h-80" }

export function ProjectsSection() {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  const [selected, setSelected] = useState<Project | null>(null)
  const [filter, setFilter] = useState("All")

  const onRef = (el: HTMLElement | null) => {
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.05 }
    )
    obs.observe(el)
  }

  const filtered = useMemo(
    () => filter === "All" ? projects : projects.filter(p => p.categories.includes(filter)),
    [filter]
  )

  return (
    <section
      id="projects"
      ref={(el) => { (ref as React.MutableRefObject<HTMLElement | null>).current = el; onRef(el) }}
      className="relative z-10 py-32 bg-cosmic-black"
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div
          className="text-center mb-12 transition-all duration-500 ease-out"
          style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(24px)" }}
        >
          <span className="text-cosmic-gold/55 text-xs tracking-[0.3em] uppercase font-mono">My Work</span>
          <h2 className="text-4xl sm:text-5xl font-bold text-cosmic-white mt-2">
            Featured <span className="text-gradient-red-gold">Projects</span>
          </h2>
        </div>

        {/* Filter buttons */}
        <div
          className="flex flex-wrap justify-center gap-3 mb-12 transition-all duration-500 ease-out"
          style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(16px)", transitionDelay: "80ms" }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2 rounded-full text-sm font-semibold tracking-wider uppercase border-2 transition-all duration-200 hover:scale-105 active:scale-95 ${
                filter === cat
                  ? "bg-cosmic-gold text-cosmic-black border-cosmic-gold shadow-[0_0_24px_rgba(255,180,100,0.45)]"
                  : "bg-transparent text-cosmic-gold border-cosmic-gold/35 hover:border-cosmic-gold/65"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry grid */}
        <div
          className="columns-1 md:columns-2 lg:columns-3 gap-6 transition-opacity duration-300 ease-out"
          style={{ opacity: visible ? 1 : 0 }}
        >
          {filtered.map((project, i) => (
            <div
              key={project.id}
              className={`break-inside-avoid mb-6 transition-all duration-500 ease-out ${
                project.disabled ? "opacity-40 grayscale cursor-not-allowed pointer-events-none" : ""
              }`}
              style={{
                opacity: visible ? (project.disabled ? 0.4 : 1) : 0,
                transform: visible ? "none" : "translateY(16px)",
                transitionDelay: `${i * 40}ms`,
              }}
            >
              <div
                onClick={() => !project.disabled && setSelected(project)}
                className={`group relative ${heightClass[project.height] ?? "h-72"} rounded-xl overflow-hidden ${
                  project.disabled ? "" : "cursor-pointer"
                } border-2 border-cosmic-gold/25 hover:border-cosmic-gold/55 transition-all duration-200 bg-cosmic-black/60 hover:shadow-[0_0_28px_rgba(255,180,100,0.22)]`}
              >
                {/* Hackathon Badge / Banner */}
                {project.hackathon && (
                  <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-cosmic-black/80 border border-cosmic-gold/60 text-cosmic-gold text-[10px] font-bold uppercase tracking-wider shadow-lg backdrop-blur-md">
                    <Trophy className="w-3 h-3 text-cosmic-gold" />
                    <span>{project.hackathon}</span>
                  </div>
                )}

                {/* Direct Action Quick-Links */}
                {!project.disabled && (
                  <div className="absolute top-3 right-3 z-20 flex items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                    {project.githubUrl && project.githubUrl !== "#" && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 rounded-full bg-cosmic-black/80 text-cosmic-gold hover:text-white border border-cosmic-gold/40 hover:border-cosmic-gold transition-all duration-150 backdrop-blur-md hover:scale-110"
                        title="View Source Code"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {project.demoUrl && project.demoUrl !== "#" && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 rounded-full bg-cosmic-black/80 text-cosmic-gold hover:text-white border border-cosmic-gold/40 hover:border-cosmic-gold transition-all duration-150 backdrop-blur-md hover:scale-110"
                        title="View Live Demo"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                )}

                <div className="absolute inset-0">
                  <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover opacity-35 group-hover:opacity-55 transition-opacity duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-cosmic-black via-cosmic-black/75 to-transparent" />
                </div>

                <div className="relative h-full flex flex-col justify-end p-6">
                  {project.disabled && (
                    <div className="mb-2">
                      <span className="px-2.5 py-0.5 rounded-full border border-gray-500 bg-gray-800 text-gray-300 text-[10px] font-semibold tracking-wider uppercase">
                        In Progress
                      </span>
                    </div>
                  )}

                  <h3 className="text-xl font-bold text-cosmic-white mb-2 group-hover:text-cosmic-gold transition-colors duration-200">
                    {project.title}
                  </h3>
                  <p className="text-cosmic-white/65 text-sm mb-4 line-clamp-2">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.slice(0, 3).map((t) => (
                      <span key={t} className="px-2 py-1 text-xs text-cosmic-gold/75 border border-cosmic-gold/25 rounded-full bg-cosmic-gold/5">{t}</span>
                    ))}
                    {project.tech.length > 3 && (
                      <span className="px-2 py-1 text-xs text-cosmic-gold font-semibold">+{project.tech.length - 3}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Expanded Modal */}
      {selected && (
        <div
          className="fixed inset-0 flex items-center justify-center p-4 bg-cosmic-black/95 overflow-y-auto z-50 pt-24"
          style={{ animation: "fadeIn 0.2s ease-out" }}
          onClick={() => setSelected(null)}
        >
          <div
            className="relative w-full max-w-3xl bg-cosmic-deep/90 border-2 border-cosmic-gold/40 rounded-2xl overflow-hidden"
            style={{
              boxShadow: "0 0 50px rgba(255,180,100,0.35)",
              maxHeight: "calc(100vh - 8rem)",
              animation: "scaleIn 0.2s ease-out",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 z-10 p-2 text-cosmic-gold hover:text-cosmic-white bg-cosmic-black/80 rounded-full border-2 border-cosmic-gold/50 hover:border-cosmic-gold transition-colors duration-150"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 8rem)" }}>
              <div className="h-48 md:h-56 relative overflow-hidden">
                <img src={selected.image} alt={selected.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-cosmic-deep via-cosmic-deep/50 to-transparent" />
              </div>

              <div className="p-6 md:p-8">
                {/* Display Category Pills and Hackathon Badge only inside Modal */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {selected.hackathon && (
                    <span className="flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-cosmic-gold bg-cosmic-gold/20 text-cosmic-gold text-xs font-bold uppercase tracking-wider">
                      <Trophy className="w-3.5 h-3.5" />
                      {selected.hackathon}
                    </span>
                  )}
                  {selected.categories.map((c) => (
                    <span key={c} className="px-4 py-1.5 rounded-full border border-cosmic-gold/35 bg-cosmic-gold/10 text-cosmic-gold text-xs font-semibold uppercase tracking-wider">
                      {c}
                    </span>
                  ))}
                </div>

                <h3 className="text-2xl md:text-3xl font-bold text-cosmic-white mb-4">{selected.title}</h3>
                <p className="text-cosmic-white/80 text-base md:text-lg mb-6 leading-relaxed">{selected.description}</p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {selected.tech.map((t) => (
                    <span key={t} className="px-3 py-1.5 text-sm text-cosmic-gold border border-cosmic-gold/35 rounded-full bg-cosmic-gold/5">{t}</span>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  {selected.demoUrl && selected.demoUrl !== "#" && (
                    <a
                      href={selected.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cosmic-gold to-cosmic-orange text-cosmic-black font-bold rounded-full text-sm hover:scale-105 active:scale-95 transition-transform duration-150"
                    >
                      <ExternalLink size={18} /> View Live
                    </a>
                  )}
                  {selected.githubUrl && selected.githubUrl !== "#" && (
                    <a
                      href={selected.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-transparent text-cosmic-gold border-2 border-cosmic-gold rounded-full text-sm hover:bg-cosmic-gold/10 hover:scale-105 active:scale-95 transition-all duration-150"
                    >
                      <Github size={18} /> Source Code
                    </a>
                  )}
                  {selected.docsUrl && (
                    <a
                      href={selected.docsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-transparent text-cosmic-gold/80 border-2 border-cosmic-gold/50 rounded-full text-sm hover:bg-cosmic-gold/10 hover:text-cosmic-gold hover:border-cosmic-gold hover:scale-105 active:scale-95 transition-all duration-150"
                    >
                      <FileText size={18} /> Documentation
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.94) translateY(12px) } to { opacity: 1; transform: none } }
      `}</style>
    </section>
  )
}
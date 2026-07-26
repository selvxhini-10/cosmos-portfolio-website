"use client"

import { useRef, useState, useMemo } from "react"
import { ExternalLink, Github, X } from "lucide-react"
import Tilt from "react-parallax-tilt"

const projects = [
  { id: 1,  title: "Summus – Terms & Conditions AI Assistant",           category: "AI & ML",           description: "Chrome extension that summarizes website terms and conditions, highlights privacy concerns, and answers user questions via an AI chatbot. Uses a FastAPI backend with transformer models and Ollama Mistral to extract, analyze, and serve content in real time.", image: "/images/summus.png",      tech: ["JavaScript", "HTML/CSS", "FastAPI", "Flask-CORS", "PyTorch", "HuggingFace Transformers", "Ollama Mistral"],                                                                                    demoUrl: "#",                                              githubUrl: "https://github.com/m76domi98/AI_AGENT",                                          height: "tall" },
  { id: 2,  title: "AgriVision – Smart Farming Assistant",               category: "Embedded Systems",  description: "Features a YOLOv8 object detection model for plant disease classification and a GPT chatbot for farming advice. Hardware integration includes an Arduino-based soil moisture sensor and relay control system for automatic irrigation.", image: "/images/agrivision.png",   tech: ["React", "Google Colab", "TailwindCSS", "YOLOv8", "OpenCV", "NumPy", "Pillow (PIL)", "Flask-RESTful", "Flask-CORS", "LangChain", "OpenAI API", "Arduino"],                                     demoUrl: "https://ai-sustainability-app.vercel.app/",      githubUrl: "https://github.com/selvxhini-10/AI-Sustainability-App",                          height: "short" },
  { id: 3,  title: "Pneumonia Classifier Web App",                       category: "AI & ML",           description: "A deep learning model deployed with Streamlit to classify chest X-ray images as normal or pneumonia-affected. Trained on 5,000+ X-ray images to assist with early pneumonia detection and reliable medical diagnosis.", image: "/images/pneumonia.png",   tech: ["Keras", "NumPy", "Streamlit", "Google Teachable Machine", "Python"],                                                                                                                              demoUrl: "#",                                              githubUrl: "https://github.com/selvxhini-10/Computer-Vision",                                height: "tall" },
  { id: 4,  title: "Intelligent Traffic Flow Optimization",              category: "AI & ML",           description: "Developed an AI model to predict traffic flow using the METR-LA dataset. Performed SHAP analysis to interpret feature importance. Created data visualizations to explore traffic trends and built both linear regression and neural network models for prediction.", image: "/images/traffic.png",     tech: ["Streamlit", "Python", "Pandas", "NumPy", "SHAP", "Matplotlib", "Seaborn", "TensorFlow", "Keras"],                                                                                                demoUrl: "#",                                              githubUrl: "https://github.com/selvxhini-10/Computer-Vision",                                height: "short" },
  { id: 5,  title: "Bad Ice Cream Game",                                 category: "Game Development",  description: "Recreated the two-player Bad Ice Cream arcade-style game using Java and core OOP principles including inheritance, encapsulation, and polymorphism. Visualized with UML diagrams.", image: "/images/badicecream.png", tech: ["Java", "Eclipse", "OOP", "UML"],                                                                                                                                                               demoUrl: "#",                                              githubUrl: "https://github.com/selvxhini-10/BadIceCream",                                    height: "tall" },
  { id: 6,  title: "Medical Pager Application",                          category: "Web Applications",  description: "Built a full-stack real-time chat application for medical communication using Stream APIs. Integrated user authentication and session management with Express and Axios.", image: "/images/chat.png",        tech: ["React", "TailwindCSS", "JavaScript", "Stream API", "Express", "Axios", "Universal-Cookies"],                                                                                                     demoUrl: "#",                                              githubUrl: "https://github.com/selvxhini-10/Covid-Tracker",                                  height: "short" },
  { id: 7,  title: "Plastic Frenzy – Ocean Cleanup Game",                category: "Game Development",  description: "An underwater adventure game built in Unity to promote plastic pollution awareness. Players collect virtual ocean waste, with real-world cleanup tied to engagement.", image: "/images/plastic.jpg",     tech: ["Unity", "C#"],                                                                                                                                                                                 demoUrl: "https://devpost.com/software/depth-defenders",   githubUrl: "https://github.com/anusha-saxena/Plastic-Frenzy",                                height: "medium" },
  { id: 8,  title: "AssistWave – STM32CubeIDE Medical Assistive Device", category: "Embedded Systems",  description: "Ultrasonic sensor tracks hand movements within distance thresholds. An STM32 microcontroller transmits data via UART in Single Wire Half-Duplex Mode to a receiving Nucleo board. Output actions include LEDs, fans, and servo-controlled doors.", image: "/images/uart.jpg",        tech: ["STM32CubeIDE", "UML and I/O Diagrams", "C++", "KiCad Schematics"],                                                                                                                               demoUrl: "#",                                              githubUrl: "https://github.com/selvxhini-10/AssistWave-STM32-TX-",                           height: "tall" },
  { id: 9,  title: "Simulated FPGA Traffic Light Controller",            category: "Embedded Systems",  description: "Designed and simulated a traffic light controller on an Altera MAX-10 FPGA using a Moore State machine. Implemented combinational and sequential logic using behavioural VHDL.", image: "/images/fpga.jpg",        tech: ["VHDL", "Intel Quartus Prime"],                                                                                                                                                                  demoUrl: "#",                                              githubUrl: "#",                                                                              height: "tall" },
  { id: 10, title: "Fine-Tuned Sentiment Analysis with LoRA and PEFT",   category: "AI & ML",           description: "Fine-tuned DistilBERT on IMDb using Hugging Face Transformers and the Trainer API with CUDA-accelerated PyTorch. Achieved 89.19% accuracy on the test split.", image: "/images/imdb.jpg",        tech: ["DistilBERT", "LoRA", "PEFT", "Hugging Face Transformers", "PyTorch", "CUDA"],                                                                                                                    demoUrl: "https://finetuned-sentiment-analysis.streamlit.app/", githubUrl: "https://github.com/selvxhini-10/Finetuned-Sentiment-Analysis",                 height: "medium" },
  { id: 11, title: "Simulated FPGA Home Energy Monitor",                 category: "Embedded Systems",  description: "Designed and simulated an HVAC system on an Altera MAX-10 FPGA using VHDL and D flip-flops. Utilized Intel Quartus Prime to implement magnitude comparators, multiplexers, adders and shift registers.", image: "/images/fpga.jpg",        tech: ["VHDL", "Intel Quartus Prime"],                                                                                                                                                                  demoUrl: "#",                                              githubUrl: "#",                                                                              height: "medium" },
  { id: 12, title: "Smart Navigation Cane for the Visually Impaired",    category: "Embedded Systems",  description: "ESP32-CAM captures live images over WiFi to a FastAPI backend. YOLOv11 (COCO dataset) identifies obstacles and returns audio feedback via Google TTS. Results displayed in a React web app.", image: "/images/cane.png",        tech: ["Arduino", "ESP32-CAM", "Google TTS", "YOLOv11", "FastAPI", "React"],                                                                                                                             demoUrl: "#",                                              githubUrl: "https://github.com/selvxhini-10/AI-Navigation-Guide",                            height: "short" },
  { id: 13, title: "Helio – Early AI-Powered Wildfire Detection",        category: "Embedded Systems",  description: "YOLOv8 trained on satellite imagery detects wildfire events. An autonomous SparkFun RedBoard rover navigates affected regions. Features a Canadian wildfire map and Twilio-powered resident alerts.", image: "/images/fire.png",        tech: ["SparkFun RedBoard", "Motor Driver", "PyTorch", "Pillow (PIL)", "Twilio API", "Next.js", "TailwindCSS"],                                                                                           demoUrl: "https://wildfire-detection.vercel.app/",         githubUrl: "https://github.com/selvxhini-10/Wildfire-Detection",                             height: "tall" },
  { id: 14, title: "Personal Portfolio v1 – Space-Themed",               category: "Web Applications",  description: "Space-themed personal portfolio featuring Framer Motion animations, interactive Spline 3D models and a responsive UI with Radix UI.", image: "/images/portfolio.png",   tech: ["React.js", "TailwindCSS", "Framer Motion", "Spline", "JavaScript", "Radix UI", "Lucide React"],                                                                                                   demoUrl: "http://skamalarajan.vercel.app/",                githubUrl: "https://github.com/selvxhini-10/Personal-Portfolio",                              height: "medium" },
  { id: 15, title: "Personal Portfolio v2 – Cinematic",                  category: "Web Applications",  description: "A cinematic developer portfolio inspired by Interstellar, featuring 3D elements, parallax backgrounds and GPU-optimized animations. Includes a blog page with dynamic slug-based routing.", image: "/images/v2.png",           tech: ["TypeScript", "Framer Motion", "Three.js", "React Three Fiber", "Next.js", "Spline"],                                                                                                              demoUrl: "http://selvahinik.vercel.app/",                  githubUrl: "https://github.com/selvxhini-10/cosmos-portfolio-website",                       height: "short" },
]

const categories = ["All", "AI & ML", "Web Applications", "Embedded Systems", "Game Development"]

const heightClass: Record<string, string> = { short: "h-56", medium: "h-72", tall: "h-80" }

export function ProjectsSection() {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  const [selected, setSelected] = useState<typeof projects[0] | null>(null)
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
    () => filter === "All" ? projects : projects.filter(p => p.category === filter),
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

        {/* Masonry grid — CSS columns, no AnimatePresence */}
        <div
          className="columns-1 md:columns-2 lg:columns-3 gap-6 transition-opacity duration-300 ease-out"
          style={{ opacity: visible ? 1 : 0 }}
        >
          {filtered.map((project, i) => (
            <div
              key={project.id}
              className="break-inside-avoid mb-6 transition-all duration-500 ease-out"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "none" : "translateY(16px)",
                transitionDelay: `${i * 40}ms`,
              }}
            >
              <div
                onClick={() => setSelected(project)}
                className={`group relative ${heightClass[project.height] ?? "h-72"} rounded-xl overflow-hidden cursor-pointer border-2 border-cosmic-gold/25 hover:border-cosmic-gold/55 transition-all duration-200 bg-cosmic-black/60 hover:shadow-[0_0_28px_rgba(255,180,100,0.22)]`}
              >
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
                  <span className="inline-block w-fit px-3 py-1 rounded-full border border-cosmic-gold/35 bg-cosmic-gold/10 text-cosmic-gold text-xs font-semibold tracking-wider uppercase mb-3">
                    {project.category}
                  </span>
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

      {/* Modal — CSS transition, not AnimatePresence */}
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
                <span className="inline-block px-4 py-2 rounded-full border border-cosmic-gold/35 bg-cosmic-gold/10 text-cosmic-gold text-sm font-semibold uppercase tracking-wider mb-4">
                  {selected.category}
                </span>
                <h3 className="text-2xl md:text-3xl font-bold text-cosmic-white mb-4">{selected.title}</h3>
                <p className="text-cosmic-white/80 text-base md:text-lg mb-6 leading-relaxed">{selected.description}</p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {selected.tech.map((t) => (
                    <span key={t} className="px-3 py-1.5 text-sm text-cosmic-gold border border-cosmic-gold/35 rounded-full bg-cosmic-gold/5">{t}</span>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href={selected.demoUrl}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cosmic-gold to-cosmic-orange text-cosmic-black font-bold rounded-full text-sm hover:scale-105 active:scale-95 transition-transform duration-150"
                  >
                    <ExternalLink size={18} /> View Live
                  </a>
                  <a
                    href={selected.githubUrl}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-transparent text-cosmic-gold border-2 border-cosmic-gold rounded-full text-sm hover:bg-cosmic-gold/10 hover:scale-105 active:scale-95 transition-all duration-150"
                  >
                    <Github size={18} /> Source Code
                  </a>
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

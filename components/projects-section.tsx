"use client"

import { useRef, useState, useMemo } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { ExternalLink, Github, X } from "lucide-react"
import Tilt from 'react-parallax-tilt';

const projects = [
  {
    id: 1,
    title: "Summus – Terms & Conditions AI Assistant",
    category: "AI & ML",
    description: "Chrome extension that summarizes website terms and conditions, highlights privacy concerns, and answers user questions via an AI chatbot. Uses a FastAPI backend with transformer models and Ollama Mistral to extract, analyze, and serve content in real time.",
    image: "/images/summus.png",
    tech: ["JavaScript", "HTML/CSS", "FastAPI", "Flask-CORS", "PyTorch", "HuggingFace Transformers", "Ollama Mistral"],
    color: "#FFB460",
    demoUrl: "#", 
    githubUrl: "https://github.com/m76domi98/AI_AGENT",
    height: "tall",
  },
  {
    id: 2,
    title: "AgriVision – Smart Farming Assistant",
    category: "Embedded Systems",
        description: "Features a YOLOv8 object detection model for plant disease classification and a GPT chatbot for farming advice. Hardware integration includes an Arduino-based soil moisture sensor and relay control system for automatic irrigation.",
        image: "/images/agrivision.png",
    tech: ["React", "Google Colab","TailwindCSS", "YOLOv8", "OpenCV", "NumPy", "Pillow (PIL)", "Flask-RESTful", "Flask-CORS", "LangChain", "OpenAI API", "Arduino"],
    color: "#FFB460",
    emoUrl: "https://ai-sustainability-app.vercel.app/", 
    githubUrl: "https://github.com/selvxhini-10/AI-Sustainability-App",
    height: "short",
  },
  {
    id: 3,
        title: "Pneumonia Classifier Web App",
    category: "AI & ML",
        description: "A deep learning model deployed with Streamlit to classify chest X-ray images as normal or pneumonia-affected. Trained on 5,000+ X-ray images to assist with early pneumonia detection and reliable medical diagnosis.",
        image: "/images/pneumonia.png",
    tech: ["Keras", "NumPy", "Streamlit", "Google Teachable Machine", "Python"],
    color: "#FFB460",
    demoUrl: "#", 
        githubUrl: "https://github.com/selvxhini-10/Computer-Vision",
    height: "medium",
  },
  {
    id: 4,
  title: "Intelligent Traffic Flow Optimization",
    category: "AI & ML",
  description: "Developed an AI model to predict traffic flow using the METR-LA dataset. Performed SHAP analysis to interpret feature importance. Created data visualizations to explore traffic trends and built both linear regression and neural network models for prediction.",
  image: "/images/traffic.png",
    tech: ["Streamlit", "Python", "Pandas", "NumPy", "SHAP", "Matplotlib", "Seaborn", "TensorFlow", "Keras"],
    color: "#FFB460",
    demoUrl: "#", 
  githubUrl: "https://github.com/selvxhini-10/Computer-Vision",
    height: "short",
  },
  {
    id: 5,
  title: "Bad Ice Cream Game",
    category: "Game Development",
  description: "Recreated the two-player Bad Ice Cream arcade-style game using Java and core object-oriented programming principles such as inheritance, encapsulation, and polymorphism. Visualized the game structure with UML diagrams to demonstrate software architecture and system interactions.",
  image: "/images/badicecream.png",
    tech: ["Java", "Eclipse", "OOP", "UML"],
    color: "#FFB460",
    demoUrl: "#", 
  githubUrl: "https://github.com/selvxhini-10/BadIceCream",
    height: "tall",
  },
  {
    id: 6,
  title: "Medical Pager Application",
    category: "Web Applications",
  description: "Built a full-stack real-time chat application for medical communication using Stream APIs. Integrated user authentication and session management with Express and Axios.",
  image: "/images/chat.png",
    tech: ["React", "TailwindCSS", "JavaScript", "Stream API", "Express", "Axios", "Universal-Cookies"],
    color: "#FFB460",
    demoUrl: "#", 
  githubUrl: "https://github.com/selvxhini-10/Covid-Tracker",
    height: "medium",
  },
  {
    id: 7,
  title: "Plastic Frenzy – Ocean Cleanup Game",
    category: "Game Development",
  description: "Play. Progress. Protect the Ocean. An underwater adventure game built in Unity to promote plastic pollution awareness. Players collect virtual ocean waste, with real-world cleanup tied to engagement. Designed for immersive gameplay with a strong focus on user experience.",
  image: "/images/plastic.jpg",
    tech: ["Unity", "C#"],
    color: "#FFB460",
  demoUrl: "https://devpost.com/software/depth-defenders", 
  githubUrl: "https://github.com/anusha-saxena/Plastic-Frenzy",
    height: "medium",
  },
  {
    id: 8,
  title: "AssistWave - STM32CubeIDE Medical Assistive Device",
  category: "Embedded Systems",
  description: "An ultrasonic sensor is used to track hand movements within predefined distance thresholds. An STM32 microcontroller transmits this data via UART communication in Single Wire Half-Duplex Mode to a receiving STM32 Nucleo board over a 1-meter wired connection. Based on the received data, output actions are triggered, such as turning on an LED light, activating a fan, and operating servo motors to open doors.",
  image: "/images/uart.jpg",
  tech: ["STM32CubeIDE", "UML and I/O Diagrams", "C++", "KiCad Schematics"],
    color: "#FFB460",
    demoUrl: "#", 
  githubUrl: "https://github.com/selvxhini-10/AssistWave-STM32-TX-",
    height: "medium",
  },
]

const categories = ["All", "AI & ML", "Web Applications", "Embedded Systems", "Game Development"]

export function ProjectsSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })
  const [selectedProject, setSelectedProject] = useState<(typeof projects)[0] | null>(null)
  const [activeFilter, setActiveFilter] = useState("All")

  const filteredProjects = useMemo(() => {
    if (activeFilter === "All") return projects
    return projects.filter(p => p.category === activeFilter)
  }, [activeFilter])

  const getHeightClass = (height: string) => {
    switch(height) {
      case "short": return "h-56"
      case "medium": return "h-72"
      case "tall": return "h-80"
      default: return "h-72"
    }
  }

  return (
    <section id="projects" ref={containerRef} className="relative py-32 z-[5] bg-cosmic-black">
      <div className="absolute inset-0 bg-gradient-to-b from-cosmic-black via-cosmic-deep to-cosmic-black -z-10" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-cosmic-gold/60 text-sm tracking-[0.3em] uppercase">My Work</span>
          <h2 className="text-4xl sm:text-5xl font-bold text-cosmic-white mb-4">
            Featured{" "}
            <span className="text-gradient-red-gold animate-text-glow-gradient">
              Projects
            </span>
          </h2>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setActiveFilter(category)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-2 rounded-full text-sm font-semibold tracking-wider uppercase transition-all duration-300 border-2 ${
                activeFilter === category
                  ? "bg-cosmic-gold text-cosmic-black border-cosmic-gold"
                  : "bg-transparent text-cosmic-gold border-cosmic-gold/40 hover:border-cosmic-gold/70"
              }`}
              style={{
                boxShadow: activeFilter === category 
                  ? '0 0 30px rgba(255,180,100,0.5), inset 0 0 20px rgba(255,255,255,0.2)' 
                  : '0 0 15px rgba(255,180,100,0.2)'
              }}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Masonry Grid - More Staggered Heights */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="columns-1 md:columns-2 lg:columns-3 gap-6"
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="break-inside-avoid mb-6"
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedProject(project)}
                  className={`group relative ${getHeightClass(project.height)} rounded-xl overflow-hidden cursor-pointer border-2 border-cosmic-gold/30 hover:border-cosmic-gold/60 transition-all duration-300 bg-cosmic-black/60 backdrop-blur-xl`}
                  style={{
                    boxShadow: '0 0 30px rgba(255,180,100,0.2), inset 0 0 30px rgba(255,180,100,0.05)'
                  }}
                >
                  {/* Image Background */}
                  <div className="absolute inset-0">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-cosmic-black via-cosmic-black/80 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="relative h-full flex flex-col justify-end p-6">
                    <span className="inline-block w-fit px-3 py-1 rounded-full border-2 border-cosmic-gold/40 bg-cosmic-gold/10 text-cosmic-gold text-xs font-semibold tracking-wider uppercase mb-3">
                      {project.category}
                    </span>

                    <h3 className="text-xl md:text-2xl font-bold text-cosmic-white mb-2 group-hover:text-cosmic-gold transition-colors">
                      {project.title}
                    </h3>

                    <p className="text-cosmic-white/70 text-sm mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {project.tech.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 text-xs text-cosmic-gold/80 border border-cosmic-gold/30 rounded-full bg-cosmic-gold/5"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.tech.length > 3 && (
                        <span className="px-2 py-1 text-xs text-cosmic-gold font-semibold">
                          +{project.tech.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Glow Effect on Hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div
                      className="absolute inset-0"
                      style={{
                        background: 'radial-gradient(circle at center, rgba(255,180,100,0.15), transparent 70%)'
                      }}
                    />
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Project Detail Modal - Smaller and Below Navbar */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
            className="fixed inset-0 flex items-center justify-center p-4 bg-cosmic-black/95 backdrop-blur-xl overflow-y-auto z-50 pt-24"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl bg-cosmic-deep/90 backdrop-blur-xl border-2 border-cosmic-gold/40 rounded-2xl overflow-hidden"
              style={{
                boxShadow: '0 0 50px rgba(255,180,100,0.4), inset 0 0 50px rgba(255,180,100,0.05)',
                maxHeight: 'calc(100vh - 8rem)'
              }}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-10 p-2 text-cosmic-gold hover:text-cosmic-white transition-colors bg-cosmic-black/80 rounded-full border-2 border-cosmic-gold/50 hover:border-cosmic-gold"
                style={{
                  boxShadow: '0 0 20px rgba(255,180,100,0.4)'
                }}
              >
                <X className="w-5 h-5" />
              </button>

              <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 8rem)' }}>
                {/* Header Image */}
                <div className="h-48 md:h-56 relative overflow-hidden">
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-cosmic-deep via-cosmic-deep/50 to-transparent" />
                </div>

                {/* Content */}
                <div className="p-6 md:p-8">
                  <span
                    className="inline-block px-4 py-2 rounded-full border-2 border-cosmic-gold/40 bg-cosmic-gold/10 text-cosmic-gold text-sm font-semibold tracking-wider uppercase mb-4"
                  >
                    {selectedProject.category}
                  </span>

                  <h3 className="text-2xl md:text-3xl font-bold text-cosmic-white mb-4">
                    {selectedProject.title}
                  </h3>

                  <p className="text-cosmic-white/80 text-base md:text-lg mb-6 leading-relaxed">
                    {selectedProject.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {selectedProject.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1.5 text-sm text-cosmic-gold border-2 border-cosmic-gold/40 rounded-full bg-cosmic-gold/5"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <motion.a
                      href={selectedProject.demoUrl}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cosmic-gold to-cosmic-orange text-cosmic-black font-bold rounded-full border-2 border-transparent text-sm"
                      style={{
                        boxShadow: '0 0 30px rgba(255,180,100,0.5), inset 0 0 20px rgba(255,255,255,0.2)'
                      }}
                    >
                      <ExternalLink size={18} />
                      View Live
                    </motion.a>
                    <motion.a
                      href={selectedProject.githubUrl}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-transparent text-cosmic-gold border-2 border-cosmic-gold rounded-full hover:bg-cosmic-gold/10 text-sm"
                      style={{
                        boxShadow: '0 0 25px rgba(255,180,100,0.3), inset 0 0 20px rgba(255,180,100,0.05)'
                      }}
                    >
                      <Github size={18} />
                      Source Code
                    </motion.a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
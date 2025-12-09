"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Float, Sphere, MeshDistortMaterial } from "@react-three/drei"
import type * as THREE from "three"
import { ExternalLink, Github } from "lucide-react"
import { CosmicHazeDivider } from "./cosmic-haze-divider"
import { Cross2Icon } from "@radix-ui/react-icons"

const projects = [
  {
    id: 1,
    title: "Neural Voyager",
    category: "AI/ML",
    description:
      "Deep learning platform for real-time image classification and object detection using TensorFlow and PyTorch.",
    image: "/ai-neural-network.png",
    tech: ["Python", "TensorFlow", "PyTorch", "React", "FastAPI"],
    color: "#ff6b6b",
    type: "pulsar",
  },
  {
    id: 2,
    title: "Stellar Dashboard",
    category: "Web Development",
    description: "Real-time analytics dashboard with interactive data visualizations and collaborative features.",
    image: "/futuristic-dashboard.png",
    tech: ["Next.js", "TypeScript", "D3.js", "PostgreSQL", "WebSocket"],
    color: "#4ecdc4",
    type: "planet",
  },
  {
    id: 3,
    title: "Quantum Drone",
    category: "Robotics",
    description: "Autonomous drone navigation system with computer vision and real-time path planning.",
    image: "/futuristic-drone-technology.jpg",
    tech: ["ROS", "Python", "OpenCV", "SLAM", "C++"],
    color: "#45b7d1",
    type: "probe",
  },
  {
    id: 4,
    title: "Dark Matter Shield",
    category: "Cybersecurity",
    description: "AI-powered threat detection system with real-time monitoring and automated incident response.",
    image: "/cybersecurity-dark-interface.jpg",
    tech: ["Go", "Kubernetes", "Elasticsearch", "ML", "Grafana"],
    color: "#6c5ce7",
    type: "cloud",
  },
]

function CelestialObject({ type, color, isHovered }: { type: string; color: string; isHovered: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const { mouse } = useThree()

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.elapsedTime * 0.3
      meshRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.2) * 0.1
      meshRef.current.position.x = mouse.x * 0.3
      meshRef.current.position.y = mouse.y * 0.2
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <Sphere ref={meshRef} args={[1, 64, 64]}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={isHovered ? 0.4 : 0.2}
          speed={2}
          roughness={0.2}
          metalness={0.8}
          emissive={color}
          emissiveIntensity={isHovered ? 0.3 : 0.1}
        />
      </Sphere>
    </Float>
  )
}

function ProjectScene({ type, color, isHovered }: { type: string; color: string; isHovered: boolean }) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={1} color={color} />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color="#4060ff" />
      <CelestialObject type={type} color={color} isHovered={isHovered} />
    </>
  )
}

export function ProjectsSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })
  const [selectedProject, setSelectedProject] = useState<(typeof projects)[0] | null>(null)
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [selectedProject])

  return (
    <>
      <CosmicHazeDivider variant="orange" />
      <section id="projects" ref={containerRef} className="relative py-32 z-[5]">
        <div className="absolute inset-0 bg-cosmic-black/40 backdrop-blur-sm -z-10" />

        <div className="relative max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="text-cosmic-gold/60 text-sm tracking-[0.3em] uppercase">Mission Archive</span>
            <h2 className="text-4xl md:text-5xl font-bold text-cosmic-white mt-2">
              CELESTIAL <span className="text-gradient-red-gold animate-text-glow-gradient">CREATIONS</span>
            </h2>
          </motion.div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                onMouseEnter={() => setHoveredId(project.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => setSelectedProject(project)}
                className="group relative border border-cosmic-gold/20 rounded-2xl overflow-hidden bg-cosmic-black/50 backdrop-blur-xl cursor-pointer hover:border-cosmic-gold/40 transition-all duration-500"
              >
                {/* 3D Background */}
                <div className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity">
                  <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
                    <ProjectScene type={project.type} color={project.color} isHovered={hoveredId === project.id} />
                  </Canvas>
                </div>

                {/* Content */}
                <div className="relative p-8">
                  <div className="mb-4">
                    <span
                      className="text-xs tracking-wider px-3 py-1 rounded-full border"
                      style={{
                        color: project.color,
                        borderColor: project.color + "40",
                        backgroundColor: project.color + "10",
                      }}
                    >
                      {project.category}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-cosmic-white mb-3 group-hover:text-cosmic-gold transition-colors">
                    {project.title}
                  </h3>

                  <p className="text-cosmic-white/60 mb-6 line-clamp-2">{project.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {project.tech.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 text-xs font-mono text-cosmic-white/50 border border-cosmic-white/20 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.tech.length > 3 && (
                      <span className="px-2 py-1 text-xs font-mono text-cosmic-gold">+{project.tech.length - 3}</span>
                    )}
                  </div>
                </div>

                {/* Hover Effect */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at center, ${project.color}10 0%, transparent 70%)`,
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {selectedProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="fixed inset-0 flex items-start md:items-center justify-center p-4 pt-20 md:pt-4 bg-cosmic-black/98 backdrop-blur-xl overflow-y-auto"
              style={{ zIndex: 999999 }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 50 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-4xl bg-cosmic-deep border border-cosmic-gold/30 rounded-2xl overflow-hidden my-4"
                style={{ maxHeight: "calc(100vh - 120px)" }}
              >
                {/* Close Button - Fixed position */}
                <button
                  onClick={() => setSelectedProject(null)}
                  className="fixed md:absolute top-4 right-4 p-3 text-cosmic-white hover:text-cosmic-gold transition-colors bg-cosmic-black/90 rounded-full border border-cosmic-gold/30 hover:border-cosmic-gold/60"
                  style={{ zIndex: 1000000 }}
                >
                  <Cross2Icon size={24} />
                </button>

                <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 120px)" }}>
                  {/* 3D Header */}
                  <div className="h-40 md:h-56 relative">
                    <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
                      <ProjectScene type={selectedProject.type} color={selectedProject.color} isHovered={true} />
                    </Canvas>
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(to top, var(--cosmic-deep), transparent)`,
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6 md:p-8 -mt-8 md:-mt-12 relative">
                    <span
                      className="text-sm tracking-wider px-4 py-2 rounded-full border inline-block mb-4"
                      style={{
                        color: selectedProject.color,
                        borderColor: selectedProject.color + "40",
                        backgroundColor: selectedProject.color + "10",
                      }}
                    >
                      {selectedProject.category}
                    </span>

                    <h3 className="text-2xl md:text-3xl font-bold text-cosmic-white mb-4">{selectedProject.title}</h3>

                    <p className="text-cosmic-white/70 mb-6 leading-relaxed">{selectedProject.description}</p>

                    <div className="flex flex-wrap gap-2 mb-8">
                      {selectedProject.tech.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 text-sm font-mono text-cosmic-gold border border-cosmic-gold/30 rounded-full bg-cosmic-gold/5"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <motion.a
                        href="#"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-cosmic-gold text-cosmic-black font-semibold rounded-full"
                      >
                        <ExternalLink size={18} />
                        View Live
                      </motion.a>
                      <motion.a
                        href="#"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center justify-center gap-2 px-6 py-3 border border-cosmic-gold/50 text-cosmic-gold rounded-full"
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
    </>
  )
}

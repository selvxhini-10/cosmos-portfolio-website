"use client"

import { useRef, useState, useMemo } from "react"
import { motion, useInView } from "framer-motion"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Line, Html, Float } from "@react-three/drei"
import * as THREE from "three"
import { CosmicHazeDivider } from "./cosmic-haze-divider"

const skillNodes = [
  { id: "tf", name: "TensorFlow", color: "#ff6f00", position: [-2.5, 1.5, 0] as [number, number, number] },
  { id: "pytorch", name: "PyTorch", color: "#ee4c2c", position: [2.5, 2, 0] as [number, number, number] },
  { id: "react", name: "React", color: "#61dafb", position: [0, 2.5, 0] as [number, number, number] },
  { id: "node", name: "Node.js", color: "#68a063", position: [-2, -1.5, 0] as [number, number, number] },
  { id: "python", name: "Python", color: "#ffd43b", position: [2, -1.8, 0] as [number, number, number] },
  { id: "ts", name: "TypeScript", color: "#3178c6", position: [0, 0, 0] as [number, number, number] },
  { id: "aws", name: "AWS", color: "#ff9900", position: [-3, 0, 0] as [number, number, number] },
  { id: "docker", name: "Docker", color: "#2496ed", position: [3, 0, 0] as [number, number, number] },
]

const connections = [
  ["tf", "pytorch"],
  ["tf", "python"],
  ["pytorch", "python"],
  ["react", "ts"],
  ["react", "node"],
  ["node", "ts"],
  ["python", "aws"],
  ["node", "docker"],
  ["ts", "aws"],
  ["ts", "docker"],
  ["tf", "ts"],
  ["pytorch", "ts"],
]

function ConstellationNode({
  node,
  isHovered,
  onHover,
}: {
  node: (typeof skillNodes)[0]
  isHovered: boolean
  onHover: (id: string | null) => void
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const scale = isHovered ? 1.5 : 1
      meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1)
      meshRef.current.position.y = node.position[1] + Math.sin(clock.elapsedTime * 0.8 + node.position[0]) * 0.08
    }
    if (glowRef.current) {
      const glowScale = isHovered ? 3 : 2
      glowRef.current.scale.lerp(new THREE.Vector3(glowScale, glowScale, glowScale), 0.1)
      ;(glowRef.current.material as THREE.MeshBasicMaterial).opacity = isHovered
        ? 0.4 + Math.sin(clock.elapsedTime * 3) * 0.15
        : 0.2 + Math.sin(clock.elapsedTime * 2) * 0.1
    }
  })

  return (
    <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.2}>
      <group position={node.position}>
        {/* Outer glow */}
        <mesh ref={glowRef}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshBasicMaterial color={node.color} transparent opacity={0.2} blending={THREE.AdditiveBlending} />
        </mesh>

        {/* Core orb */}
        <mesh ref={meshRef} onPointerOver={() => onHover(node.id)} onPointerOut={() => onHover(null)}>
          <sphereGeometry args={[0.12, 32, 32]} />
          <meshBasicMaterial color={node.color} transparent opacity={isHovered ? 1 : 0.9} />
        </mesh>

        {/* Inner bright core */}
        <mesh scale={0.6}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
        </mesh>

        {isHovered && (
          <Html center distanceFactor={5}>
            <div className="px-3 py-1.5 bg-cosmic-black/95 border border-cosmic-gold/40 rounded-lg text-cosmic-white text-sm whitespace-nowrap backdrop-blur-sm">
              {node.name}
            </div>
          </Html>
        )}
      </group>
    </Float>
  )
}

function ConstellationConnections({ hoveredNode }: { hoveredNode: string | null }) {
  const linesRef = useRef<THREE.Group>(null)

  const lineData = useMemo(() => {
    return connections.map(([from, to]) => {
      const fromNode = skillNodes.find((n) => n.id === from)!
      const toNode = skillNodes.find((n) => n.id === to)!
      const isActive = hoveredNode === from || hoveredNode === to

      return {
        points: [fromNode.position, toNode.position] as [THREE.Vector3Tuple, THREE.Vector3Tuple],
        color: isActive ? "#ffb060" : "#ffffff",
        lineWidth: isActive ? 2.5 : 1,
        opacity: isActive ? 0.8 : 0.15,
      }
    })
  }, [hoveredNode])

  useFrame(({ clock }) => {
    if (linesRef.current) {
      linesRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.08) * 0.04
    }
  })

  return (
    <group ref={linesRef}>
      {lineData.map((line, i) => (
        <Line
          key={i}
          points={line.points}
          color={line.color}
          lineWidth={line.lineWidth}
          transparent
          opacity={line.opacity}
        />
      ))}
    </group>
  )
}

function ConstellationNetwork() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const groupRef = useRef<THREE.Group>(null)
  const { mouse } = useThree()

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = mouse.x * 0.15
      groupRef.current.rotation.x = mouse.y * 0.08
    }
  })

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={0.8} color="#ffb060" />
      <pointLight position={[-5, -5, 5]} intensity={0.4} color="#ff6040" />

      <ConstellationConnections hoveredNode={hoveredNode} />

      {skillNodes.map((node) => (
        <ConstellationNode key={node.id} node={node} isHovered={hoveredNode === node.id} onHover={setHoveredNode} />
      ))}
    </group>
  )
}

const skillCategories = [
  {
    title: "Frontend",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Three.js"],
  },
  {
    title: "Backend",
    skills: ["Node.js", "Python", "Go", "PostgreSQL", "Redis"],
  },
  {
    title: "AI/ML",
    skills: ["TensorFlow", "PyTorch", "Scikit-learn", "OpenCV", "NLP"],
  },
  {
    title: "DevOps",
    skills: ["Docker", "Kubernetes", "AWS", "CI/CD", "Terraform"],
  },
]

export function SkillsSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })

  return (
    <>
      <CosmicHazeDivider variant="gold" />
      <section id="skills" ref={containerRef} className="relative py-32 z-[1]">
        <div className="absolute inset-0 bg-cosmic-black/40 backdrop-blur-sm -z-10" />

        <div className="relative max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="text-cosmic-gold/60 text-sm tracking-[0.3em] uppercase">Neural Core</span>
            <h2 className="text-4xl md:text-5xl font-bold text-cosmic-white mt-2">
              TECH <span className="text-gradient-red-gold animate-text-glow-gradient">CONSTELLATION</span>
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* 3D Constellation Network */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="h-[500px] relative"
              style={{ willChange: 'opacity' }}
            >
              <Canvas 
                camera={{ position: [0, 0, 6], fov: 50 }}
                gl={{ antialias: false, powerPreference: "high-performance" }}
                dpr={[1, 1.5]}
              >
                <ConstellationNetwork />
              </Canvas>

              <div className="absolute bottom-4 left-4 right-4 text-center">
                <p className="text-cosmic-white/50 text-sm">Hover over nodes to explore connections</p>
              </div>
            </motion.div>

            {/* Skill Categories */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
              className="space-y-6"
              style={{ willChange: 'transform, opacity' }}
            >
              {skillCategories.map((category, index) => (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.05, ease: "easeOut" }}
                  className="p-6 border border-cosmic-gold/20 rounded-xl bg-cosmic-black/50 backdrop-blur-xl"
                  style={{ willChange: 'transform, opacity' }}
                >
                  <h3 className="text-lg font-semibold text-cosmic-gold mb-4">{category.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill) => (
                      <motion.span
                        key={skill}
                        whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 180, 100, 0.2)" }}
                        className="px-4 py-2 text-sm text-cosmic-white/80 border border-cosmic-white/20 rounded-full hover:border-cosmic-gold/50 transition-colors cursor-default"
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}

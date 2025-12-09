"use client"

import { motion } from "framer-motion"

interface CosmicHazeDividerProps {
  variant?: "orange" | "gold" | "red" | "mixed"
  className?: string
}

export function CosmicHazeDivider({ variant = "mixed", className = "" }: CosmicHazeDividerProps) {
  const gradients = {
    orange: "from-transparent via-orange-500/20 to-transparent",
    gold: "from-transparent via-amber-500/20 to-transparent",
    red: "from-transparent via-red-500/15 to-transparent",
    mixed: "from-red-500/10 via-orange-500/20 to-amber-500/10",
  }

  return (
    <div className={`relative h-32 w-full overflow-hidden ${className}`}>
      {/* Main gradient haze */}
      <motion.div
        animate={{
          opacity: [0.4, 0.7, 0.4],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        className={`absolute inset-0 bg-gradient-to-r ${gradients[variant]}`}
      />

      {/* Secondary glow layer */}
      <motion.div
        animate={{
          x: [-100, 100, -100],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/15 to-transparent blur-xl"
      />

      {/* Particle dust effect */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
              opacity: 0,
            }}
            animate={{
              y: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
            }}
            className="absolute w-1 h-1 bg-amber-400/50 rounded-full"
          />
        ))}
      </div>
    </div>
  )
}

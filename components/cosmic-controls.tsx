"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, EyeOff, Sparkles } from "lucide-react"

interface CosmicControlsProps {
  onToggleVisibility: (visible: boolean) => void
  onToggleIntensity: (intensity: number) => void
}

export function CosmicControls({ onToggleVisibility, onToggleIntensity }: CosmicControlsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [intensity, setIntensity] = useState(100)

  const handleToggleVisibility = () => {
    const newVisibility = !isVisible
    setIsVisible(newVisibility)
    onToggleVisibility(newVisibility)
  }

  const handleIntensityChange = (value: number) => {
    setIntensity(value)
    onToggleIntensity(value)
  }

  return (
    <div className="fixed bottom-6 right-6 z-[9998]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-16 right-0 w-64 p-4 rounded-xl bg-cosmic-black/80 backdrop-blur-md border border-cosmic-gold/30 shadow-[0_0_30px_rgba(255,140,80,0.3)]"
          >
            <h3 className="text-sm font-bold text-cosmic-gold mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Cosmic Background
            </h3>

            {/* Toggle Visibility */}
            <div className="mb-4">
              <button
                onClick={handleToggleVisibility}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-cosmic-gold/10 border border-cosmic-gold/30 hover:border-cosmic-gold/60 transition-colors"
              >
                <span className="text-sm text-cosmic-white">Visibility</span>
                <div className="flex items-center gap-2">
                  {isVisible ? (
                    <>
                      <Eye className="w-4 h-4 text-cosmic-gold" />
                      <span className="text-xs text-cosmic-gold">ON</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-4 h-4 text-cosmic-white/50" />
                      <span className="text-xs text-cosmic-white/50">OFF</span>
                    </>
                  )}
                </div>
              </button>
            </div>

            {/* Intensity Slider */}
            <div className="mb-2">
              <label className="text-xs text-cosmic-white/70 mb-2 block">
                Intensity: {intensity}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={intensity}
                onChange={(e) => handleIntensityChange(Number(e.target.value))}
                className="w-full h-2 bg-cosmic-gold/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cosmic-gold [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(255,140,80,0.8)]"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 border-2 border-white/40 shadow-[0_0_20px_rgba(255,140,80,0.6)] hover:shadow-[0_0_30px_rgba(255,140,80,0.9)] transition-shadow flex items-center justify-center group"
      >
        <Sparkles className="w-6 h-6 text-white group-hover:rotate-12 transition-transform" />
        
        {/* Pulsing glow */}
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 rounded-full bg-orange-400 -z-10"
        />
      </motion.button>
    </div>
  )
}

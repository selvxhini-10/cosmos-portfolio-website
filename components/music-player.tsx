"use client"

import { useEffect, useRef, useState } from "react"
import { Volume2, VolumeX } from "lucide-react"

const STORAGE_KEY = "cosmic-music-enabled"
const TARGET_VOLUME = 0.35

/**
 * Global ambient music toggle.
 * - Off by default (respects browser autoplay policies, no surprise audio).
 * - Audio uses preload="none" so the file is only fetched after the user opts in.
 * - Choice persists across pages via localStorage.
 * - Volume fades in/out to avoid jarring starts and stops.
 */
export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const fadeRef = useRef<number | null>(null)
  const [playing, setPlaying] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Restore saved preference — auto-play if user previously enabled music
    if (localStorage.getItem(STORAGE_KEY) === "true") {
      enable()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const clearFade = () => {
    if (fadeRef.current !== null) {
      window.clearInterval(fadeRef.current)
      fadeRef.current = null
    }
  }

  const fadeTo = (target: number, onDone?: () => void) => {
    const audio = audioRef.current
    if (!audio) return
    clearFade()
    fadeRef.current = window.setInterval(() => {
      const diff = target - audio.volume
      const step = 0.04
      if (Math.abs(diff) <= step) {
        audio.volume = target
        clearFade()
        onDone?.()
      } else {
        audio.volume = Math.max(0, Math.min(1, audio.volume + Math.sign(diff) * step))
      }
    }, 40)
  }

  const enable = async () => {
    const audio = audioRef.current
    if (!audio) return
    try {
      audio.volume = 0
      await audio.play()
      fadeTo(TARGET_VOLUME)
      setPlaying(true)
      localStorage.setItem(STORAGE_KEY, "true")
    } catch {
      // Autoplay may be blocked until a gesture; the click itself is the gesture,
      // so this rarely fails, but we guard against it silently.
      setPlaying(false)
    }
  }

  const disable = () => {
    const audio = audioRef.current
    if (!audio) return
    fadeTo(0, () => audio.pause())
    setPlaying(false)
    localStorage.setItem(STORAGE_KEY, "false")
  }

  const toggle = () => (playing ? disable() : enable())

  useEffect(() => {
    return () => clearFade()
  }, [])

  if (!mounted) return null

  return (
    <>
      <audio ref={audioRef} loop preload="none" src="/audio/interstellar-theme.mp3" />
      <button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? "Turn background music off" : "Turn background music on"}
        title={playing ? "Music: on" : "Music: off"}
        className="fixed bottom-6 left-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-cosmic-gold/40 bg-cosmic-black/70 text-cosmic-gold backdrop-blur-sm transition-all duration-300 hover:border-cosmic-gold hover:bg-cosmic-gold/15 hover:shadow-[0_0_24px_rgba(255,180,100,0.4)]"
      >
        {playing ? (
          <>
            <Volume2 className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 animate-pulse rounded-full bg-cosmic-gold" />
          </>
        ) : (
          <VolumeX className="h-5 w-5" />
        )}
        <span className="sr-only">{playing ? "Pause music" : "Play music"}</span>
      </button>
    </>
  )
}

export default MusicPlayer
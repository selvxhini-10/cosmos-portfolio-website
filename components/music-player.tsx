"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Volume2, VolumeX } from "lucide-react"

const STORAGE_KEY = "cosmic-music-enabled"
const TARGET_VOLUME = 0.35
const SRC = "/audio/interstellar-theme.mp3"

// ---------------------------------------------------------------------------
// Singleton helpers anchored on `window` so they survive module re-evaluation
// (HMR, dynamic-import chunk refresh, React Strict Mode double-mount, etc.).
// Module-level `let` variables reset whenever the JS chunk is re-parsed;
// `window.__cosmicAudio` does not — it lives for the entire browser-tab lifetime.
// ---------------------------------------------------------------------------

declare global {
  interface Window {
    __cosmicAudio?: HTMLAudioElement
    __cosmicFade?: ReturnType<typeof setInterval>
  }
}

function getAudio(): HTMLAudioElement {
  if (!window.__cosmicAudio) {
    const a = new Audio(SRC)
    a.loop = true
    a.volume = 0
    a.preload = "none"
    window.__cosmicAudio = a
  }
  return window.__cosmicAudio
}

function clearFade() {
  if (window.__cosmicFade != null) {
    clearInterval(window.__cosmicFade)
    window.__cosmicFade = undefined
  }
}

function fadeTo(target: number, onDone?: () => void) {
  const audio = getAudio()
  clearFade()
  window.__cosmicFade = setInterval(() => {
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

/**
 * Global ambient music toggle.
 * - Off by default (respects browser autoplay policies, no surprise audio).
 * - Audio singleton lives on `window` so navigation and module re-evaluation
 *   never restart or interrupt playback.
 * - Choice persists across pages and sessions via localStorage.
 * - Volume fades in/out to avoid jarring starts and stops.
 */
export function MusicPlayer() {
  const [playing, setPlaying] = useState(false)
  const [mounted, setMounted] = useState(false)
  const restoredRef = useRef(false)

  const enable = useCallback(async () => {
    const audio = getAudio()
    try {
      if (!audio.paused) {
        // Already playing from a previous page — just sync the button state.
        setPlaying(true)
        return
      }
      audio.volume = 0
      await audio.play()
      fadeTo(TARGET_VOLUME)
      setPlaying(true)
      localStorage.setItem(STORAGE_KEY, "true")
    } catch {
      setPlaying(false)
    }
  }, [])

  const disable = useCallback(() => {
    fadeTo(0, () => getAudio().pause())
    setPlaying(false)
    localStorage.setItem(STORAGE_KEY, "false")
  }, [])

  const toggle = useCallback(() => {
    playing ? disable() : enable()
  }, [playing, enable, disable])

  useEffect(() => {
    setMounted(true)

    // Sync button with actual audio state on every mount (page navigation).
    const audio = getAudio()
    if (!audio.paused) {
      setPlaying(true)
      return
    }

    // Restore saved preference once per browser session.
    if (!restoredRef.current) {
      restoredRef.current = true
      if (localStorage.getItem(STORAGE_KEY) === "true") {
        enable()
      }
    }

    return () => {
      // Cancel any in-flight fade on unmount so it doesn't race the next mount.
      // Do NOT pause — continuous playback across navigations is the whole point.
      clearFade()
    }
  }, [enable])

  if (!mounted) return null

  return (
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
  )
}

export default MusicPlayer
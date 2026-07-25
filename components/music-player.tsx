"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Volume2, VolumeX } from "lucide-react"

const STORAGE_KEY = "cosmic-music-enabled"
const TARGET_VOLUME = 0.35
const SRC = "/audio/interstellar-theme.mp3"

/**
 * Module-level singleton audio element so it survives Next.js App Router
 * client-side navigations. React re-mounts components on route change but
 * module scope persists for the lifetime of the browser tab.
 */
let _audio: HTMLAudioElement | null = null
let _fadeInterval: ReturnType<typeof setInterval> | null = null

function getAudio(): HTMLAudioElement {
  if (!_audio) {
    _audio = new Audio(SRC)
    _audio.loop = true
    _audio.volume = 0
    _audio.preload = "none"
  }
  return _audio
}

function clearFade() {
  if (_fadeInterval !== null) {
    clearInterval(_fadeInterval)
    _fadeInterval = null
  }
}

function fadeTo(target: number, onDone?: () => void) {
  const audio = getAudio()
  clearFade()
  _fadeInterval = setInterval(() => {
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
 * - Singleton <Audio> node lives outside React so navigation never mutes it.
 * - Choice persists across pages and sessions via localStorage.
 * - Volume fades in/out to avoid jarring starts and stops.
 */
export function MusicPlayer() {
  const [playing, setPlaying] = useState(false)
  const [mounted, setMounted] = useState(false)
  // Track whether we've already attempted autoplay restore this session
  const restoredRef = useRef(false)

  const enable = useCallback(async () => {
    const audio = getAudio()
    try {
      // If already playing (e.g. navigated back), just sync UI state
      if (!audio.paused) {
        setPlaying(true)
        return
      }
      audio.volume = 0
      await audio.play()
      fadeTo(TARGET_VOLUME)
      setPlaying(true)
      localStorage.setItem(STORAGE_KEY, "true")
    } catch {
      // Autoplay blocked — user must interact first. The button click is a
      // valid gesture so this only fails on the very first auto-restore attempt.
      setPlaying(false)
    }
  }, [])

  const disable = useCallback(() => {
    const audio = getAudio()
    fadeTo(0, () => audio.pause())
    setPlaying(false)
    localStorage.setItem(STORAGE_KEY, "false")
  }, [])

  const toggle = useCallback(() => {
    playing ? disable() : enable()
  }, [playing, enable, disable])

  useEffect(() => {
    setMounted(true)

    // Sync UI with the singleton audio in case we navigated here mid-play
    const audio = getAudio()
    if (!audio.paused) {
      setPlaying(true)
      return
    }

    // Restore saved preference on first mount only
    if (!restoredRef.current) {
      restoredRef.current = true
      if (localStorage.getItem(STORAGE_KEY) === "true") {
        enable()
      }
    }

    return () => {
      // Do NOT pause on unmount — that's the whole point. Just cancel any
      // in-flight fade so it doesn't race with the next mount's fade.
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
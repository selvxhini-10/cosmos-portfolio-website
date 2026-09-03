"use client"

import { Github, Linkedin, Mail, ChevronDown } from "lucide-react"
import { CosmicBackground } from "@/components/cosmic-background"
import { GravitationalLensText } from "@/components/gravitational-lens-text"
import { HudTrigger } from "@/components/hud-overlay"
import { InteractiveAsteroids3D } from "@/components/interactive-asteroids"
import { ScannerSweep } from "@/components/scanner-sweep"
import dynamic from "next/dynamic"

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col bg-cosmic-black overflow-hidden"
    >
      {/* ── Background stack, bottom → top ──────────────────────────────── */}
      <div className="absolute inset-0 w-full h-full overflow-hidden" style={{ zIndex: 0 }}>
        {/* 1. Starfield */}
        <CosmicBackground />

        {/* 2. Dimming overlays — sit directly on the starfield so text stays
               legible, but BELOW the asteroid layer so asteroids don't get
               washed out by them */}
        <div className="absolute inset-0 bg-cosmic-black/50" />
        {/* Reaches fully solid black by ~80% down the section (not just at the
            very last pixel), so there's no visible seam against the next
            section's flat background — pure CSS, no extra render cost */}
        <div className="absolute inset-0 bg-gradient-to-b from-cosmic-black/70 via-transparent via-[60%] to-cosmic-black to-[85%]" />

        {/* 3. Breakable asteroid field — rendered last in this stack so it
               paints on top of the dimming layers and stays crisp/clickable */}
        <InteractiveAsteroids3D />
      </div>

      {/* ── Foreground content ──────────────────────────────────────────── */}
      {/* pointer-events-none on the wrapper lets clicks/hover fall through to
          the asteroid canvas in empty space; re-enabled per interactive
          child below so buttons/links/badge still work normally */}
      <div className="relative z-10 flex-1 flex flex-col px-6 max-w-6xl mx-auto w-full pointer-events-none">
        {/* Availability Badge — hover to open the HUD readout */}
        <div className="pt-28 md:pt-32 flex justify-center pointer-events-auto">
          <HudTrigger
  readout={[
    { label: "Status", value: "Active" },
    { label: "Role sought", value: "SWE Intern" },
    { label: "Availability", value: "May – Aug 2026" },
    { label: "Location", value: "Waterloo, ON" },
    { type: "bar", label: "Uplink", level: 0.9 },
  ]}
>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-cosmic-gold bg-cosmic-gold/10">
              <span className="w-2 h-2 rounded-full bg-cosmic-gold animate-pulse" />
              <span className="text-cosmic-gold text-sm tracking-wide">
                Seeking Summer 2026 Opportunities
              </span>
            </div>
          </HudTrigger>
        </div>

        {/* Center Content */}
        <div className="flex-1 flex flex-col justify-center items-center text-center py-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight leading-[1.1] max-w-5xl">
            <GravitationalLensText className="block mb-2 text-cosmic-white uppercase tracking-[0.15em]">
              {"Hi, I'm"}
            </GravitationalLensText>
            <GravitationalLensText gradient className="block tracking-wide whitespace-nowrap">
              Selvahini Kamalarajan
            </GravitationalLensText>
          </h1>

          <p className="text-lg md:text-xl lg:text-2xl font-bold text-cosmic-gold mb-6 tracking-wide">
            Computer Engineering @ University of Waterloo
          </p>

          <p className="text-sm md:text-base lg:text-lg text-cosmic-white/80 mb-10 max-w-3xl leading-relaxed px-4">
            Delivering human-centered solutions and user-friendly experiences.
          </p>

          {/* CTAs — pure CSS transitions, zero JS overhead */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10 pointer-events-auto">
            <a
              href="#projects"
              className="px-8 py-4 rounded-full font-bold uppercase text-sm tracking-wider bg-gradient-to-r from-cosmic-gold to-cosmic-orange text-cosmic-black transition-all duration-200 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,180,100,0.5)] active:scale-95"
              style={{ willChange: "transform" }}
            >
              View My Work
            </a>
            <a
              href="/contact"
              className="px-8 py-4 rounded-full font-bold uppercase text-sm tracking-wider border-2 border-cosmic-gold text-cosmic-gold bg-cosmic-black/60 transition-all duration-200 hover:scale-105 hover:bg-cosmic-gold/15 hover:shadow-[0_0_30px_rgba(255,180,100,0.35)] active:scale-95"
              style={{ willChange: "transform" }}
            >
              Get In Touch
            </a>
          </div>

          {/* Social Icons */}
          <div className="flex gap-5 justify-center pointer-events-auto">
            {[
              { icon: Github, href: "https://github.com/selvxhini-10", label: "GitHub" },
              { icon: Linkedin, href: "https://www.linkedin.com/in/selvahini-kamalarajan/", label: "LinkedIn" },
              { icon: Mail, href: "mailto:s5kamala@uwaterloo.ca", label: "Email" },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-14 h-14 flex items-center justify-center rounded-full border-2 border-cosmic-gold text-cosmic-gold bg-cosmic-black/60 hover:bg-cosmic-gold/20 transition-colors"
              >
                <Icon className="w-6 h-6" />
              </a>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="pb-8 flex justify-center">
          <div className="flex flex-col items-center gap-2 text-cosmic-white/70">
            <span className="text-xs tracking-[0.3em] uppercase">
              Scroll to Explore
            </span>
            <ChevronDown className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* HUD scan sweep — passes over the whole hero, background and text alike */}
      <ScannerSweep />
    </section>
  )
}
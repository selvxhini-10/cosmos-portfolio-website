"use client"

import { useState } from "react"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { ExperienceSection } from "@/components/experience-section"
import { ProjectsSection } from "@/components/projects-section"
import { SkillsSection } from "@/components/skills-section"
import { LeadershipSection } from "@/components/leadership-section"
import { BlogSection } from "@/components/blog-section"
import { ContactSection } from "@/components/contact-section"
import { Navigation } from "@/components/navigation"
import { CosmicBackground } from "@/components/cosmic-background"
import { CosmicControls } from "@/components/cosmic-controls"
import { SmoothScroll } from "@/components/smooth-scroll"
import { Footer } from "@/components/footer"

export default function Home() {
  const [cosmicVisible, setCosmicVisible] = useState(true)
  const [cosmicIntensity, setCosmicIntensity] = useState(100)

  return (
      <main className="relative min-h-screen overflow-x-hidden">

        {/* Content Layer */}
        <div className="relative z-10">
          <Navigation />
          <HeroSection />
          <AboutSection />
          <SkillsSection />
          <ProjectsSection />
          <ExperienceSection />
          <LeadershipSection />
          <BlogSection />
          <ContactSection />
          <Footer />
        </div>

        {/* Controls Layer - always on top */}
      </main>
  )
}

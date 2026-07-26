"use client"

import { HeroSection }      from "@/components/hero-section"
import { AboutSection }     from "@/components/about-section"
import { ExperienceSection } from "@/components/experience-section"
import { ProjectsSection }  from "@/components/projects-section"
import { SkillsSection }    from "@/components/skills-section"
import { NeuralSection }    from "@/components/neural-section"
import { LeadershipSection } from "@/components/leadership-section"
import { BlogSection }      from "@/components/blog-section"
import { Navigation }       from "@/components/navigation"
import { Footer }           from "@/components/footer"

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div className="relative z-10">
        <Navigation />
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <NeuralSection />
        <ProjectsSection />
        <ExperienceSection />
        <LeadershipSection />
        <BlogSection />
        <Footer />
      </div>
    </main>
  )
}
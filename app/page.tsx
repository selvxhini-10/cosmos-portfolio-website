import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { ExperienceSection } from "@/components/experience-section"
import { ProjectsSection } from "@/components/projects-section"
import { SkillsSection } from "@/components/skills-section"
import { ContactSection } from "@/components/contact-section"
import { Navigation } from "@/components/navigation"
import { CosmicBackground } from "@/components/cosmic-background"
import { SmoothScroll } from "@/components/smooth-scroll"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <SmoothScroll>
      <main className="relative min-h-screen overflow-x-hidden">
        <CosmicBackground />
        <Navigation />
        <HeroSection />
        <AboutSection />
        <ExperienceSection />
        <ProjectsSection />
        <SkillsSection />
        <ContactSection />
        <Footer />
      </main>
    </SmoothScroll>
  )
}

"use client"

import { useRef, useState } from "react"
import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component"
import "react-vertical-timeline-component/style.min.css"

const experiences = [
  {
    id: 1,
    title: "AI Developer",
    company_name: "Information Systems & Technology, University of Waterloo",
    date: "Sep. 2025 - Dec. 2025",
    icon: "/images/uw.svg",
    skills: [".NET/C#", "Azure OpenAI", "Cosmos DB", "Azure AI Search"],
    points: [
      "Deployed Azure Functions–based RAG pipelines and AI chatbots supporting 10,500+ campus documents in production testing",
      "Architected an agentic platform using Semantic Kernel and Microsoft Agent Framework for 3+ agents",
      "Built Jira Service Management automation pipeline to post internal AI-generated comments on tickets and stream user feedback to Azure Cosmos DB",
    ],
  },
  {
    id: 2,
    title: "Engineering Outreach Facilitator",
    company_name: "Engineering Outreach, University of Waterloo",
    date: "Jan. 2025 - Apr. 2025",
    icon: "/images/wie.png",
    skills: ["AI/ML", "Arduino", "Robotics", "Circuitry"],
    points: [
      "Delivered 50+ hands-on Women in Engineering workshops to 1300+ students across Ontario",
      "Trained and embedded a Teachable Machine model with TensorFlow.js for real-time sign language detection on a responsive web platform",
      "Developed 60% more innovative STEM outreach content by integrating Tinkercad, SketchUp, Scratch Coding, Arduino, Micro:bits and Ozobots",
    ],
  },
  {
    id: 3,
    title: "Fullstack Developer",
    company_name: "BrandEQ Group",
    date: "Jul. 2022 - Sep. 2022",
    icon: "/images/brandeq.jpeg",
    skills: ["Fullstack", "Supabase", "Flutter"],
    points: [
      "Enhanced SEO by implementing WCAG 2.0 accessibility standards, PR backlinking and UX/UI design with WordPress and JavaScript",
      "Designed a fullstack mobile application for iOS and Android using Flutter and Supabase",
      "Improved mobile optimization by 60% by redesigning 25+ websites and applications",
    ],
  },
]

const ExperienceCard = ({ experience }: { experience: typeof experiences[0] }) => (
  <VerticalTimelineElement
    contentStyle={{
      background: "linear-gradient(180deg, rgba(255,140,80,0.08), rgba(0,0,0,0.92))",
      color: "#fff",
      border: "1px solid rgba(255,140,80,0.35)",
      boxShadow: "0 0 0 1px rgba(255,140,80,0.15), 0 10px 40px rgba(255,90,40,0.15)",
      backdropFilter: "blur(8px)",
      borderRadius: "14px",
    }}
    contentArrowStyle={{ borderRight: "7px solid rgba(255,140,80,0.6)" }}
    date={experience.date}
    iconStyle={{
      background: "radial-gradient(circle at 30% 30%, #ffb347, #ff6a00)",
      boxShadow: "0 0 25px rgba(255,140,80,0.9)",
    }}
    icon={
      <div className="flex justify-center items-center w-full h-full">
        <img src={experience.icon} alt={experience.company_name} className="w-full h-full object-cover rounded-full" />
      </div>
    }
  >
    <div className="mb-2">
      <h3 className="text-xl font-bold text-cosmic-gold leading-tight">{experience.title}</h3>
      <p className="text-cosmic-orange text-sm font-medium mt-1">{experience.company_name}</p>
    </div>

    <div className="flex flex-wrap gap-2 mt-3">
      {experience.skills.map((skill) => (
        <span key={skill} className="text-xs font-mono px-3 py-1 rounded-full border border-orange-400/40 bg-orange-500/10 text-orange-300">
          {skill}
        </span>
      ))}
    </div>

    <ul className="mt-5 list-disc ml-5 space-y-2">
      {experience.points.map((point, i) => (
        <li key={i} className="text-cosmic-white/80 text-sm leading-relaxed">{point}</li>
      ))}
    </ul>

    <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-60" />
  </VerticalTimelineElement>
)

export function ExperienceSection() {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  const onRef = (el: HTMLElement | null) => {
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.05 }
    )
    obs.observe(el)
  }

  return (
    <section
      id="experience"
      ref={(el) => { (ref as React.MutableRefObject<HTMLElement | null>).current = el; onRef(el) }}
      className="relative z-[1] py-24"
    >
      <div className="relative max-w-7xl mx-auto px-6">
        <div
          className="text-center mb-16 transition-all duration-500 ease-out"
          style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(24px)" }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-cosmic-white">
            WORK <span className="text-gradient-red-gold">EXPERIENCE</span>
          </h2>
        </div>

        <div
          className="transition-all duration-600 ease-out"
          style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(32px)", transitionDelay: "100ms" }}
        >
          <VerticalTimeline>
            {experiences.map((exp, i) => (
              <ExperienceCard key={i} experience={exp} />
            ))}
          </VerticalTimeline>
        </div>
      </div>
    </section>
  )
}

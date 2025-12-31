"use client"
import { useRef} from "react"
import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component"
import { motion, useInView } from "framer-motion"


import "react-vertical-timeline-component/style.min.css"

const ExperienceCard = ({ experience }: { experience: any }) => (
  <VerticalTimelineElement
    contentStyle={{
      background: "linear-gradient(180deg, rgba(255,140,80,0.08), rgba(0,0,0,0.92))",
      color: "#fff",
      border: "1px solid rgba(255,140,80,0.35)",
      boxShadow:
        "0 0 0 1px rgba(255,140,80,0.15), 0 10px 40px rgba(255,90,40,0.15)",
      backdropFilter: "blur(8px)",
      borderRadius: "14px",
    }}
    contentArrowStyle={{
      borderRight: "7px solid rgba(255,140,80,0.6)",
      filter: "drop-shadow(0 0 6px rgba(255,140,80,0.6))",
    }}
    date={experience.date}
    iconStyle={{
      background: "radial-gradient(circle at 30% 30%, #ffb347, #ff6a00)",
      boxShadow: "0 0 25px rgba(255,140,80,0.9)",
    }}
    icon={
      <div className="flex justify-center items-center w-full h-full">
        <img
          src={experience.icon || "/placeholder.svg"}
          alt={experience.company_name}
          className="w-full h-full object-cover rounded-full"
        />
      </div>
    }
  >
    {/* Header */}
    <div className="mb-2">
      <h3 className="text-[22px] font-bold text-cosmic-gold leading-tight">
        {experience.title}
      </h3>
      <p className="text-cosmic-orange text-sm font-medium mt-1">
        {experience.company_name}
      </p>
    </div>

    {/* Skill Chips */}
    <div className="flex flex-wrap gap-2 mt-3">
      {experience.skills.map((skill: string, index: number) => (
        <span
          key={index}
          className="
            text-xs font-mono px-3 py-1 rounded-full
            border border-orange-400/40
            bg-orange-500/10
            text-orange-300
            shadow-[0_0_12px_rgba(255,140,80,0.25)]
          "
        >
          {skill}
        </span>
      ))}
    </div>

    {/* Description */}
    <ul className="mt-5 list-disc ml-5 space-y-2">
      {experience.points.map((point: string, index: number) => (
        <li
          key={`experience-point-${index}`}
          className="text-cosmic-white/80 text-[14px] leading-relaxed"
        >
          {point}
        </li>
      ))}
    </ul>

    {/* Bottom Plasma Line */}
    <div className="mt-6 h-[2px] w-full bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-70 shadow-[0_0_8px_rgba(255,140,80,0.6)]" />
  </VerticalTimelineElement>
)


const experiences = [
  {
    id: 1,
    title: "AI Developer",
    company_name: "Information Systems & Technology, University of Waterloo",
    date: "Sep. 2025 - Dec. 2025",
    icon: "/images/uw.svg",
    iconBg: "#ff6347",
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
    iconBg: "#ff8c00",
    skills: ["AI/ML", "Arduino", "Robotics", "Circuitry"],
    points: [
      "Delivered 50+ hands-on Women in Engineering workshops to 1300+ students across Ontario",
     "Trained and embedded a Teachable Machine model with TensorFlow.js for real-time sign language detection on a responsive web platform",
      "Developed 60% more innovative STEM outreach content, as measured against Ontario education standards, by integrating Tinkercad, SketchUp, Scratch Coding, Arduino, Micro:bits and Ozobots",
    ]
  },
  {
    id: 3,
    title: "Fullstack Developer",
    company_name: "BrandEQ Group",
    date: "Jul. 2022 - Sep. 2022",
    icon: "/images/brandeq.jpeg",
    iconBg: "#ffa500",
    skills: ["Fullstack", "Supabase", "Flutter"],
    points: [
      "Enhanced SEO by implementing WCAG 2.0 accessibility standards, PR backlinking and UX/UI design with WordPress and JavaScript",
      "Designed a fullstack mobile application for iOS and Android using Flutter and Supabase",
      "Improved mobile optimization by 60%, as endorsed by client feedback, by redesigning 25+ websites and applications",
    ],
  },
]

export function ExperienceSection() {
   const containerRef = useRef<HTMLDivElement>(null)
    const isInView = useInView(containerRef, { once: true, margin: "-100px" })
  return (
    <>
       <section id="experience" ref={containerRef} className="relative z-[1]">
        <div className="absolute inset-0 bg-cosmic-black/40 -z-10" />
        <div className="relative max-w-7xl mx-auto px-6">
             {/* Section Header */}
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.8 }}
                      className="text-center mb-16"
                    >
                      <h2 className="text-4xl md:text-5xl font-bold text-cosmic-white">
                        WORK <span className="text-gradient-red-gold animate-text-glow-gradient">EXPERIENCE</span>
                      </h2>
                    </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="mt-14 flex flex-col">
              <VerticalTimeline>
                {experiences.map((experience, index) => (
                  <ExperienceCard key={index} experience={experience} />
                ))}
              </VerticalTimeline>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}

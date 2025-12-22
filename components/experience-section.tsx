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
    date: "Sep. 2022 - Jun. 2024",
    icon: "/images/clc.png",
    iconBg: "#ff6347",
    skills: ["Innovation", "Leadership", "Project Management"],
    points: [
      "Led cross-functional teams to build an informative website about Fast Fashion using HTML, CSS, JavaScript and Bootstrap",
      "Designed and proposed a safety application prototype using Marvel to combat youth violence and improve emergency preparedness",
      "Facilitated end-to-end project management using Kanban boards, overseeing ideation and developing workflows to ensure timely completion.",
    ],
  },
  {
    id: 2,
    title: "Engineering Outreach Facilitator",
    company_name: "Engineering Outreach, University of Waterloo",
    date: "Jan. 2025 - Apr. 2025",
    icon: "/images/wie.png",
    iconBg: "#ff8c00",
    skills: ["Technological Agility", "Implementation", "Critical Thinking"],
    points: [
      "Delivered 50+ hands-on Women in Engineering workshops to 1300+ students across Ontario, leveraging my strong communication and organizational skills",
      "Developed robotics, AI and programming challenges using LEGO Spike Primes, Teachable Machine, Arduino, Micro:bits, and Ozobots, increasing STEM participation",
      "Implemented documentation, budgets and oral presentations using Ontario education standards, developing 60% more innovative STEM outreach content.",
      "Debugged and troubleshooted electronic devices, circuitry and coding projects, including an AI-powered sign language detection site and Arduino clinostat to simulate microgravity.",
    ],
  },
  {
    id: 3,
    title: "Fullstack Web Developer",
    company_name: "BrandEQ Group",
    date: "Jul. 2022 - Sep. 2022",
    icon: "/images/brandeq.jpeg",
    iconBg: "#ffa500",
    skills: ["Collaboration", "Problem-Solving", "Communication"],
    points: [
      "Enhanced SEO by implementing WCAG 2.0 accessibility standards, PR backlinking, responsive web design and architecture using Editor X, WordPress and JavaScript",
      "Developed and pitched website prototypes using MS Office tools and agile methodologies to improve user interaction, receiving endorsement from national brands",
      "Improved user experience, accessibility and mobile optimization by 60% by leading web development team to redesign and monitor 25+ client websites and software applications",
    ],
  },
]

export function ExperienceSection() {
   const containerRef = useRef<HTMLDivElement>(null)
    const isInView = useInView(containerRef, { once: true, margin: "-100px" })
  return (
    <>
       <section id="experience" ref={containerRef} className="relative z-[1]">
        <div className="absolute inset-0 bg-cosmic-black/40 backdrop-blur-sm -z-10" />
        <div className="relative max-w-7xl mx-auto px-6">
             {/* Section Header */}
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.8 }}
                      className="text-center mb-16"
                    >
                      <span className="text-cosmic-gold/60 text-sm tracking-[0.3em] uppercase">Neural Core</span>
                      <h2 className="text-4xl md:text-5xl font-bold text-cosmic-white mt-2">
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

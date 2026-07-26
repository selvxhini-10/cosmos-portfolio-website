"use client"

import { Github, Linkedin, Mail } from "lucide-react"

const socialLinks = [
  { icon: Github,   href: "https://github.com/selvxhini-10",                        label: "GitHub" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/selvahini-kamalarajan/",     label: "LinkedIn" },
  { icon: Mail,     href: "mailto:s5kamala@uwaterloo.ca",                           label: "Email" },
]

export function Footer() {
  return (
    <footer className="relative z-[1] border-t border-cosmic-gold/20 bg-cosmic-black/70">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          <span className="text-xl font-bold bg-gradient-to-r from-[#ff4136] via-[#ffb460] to-[#ff851b] bg-clip-text text-transparent">
            Selvahini Kamalarajan
          </span>

          <div className="flex gap-4">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-11 h-11 rounded-full flex items-center justify-center border-2 border-cosmic-gold/40 bg-cosmic-black text-cosmic-gold hover:border-cosmic-gold hover:bg-cosmic-gold/10 transition-colors duration-150"
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>

          <p className="text-cosmic-white/60 text-sm tracking-wider">
            © {new Date().getFullYear()} ALL RIGHTS RESERVED
          </p>
        </div>
      </div>
    </footer>
  )
}

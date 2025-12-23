"use client"

import { motion } from "framer-motion"
import { Github, Linkedin, Mail } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    { icon: Github, href: "https://github.com/selvxhini-10", label: "GitHub" },
    { icon: Linkedin, href: "https://www.linkedin.com/in/selvahini-kamalarajan/", label: "LinkedIn" },
    { icon: Mail, href: "mailto:s5kamala@uwaterloo.ca", label: "Email" },
  ]

  return (
    <footer className="relative z-[1] border-t border-cosmic-gold/20 bg-cosmic-black/70">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="text-xl font-bold"
          >
            <span className="bg-gradient-to-r from-[#ff4136] via-[#ffb460] to-[#ff851b] bg-clip-text text-transparent">
              Selvahini Kamalarajan
            </span>
          </motion.div>

          {/* Social Links */}
          <div className="flex gap-4">
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.label}
                href={social.href}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.2, ease: "easeOut" }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className="
                  w-11 h-11 rounded-full
                  flex items-center justify-center
                  border-2 border-cosmic-gold/40
                  bg-cosmic-black
                  text-cosmic-gold
                  transition-colors duration-150
                  hover:border-cosmic-gold
                  hover:bg-cosmic-gold/10
                "
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5" />
              </motion.a>
            ))}
          </div>

          {/* Copyright */}
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="text-cosmic-white/80 text-sm tracking-wider"
          >
            © {currentYear} ALL RIGHTS RESERVED
          </motion.p>
        </div>
      </div>
    </footer>
  )
}

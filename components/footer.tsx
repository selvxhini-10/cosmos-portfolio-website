"use client"

import { motion } from "framer-motion"
import { Github, Linkedin, Twitter, Sparkles, Mail } from "lucide-react"
import { EnvelopeClosedIcon } from "@radix-ui/react-icons"

export function Footer() {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Mail, href: "#contact", label: "Email" },
  ]

  return (
    <footer className="relative z-20 border-t border-cosmic-gold/20 bg-cosmic-black/60 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 text-xl font-bold text-cosmic-gold"
          >
            <Sparkles className="w-5 h-5" />
            <span>PORTFOLIO</span>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex gap-4"
          >
            {socialLinks.map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                whileHover={{ scale: 1.1, y: -3 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-full border border-cosmic-gold/40 flex items-center justify-center text-cosmic-gold hover:bg-cosmic-gold/10 hover:border-cosmic-gold transition-all duration-300"
                aria-label={social.label}
              >
                <social.icon className="w-4 h-4" />
              </motion.a>
            ))}
          </motion.div>

          {/* Copyright */}
          <motion.p
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-cosmic-white/50 text-sm tracking-wider"
          >
            © {currentYear} ALL RIGHTS RESERVED
          </motion.p>
        </div>
      </div>
    </footer>
  )
}

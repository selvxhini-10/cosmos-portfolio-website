"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, Sparkles } from "lucide-react"
import { Cross2Icon } from "@radix-ui/react-icons"

const navItems = [
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Experience", href: "#experience" },
  { name: "Projects", href: "#projects" },
  { name: "Blog", href: "#blog" },
]

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMobileMenuOpen])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-500 ${
        isScrolled ? "bg-cosmic-black/90 backdrop-blur-xl border-b border-cosmic-gold/20" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        {/* Three-Section Flex Layout */}
        <div className="flex items-center justify-between gap-4">
          {/* Left Section: Logo */}
          <motion.a
            href="/"
            className="flex items-center gap-2 text-xl md:text-2xl font-bold tracking-wider text-cosmic-gold flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Sparkles className="w-5 h-5 md:w-6 md:h-6" />
            <span className="hidden sm:inline">Selvahini</span>
            <span className="sm:hidden">SK</span>
          </motion.a>

          {/* Center Section: Navigation Links */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 flex-shrink-0">
            {navItems.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative text-cosmic-white/70 hover:text-cosmic-gold transition-all duration-300 text-xs lg:text-sm tracking-widest uppercase group whitespace-nowrap"
                whileHover={{ scale: 1.05 }}
              >
                <span className="group-hover:drop-shadow-[0_0_10px_rgba(255,180,100,0.8)]">{item.name}</span>
              </motion.a>
            ))}
          </div>

          {/* Right Section: Contact Button */}
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hidden md:flex items-center px-4 lg:px-6 py-2 border border-cosmic-gold/50 text-cosmic-gold hover:bg-cosmic-gold/10 rounded-full text-xs lg:text-sm font-semibold tracking-wider uppercase transition-colors flex-shrink-0"
          >
            Contact
          </motion.a>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-cosmic-white p-2 flex-shrink-0">
            {isMobileMenuOpen ? <Cross2Icon className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Full-Screen Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 top-[72px] md:hidden bg-cosmic-black/98 backdrop-blur-xl overflow-y-auto"
            style={{ zIndex: 9998 }}
          >
            <div className="flex flex-col items-center justify-center min-h-full px-6 py-12 gap-8">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-cosmic-white/90 hover:text-cosmic-gold transition-colors duration-300 text-2xl tracking-widest uppercase font-bold"
                >
                  {item.name}
                </motion.a>
              ))}
              <motion.a
                href="#contact"
                onClick={() => setIsMobileMenuOpen(false)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navItems.length * 0.1 }}
                className="mt-8 px-8 py-4 border-2 border-cosmic-gold text-cosmic-gold hover:bg-cosmic-gold/10 rounded-full text-lg font-bold tracking-wider uppercase transition-colors"
              >
                Contact
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

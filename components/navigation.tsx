"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"

const navItems = [
  { name: "About", href: "/home/#about" },
  { name: "Skills", href: "/home/#skills" },
  { name: "Projects", href: "/home/#projects" },
  { name: "Experience", href: "/home/#experience" },
  { name: "Blog", href: "/blog" },
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

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <motion.nav
  initial={{ y: -60 }}
  animate={{ y: 0 }}
  transition={{ duration: 0.25, ease: "easeOut" }}
  className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-300 ${
    isScrolled
      ? "bg-cosmic-black/90 border-b border-cosmic-gold/20"
      : "bg-transparent"
  }`}
>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3 sm:py-4">
        {/* Desktop & Tablet Layout */}
        <div className="flex items-center justify-between lg:grid lg:grid-cols-3 gap-4">
          {/* Left: Logo */}
          <motion.a
            href="/home"
            className="text-sm sm:text-base lg:text-lg font-bold tracking-wider text-cosmic-gold justify-self-start z-[10001]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ letterSpacing: '0.08em' }}
          >
            {/* Show only SK on mobile, full name on larger screens */}
            <span className="block sm:hidden">SK</span>
            <span className="hidden sm:block lg:hidden">Selvahini K.</span>
            <span className="hidden lg:block bg-gradient-to-r from-[#ff4136] via-[#ffb460] to-[#ff851b] bg-clip-text text-transparent">Selvahini Kamalarajan</span>
      
          </motion.a>

          {/* Center: Navigation Links - Hidden below lg */}
          <div className="hidden lg:flex items-center justify-center gap-6 xl:gap-8">
  {navItems.map((item) => (
    <a
      key={item.name}
      href={item.href}
      className="relative text-cosmic-white hover:text-cosmic-gold transition-colors duration-200 text-xs xl:text-sm tracking-widest uppercase whitespace-nowrap"
      style={{ letterSpacing: "0.15em" }}
    >
      {item.name}
    </a>
  ))}
</div>


          {/* Right: Contact Button & Mobile Menu */}
          <div className="flex items-center justify-end gap-3">
            <motion.a
              href="/contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden lg:flex items-center px-4 xl:px-6 py-2 bg-transparent text-cosmic-gold hover:bg-cosmic-gold/10 rounded-full text-xs xl:text-sm font-semibold tracking-wider uppercase transition-colors border-2 border-cosmic-gold"
              style={{
                boxShadow: '0 0 25px rgba(255,180,100,0.5), 0 0 50px rgba(255,180,100,0.2), inset 0 0 20px rgba(255,180,100,0.08)',
                letterSpacing: '0.1em'
              }}
            >
              Contact
            </motion.a>

            {/* Mobile Menu Button */}
            <button 
              onClick={handleMobileMenuToggle}
              className="lg:hidden text-cosmic-gold p-2 rounded-lg border-2 border-cosmic-gold bg-cosmic-black/50 z-[10001]"
              style={{
                boxShadow: '0 0 20px rgba(255,180,100,0.5), inset 0 0 15px rgba(255,180,100,0.08)'
              }}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Full-Screen Mobile Menu */}
     <AnimatePresence>
  {isMobileMenuOpen && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 lg:hidden bg-gradient-to-br from-cosmic-black via-cosmic-deep to-cosmic-black"
      style={{ zIndex: 10000 }}
    >
      {/* Logo */}
      <div className="absolute top-16 inset-x-0 flex justify-center pointer-events-none">
        {/* Logo */}
      </div>

      {/* Scrollable Menu Content */}
      <div className="flex flex-col items-center justify-center min-h-full px-6 py-32 gap-6 overflow-y-auto">
        {navItems.map((item, index) => (
          <motion.a
            key={item.name}
            href={item.href}
            onClick={closeMobileMenu}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="text-cosmic-white hover:text-cosmic-gold text-xl sm:text-2xl tracking-widest uppercase font-bold"
          >
            {item.name}
          </motion.a>
        ))}

        <motion.a
          href="/contact"
          onClick={closeMobileMenu}
          className="mt-10 px-8 py-4 text-cosmic-gold border-2 border-cosmic-gold rounded-full uppercase font-bold tracking-wider"
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
"use client"

import type React from "react"

import { useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { MapPin, Github, Linkedin, Twitter } from "lucide-react"
import { PaperPlaneIcon, EnvelopeClosedIcon } from "@radix-ui/react-icons"
import Spline from '@splinetool/react-spline'

export function ContactSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsSubmitting(false)
    setFormState({ name: "", email: "", message: "" })
  }

  return (
    <>
      <section id="contact" ref={containerRef} className="relative py-32 z-[1]">
        <div className="absolute inset-0 bg-cosmic-black/40 backdrop-blur-sm -z-10" />

        {/* Nebula glow effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-15"
            style={{
              background: "radial-gradient(circle, rgba(255, 140, 80, 0.3) 0%, transparent 70%)",
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          {/* Section Header with UFO - Side by Side Layout */}
          <div className="grid lg:grid-cols-2 gap-8 items-center mb-16">
            {/* Left: Title and Description */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="space-y-6"
              style={{ willChange: 'transform, opacity' }}
            >
              <div>
                <span className="text-cosmic-gold/60 text-sm tracking-[0.3em] uppercase">Transmission Channel</span>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-cosmic-white mt-2">
                  ESTABLISH <span className="text-gradient-red-gold animate-text-glow-gradient">CONTACT</span>
                </h2>
                <p className="mt-6 text-cosmic-white/60 text-lg leading-relaxed">
                  Ready to embark on a new mission? Send a signal through the void and let's create something extraordinary
                  together.
                </p>
              </div>
              
              {/* Terminal Status */}
              <div className="p-4 border border-cosmic-gold/20 rounded-lg bg-cosmic-black/80 font-mono text-sm backdrop-blur-xl">
                <div className="text-cosmic-gold">$ establishing_secure_connection...</div>
                <div className="text-cosmic-white/50 mt-1">{">> Signal strength: Strong"}</div>
                <div className="text-cosmic-white/50">{">> Encryption: Active"}</div>
                <div className="text-cosmic-gold mt-2 animate-pulse">{">> Awaiting transmission..."}</div>
              </div>
            </motion.div>

            {/* Right: 3D UFO Model */}
          <motion.div
  initial={{ opacity: 0, x: 50 }}
  animate={isInView ? { opacity: 1, x: 0 } : {}}
  transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
  className="relative"
>
  {/* Height-defined interaction zone */}
  <div className="relative w-full h-[350px] md:h-[450px] lg:h-[500px]">
    
    {/* Spline UFO */}
    <Spline
      scene="https://prod.spline.design/bRYq5NjKXuiOAAG8/scene.splinecode"
      className="absolute inset-0 w-full h-full"
    />

    {/* Edge fade for blending */}
    <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-cosmic-black to-transparent pointer-events-none" />
    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-cosmic-black to-transparent pointer-events-none" />

    {/* Optional subtle glow */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,140,80,0.15),transparent_60%)] pointer-events-none" />
  </div>
</motion.div>

          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              className="space-y-8"
              style={{ willChange: 'transform, opacity' }}
            >
              <motion.div 
                whileTap={{ scale: 0.98 }}
                whileHover={{ 
                  borderColor: "rgba(255, 180, 100, 0.5)",
                  boxShadow: "0 0 30px rgba(255, 180, 100, 0.3)"
                }}
                className="p-6 border border-cosmic-gold/20 rounded-xl bg-cosmic-black/50 backdrop-blur-xl transition-all duration-300 cursor-pointer"
              >
                <h3 className="text-xl font-semibold text-cosmic-white mb-6">Signal Coordinates</h3>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-cosmic-white/70">
                    <div className="w-12 h-12 rounded-full border border-cosmic-gold/30 flex items-center justify-center">
                      <EnvelopeClosedIcon className="w-5 h-5 text-cosmic-gold" />
                    </div>
                    <div>
                      <p className="text-sm text-cosmic-white/50">Email</p>
                      <p className="text-cosmic-white">explorer@cosmic.dev</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-cosmic-white/70">
                    <div className="w-12 h-12 rounded-full border border-cosmic-gold/30 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-cosmic-gold" />
                    </div>
                    <div>
                      <p className="text-sm text-cosmic-white/50">Location</p>
                      <p className="text-cosmic-white">Earth, Milky Way Galaxy</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                whileTap={{ scale: 0.98 }}
                whileHover={{ 
                  borderColor: "rgba(255, 180, 100, 0.5)",
                  boxShadow: "0 0 30px rgba(255, 180, 100, 0.3)"
                }}
                className="p-6 border border-cosmic-gold/20 rounded-xl bg-cosmic-black/50 backdrop-blur-xl transition-all duration-300 cursor-pointer"
              >
                <h3 className="text-xl font-semibold text-cosmic-white mb-6">Communication Links</h3>

                <div className="flex gap-4">
                  {[
                    { icon: Github, href: "#", label: "GitHub" },
                    { icon: Linkedin, href: "#", label: "LinkedIn" },
                    { icon: Twitter, href: "#", label: "Twitter" },
                  ].map((social) => (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      whileHover={{ scale: 1.1, borderColor: "rgba(255, 180, 100, 0.5)" }}
                      whileTap={{ scale: 0.95 }}
                      className="w-12 h-12 rounded-full border border-cosmic-gold/30 flex items-center justify-center text-cosmic-gold hover:text-cosmic-gold hover:bg-cosmic-gold/10 transition-colors"
                    >
                      <social.icon className="w-5 h-5" />
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
              style={{ willChange: 'transform, opacity' }}
            >
              <form
                onSubmit={handleSubmit}
                className="p-8 border border-cosmic-gold/20 rounded-2xl bg-cosmic-black/50 backdrop-blur-xl"
              >
                <div className="space-y-6">
                  <div>
                    <label className="block text-cosmic-white/70 text-sm mb-2 uppercase tracking-wider">
                      Callsign (Name)
                    </label>
                    <input
                      type="text"
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-cosmic-black/50 border border-cosmic-gold/30 rounded-lg text-cosmic-white placeholder-cosmic-white/30 focus:outline-none focus:border-cosmic-gold transition-colors"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="block text-cosmic-white/70 text-sm mb-2 uppercase tracking-wider">
                      Transmission Frequency (Email)
                    </label>
                    <input
                      type="email"
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-cosmic-black/50 border border-cosmic-gold/30 rounded-lg text-cosmic-white placeholder-cosmic-white/30 focus:outline-none focus:border-cosmic-gold transition-colors"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-cosmic-white/70 text-sm mb-2 uppercase tracking-wider">
                      Message Payload
                    </label>
                    <textarea
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      required
                      rows={5}
                      className="w-full px-4 py-3 bg-cosmic-black/50 border border-cosmic-gold/30 rounded-lg text-cosmic-white placeholder-cosmic-white/30 focus:outline-none focus:border-cosmic-gold transition-colors resize-none"
                      placeholder="Your message..."
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(255, 180, 100, 0.3)" }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 bg-gradient-to-r from-cosmic-gold to-cosmic-orange text-cosmic-black font-semibold rounded-lg tracking-wider uppercase flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-cosmic-black/30 border-t-cosmic-black rounded-full animate-spin" />
                        Transmitting...
                      </>
                    ) : (
                      <>
                        <PaperPlaneIcon className="w-5 h-5" />
                        Send Transmission
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}

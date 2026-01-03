"use client"

import type React from "react"

import { useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { MapPin, Send, Github, Linkedin, Twitter } from "lucide-react"
import { PaperPlaneIcon, EnvelopeClosedIcon } from "@radix-ui/react-icons"
import Spline from '@splinetool/react-spline'
import dynamic from "next/dynamic"

export function ContactSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })
  const [success, setSuccess] = useState(false)
const Spline = dynamic(
  () => import("@splinetool/react-spline"),
  { ssr: false }
)

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsSubmitting(true)
  setSuccess(false)

  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formState),
    })

    if (!res.ok) throw new Error("Failed")

    setFormState({ name: "", email: "", message: "" })
    setSuccess(true)

  } catch (err) {
    console.error(err)
  } finally {
    setIsSubmitting(false)
  }
}

  return (
    <>
  <section id="contact" ref={containerRef} className="relative z-10 py-24">
        <div className="absolute inset-0 bg-cosmic-black/40 -z-10" />

        {/* Nebula glow effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-15"
            style={{
              background: "radial-gradient(circle, rgba(255, 140, 80, 0.3) 0%, transparent 70%)",
            }}
          />
        </div>

  {/* Black Hole Video Background*/}
<div className="absolute bottom-0 left-0 w-full md:w-3/4 lg:w-2/3 h-[600px] md:h-[800px] overflow-hidden pointer-events-none -z-10">
  <img
    className="w-full h-full object-cover opacity-60"
    src="/images/black.gif"
    alt="Black Hole Background"
  />

  {/* Bottom fade only (cheap, static) */}
  <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-cosmic-black to-transparent" />
</div>
      
      <div className="relative max-w-7xl mx-auto px-6 text-center">
         {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-cosmic-white">
            CONTACT <span className="text-gradient-red-gold animate-text-glow-gradient">ME</span>
          </h2>
           <p className="mt-6 mx-auto max-w-3xl text-cosmic-white/90 text-lg leading-relaxed">
            I'm always open to collaborating on projects that make a meaningful impact. Feel free to connect via the form below or my socials! 
                </p>
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
                className="p-6 border border-cosmic-gold/20 rounded-xl bg-cosmic-black/50 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-4">
  <div className="w-3 h-3 rounded-full bg-red-500" />
  <div className="w-3 h-3 rounded-full bg-yellow-500" />
  <div className="w-3 h-3 rounded-full bg-green-500" />
  <span className="ml-4 text-cosmic-white/50 text-sm">
    secure_link.sys
  </span>
</div>
{/* Terminal Status */}
                <div className="text-cosmic-gold">$ establishing_secure_connection...</div>
                <div className="text-cosmic-white/50 mt-1">{">> Signal strength: Strong"}</div>
                <div className="text-cosmic-white/50">{">> Encryption: Active"}</div>
                <div className="text-cosmic-gold mt-2 animate-pulse">{">> Awaiting transmission..."}</div>
            
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
  className="p-8 border border-cosmic-gold/20 rounded-2xl bg-cosmic-black/50 text-left"
>

                <div className="space-y-6">
                  <div>
                    <label className="block text-cosmic-white/70 text-sm mb-2 uppercase tracking-wider">
                      Name
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
                      Email
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
                      Message
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
                  {success && (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="rounded-lg border border-green-400/30 bg-green-400/10 px-4 py-3 text-center text-green-300 text-sm"
  >
    Message sent successfully. I’ll get back to you soon.
  </motion.div>
)}


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
                        SENDING...
                      </>
                    ) : (
                      <>
                        <PaperPlaneIcon className="w-5 h-5" />
                        Send
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

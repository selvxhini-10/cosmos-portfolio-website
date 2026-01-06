"use client"

import { useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Calendar, Clock, ArrowLeft, Tag } from "lucide-react"
import Link from "next/link"
import Spline from '@splinetool/react-spline' 
import { blogPosts } from "@/lib/data/blogPosts"

export default function BlogPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })
  const filteredPosts = blogPosts

  return (
    <main className="relative min-h-screen overflow-x-hidden">

      {/* Content Layer */}
      <div className="relative z-10">
        <Navigation />

        {/* Hero Section with 3D Brain */}
        <section className="relative pt-32 pb-20 px-6">
          <div className="absolute inset-0 bg-cosmic-black/40 -z-10" />
          
          <div className="max-w-7xl mx-auto">
            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <Link
                href="/home"
                className="inline-flex items-center gap-2 text-cosmic-gold hover:text-cosmic-orange transition-colors duration-300 font-mono"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
            </motion.div>

            {/* 3D Brain Model Header */}
<div className="relative w-full h-[400px] md:h-[500px]">
  
  {/* Spline Brain — interactive, no box */}
  <Spline
    scene="https://prod.spline.design/BNf8gJfjxTOH9jNT/scene.splinecode"
    className="absolute inset-0 w-full h-full"
  />

  {/* Title overlay */}
  <div className="absolute bottom-0 left-0 right-0 p-8 pointer-events-none">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="max-w-3xl"
    >
      <h1 className="text-4xl md:text-6xl font-bold text-cosmic-white mb-4">
        <span className="font-mono">BLOG </span>
        <span className="text-gradient-red-gold animate-text-glow-gradient font-mono">
          ARCHIVE
        </span>
      </h1>
      <p className="text-cosmic-white/70 text-lg md:text-xl font-mono">
        {">> Thoughts & Insights"}
      </p>
    </motion.div>
  </div>
</div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section ref={containerRef} className="relative py-12 px-6">
          <div className="absolute inset-0 bg-cosmic-black/20 -z-10" />
          
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group relative"
                >
                  <div className="h-full p-6 border border-cosmic-gold/20 rounded-xl bg-cosmic-black/50 hover:border-cosmic-gold/40 hover:shadow-[0_0_30px_rgba(255,180,100,0.2)] transition-all duration-300">
                    {post.featured && (
                      <div className="absolute -top-3 -right-3 px-3 py-1 bg-gradient-to-r from-cosmic-gold to-cosmic-orange text-cosmic-black text-xs font-bold rounded-full shadow-lg">
                        FEATURED
                      </div>
                    )}
                    
                    <h2 className="text-xl font-bold text-cosmic-white mb-3 group-hover:text-cosmic-gold transition-colors duration-300">
                      {post.title}
                    </h2>
                    
                    <p className="text-cosmic-white/60 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="flex items-center gap-1 text-xs text-cosmic-white/40 font-mono"
                        >
                          <Tag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-cosmic-white/40 pt-4 border-t border-cosmic-gold/10">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {post.readTime}
                      </span>
                    </div>
                    <Link href={`/blog/${post.slug}`}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="mt-4 w-full py-2 bg-cosmic-gold/10 hover:bg-cosmic-gold/20 text-cosmic-gold border border-cosmic-gold/20 hover:border-cosmic-gold/40 rounded-lg font-mono text-sm transition-all duration-300"
                    >
                      Read Article
                    </motion.button>
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  )
}

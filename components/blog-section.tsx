"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { BookOpen, ArrowRight, Calendar, Clock } from "lucide-react"
import { CosmicHazeDivider } from "./cosmic-haze-divider"
import Link from "next/link"

const featuredArticles = [
  {
    title: "The Future of Web Development: AI-Powered Interfaces",
    excerpt: "Exploring how artificial intelligence is reshaping the way we build and interact with web applications...",
    date: "2024-03-15",
    readTime: "8 min read",
    category: "AI & Web Dev",
  },
  {
    title: "Building Scalable Microservices with Node.js",
    excerpt: "A deep dive into architectural patterns and best practices for creating robust distributed systems...",
    date: "2024-02-28",
    readTime: "12 min read",
    category: "Backend",
  },
  {
    title: "Modern CSS: Beyond the Basics",
    excerpt: "Unlocking the power of CSS Grid, Container Queries, and the latest features transforming frontend design...",
    date: "2024-02-10",
    readTime: "6 min read",
    category: "Frontend",
  },
]

export function BlogSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })

  return (
    <>
      <CosmicHazeDivider />
      <section id="blog" ref={containerRef} className="relative py-32 z-[1]">
        {/* Section Background */}
        <div className="absolute inset-0 bg-cosmic-black/40 backdrop-blur-sm -z-10" />

        <div className="relative max-w-7xl mx-auto px-6">
          {/* Terminal Header */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="mb-16 text-center"
          >
            <div className="inline-block">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-4 text-cosmic-white/50 text-sm font-mono">blog_archive.exe</span>
              </div>
              <div className="border border-cosmic-gold/30 rounded-lg p-6 bg-cosmic-black/50 backdrop-blur-xl">
                <div className="font-mono text-cosmic-gold/80 text-sm mb-2">
                  <span className="text-cosmic-gold">$ </span>
                  <span className="animate-pulse">_</span> Loading thought database...
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-cosmic-white mb-2">
                  <span className="font-mono">BLOG </span>
                  <span className="text-gradient-red-gold animate-text-glow-gradient font-mono">TRANSMISSIONS</span>
                </h2>
                <p className="text-cosmic-white/60 font-mono text-sm">
                  {">> Insights from the developer void"}
                </p>
              </div>
            </div>
          </motion.div>

          {/* 3D Brain Model - Center Piece */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="relative mb-20"
            style={{ willChange: 'opacity' }}
          >
            <div className="relative w-full h-[400px] md:h-[600px] rounded-2xl overflow-hidden border border-cosmic-gold/20 bg-cosmic-black/50 backdrop-blur-xl">
              <iframe
                src="https://my.spline.design/particleaibrain-Muif91xEvdINiY9GGmaeZ7hn/"
                frameBorder="0"
                width="100%"
                height="100%"
                className="w-full h-full relative z-10"
                title="3D AI Brain Model"
                loading="lazy"
              />
              {/* Overlay gradient for better text visibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-cosmic-black/60 via-transparent to-transparent pointer-events-none" />
              
              {/* Floating text overlay */}
              <div className="absolute bottom-8 left-8 right-8 pointer-events-none">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="text-center"
                >
                  <h3 className="text-2xl md:text-3xl font-bold text-cosmic-white mb-2">
                    Exploring the Intersection of{" "}
                    <span className="text-gradient-red-gold">Code & Consciousness</span>
                  </h3>
                  <p className="text-cosmic-white/70 text-sm md:text-base">
                    Deep dives into technology, development, and digital innovation
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Featured Articles Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredArticles.map((article, index) => (
              <motion.article
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.05, ease: "easeOut" }}
                className="group relative"
                style={{ willChange: 'transform, opacity' }}
              >
                <div className="h-full p-6 border border-cosmic-gold/20 rounded-xl bg-cosmic-black/50 backdrop-blur-xl hover:border-cosmic-gold/40 transition-all duration-300">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 text-xs font-mono text-cosmic-gold bg-cosmic-gold/10 rounded-full border border-cosmic-gold/20">
                      {article.category}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-cosmic-white mb-3 group-hover:text-cosmic-gold transition-colors duration-300">
                    {article.title}
                  </h3>
                  
                  <p className="text-cosmic-white/60 mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-cosmic-white/40 mb-4">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {article.readTime}
                      </span>
                    </div>
                  </div>
                  
                  <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-cosmic-gold hover:text-cosmic-orange transition-colors duration-300 font-mono text-sm group/link"
                  >
                    Read More
                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>

          {/* View All Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center"
          >
            <Link href="/blog">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(255, 180, 100, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cosmic-gold to-cosmic-orange text-cosmic-black font-semibold rounded-full tracking-wider uppercase transition-all duration-300 shadow-lg"
              >
                <BookOpen className="w-5 h-5" />
                View All Articles
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}

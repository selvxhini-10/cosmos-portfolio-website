"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { BookOpen, ArrowRight, Calendar, Clock } from "lucide-react"
import Link from "next/link"
import type { BlogPost } from "@/lib/types/blog"
import { blogPosts } from "@/lib/data/blogPosts"

const featuredArticles = blogPosts.filter((p: BlogPost) => p.featured)

export function BlogSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="blog" ref={ref} className="relative z-[1] mb-16">
      <div className="absolute inset-0 bg-cosmic-black/40 -z-10" />

      <div className="relative max-w-7xl mx-auto px-6">

        {/* ── Header ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <div className="inline-block">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="ml-4 text-cosmic-white/50 text-sm font-mono">blog_archive.exe</span>
            </div>
            <div className="border border-cosmic-gold/30 rounded-lg p-6 bg-cosmic-black/50">
              <div className="font-mono text-cosmic-gold/80 text-sm mb-2">
                <span className="text-cosmic-gold">$ </span>Loading thought database...
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-cosmic-white mb-2">
                <span className="font-mono">BLOG </span>
                <span className="text-gradient-red-gold font-mono">ARTICLES</span>
              </h2>
              <p className="text-cosmic-white/60 font-mono text-sm">
                {">> Insights from the developer void"}
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Accretion disk centrepiece ─────────────────────────────── */}
        {/*
          Replaces the heavy Spline brain. The video is 153 KB and plays
          immediately — no WebGL runtime, no CDN round-trip.
          vignette is a single radial gradient (not stacked), kept at 55%
          opacity so the disk visuals remain clearly visible underneath.
        */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative mb-16 rounded-2xl overflow-hidden"
          style={{ height: "340px" }}
        >
          {/* Video — only mounted once in view */}
          {isInView && (
            <video
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay muted loop playsInline preload="none"
              style={{ filter: "brightness(0.7) saturate(1.4)" }}
            >
              <source src="/videos/accretion_disk.mp4" type="video/mp4" />
            </video>
          )}

          {/* Single radial vignette — center clear, edges dark */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 70% 70% at 50% 50%, transparent 35%, rgba(5,3,10,0.72) 100%)",
            }}
          />
          {/* Top + bottom edge fades only — keeps left/right disk visible */}
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-cosmic-black to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-cosmic-black to-transparent pointer-events-none" />

          {/* Overlay text */}
          <div className="relative h-full flex flex-col items-center justify-center px-6 text-center z-10">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              <p className="text-cosmic-white/40 text-xs tracking-[0.3em] uppercase font-mono mb-3">
                // THOUGHT STREAM
              </p>
              <h3 className="text-2xl md:text-3xl font-bold text-cosmic-white mb-3">
                Exploring the Intersection of{" "}
                <span className="text-gradient-red-gold">Code & Consciousness</span>
              </h3>
              <p className="text-cosmic-white/70 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
                A collection of evolving ideas, research, and documentation — a glimpse into the thinking behind my projects.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* ── Featured articles grid ─────────────────────────────────── */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredArticles.map((article, i) => (
            <motion.article
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.05 }}
              className="group"
            >
              <div className="h-full p-6 border border-cosmic-gold/20 rounded-xl bg-cosmic-black/50 hover:border-cosmic-gold/40 transition-colors duration-200">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 text-xs font-mono text-cosmic-gold bg-cosmic-gold/10 rounded-full border border-cosmic-gold/20">
                    {article.category}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-cosmic-white mb-3 group-hover:text-cosmic-gold transition-colors duration-200">
                  {article.title}
                </h3>
                <p className="text-cosmic-white/60 mb-4 line-clamp-3 text-sm">{article.excerpt}</p>
                <div className="flex items-center gap-4 text-xs text-cosmic-white/40 mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(article.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {article.readTime}
                  </span>
                </div>
                <Link
                  href={`/blog/${article.slug}`}
                  className="inline-flex items-center gap-2 text-cosmic-gold hover:text-cosmic-orange transition-colors duration-200 font-mono text-sm group/link"
                >
                  Read More
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-200" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        {/* ── View all ───────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center"
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cosmic-gold to-cosmic-orange text-cosmic-black font-bold rounded-full tracking-wider uppercase text-sm transition-all duration-200 hover:shadow-[0_0_28px_rgba(255,180,100,0.4)] hover:scale-105 active:scale-95"
          >
            <BookOpen className="w-5 h-5" />
            View All Articles
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

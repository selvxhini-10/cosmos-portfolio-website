"use client"

import { useRef, useState } from "react"
import { BookOpen, ArrowRight, Calendar, Clock, Sparkles } from "lucide-react"
import Link from "next/link"
import { blogPosts } from "@/lib/data/blogPosts"

export function BlogSection() {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  const onRef = (el: HTMLElement | null) => {
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.08 }
    )
    obs.observe(el)
  }

  // Show latest 3 articles
  const displayedPosts = blogPosts.slice(0, 3)
  const [heroPost, ...secondaryPosts] = displayedPosts

  return (
    <section
      id="blog"
      ref={(el) => { (ref as React.MutableRefObject<HTMLElement | null>).current = el; onRef(el) }}
      className="relative z-[1] py-16 bg-cosmic-black"
    >
      <div className="relative max-w-7xl mx-auto px-6">

        {/* Section Header */}
        <div
          className="mb-10 text-center transition-all duration-500 ease-out"
          style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(24px)" }}
        >
          <p className="text-cosmic-gold/60 text-xs tracking-[0.3em] uppercase font-mono mb-2">
            // THOUGHT STREAM
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-cosmic-white">
            RECENT <span className="text-gradient-red-gold">WRITINGS</span>
          </h2>
        </div>

        {/* Articles Layout Grid */}
        {displayedPosts.length > 0 && (
          <div className="grid lg:grid-cols-3 gap-6 mb-12">

            {/* Hero Article (Spans 2 Columns on Large Screens) */}
            {heroPost && (
              <article
                className="lg:col-span-2 group relative flex flex-col justify-between p-8 border border-cosmic-gold/30 rounded-2xl bg-gradient-to-br from-cosmic-black/80 to-cosmic-black/40 hover:border-cosmic-gold/60 transition-all duration-300 shadow-lg hover:shadow-[0_0_30px_rgba(255,180,100,0.15)] overflow-hidden"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "none" : "translateY(20px)",
                }}
              >

                <div className="relative">
                  <div className="flex items-center justify-end mb-4">
  <span className="text-xs font-mono text-cosmic-gold/60">LATEST ENTRY</span>
</div>

                  <h3 className="text-2xl md:text-4xl font-bold text-cosmic-white mb-4 tracking-tight group-hover:text-cosmic-gold transition-colors duration-200">
                    {heroPost.title}
                  </h3>

                  <p className="text-cosmic-white/70 mb-6 text-base md:text-lg leading-relaxed">
                    {heroPost.excerpt}
                  </p>
                </div>

                <div className="relative">
                  <div className="h-px w-full bg-gradient-to-r from-cosmic-gold/30 via-cosmic-gold/10 to-transparent mb-6" />

                  <div className="flex items-center gap-4 text-xs font-mono text-cosmic-white/40 mb-6">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-cosmic-gold/70" />
                      {new Date(heroPost.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-cosmic-gold/70" />
                      {heroPost.readTime}
                    </span>
                  </div>

                  <Link
                    href={`/blog/${heroPost.slug}`}
                    className="inline-flex items-center gap-2 text-cosmic-gold font-mono text-sm hover:text-cosmic-orange transition-colors group/link"
                  >
                    Read Full Article
                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </article>
            )}

            {/* Secondary Articles Side Column */}
            <div className="flex flex-col gap-6">
              {secondaryPosts.map((article, i) => (
                <article
                  key={article.slug || i}
                  className="group flex-1 flex flex-col justify-between p-6 border border-cosmic-gold/20 rounded-2xl bg-cosmic-black/50 hover:border-cosmic-gold/40 transition-all duration-300"
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? "none" : "translateY(20px)",
                    transitionDelay: `${(i + 1) * 80}ms`,
                  }}
                >
                  <div>
                  <h3 className="text-lg font-bold text-cosmic-white mb-2 mt-1 group-hover:text-cosmic-gold transition-colors duration-200">{article.title}
                    </h3>
                    <p className="text-cosmic-white/55 mb-4 line-clamp-3 text-sm leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 text-xs font-mono text-cosmic-white/35 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(article.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {article.readTime}
                      </span>
                    </div>

                    <Link
                      href={`/blog/${article.slug}`}
                      className="inline-flex items-center gap-1.5 text-cosmic-gold hover:text-cosmic-orange transition-colors font-mono text-xs group/link"
                    >
                      Read Post
                      <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>

          </div>
        )}

        {/* Global CTA */}
        <div
          className="text-center transition-all duration-500 ease-out"
          style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(16px)", transitionDelay: "250ms" }}
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-3 px-8 py-3.5 bg-gradient-to-r from-cosmic-gold to-cosmic-orange text-cosmic-black font-bold rounded-full tracking-wider uppercase text-xs transition-all duration-200 hover:shadow-[0_0_25px_rgba(255,180,100,0.35)] hover:scale-105 active:scale-95"
          >
            <BookOpen className="w-4 h-4" />
            Explore All Articles
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  )
}
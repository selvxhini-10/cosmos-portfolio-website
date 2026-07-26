"use client"

import { useRef, useState } from "react"
import { BookOpen, ArrowRight, Calendar, Clock } from "lucide-react"
import Link from "next/link"
import type { BlogPost } from "@/lib/types/blog"
import { blogPosts } from "@/lib/data/blogPosts"

const featuredArticles = blogPosts.filter((p: BlogPost) => p.featured)

export function BlogSection() {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  // CSS-only reveal: IntersectionObserver replaces useInView + framer
  const onRef = (el: HTMLElement | null) => {
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.08 }
    )
    obs.observe(el)
  }

  return (
    <section
      id="blog"
      ref={(el) => { (ref as React.MutableRefObject<HTMLElement | null>).current = el; onRef(el) }}
      className="relative z-[1] py-24"
    >
      <div className="relative max-w-7xl mx-auto px-6">

        {/* Header */}
        <div
          className="mb-12 text-center transition-all duration-500 ease-out"
          style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(24px)" }}
        >
          <p className="text-cosmic-white/30 text-xs tracking-[0.3em] uppercase font-mono mb-3">
            // THOUGHT STREAM
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-cosmic-white">
            BLOG <span className="text-gradient-red-gold">ARTICLES</span>
          </h2>
          <p className="mt-3 text-cosmic-white/50 font-mono text-sm">
            {">> Insights from the developer void"}
          </p>
        </div>

        {/* Articles grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {featuredArticles.map((article, i) => (
            <article
              key={i}
              className="group h-full transition-all duration-500 ease-out"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "none" : "translateY(20px)",
                transitionDelay: `${i * 60}ms`,
              }}
            >
              <div className="h-full p-6 border border-cosmic-gold/20 rounded-xl bg-cosmic-black/50 hover:border-cosmic-gold/40 transition-colors duration-200">
                <span className="px-3 py-1 text-xs font-mono text-cosmic-gold bg-cosmic-gold/10 rounded-full border border-cosmic-gold/20">
                  {article.category}
                </span>

                <h3 className="mt-4 text-lg font-bold text-cosmic-white mb-2 group-hover:text-cosmic-gold transition-colors duration-200">
                  {article.title}
                </h3>
                <p className="text-cosmic-white/55 mb-4 line-clamp-3 text-sm leading-relaxed">
                  {article.excerpt}
                </p>

                <div className="flex items-center gap-4 text-xs text-cosmic-white/35 mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(article.date).toLocaleDateString("en-US", {
                      month: "short", day: "numeric", year: "numeric",
                    })}
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
            </article>
          ))}
        </div>

        {/* CTA */}
        <div
          className="text-center transition-all duration-500 ease-out"
          style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(16px)", transitionDelay: "300ms" }}
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cosmic-gold to-cosmic-orange text-cosmic-black font-bold rounded-full tracking-wider uppercase text-sm transition-all duration-200 hover:shadow-[0_0_28px_rgba(255,180,100,0.4)] hover:scale-105 active:scale-95"
          >
            <BookOpen className="w-5 h-5" />
            View All Articles
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}

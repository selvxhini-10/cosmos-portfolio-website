"use client"

import { useRef, useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Calendar, Clock, ArrowLeft, Tag } from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"
import { blogPosts } from "@/lib/data/blogPosts"

// Lazy-load the Spline brain — synchronous import was loading 800 KB on page entry
const Spline = dynamic(() => import("@splinetool/react-spline"), { ssr: false })

export default function BlogPage() {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  const [splineReady, setSplineReady] = useState(false)

  const onRef = (el: HTMLElement | null) => {
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.05 }
    )
    obs.observe(el)
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div className="relative z-10">
        <Navigation />

        {/* Header — lazy Spline brain */}
        <section className="relative pt-32 pb-20 px-6">
          <div className="absolute inset-0 bg-cosmic-black/40 -z-10" />
          <div className="max-w-7xl mx-auto">

            <div className="mb-8">
              <Link
                href="/home"
                className="inline-flex items-center gap-2 text-cosmic-gold hover:text-cosmic-orange transition-colors duration-200 font-mono text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
            </div>

            <div className="relative w-full h-[400px] md:h-[500px]">
              {/* Spline brain — gated until component mounts */}
              <Spline
                scene="https://prod.spline.design/BNf8gJfjxTOH9jNT/scene.splinecode"
                className="absolute inset-0 w-full h-full"
                onLoad={() => setSplineReady(true)}
              />

              {/* Loading placeholder shown until Spline is ready */}
              {!splineReady && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-cosmic-white/30 text-xs font-mono tracking-widest animate-pulse">
                    // LOADING NEURAL MODEL...
                  </span>
                </div>
              )}

              {/* Title overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8 pointer-events-none">
                <h1 className="text-4xl md:text-6xl font-bold text-cosmic-white mb-2">
                  <span className="font-mono">BLOG </span>
                  <span className="text-gradient-red-gold font-mono">ARCHIVE</span>
                </h1>
                <p className="text-cosmic-white/60 text-lg font-mono">{">> Thoughts & Insights"}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Posts grid */}
        <section
          ref={(el) => { (ref as React.MutableRefObject<HTMLElement | null>).current = el; onRef(el) }}
          className="relative py-12 px-6"
        >
          <div className="absolute inset-0 bg-cosmic-black/20 -z-10" />
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post, i) => (
                <article
                  key={post.id}
                  className="group relative transition-all duration-500 ease-out"
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? "none" : "translateY(32px)",
                    transitionDelay: `${i * 60}ms`,
                  }}
                >
                  <div className="h-full p-6 border border-cosmic-gold/20 rounded-xl bg-cosmic-black/50 hover:border-cosmic-gold/40 hover:shadow-[0_0_24px_rgba(255,180,100,0.18)] transition-all duration-200">
                    {post.featured && (
                      <div className="absolute -top-3 -right-3 px-3 py-1 bg-gradient-to-r from-cosmic-gold to-cosmic-orange text-cosmic-black text-xs font-bold rounded-full">
                        FEATURED
                      </div>
                    )}

                    <h2 className="text-xl font-bold text-cosmic-white mb-3 group-hover:text-cosmic-gold transition-colors duration-200">
                      {post.title}
                    </h2>
                    <p className="text-cosmic-white/60 mb-4 line-clamp-3 text-sm leading-relaxed">{post.excerpt}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="flex items-center gap-1 text-xs text-cosmic-white/40 font-mono">
                          <Tag className="w-3 h-3" />{tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs text-cosmic-white/35 pt-4 border-t border-cosmic-gold/10 mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />{post.readTime}
                      </span>
                    </div>

                    <Link href={`/blog/${post.slug}`}>
                      <button className="w-full py-2 bg-cosmic-gold/10 hover:bg-cosmic-gold/20 text-cosmic-gold border border-cosmic-gold/20 hover:border-cosmic-gold/40 rounded-lg font-mono text-sm transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]">
                        Read Article
                      </button>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  )
}
"use client"

import { useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { CosmicBackground } from "@/components/cosmic-background"
import { Calendar, Clock, ArrowLeft, Tag } from "lucide-react"
import Link from "next/link"

const blogPosts = [
  {
    id: 1,
    title: "The Future of Web Development: AI-Powered Interfaces",
    excerpt: "Exploring how artificial intelligence is reshaping the way we build and interact with web applications. From automated code generation to intelligent user experiences...",
    date: "2024-03-15",
    readTime: "8 min read",
    category: "AI & Web Dev",
    tags: ["AI", "WebDev", "UX", "Future Tech"],
    featured: true,
  },
  {
    id: 2,
    title: "Building Scalable Microservices with Node.js",
    excerpt: "A deep dive into architectural patterns and best practices for creating robust distributed systems. Learn how to design services that can handle millions of requests...",
    date: "2024-02-28",
    readTime: "12 min read",
    category: "Backend",
    tags: ["Node.js", "Microservices", "Architecture", "Backend"],
    featured: true,
  },
  {
    id: 3,
    title: "Modern CSS: Beyond the Basics",
    excerpt: "Unlocking the power of CSS Grid, Container Queries, and the latest features transforming frontend design. Discover techniques that will elevate your styling game...",
    date: "2024-02-10",
    readTime: "6 min read",
    category: "Frontend",
    tags: ["CSS", "Frontend", "Design", "Web Standards"],
    featured: true,
  },
  {
    id: 4,
    title: "TypeScript Best Practices for Large Scale Applications",
    excerpt: "Essential patterns and techniques for maintaining type safety in enterprise-level codebases. Learn how to leverage TypeScript's advanced features effectively...",
    date: "2024-01-22",
    readTime: "10 min read",
    category: "TypeScript",
    tags: ["TypeScript", "Best Practices", "Enterprise"],
    featured: false,
  },
  {
    id: 5,
    title: "Optimizing React Performance: A Comprehensive Guide",
    excerpt: "Master the art of building lightning-fast React applications. From code splitting to memoization, discover the techniques that matter most...",
    date: "2024-01-08",
    readTime: "15 min read",
    category: "React",
    tags: ["React", "Performance", "Optimization"],
    featured: false,
  },
  {
    id: 6,
    title: "GraphQL vs REST: Choosing the Right API Architecture",
    excerpt: "An in-depth comparison of two popular API paradigms. Understand when to use each approach and how to migrate between them...",
    date: "2023-12-15",
    readTime: "9 min read",
    category: "API Design",
    tags: ["GraphQL", "REST", "API", "Architecture"],
    featured: false,
  },
]

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })

  const categories = Array.from(new Set(blogPosts.map((post) => post.category)))
  
  const filteredPosts = selectedCategory
    ? blogPosts.filter((post) => post.category === selectedCategory)
    : blogPosts

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      {/* Cosmic Background Layer */}
      <div className="fixed inset-0 z-[5] pointer-events-none">
        <CosmicBackground />
      </div>

      {/* Content Layer */}
      <div className="relative z-10">
        <Navigation />

        {/* Hero Section with 3D Brain */}
        <section className="relative pt-32 pb-20 px-6">
          <div className="absolute inset-0 bg-cosmic-black/40 backdrop-blur-sm -z-10" />
          
          <div className="max-w-7xl mx-auto">
            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-cosmic-gold hover:text-cosmic-orange transition-colors duration-300 font-mono"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
            </motion.div>

            {/* 3D Brain Model Header */}
            <div className="relative w-full h-[400px] md:h-[500px] mb-12 rounded-2xl overflow-hidden border border-cosmic-gold/20 bg-cosmic-black/50 backdrop-blur-xl">
              <iframe
                src="https://my.spline.design/particleaibrain-Muif91xEvdINiY9GGmaeZ7hn/"
                frameBorder="0"
                width="100%"
                height="100%"
                className="w-full h-full"
                title="3D AI Brain Model"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-cosmic-black/80 via-transparent to-transparent pointer-events-none" />
              
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
                    <span className="text-gradient-red-gold animate-text-glow-gradient font-mono">ARCHIVE</span>
                  </h1>
                  <p className="text-cosmic-white/70 text-lg md:text-xl font-mono">
                    {">> Transmissions from the code frontier"}
                  </p>
                </motion.div>
              </div>
            </div>

            {/* Category Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-3 mb-12 justify-center"
            >
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full font-mono text-sm transition-all duration-300 ${
                  selectedCategory === null
                    ? "bg-cosmic-gold text-cosmic-black shadow-[0_0_20px_rgba(255,180,100,0.4)]"
                    : "bg-cosmic-black/50 text-cosmic-white/60 border border-cosmic-gold/20 hover:border-cosmic-gold/40"
                }`}
              >
                All Posts
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full font-mono text-sm transition-all duration-300 ${
                    selectedCategory === category
                      ? "bg-cosmic-gold text-cosmic-black shadow-[0_0_20px_rgba(255,180,100,0.4)]"
                      : "bg-cosmic-black/50 text-cosmic-white/60 border border-cosmic-gold/20 hover:border-cosmic-gold/40"
                  }`}
                >
                  {category}
                </button>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section ref={containerRef} className="relative py-12 px-6">
          <div className="absolute inset-0 bg-cosmic-black/20 backdrop-blur-sm -z-10" />
          
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
                  <div className="h-full p-6 border border-cosmic-gold/20 rounded-xl bg-cosmic-black/50 backdrop-blur-xl hover:border-cosmic-gold/40 hover:shadow-[0_0_30px_rgba(255,180,100,0.2)] transition-all duration-300">
                    {post.featured && (
                      <div className="absolute -top-3 -right-3 px-3 py-1 bg-gradient-to-r from-cosmic-gold to-cosmic-orange text-cosmic-black text-xs font-bold rounded-full shadow-lg">
                        FEATURED
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-3 py-1 text-xs font-mono text-cosmic-gold bg-cosmic-gold/10 rounded-full border border-cosmic-gold/20">
                        {post.category}
                      </span>
                    </div>
                    
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
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="mt-4 w-full py-2 bg-cosmic-gold/10 hover:bg-cosmic-gold/20 text-cosmic-gold border border-cosmic-gold/20 hover:border-cosmic-gold/40 rounded-lg font-mono text-sm transition-all duration-300"
                    >
                      Read Article
                    </motion.button>
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

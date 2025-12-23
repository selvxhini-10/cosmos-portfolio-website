// app/blog/[slug]/page.tsx

import { notFound } from "next/navigation"
import { blogPosts } from "@/lib/data/blogPosts"
import type { BlogPost } from "@/lib/types/blog"
import { Calendar, Clock, Tag } from "lucide-react"

type BlogPostPageProps = {
  params: { slug: string }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = blogPosts.find(p => p.slug === params.slug)

  if (!post) return notFound()

  return (
    <main className="min-h-screen bg-cosmic-black text-cosmic-white px-6 py-32">
      <article className="max-w-3xl mx-auto">

        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {post.title}
          </h1>

          <div className="flex flex-wrap gap-4 text-sm text-cosmic-white/60">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(post.date).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {post.readTime}
            </span>
          </div>

          <div className="flex gap-2 mt-4">
            {post.tags.map(tag => (
              <span
                key={tag}
                className="flex items-center gap-1 text-xs text-cosmic-gold font-mono"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        </header>

        {/* Content */}
        <section className="prose prose-invert prose-lg max-w-none">
          {post.content}
        </section>

        {/* AI Recommendations (future hook) */}
        <section className="mt-16 p-6 border border-cosmic-gold/20 rounded-xl bg-cosmic-black/40">
          <h2 className="text-xl font-bold text-cosmic-gold mb-2">
            AI Insights (Coming Soon)
          </h2>
          <p className="text-cosmic-white/60 text-sm">
            Personalized recommendations and related research will appear here.
          </p>
        </section>

      </article>
    </main>
  )
}

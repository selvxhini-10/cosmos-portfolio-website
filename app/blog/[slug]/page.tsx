// app/blog/[slug]/page.tsx

import { notFound } from "next/navigation"
import { blogPosts } from "@/lib/data/blogPosts"
import { Calendar, Clock, Tag } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import dedent from "dedent"
import rehypeRaw from "rehype-raw"

type BlogPostPageProps = {
  params: { slug: string }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = blogPosts.find(p => p.slug === slug)

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
            <ReactMarkdown
  remarkPlugins={[remarkGfm]}
  rehypePlugins={[rehypeRaw]}
  components={{
    p: ({ children }) => (
      <p className="leading-relaxed mb-6 whitespace-pre-line">
        {children}
      </p>
    ),
      ul: ({ children }) => (
      <ul className="list-disc pl-6 space-y-2 mb-8">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal pl-6 space-y-2">{children}</ol>
    ),
    iframe: ({ ...props }) => (
      <div className="my-12">
        <iframe
          {...props}
          className="w-full h-[650px] rounded-xl border border-cosmic-gold/20 shadow-[0_0_40px_rgba(255,180,96,0.15)]"
        />
      </div>
    ),
  }}
>
  {dedent(post.content).trimEnd()}
</ReactMarkdown>



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

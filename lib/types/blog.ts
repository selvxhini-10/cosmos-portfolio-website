// lib/types/blog.ts
export type BlogPost = {
  id: number
  slug: string
  title: string
  excerpt: string
  content: string
  date: string
  readTime?: string
  category?: string
  tags: string[]
  featured?: boolean
}

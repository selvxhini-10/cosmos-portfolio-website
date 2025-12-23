// lib/blogPosts.ts
import { BlogPost } from "../types/blog"

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    slug: "future-of-web-dev-ai",
    title: "The Future of Web Development: AI-Powered Interfaces",
    excerpt: "...",
    content: `
## Introduction
AI is reshaping how we design and build web applications...

## Key Trends
- AI copilots
- Adaptive interfaces
- Personalized UX

## Conclusion
The future is intelligent, contextual, and human-centered.
    `,
    date: "2024-03-15",
    readTime: "8 min read",
    category: "AI & Web Dev",
    tags: ["AI", "WebDev", "UX"],
    featured: true,
  },
  {
    id: 2,
    title: "Building Scalable Microservices with Node.js",
    slug: "building-scalable-microservices-nodejs",

    excerpt: "A deep dive into architectural patterns and best practices for creating robust distributed systems. Learn how to design services that can handle millions of requests...",
    content: `
## Introduction
AI is reshaping how we design and build web applications...

## Key Trends
- AI copilots
- Adaptive interfaces
- Personalized UX

## Conclusion
The future is intelligent, contextual, and human-centered.
    `,
    date: "2024-02-28",
    readTime: "12 min read",
    category: "Backend",
    tags: ["Node.js", "Microservices", "Architecture", "Backend"],
    featured: true,
  },
  {
    id: 3,
    title: "Modern CSS: Beyond the Basics",
    slug: "modern-css-beyond-basics",
    excerpt: "Unlocking the power of CSS Grid, Container Queries, and the latest features transforming frontend design. Discover techniques that will elevate your styling game...",
    content: "## Introduction\nModern CSS has evolved significantly with new features like CSS Grid and Container Queries...\n\n## Key Features\n- CSS Grid\n- Container Queries\n- New Pseudo-classes\n\n## Conclusion\nEmbrace modern CSS to create responsive and dynamic web designs.",
    date: "2024-02-10",
    readTime: "6 min read",
    category: "Frontend",
    tags: ["CSS", "Frontend", "Design", "Web Standards"],
    featured: true,
  },
  {
    id: 4,
    title: "TypeScript Best Practices for Large Scale Applications",
    slug: "typescript-best-practices-large-scale-applications",
    excerpt: "Essential patterns and techniques for maintaining type safety in enterprise-level codebases. Learn how to leverage TypeScript's advanced features effectively...",
    content: "",
    date: "2024-01-22",
    readTime: "10 min read",
    category: "TypeScript",
    tags: ["TypeScript", "Best Practices", "Enterprise"],
    featured: false,
  },
  {
    id: 5,
    slug: "optimizing-react-performance-comprehensive-guide",
    title: "Optimizing React Performance: A Comprehensive Guide",
    excerpt: "Master the art of building lightning-fast React applications. From code splitting to memoization, discover the techniques that matter most...",
    content: "",
    date: "2024-01-08",
    readTime: "15 min read",
    category: "React",
    tags: ["React", "Performance", "Optimization"],
    featured: false,
  },
  {
    id: 6,
    slug: "introduction-to-web-assembly",
    title: "GraphQL vs REST: Choosing the Right API Architecture",
    excerpt: "An in-depth comparison of two popular API paradigms. Understand when to use each approach and how to migrate between them...",
    content: "",
    date: "2023-12-15",
    readTime: "9 min read",
    category: "API Design",
    tags: ["GraphQL", "REST", "API", "Architecture"],
    featured: false,
  },
]

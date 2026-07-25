import type React from "react"
import type { Metadata } from "next"
import { Cinzel, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import dynamic from "next/dynamic"
import "./globals.css"

// Skip SSR for components that rely on browser APIs (window, Audio, localStorage).
// Without ssr:false Next.js tries to prerender them during static generation,
// where React hooks and browser globals don't exist, crashing the build.
const MusicPlayer = dynamic(
  () => import("@/components/music-player").then((m) => m.MusicPlayer),
  { ssr: false }
)
const ChatWidget = dynamic(
  () => import("@/components/chat-widget").then((m) => m.ChatWidget),
  { ssr: false }
)

const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-cinzel" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })

export const metadata: Metadata = {
  title: "Selvahini Kamalarajan",
  description:
    "A cinematic developer portfolio inspired by Interstellar, featuring 3D elements, parallax backgrounds, and cosmic exploration themes.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${cinzel.variable} ${geistMono.variable} font-sans antialiased`}>
        {children}
        <MusicPlayer />
        <ChatWidget />
        <Analytics />
      </body>
    </html>
  )
}

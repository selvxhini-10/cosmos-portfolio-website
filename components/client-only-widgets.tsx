"use client"

import dynamic from "next/dynamic"

// `ssr: false` is only permitted inside Client Components (Next.js 16+).
// This thin wrapper lets the Server Component layout include browser-only
// widgets without triggering the "ssr:false in Server Component" build error.
const MusicPlayer = dynamic(
  () => import("@/components/music-player").then((m) => m.MusicPlayer),
  { ssr: false }
)

const ChatWidget = dynamic(
  () => import("@/components/chat-widget").then((m) => m.ChatWidget),
  { ssr: false }
)

export function ClientOnlyWidgets() {
  return (
    <>
      <MusicPlayer />
      <ChatWidget />
    </>
  )
}

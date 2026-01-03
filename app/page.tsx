"use client"

import { VideoBackground } from "@/components/video-background"
import { Loading } from "@/components/loading"

export default function RootPage() {
  return (
    <div className="relative w-full h-screen overflow-hidden isolate">
      <VideoBackground />
      <div className="relative z-10">
        <Loading />
      </div>
    </div>
  )
}

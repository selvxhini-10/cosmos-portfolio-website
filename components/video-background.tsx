import React from "react"
import { CosmicBackground } from "@/components/cosmic-background"

export function VideoBackground() {
  return (
    <div className="absolute inset-0 z-0 h-full w-full bg-cosmic-black">
      <CosmicBackground />
      <div className="absolute inset-0 bg-cosmic-black/40" />
    </div>
  )
}

export default VideoBackground

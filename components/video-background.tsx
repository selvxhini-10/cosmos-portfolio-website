import React from "react"

export function VideoBackground() {
  return (
    <video
      className="absolute inset-0 w-full h-full object-cover z-0"
      autoPlay
      muted
      loop
      playsInline
    >
      <source src="/videos/galaxy.mp4" type="video/mp4" />
    </video>
  )
}

export default VideoBackground

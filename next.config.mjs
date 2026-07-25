/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Required for ai/react streaming in Next.js App Router
  serverExternalPackages: ["ai", "@ai-sdk/react"],

  async headers() {
    return [
      {
        // Enable range requests for the audio player so browsers can seek
        source: "/audio/:path*",
        headers: [
          { key: "Accept-Ranges", value: "bytes" },
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ]
  },
}

export default nextConfig
"use client"

/**
 * A slow, looping top-to-bottom scan line across its container, for a HUD
 * "system scan" feel. Pure CSS animation (see the .animate-hero-scan /
 * @keyframes hero-scan block you need to add to globals.css below) —
 * no JS, negligible cost, and it composites over everything since it's
 * transparent except for the thin core line.
 *
 * v2: thinner and much less glowy — a hairline with a soft, narrow falloff
 * rather than a wide glowing band, closer to a real HUD readout.
 *
 * Usage: drop it as the LAST child of your hero <section> so it sweeps over
 * both the background and the text content:
 *   <section className="relative ...">
 *     ...
 *     <ScannerSweep />
 *   </section>
 */
export function ScannerSweep({ className = "" }: { className?: string }) {
  return (
    <div
      className={`absolute inset-0 z-20 overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <div
        className="absolute left-0 right-0 h-10 animate-hero-scan"
        style={{
          background:
            "linear-gradient(to bottom, transparent, rgba(255,200,140,0.04) 48%, rgba(255,200,140,0.04) 52%, transparent)",
        }}
      >
        <div
          className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-cosmic-gold/40"
          style={{ boxShadow: "0 0 6px 0.5px rgba(255,180,100,0.3)" }}
        />
      </div>
    </div>
  )
}
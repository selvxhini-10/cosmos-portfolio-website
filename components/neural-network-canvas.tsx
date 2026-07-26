"use client"

import { useEffect, useRef, useState } from "react"

// ─── Types ────────────────────────────────────────────────────────────────────
interface Node {
  id: number
  x: number
  y: number
  layer: number
  activation: number   // 0-1, drives brightness
  targetActivation: number
  pulsePhase: number
}

interface Edge {
  from: number
  to: number
  weight: number       // -1 to 1, drives colour (neg=inhibitory, pos=excitatory)
  signal: number       // travelling dot position 0-1 (-1 = idle)
  signalSpeed: number
}

/**
 * NeuralNetworkCanvas
 *
 * Interactive canvas neural network.
 *  - Layer topology: [3, 5, 5, 3] — matches the CE/AI framing (input→hidden→output)
 *  - Mouse hover over a node fires it: activation cascades through edges forward
 *  - Travelling "signal" dots move along each edge with random speed variation
 *  - Excitatory edges render in gold, inhibitory in deep red
 *  - All rendering on one canvas, single RAF, paused when tab hidden
 *  - prefers-reduced-motion: draws static snapshot, no RAF
 *
 * Design language: mission-control telemetry (Image 1) × circuit schematic (Image 2)
 * Colour palette stays within the existing cosmic-gold / cosmic-orange tokens.
 */
export function NeuralNetworkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef  = useRef({ x: -1, y: -1 })
  const [activeNode, setActiveNode] = useState<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    // ── Layout ──────────────────────────────────────────────────────────────
    const LAYERS = [3, 5, 5, 3]
    const LAYER_LABELS = ["INPUT", "HIDDEN·1", "HIDDEN·2", "OUTPUT"]
    const NODE_R = 9
    const CANVAS_PAD = 48

    let W = 0, H = 0, dpr = 1
    let nodes: Node[] = []
    let edges: Edge[] = []
    let rafId = 0
    let running = true

    const buildGraph = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      W = canvas.clientWidth
      H = canvas.clientHeight
      canvas.width  = Math.floor(W * dpr)
      canvas.height = Math.floor(H * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      nodes = []
      edges = []

      let id = 0
      const layerXs = LAYERS.map((_, li) =>
        CANVAS_PAD + (W - CANVAS_PAD * 2) * (li / (LAYERS.length - 1))
      )

      LAYERS.forEach((count, li) => {
        const totalH = H - CANVAS_PAD * 2
        const step   = count > 1 ? totalH / (count - 1) : 0
        const startY = count === 1 ? H / 2 : CANVAS_PAD

        for (let ni = 0; ni < count; ni++) {
          nodes.push({
            id,
            x: layerXs[li],
            y: startY + ni * step,
            layer: li,
            activation: 0.15 + Math.random() * 0.15,
            targetActivation: 0.15 + Math.random() * 0.15,
            pulsePhase: Math.random() * Math.PI * 2,
          })
          id++
        }
      })

      // Connect adjacent layers fully
      let offset = 0
      for (let li = 0; li < LAYERS.length - 1; li++) {
        const fromCount = LAYERS[li]
        const toCount   = LAYERS[li + 1]
        for (let fi = 0; fi < fromCount; fi++) {
          for (let ti = 0; ti < toCount; ti++) {
            edges.push({
              from: offset + fi,
              to:   offset + fromCount + ti,
              weight: Math.random() * 2 - 1,
              signal: -1,
              signalSpeed: 0.004 + Math.random() * 0.006,
            })
          }
        }
        offset += fromCount
      }

      // Seed some travelling signals
      edges.forEach(e => {
        if (Math.random() > 0.6) e.signal = Math.random()
      })
    }

    // ── Hit test ────────────────────────────────────────────────────────────
    const hitNode = (mx: number, my: number): number | null => {
      for (const n of nodes) {
        const dx = n.x - mx, dy = n.y - my
        if (dx * dx + dy * dy < (NODE_R + 8) ** 2) return n.id
      }
      return null
    }

    const onMouseMove = (e: MouseEvent) => {
      const r  = canvas.getBoundingClientRect()
      const mx = e.clientX - r.left
      const my = e.clientY - r.top
      mouseRef.current = { x: mx, y: my }
      const hit = hitNode(mx, my)
      if (hit !== null) {
        // Fire hovered node and cascade forward
        nodes[hit].targetActivation = 1.0
        // Activate outgoing edges' targets
        edges.filter(e => e.from === hit).forEach(e => {
          nodes[e.to].targetActivation = Math.min(1, nodes[e.to].targetActivation + 0.6)
          e.signal = 0  // spawn signal from this node
        })
        setActiveNode(hit)
      } else {
        setActiveNode(null)
      }
    }
    const onMouseLeave = () => {
      mouseRef.current = { x: -1, y: -1 }
      setActiveNode(null)
    }

    // ── Render ──────────────────────────────────────────────────────────────
    const render = () => {
      if (!running) return
      ctx.clearRect(0, 0, W, H)

      // Layer label lines
      LAYERS.forEach((_, li) => {
        const x = CANVAS_PAD + (W - CANVAS_PAD * 2) * (li / (LAYERS.length - 1))
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, 8)
        ctx.strokeStyle = "rgba(255,180,100,0.12)"
        ctx.lineWidth = 1
        ctx.stroke()
        ctx.fillStyle = "rgba(255,180,100,0.3)"
        ctx.font = `500 9px 'Geist Mono', monospace`
        ctx.textAlign = "center"
        ctx.fillText(LAYER_LABELS[li], x, 22)
      })

      // Edges
      for (const e of edges) {
        const fn = nodes[e.from], tn = nodes[e.to]

        // Lerp signal
        if (e.signal >= 0) {
          e.signal += e.signalSpeed
          if (e.signal > 1) e.signal = -1
        } else if (Math.random() < 0.003) {
          e.signal = 0
        }

        const alpha   = 0.08 + (fn.activation + tn.activation) * 0.12
        const isExcit = e.weight > 0
        const edgeCol = isExcit
          ? `rgba(255,180,100,${alpha})`
          : `rgba(220,60,54,${alpha * 0.8})`

        ctx.beginPath()
        ctx.moveTo(fn.x, fn.y)
        ctx.lineTo(tn.x, tn.y)
        ctx.strokeStyle = edgeCol
        ctx.lineWidth   = 0.8
        ctx.stroke()

        // Travelling signal dot
        if (e.signal >= 0) {
          const sx = fn.x + (tn.x - fn.x) * e.signal
          const sy = fn.y + (tn.y - fn.y) * e.signal
          const dotCol = isExcit ? "rgba(255,200,120,0.9)" : "rgba(255,80,70,0.9)"
          ctx.beginPath()
          ctx.arc(sx, sy, 2.5, 0, Math.PI * 2)
          ctx.fillStyle = dotCol
          ctx.fill()
        }
      }

      // Nodes
      for (const n of nodes) {
        n.pulsePhase += 0.025
        // Decay activation toward resting
        n.activation += (n.targetActivation - n.activation) * 0.06
        n.targetActivation += (0.2 - n.targetActivation) * 0.01

        const pulse  = 0.5 + Math.sin(n.pulsePhase) * 0.5
        const bright = n.activation
        const r      = NODE_R + pulse * 1.5 * bright

        // Outer glow ring
        const grd = ctx.createRadialGradient(n.x, n.y, r * 0.4, n.x, n.y, r * 2.5)
        grd.addColorStop(0, `rgba(255,180,100,${bright * 0.35})`)
        grd.addColorStop(1, "rgba(255,180,100,0)")
        ctx.beginPath()
        ctx.arc(n.x, n.y, r * 2.5, 0, Math.PI * 2)
        ctx.fillStyle = grd
        ctx.fill()

        // Node circle
        ctx.beginPath()
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(5,3,10,0.95)`
        ctx.fill()
        ctx.strokeStyle = `rgba(255,180,100,${0.3 + bright * 0.6})`
        ctx.lineWidth = 1.2
        ctx.stroke()

        // Inner core dot
        ctx.beginPath()
        ctx.arc(n.x, n.y, r * 0.38, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,180,100,${bright * 0.9})`
        ctx.fill()
      }

      rafId = requestAnimationFrame(render)
    }

    const onVisibility = () => {
      if (document.hidden) { running = false; cancelAnimationFrame(rafId) }
      else if (!running)   { running = true;  rafId = requestAnimationFrame(render) }
    }

    buildGraph()
    window.addEventListener("resize", buildGraph, { passive: true })
    canvas.addEventListener("mousemove", onMouseMove, { passive: true })
    canvas.addEventListener("mouseleave", onMouseLeave)
    document.addEventListener("visibilitychange", onVisibility)

    if (reduceMotion) {
      // Single static frame
      ctx.clearRect(0, 0, W, H)
      edges.forEach(e => {
        const fn = nodes[e.from], tn = nodes[e.to]
        ctx.beginPath(); ctx.moveTo(fn.x, fn.y); ctx.lineTo(tn.x, tn.y)
        ctx.strokeStyle = "rgba(255,180,100,0.1)"; ctx.lineWidth = 0.8; ctx.stroke()
      })
      nodes.forEach(n => {
        ctx.beginPath(); ctx.arc(n.x, n.y, NODE_R, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(5,3,10,0.95)"; ctx.fill()
        ctx.strokeStyle = "rgba(255,180,100,0.4)"; ctx.lineWidth = 1.2; ctx.stroke()
      })
    } else {
      rafId = requestAnimationFrame(render)
    }

    return () => {
      running = false
      cancelAnimationFrame(rafId)
      window.removeEventListener("resize", buildGraph)
      canvas.removeEventListener("mousemove", onMouseMove)
      canvas.removeEventListener("mouseleave", onMouseLeave)
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [])

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-cosmic-gold/20 bg-cosmic-black/60"
         style={{ height: "340px", boxShadow: "inset 0 0 60px rgba(255,180,100,0.03)" }}>
      <canvas ref={canvasRef} aria-hidden="true" className="block w-full h-full cursor-crosshair" />
      {/* Corner HUD labels */}
      <div className="absolute top-3 left-4 pointer-events-none">
        <p className="text-[0.6rem] font-mono tracking-widest text-cosmic-white/25 uppercase">// NEURAL NET · LAYER TOPOLOGY [3 › 5 › 5 › 3]</p>
      </div>
      <div className="absolute top-3 right-4 pointer-events-none flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-cosmic-gold animate-pulse" />
        <span className="text-[0.6rem] font-mono text-cosmic-gold/40 uppercase tracking-widest">LIVE</span>
      </div>
      {activeNode !== null && (
        <div className="absolute bottom-3 left-4 pointer-events-none">
          <p className="text-[0.6rem] font-mono text-cosmic-gold/60 tracking-widest">
            NODE_{String(activeNode).padStart(2, "0")} · FIRING
          </p>
        </div>
      )}
    </div>
  )
}

export default NeuralNetworkCanvas

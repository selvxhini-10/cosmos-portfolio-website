"use client"

import { useEffect, useRef, useCallback } from "react"

// ---------------------------------------------------------------------------
// PCB schematic geometry – drawn once onto an offscreen canvas and reused
// ---------------------------------------------------------------------------

function drawPCBLayer(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.clearRect(0, 0, w, h)

  const gold   = "#ffb460"
  const orange = "#ff6a20"
  const dim    = "#ff8c2a"
  const bright = "#ffe0a0"

  const line = (x1: number, y1: number, x2: number, y2: number, color = gold, lw = 1.5) => {
    ctx.strokeStyle = color; ctx.lineWidth = lw
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke()
  }
  const rect = (x: number, y: number, rw: number, rh: number, color = gold, lw = 1.2) => {
    ctx.strokeStyle = color; ctx.lineWidth = lw
    ctx.strokeRect(x, y, rw, rh)
  }
  const pad = (x: number, y: number, r = 4, color = gold) => {
    ctx.fillStyle = color
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill()
    ctx.strokeStyle = "rgba(0,0,0,0.6)"; ctx.lineWidth = 1
    ctx.beginPath(); ctx.arc(x, y, r * 0.45, 0, Math.PI * 2); ctx.stroke()
  }
  const sqPad = (x: number, y: number, s = 7, color = gold) => {
    ctx.fillStyle = color; ctx.fillRect(x - s/2, y - s/2, s, s)
    ctx.strokeStyle = "rgba(0,0,0,0.5)"; ctx.lineWidth = 1
    ctx.strokeRect(x - s/3, y - s/3, s * 0.66, s * 0.66)
  }
  const label = (x: number, y: number, txt: string, size = 7, color = dim) => {
    ctx.fillStyle = color; ctx.font = `${size}px monospace`
    ctx.fillText(txt, x, y)
  }
  const via = (x: number, y: number, color = orange) => {
    ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, 3.5, 0, Math.PI * 2); ctx.fill()
    ctx.strokeStyle = bright; ctx.lineWidth = 0.8
    ctx.beginPath(); ctx.arc(x, y, 3.5, 0, Math.PI * 2); ctx.stroke()
    ctx.fillStyle = "rgba(0,0,0,0.7)"
    ctx.beginPath(); ctx.arc(x, y, 1.5, 0, Math.PI * 2); ctx.fill()
  }
  const chip = (x: number, y: number, cw: number, ch: number, pins: number, name: string) => {
    ctx.fillStyle = "rgba(20,10,0,0.85)"; ctx.fillRect(x, y, cw, ch)
    rect(x, y, cw, ch, gold, 1.4)
    const rows = Math.floor(pins / 2)
    const step = ch / (rows + 1)
    for (let i = 1; i <= rows; i++) {
      const py = y + step * i
      sqPad(x - 6, py, 5, gold); sqPad(x + cw + 6, py, 5, gold)
      line(x - 9, py, x, py, dim, 1); line(x + cw, py, x + cw + 9, py, dim, 1)
    }
    ctx.fillStyle = bright; ctx.font = `bold ${Math.min(9, cw / name.length * 1.4)}px monospace`
    ctx.textAlign = "center"; ctx.fillText(name, x + cw/2, y + ch/2 + 3); ctx.textAlign = "left"
    ctx.beginPath(); ctx.arc(x + 8, y, 4, 0, Math.PI); ctx.fillStyle = "rgba(255,180,80,0.2)"; ctx.fill()
    ctx.strokeStyle = gold; ctx.lineWidth = 0.8; ctx.stroke()
  }

  // Background grid
  ctx.strokeStyle = "rgba(255,140,40,0.07)"; ctx.lineWidth = 0.5
  for (let gx = 0; gx < w; gx += 24) { ctx.beginPath(); ctx.moveTo(gx,0); ctx.lineTo(gx,h); ctx.stroke() }
  for (let gy = 0; gy < h; gy += 24) { ctx.beginPath(); ctx.moveTo(0,gy); ctx.lineTo(w,gy); ctx.stroke() }

  // PCB border
  ctx.strokeStyle = "rgba(255,180,80,0.25)"; ctx.lineWidth = 2; ctx.setLineDash([8,4])
  ctx.strokeRect(10, 10, w - 20, h - 20)
  ctx.setLineDash([])

  // STM32
  chip(60, 60, 90, 110, 16, "STM32")
  line(150, 100, 220, 100, gold, 1.8); line(220, 100, 220, 140, gold, 1.8); line(220, 140, 310, 140, gold, 1.8)
  via(220, 100); via(220, 140); label(155, 95, "UART_TX", 6)
  line(150, 115, 240, 115, dim, 1.4); line(240, 115, 240, 160, dim, 1.4)
  via(240, 115); label(155, 128, "UART_RX", 6)
  line(60, 140, 30, 140, orange, 1.6); line(30, 140, 30, 240, orange, 1.6)
  via(30, 140); via(30, 240); label(12, 135, "MOSI", 6, orange)
  line(60, 155, 20, 155, dim, 1.2); line(20, 155, 20, 260, dim, 1.2)
  label(2, 150, "MISO", 6, dim)

  // MAX-10 FPGA
  chip(w - 200, 50, 110, 130, 20, "MAX-10\nFPGA")
  line(w-200,90, w-230,90, gold,1.8); line(w-230,90, w-230,190,gold,1.8); line(w-230,190,w-260,190,gold,1.8)
  via(w-230,90); via(w-230,190); label(w-224,84,"IO[0]",6)
  line(w-200,105,w-250,105,dim,1.4); line(w-250,105,w-250,210,dim,1.4)
  via(w-250,105); label(w-244,99,"IO[1]",6)
  const jx = w-170; const jy = 15
  label(jx,jy+6,"JTAG",7,bright)
  for (let j=0;j<5;j++) {
    sqPad(jx+j*14,jy+12,6,j===0?orange:gold)
    line(jx+j*14,jy+18,jx+j*14,jy+50,dim,1)
    label(jx+j*14-3,jy+22,["TDI","TDO","TCK","TMS","GND"][j],5)
  }

  // LDO power
  chip(40,h-160,70,60,8,"LDO\n3V3")
  line(0,h-130,40,h-130,"#ff4136",2.5); label(2,h-134,"+5V",7,"#ff6655"); via(40,h-130)
  line(110,h-130,200,h-130,orange,2.5); label(115,h-134,"3V3",7,bright); via(200,h-130)
  line(200,h-130,200,h-80,orange,2); via(200,h-80)
  for (let ci=0;ci<4;ci++) {
    const cx=230+ci*50; const cy=h-120
    pad(cx,cy-8,4,gold); pad(cx,cy+8,4,gold)
    line(cx-10,cy-3,cx+10,cy-3,bright,2.5); line(cx-10,cy+3,cx+10,cy+3,bright,2.5)
    line(cx,cy-8,cx,cy-3,gold,1.2); line(cx,cy+3,cx,cy+8,gold,1.2)
    label(cx-5,cy+20,"100nF",5,dim)
  }
  ctx.strokeStyle = "rgba(255,100,30,0.12)"; ctx.lineWidth = 1
  for (let hx=0;hx<w;hx+=10) { ctx.beginPath(); ctx.moveTo(hx,h-30); ctx.lineTo(hx+20,h-10); ctx.stroke() }
  label(w/2-16,h-14,"GND PLANE",7,"rgba(255,140,60,0.4)")

  // Connector header
  const hdrX=w-140; const hdrY=h-180
  rect(hdrX,hdrY,100,130,gold,1.2); label(hdrX+20,hdrY-6,"J1 – I/O HDR",7,bright)
  const pinNames=["VCC","GND","PA0","PA1","PA2","PA3","PB0","PB1","CLK","RST"]
  pinNames.forEach((pn,pi) => {
    const py=hdrY+10+pi*11
    sqPad(hdrX+10,py,5,pi<2?orange:gold); sqPad(hdrX+90,py,5,gold)
    label(hdrX+18,py+4,pn,6,pi<2?bright:dim)
    line(hdrX+10,py,hdrX+90,py,"rgba(255,160,60,0.15)",0.5)
  })

  // Oscillator
  const ox=w/2-30; const oy=h/2-25
  rect(ox,oy,60,50,bright,1.5); label(ox+8,oy+22,"16MHz",8,bright); label(ox+10,oy+33,"XTAL",7,dim)
  pad(ox,oy+10,4,gold); pad(ox,oy+40,4,gold); pad(ox+60,oy+10,4,gold); pad(ox+60,oy+40,4,gold)
  line(ox,oy+10,ox-40,oy+10,gold,1.4); line(ox-40,oy+10,ox-40,oy+40,gold,1.4); via(ox-40,oy+25)
  line(ox+60,oy+10,ox+100,oy+10,gold,1.4); via(ox+100,oy+10)

  // Misc traces
  const traces: [number,number,number,number][] = [
    [160,220,300,220],[300,220,300,280],[300,280,400,280],
    [180,250,180,340],[180,340,350,340],[w/2,30,w/2,50],[w/2,50,w/2+60,50],
  ]
  traces.forEach(([x1,y1,x2,y2],ti) => { line(x1,y1,x2,y2,ti%2===0?gold:dim,1.4); via(x2,y2) })
  ;[[165,218,"PD2"],[305,278,"PC5"],[185,338,"PB3"],[w/2+5,28,"VBUS"]].forEach(([lx,ly,lt]) =>
    label(Number(lx),Number(ly),String(lt),6))

  // Fiducials
  ;[[24,24],[w-24,24],[24,h-24],[w-24,h-24]].forEach(([fx,fy]) => {
    ctx.strokeStyle=gold; ctx.lineWidth=1
    ctx.beginPath(); ctx.arc(Number(fx),Number(fy),8,0,Math.PI*2); ctx.stroke()
    ctx.beginPath(); ctx.arc(Number(fx),Number(fy),2,0,Math.PI*2)
    ctx.fillStyle=orange; ctx.fill()
  })
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function PCBScannerMask({ targetId = "about-scanner-zone" }: { targetId?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pcbRef    = useRef<HTMLCanvasElement>(null)
  const mouseRef  = useRef<{ x: number; y: number; inside: boolean }>({ x: 0, y: 0, inside: false })
  const rafRef    = useRef<number>(0)
  const angleRef  = useRef(0)
  const RADIUS    = 120

  const buildPCB = useCallback(() => {
    const zone = document.getElementById(targetId)
    const pcb  = pcbRef.current
    if (!zone || !pcb) return
    const r   = zone.getBoundingClientRect()
    pcb.width  = r.width
    pcb.height = r.height
    drawPCBLayer(pcb.getContext("2d")!, r.width, r.height)
  }, [targetId])

  const render = useCallback(() => {
    const canvas = canvasRef.current
    const pcb    = pcbRef.current
    if (!canvas || !pcb) return

    const ctx = canvas.getContext("2d")!
    const { x, y, inside } = mouseRef.current
    const w = canvas.width; const h = canvas.height

    // Always fully clear — no overlay at all outside the circle
    ctx.clearRect(0, 0, w, h)

    if (inside) {
      // ── PCB reveal: clip to circle, draw schematic ──────────────────────
      ctx.save()
      ctx.beginPath(); ctx.arc(x, y, RADIUS, 0, Math.PI * 2); ctx.clip()

      // Dark PCB substrate tint so traces pop against it
      ctx.fillStyle = "rgb(0, 0, 0)"
      ctx.fillRect(0, 0, w, h)

      // PCB traces
      ctx.drawImage(pcb, 0, 0)

      // Radial edge vignette inside circle
      const grd = ctx.createRadialGradient(x, y, RADIUS * 0.65, x, y, RADIUS)
      grd.addColorStop(0, "rgba(255,130,30,0)")
      grd.addColorStop(1, "rgba(255,90,10,0.28)")
      ctx.fillStyle = grd; ctx.fillRect(0, 0, w, h)
      ctx.restore()

      // ── Rotating scan sweep ──────────────────────────────────────────────
      angleRef.current = (angleRef.current + 0.025) % (Math.PI * 2)
      const sweep = angleRef.current

      ctx.save()
      ctx.beginPath(); ctx.arc(x, y, RADIUS, 0, Math.PI * 2); ctx.clip()
      ctx.translate(x, y)
      // sweep sector gradient
      const sweepGrd = ctx.createLinearGradient(
        Math.cos(sweep - 0.6) * RADIUS, Math.sin(sweep - 0.6) * RADIUS,
        Math.cos(sweep) * RADIUS,       Math.sin(sweep) * RADIUS
      )
      sweepGrd.addColorStop(0, "rgba(255,180,60,0)")
      sweepGrd.addColorStop(1, "rgba(255,180,60,0.2)")
      ctx.fillStyle = sweepGrd
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, RADIUS, sweep - 0.9, sweep); ctx.closePath(); ctx.fill()
      ctx.restore()

      // sweep leading edge
      ctx.save()
      ctx.beginPath(); ctx.arc(x, y, RADIUS, 0, Math.PI * 2); ctx.clip()
      ctx.strokeStyle = "rgba(255,210,90,0.75)"; ctx.lineWidth = 1.5
      ctx.shadowColor = "#ffb460"; ctx.shadowBlur = 10
      ctx.beginPath(); ctx.moveTo(x, y)
      ctx.lineTo(x + Math.cos(sweep) * RADIUS, y + Math.sin(sweep) * RADIUS)
      ctx.stroke()
      ctx.restore()

      // ── Scanner ring + crosshair ─────────────────────────────────────────
      ctx.save()
      // outer glowing ring
      ctx.strokeStyle = "rgba(255,180,60,0.65)"; ctx.lineWidth = 1.5
      ctx.shadowColor = "#ffb460"; ctx.shadowBlur = 14
      ctx.beginPath(); ctx.arc(x, y, RADIUS, 0, Math.PI * 2); ctx.stroke()

      // tick marks
      ctx.shadowBlur = 0
      ctx.strokeStyle = "rgba(255,180,60,0.5)"; ctx.lineWidth = 1
      for (let t = 0; t < 32; t++) {
        const a   = (t / 32) * Math.PI * 2
        const len = t % 8 === 0 ? 9 : t % 4 === 0 ? 5 : 3
        ctx.beginPath()
        ctx.moveTo(x + Math.cos(a) * (RADIUS - len), y + Math.sin(a) * (RADIUS - len))
        ctx.lineTo(x + Math.cos(a) * RADIUS,         y + Math.sin(a) * RADIUS)
        ctx.stroke()
      }

      // crosshair at center
      ctx.strokeStyle = "rgba(255,180,60,0.4)"; ctx.lineWidth = 0.8
      const cs = 16
      ctx.beginPath()
      ctx.moveTo(x - cs, y); ctx.lineTo(x + cs, y)
      ctx.moveTo(x, y - cs); ctx.lineTo(x, y + cs)
      ctx.stroke()

      // degree readout just outside ring
      const deg = Math.round((sweep / (Math.PI * 2)) * 360)
      ctx.fillStyle = "rgba(255,200,100,0.75)"; ctx.font = "10px monospace"
      ctx.fillText(`${deg}°`, x + RADIUS + 8, y + 4)

      ctx.restore()
    }

    rafRef.current = requestAnimationFrame(render)
  }, [RADIUS])

  useEffect(() => {
    const zone   = document.getElementById(targetId)
    const canvas = canvasRef.current
    if (!zone || !canvas) return

    const sync = () => {
      const r = zone.getBoundingClientRect()
      canvas.width  = r.width
      canvas.height = r.height
      buildPCB()
    }
    sync()

    const onMove = (e: MouseEvent) => {
      const r = zone.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top, inside: true }
    }
    const onLeave = () => { mouseRef.current.inside = false }

    zone.addEventListener("mousemove", onMove)
    zone.addEventListener("mouseleave", onLeave)
    window.addEventListener("resize", sync)

    rafRef.current = requestAnimationFrame(render)
    return () => {
      zone.removeEventListener("mousemove", onMove)
      zone.removeEventListener("mouseleave", onLeave)
      window.removeEventListener("resize", sync)
      cancelAnimationFrame(rafRef.current)
    }
  }, [targetId, buildPCB, render])

  return (
    <>
      <canvas ref={pcbRef} style={{ display: "none" }} />
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 20,
        }}
      />
    </>
  )
}
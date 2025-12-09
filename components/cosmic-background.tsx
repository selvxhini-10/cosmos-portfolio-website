"use client"

import { useEffect, useRef } from "react"

// Particle displacement shader with WebGL
const vertexShaderSource = `
  attribute vec2 a_position;
  attribute vec2 a_texCoord;
  varying vec2 v_texCoord;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    v_texCoord = a_texCoord;
  }
`

const fragmentShaderSource = `
  precision mediump float;
  uniform vec2 u_mouse;
  uniform float u_time;
  uniform vec2 u_resolution;
  varying vec2 v_texCoord;
  
  // Noise function for organic movement
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }
  
  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    vec2 mouse = u_mouse / u_resolution;
    
    // Distance from mouse with falloff
    float dist = distance(uv, mouse);
    float displacement = smoothstep(0.3, 0.0, dist) * 0.08;
    
    // Create particle field
    vec2 particleUV = uv * 80.0;
    vec2 cell = floor(particleUV);
    vec2 frac = fract(particleUV);
    
    float particleRandom = random(cell);
    
    // Displace particles away from cursor
    vec2 particleCenter = vec2(0.5) + (uv - mouse) * displacement * 2.0;
    float particleDist = length(frac - particleCenter);
    
    // Animated stars moving across screen
    float movingStar = 0.0;
    for(float i = 0.0; i < 5.0; i++) {
      vec2 starPos = vec2(
        mod(u_time * 0.05 + i * 0.2 + particleRandom, 1.0),
        mod(uv.y + i * 0.15 + particleRandom * 0.5, 1.0)
      );
      float starDist = distance(uv, starPos);
      movingStar += smoothstep(0.008, 0.0, starDist) * (0.5 + particleRandom * 0.5);
    }
    
    // Static particle glow
    float particle = smoothstep(0.15, 0.0, particleDist) * (0.3 + particleRandom * 0.4);
    
    // Constellation lines (subtle connecting lines)
    float constellation = 0.0;
    if(mod(cell.x + cell.y, 7.0) < 1.0) {
      float lineX = abs(frac.x - 0.5);
      constellation = smoothstep(0.02, 0.0, lineX) * 0.15;
    }
    
    // Combine effects
    float brightness = particle + movingStar + constellation;
    vec3 color = mix(
      vec3(1.0, 0.95, 0.9),  // Warm white
      vec3(1.0, 0.7, 0.4),   // Golden orange
      particleRandom
    );
    
    gl_FragColor = vec4(color * brightness, brightness * 0.8);
  }
`

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  hue: number
}

export function CosmicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const glCanvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const particlesRef = useRef<Particle[]>([])

  // WebGL particle displacement effect
  useEffect(() => {
    const canvas = glCanvasRef.current
    if (!canvas) return

    const gl = canvas.getContext("webgl")
    if (!gl) {
      console.warn("WebGL not supported")
      return
    }

    // Setup WebGL
    const vertexShader = gl.createShader(gl.VERTEX_SHADER)!
    gl.shaderSource(vertexShader, vertexShaderSource)
    gl.compileShader(vertexShader)

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!
    gl.shaderSource(fragmentShader, fragmentShaderSource)
    gl.compileShader(fragmentShader)

    const program = gl.createProgram()!
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    gl.useProgram(program)

    // Setup geometry (full screen quad)
    const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1])
    const texCoords = new Float32Array([0, 0, 1, 0, 0, 1, 1, 1])

    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW)

    const positionLocation = gl.getAttribLocation(program, "a_position")
    gl.enableVertexAttribArray(positionLocation)
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

    const texCoordBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW)

    const texCoordLocation = gl.getAttribLocation(program, "a_texCoord")
    gl.enableVertexAttribArray(texCoordLocation)
    gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0)

    // Get uniform locations
    const mouseLocation = gl.getUniformLocation(program, "u_mouse")
    const timeLocation = gl.getUniformLocation(program, "u_time")
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution")

    // Enable blending
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    // Resize handler
    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height)
    }
    resize()
    window.addEventListener("resize", resize)

    // Animation loop
    let raf: number
    const startTime = Date.now()
    const animate = () => {
      const time = (Date.now() - startTime) / 1000

      gl.uniform2f(mouseLocation, mouseRef.current.x, mouseRef.current.y)
      gl.uniform1f(timeLocation, time)

      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

      raf = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
      gl.deleteProgram(program)
      gl.deleteShader(vertexShader)
      gl.deleteShader(fragmentShader)
    }
  }, [])

  // Canvas 2D for additional animated stars
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")!

    // Initialize shooting stars
    const createShootingStar = (): Particle => ({
      x: Math.random() * canvas.width,
      y: -20,
      vx: (Math.random() - 0.5) * 2,
      vy: Math.random() * 3 + 2,
      size: Math.random() * 2 + 1,
      opacity: 1,
      hue: Math.random() * 60 + 30, // Gold to orange range
    })

    for (let i = 0; i < 50; i++) {
      particlesRef.current.push(createShootingStar())
    }

    let raf: number
    const animate = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particlesRef.current.forEach((particle, index) => {
        particle.x += particle.vx
        particle.y += particle.vy
        particle.opacity -= 0.003

        // Reset particle if off-screen
        if (particle.y > canvas.height || particle.opacity <= 0) {
          particlesRef.current[index] = createShootingStar()
          return
        }

        // Draw particle with trail
        ctx.save()
        ctx.globalAlpha = particle.opacity
        const gradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.size * 3)
        gradient.addColorStop(0, `hsla(${particle.hue}, 100%, 70%, 0.8)`)
        gradient.addColorStop(1, `hsla(${particle.hue}, 100%, 50%, 0)`)
        ctx.fillStyle = gradient
        ctx.fillRect(particle.x - particle.size * 3, particle.y - particle.size * 3, particle.size * 6, particle.size * 6)
        ctx.restore()
      })

      raf = requestAnimationFrame(animate)
    }
    animate()

    return () => cancelAnimationFrame(raf)
  }, [])

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none">
      {/* WebGL particle displacement layer */}
      <canvas ref={glCanvasRef} className="absolute inset-0 w-full h-full" style={{ mixBlendMode: "screen" }} />
      {/* Canvas 2D shooting stars layer */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ mixBlendMode: "screen" }} />
    </div>
  )
}

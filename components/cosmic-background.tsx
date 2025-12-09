"use client"

import { useEffect, useRef } from "react"

// Pure CSS Shooting Stars Component
function ShootingStars() {
  return (
    <div className="shooting-stars-container">
      {[...Array(10)].map((_, i) => (
        <span key={i} className={`shooting-star shooting-star-${i + 1}`} />
      ))}
      <style jsx>{`
        .shooting-stars-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .shooting-star {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 4px;
          height: 4px;
          background: #fff;
          border-radius: 50%;
          box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.1), 0 0 0 8px rgba(255, 255, 255, 0.1),
            0 0 20px rgba(255, 255, 255, 0.1);
          animation: animate 3s linear infinite;
        }

        .shooting-star::before {
          content: "";
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 300px;
          height: 1px;
          background: linear-gradient(90deg, #fff, transparent);
        }

        @keyframes animate {
          0% {
            transform: rotate(315deg) translateX(0);
            opacity: 1;
          }
          70% {
            opacity: 1;
          }
          100% {
            transform: rotate(315deg) translateX(-1000px);
            opacity: 0;
          }
        }

        .shooting-star-1 {
          top: 0;
          right: 0;
          left: initial;
          animation-delay: 0s;
          animation-duration: 1s;
        }
        .shooting-star-2 {
          top: 0;
          right: 80px;
          left: initial;
          animation-delay: 0.2s;
          animation-duration: 3s;
        }
        .shooting-star-3 {
          top: 80px;
          right: 0px;
          left: initial;
          animation-delay: 0.4s;
          animation-duration: 2s;
        }
        .shooting-star-4 {
          top: 0;
          right: 180px;
          left: initial;
          animation-delay: 0.6s;
          animation-duration: 1.5s;
        }
        .shooting-star-5 {
          top: 0;
          right: 400px;
          left: initial;
          animation-delay: 0.8s;
          animation-duration: 2.5s;
        }
        .shooting-star-6 {
          top: 0;
          right: 600px;
          left: initial;
          animation-delay: 1s;
          animation-duration: 3s;
        }
        .shooting-star-7 {
          top: 300px;
          right: 0px;
          left: initial;
          animation-delay: 1.2s;
          animation-duration: 1.75s;
        }
        .shooting-star-8 {
          top: 0px;
          right: 700px;
          left: initial;
          animation-delay: 1.4s;
          animation-duration: 1.25s;
        }
        .shooting-star-9 {
          top: 0px;
          right: 1000px;
          left: initial;
          animation-delay: 0.75s;
          animation-duration: 2.25s;
        }
        .shooting-star-10 {
          top: 0px;
          right: 450px;
          left: initial;
          animation-delay: 2.75s;
          animation-duration: 2.75s;
        }
      `}</style>
    </div>
  )
}

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
    
    // Static particle glow
    float particle = smoothstep(0.15, 0.0, particleDist) * (0.3 + particleRandom * 0.4);
    
    // Constellation lines (subtle connecting lines)
    float constellation = 0.0;
    if(mod(cell.x + cell.y, 7.0) < 1.0) {
      float lineX = abs(frac.x - 0.5);
      constellation = smoothstep(0.02, 0.0, lineX) * 0.15;
    }
    
    // Combine effects
    float brightness = particle + constellation;
    vec3 color = mix(
      vec3(1.0, 0.95, 0.9),  // Warm white
      vec3(1.0, 0.7, 0.4),   // Golden orange
      particleRandom
    );
    
    gl_FragColor = vec4(color * brightness, brightness * 0.8);
  }
`

export function CosmicBackground() {
  const glCanvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })

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
      {/* CSS Shooting stars layer */}
      <ShootingStars />
    </div>
  )
}

"use client"

import { useEffect, useRef } from "react"

export function HexagonBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Carbon fiber hexagon properties
    const hexSize = 25
    const hexSpacing = 52
    const hexagonPattern = []

    // Create hexagon pattern grid
    const createHexagonGrid = () => {
      hexagonPattern.length = 0
      const rows = Math.ceil(canvas.height / hexSpacing) + 4
      const cols = Math.ceil(canvas.width / hexSpacing) + 4

      for (let row = -2; row < rows; row++) {
        for (let col = -2; col < cols; col++) {
          const offsetX = row % 2 === 0 ? 0 : hexSpacing / 2
          const x = col * hexSpacing + offsetX
          const y = row * hexSpacing

          // Add some variation to make it look more natural
          const sizeVariation = Math.random() * 0.1 + 0.95

          hexagonPattern.push({
            x,
            y,
            size: hexSize * sizeVariation,
            rotation: Math.PI / 6, // 30 degrees rotation for sharp angles
            glowIntensity: 0,
          })
        }
      }
    }

    // Create glow points
    const glowPoints = []
    const createGlowPoints = () => {
      glowPoints.length = 0
      for (let i = 0; i < 5; i++) {
        glowPoints.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: 150 + Math.random() * 250,
          intensity: 0.7 + Math.random() * 0.3,
          speed: {
            x: (Math.random() - 0.5) * 0.5,
            y: (Math.random() - 0.5) * 0.5,
          },
        })
      }
    }

    // Draw a single hexagon
    const drawHexagon = (x, y, size, rotation, glowIntensity) => {
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(rotation)

      // Draw outer hexagon
      ctx.beginPath()
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i
        const hx = size * Math.cos(angle)
        const hy = size * Math.sin(angle)
        if (i === 0) {
          ctx.moveTo(hx, hy)
        } else {
          ctx.lineTo(hx, hy)
        }
      }
      ctx.closePath()

      // Carbon fiber effect
      const gradient = ctx.createLinearGradient(-size, -size, size, size)
      gradient.addColorStop(0, `rgba(5, 5, 5, ${0.9 + glowIntensity * 0.1})`)
      gradient.addColorStop(0.5, `rgba(15, 15, 15, ${0.95 + glowIntensity * 0.05})`)
      gradient.addColorStop(1, `rgba(0, 0, 0, ${0.9 + glowIntensity * 0.1})`)
      ctx.fillStyle = gradient
      ctx.fill()

      // Edge highlight for carbon fiber look
      ctx.strokeStyle = `rgba(40, 40, 40, ${0.7 + glowIntensity * 0.3})`
      ctx.lineWidth = 1
      ctx.stroke()

      // Inner pattern for carbon fiber texture
      ctx.beginPath()
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i
        const innerSize = size * 0.7
        const hx = innerSize * Math.cos(angle)
        const hy = innerSize * Math.sin(angle)
        if (i === 0) {
          ctx.moveTo(hx, hy)
        } else {
          ctx.lineTo(hx, hy)
        }
      }
      ctx.closePath()
      ctx.strokeStyle = `rgba(30, 30, 30, ${0.6 + glowIntensity * 0.4})`
      ctx.lineWidth = 0.5
      ctx.stroke()

      // Add dramatic glow effect when illuminated
      if (glowIntensity > 0.1) {
        ctx.shadowBlur = 15 * glowIntensity
        ctx.shadowColor = "#00DC82"
        ctx.strokeStyle = `rgba(0, 220, 130, ${glowIntensity * 0.6})`
        ctx.lineWidth = 1.5 * glowIntensity
        ctx.stroke()

        // Extra inner glow for more dramatic effect
        if (glowIntensity > 0.4) {
          ctx.beginPath()
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i
            const innerSize = size * 0.4
            const hx = innerSize * Math.cos(angle)
            const hy = innerSize * Math.sin(angle)
            if (i === 0) {
              ctx.moveTo(hx, hy)
            } else {
              ctx.lineTo(hx, hy)
            }
          }
          ctx.closePath()
          ctx.strokeStyle = `rgba(0, 220, 130, ${glowIntensity * 0.3})`
          ctx.stroke()
        }
      }

      ctx.restore()
    }

    // Draw the entire scene
    const drawScene = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw background
      ctx.fillStyle = "#000000"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw glow effects first
      glowPoints.forEach((glow) => {
        const gradient = ctx.createRadialGradient(glow.x, glow.y, 0, glow.x, glow.y, glow.radius)
        gradient.addColorStop(0, `rgba(0, 220, 130, ${0.2 * glow.intensity})`)
        gradient.addColorStop(0.5, `rgba(0, 220, 130, ${0.05 * glow.intensity})`)
        gradient.addColorStop(1, "rgba(0, 220, 130, 0)")
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(glow.x, glow.y, glow.radius, 0, Math.PI * 2)
        ctx.fill()
      })

      // Update hexagon glow intensities based on proximity to glow points
      hexagonPattern.forEach((hex) => {
        hex.glowIntensity = 0
        glowPoints.forEach((glow) => {
          const dx = hex.x - glow.x
          const dy = hex.y - glow.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          if (distance < glow.radius) {
            const intensity = (1 - distance / glow.radius) * glow.intensity
            hex.glowIntensity = Math.max(hex.glowIntensity, intensity)
          }
        })
      })

      // Draw all hexagons
      hexagonPattern.forEach((hex) => {
        drawHexagon(hex.x, hex.y, hex.size, hex.rotation, hex.glowIntensity)
      })
    }

    // Animation loop
    const animate = () => {
      // Move glow points
      glowPoints.forEach((glow) => {
        glow.x += glow.speed.x
        glow.y += glow.speed.y

        // Bounce off edges
        if (glow.x < -glow.radius || glow.x > canvas.width + glow.radius) {
          glow.speed.x *= -1
        }
        if (glow.y < -glow.radius || glow.y > canvas.height + glow.radius) {
          glow.speed.y *= -1
        }
      })

      drawScene()
      requestAnimationFrame(animate)
    }

    // Initialize
    createHexagonGrid()
    createGlowPoints()
    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10" />
}


"use client"

import { useEffect, useRef } from "react"

export default function AnimatedGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      const container = canvas.parentElement
      if (!container) return

      canvas.width = container.clientWidth
      canvas.height = container.clientHeight
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Globe parameters
    const globeRadius = Math.min(canvas.width, canvas.height) * 0.25
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    // Destinations (random points on the globe)
    const destinations = Array.from({ length: 20 }, () => {
      const lat = Math.random() * Math.PI - Math.PI / 2
      const lng = Math.random() * Math.PI * 2
      return { lat, lng }
    })

    // Animation variables
    let rotation = 0
    const rotationSpeed = 0.005

    // Draw function
    const draw = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw globe background
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, globeRadius)
      gradient.addColorStop(0, "rgba(88, 28, 135, 0.2)")
      gradient.addColorStop(1, "rgba(88, 28, 135, 0.05)")

      ctx.beginPath()
      ctx.arc(centerX, centerY, globeRadius, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()

      // Draw grid lines (latitude)
      for (let lat = -80; lat <= 80; lat += 20) {
        const radius = globeRadius * Math.cos((lat * Math.PI) / 180)
        const y = centerY + globeRadius * Math.sin((lat * Math.PI) / 180)

        ctx.beginPath()
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
        ctx.strokeStyle = "rgba(168, 85, 247, 0.2)"
        ctx.stroke()
      }

      // Draw grid lines (longitude)
      for (let lng = 0; lng < 360; lng += 20) {
        const adjustedLng = lng + rotation * (180 / Math.PI)

        ctx.beginPath()
        ctx.moveTo(centerX, centerY - globeRadius)
        ctx.bezierCurveTo(
          centerX + globeRadius * Math.sin((adjustedLng * Math.PI) / 180),
          centerY,
          centerX + globeRadius * Math.sin((adjustedLng * Math.PI) / 180),
          centerY,
          centerX,
          centerY + globeRadius,
        )
        ctx.strokeStyle = "rgba(168, 85, 247, 0.2)"
        ctx.stroke()
      }

      // Draw destinations
      destinations.forEach((dest, i) => {
        const adjustedLng = dest.lng + rotation

        // Calculate 3D position
        const x = centerX + globeRadius * Math.cos(dest.lat) * Math.sin(adjustedLng)
        const y = centerY - globeRadius * Math.sin(dest.lat)
        const z = globeRadius * Math.cos(dest.lat) * Math.cos(adjustedLng)

        // Only draw points on the front half of the globe
        if (z > 0) {
          const size = 3 + Math.random() * 2

          // Glow effect
          const glow = ctx.createRadialGradient(x, y, 0, x, y, size * 3)
          glow.addColorStop(0, "rgba(216, 180, 254, 0.8)")
          glow.addColorStop(1, "rgba(216, 180, 254, 0)")

          ctx.beginPath()
          ctx.arc(x, y, size * 3, 0, Math.PI * 2)
          ctx.fillStyle = glow
          ctx.fill()

          // Destination point
          ctx.beginPath()
          ctx.arc(x, y, size, 0, Math.PI * 2)
          ctx.fillStyle = i % 3 === 0 ? "#f472b6" : i % 3 === 1 ? "#c084fc" : "#38bdf8"
          ctx.fill()

          // Pulse animation for some points
          if (i % 4 === 0) {
            const pulseSize = (Math.sin(Date.now() * 0.003 + i) + 1) * 5 + 5
            ctx.beginPath()
            ctx.arc(x, y, pulseSize, 0, Math.PI * 2)
            ctx.strokeStyle = "rgba(216, 180, 254, 0.5)"
            ctx.stroke()
          }
        }
      })

      // Update rotation
      rotation += rotationSpeed

      // Request next frame
      requestAnimationFrame(draw)
    }

    // Start animation
    draw()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [])

  return (
    <div className="relative w-full h-full overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-70"></div>
    </div>
  )
}

"use client"

import React, { useEffect, useRef } from "react"
import * as THREE from "three"

interface CountryBeacon {
  code: string
  name: string
  count: number
  lat: number
  lng: number
}

// Lat/Lng for top countries
const COUNTRY_COORDS: Record<string, { lat: number; lng: number }> = {
  US: { lat: 37.0902, lng: -95.7129 },
  BD: { lat: 23.685, lng: 90.3563 },
  GB: { lat: 55.3781, lng: -3.436 },
  DE: { lat: 51.1657, lng: 10.4515 },
  IN: { lat: 20.5937, lng: 78.9629 },
  CA: { lat: 56.1304, lng: -106.3468 },
  AU: { lat: -25.2744, lng: 133.7751 },
  FR: { lat: 46.2276, lng: 2.2137 },
  SG: { lat: 1.3521, lng: 103.8198 },
  NL: { lat: 52.1326, lng: 5.2913 },
  RU: { lat: 61.524, lng: 105.3188 },
  ID: { lat: -0.7893, lng: 113.9213 },
  HK: { lat: 22.3193, lng: 114.1694 },
  BR: { lat: -14.235, lng: -51.9253 },
  CN: { lat: 35.8617, lng: 104.1954 },
  JP: { lat: 36.2048, lng: 138.2529 },
  KR: { lat: 35.9078, lng: 127.7669 },
  TR: { lat: 38.9637, lng: 35.2433 },
}

function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)
  const x = -(radius * Math.sin(phi) * Math.cos(theta))
  const z = radius * Math.sin(phi) * Math.sin(theta)
  const y = radius * Math.cos(phi)
  return new THREE.Vector3(x, y, z)
}

interface GlobeProps {
  topCountries: { code: string; name: string; count: number }[]
}

export default function ThreeGlobeView({ topCountries }: GlobeProps) {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mountRef.current) return

    const container = mountRef.current
    const width = container.clientWidth || 600
    const height = container.clientHeight || 450

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.z = 210

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // 2. Earth Globe Geometry (Light theme: crisp pearl/porcelain sphere with azure & cobalt accents)
    const globeRadius = 60
    const globeGroup = new THREE.Group()
    scene.add(globeGroup)

    // Inner sphere
    const sphereGeo = new THREE.SphereGeometry(globeRadius, 64, 64)
    const sphereMat = new THREE.MeshPhongMaterial({
      color: 0xf1f5f9,
      emissive: 0xe2e8f0,
      specular: 0x3b82f6,
      shininess: 25,
      transparent: true,
      opacity: 0.98,
    })
    const globe = new THREE.Mesh(sphereGeo, sphereMat)
    globeGroup.add(globe)

    // Wireframe Latitude / Longitude grid lines
    const wireframeGeo = new THREE.WireframeGeometry(new THREE.SphereGeometry(globeRadius + 0.25, 32, 16))
    const wireframeMat = new THREE.LineBasicMaterial({
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.35,
    })
    const wireframe = new THREE.LineSegments(wireframeGeo, wireframeMat)
    globeGroup.add(wireframe)

    // Equator & Prime Meridian accent rings
    const ringGeo = new THREE.RingGeometry(globeRadius + 0.3, globeRadius + 0.6, 64)
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x60a5fa,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4,
    })
    const equatorRing = new THREE.Mesh(ringGeo, ringMat)
    equatorRing.rotation.x = Math.PI / 2
    globeGroup.add(equatorRing)

    // 3. Ambient and Directional Lights (for clean crisp light shading)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85)
    scene.add(ambientLight)

    const dirLight1 = new THREE.DirectionalLight(0x38bdf8, 1.2)
    dirLight1.position.set(150, 100, 150)
    scene.add(dirLight1)

    const dirLight2 = new THREE.DirectionalLight(0x6366f1, 0.8)
    dirLight2.position.set(-150, -100, -150)
    scene.add(dirLight2)

    // 4. Dot Matrix / Continent Landmass Simulation
    const dotCount = 1400
    const dotGeo = new THREE.BufferGeometry()
    const dotPositions: number[] = []

    for (let i = 0; i < dotCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / dotCount)
      const theta = Math.sqrt(dotCount * Math.PI) * phi
      const r = globeRadius + 0.5
      const x = r * Math.sin(phi) * Math.cos(theta)
      const y = r * Math.cos(phi)
      const z = r * Math.sin(phi) * Math.sin(theta)
      dotPositions.push(x, y, z)
    }

    dotGeo.setAttribute("position", new THREE.Float32BufferAttribute(dotPositions, 3))
    const dotMat = new THREE.PointsMaterial({
      color: 0x2563eb,
      size: 1.4,
      transparent: true,
      opacity: 0.65,
    })
    const dotsMesh = new THREE.Points(dotGeo, dotMat)
    globeGroup.add(dotsMesh)

    // 5. Active Traffic Beacons & Pulsing Rings
    const beaconRings: { mesh: THREE.Mesh; maxScale: number; speed: number }[] = []

    topCountries.forEach((c) => {
      const coords = COUNTRY_COORDS[c.code]
      if (!coords) return

      const pos = latLngToVector3(coords.lat, coords.lng, globeRadius + 1.2)

      // Solid central beacon pin
      const pinGeo = new THREE.SphereGeometry(1.6, 16, 16)
      const pinMat = new THREE.MeshBasicMaterial({
        color: c.code === "BD" ? 0x10b981 : 0x0284c7, // Green for BD, Blue for others
      })
      const pin = new THREE.Mesh(pinGeo, pinMat)
      pin.position.copy(pos)
      globeGroup.add(pin)

      // Pulsing wave ring around pin
      const pRingGeo = new THREE.RingGeometry(1.8, 2.8, 32)
      const pRingMat = new THREE.MeshBasicMaterial({
        color: c.code === "BD" ? 0x10b981 : 0x2563eb,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
      })
      const pRing = new THREE.Mesh(pRingGeo, pRingMat)
      pRing.position.copy(pos)
      pRing.lookAt(new THREE.Vector3(0, 0, 0))
      globeGroup.add(pRing)

      beaconRings.push({ mesh: pRing, maxScale: 3.2, speed: 0.03 + Math.random() * 0.02 })
    })

    // 6. Interactive Drag Controls (Mouse & Touch)
    let isDragging = false
    let prevMouseX = 0
    let prevMouseY = 0
    let autoRotate = true

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true
      autoRotate = false
      prevMouseX = e.clientX
      prevMouseY = e.clientY
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      const deltaX = e.clientX - prevMouseX
      const deltaY = e.clientY - prevMouseY
      globeGroup.rotation.y += deltaX * 0.008
      globeGroup.rotation.x += deltaY * 0.008
      prevMouseX = e.clientX
      prevMouseY = e.clientY
    }

    const onMouseUp = () => {
      isDragging = false
      // Resume slow auto-rotation after 3 seconds
      setTimeout(() => {
        autoRotate = true
      }, 3000)
    }

    const dom = renderer.domElement
    dom.addEventListener("mousedown", onMouseDown)
    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)

    // Touch support for mobile devices
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true
        autoRotate = false
        prevMouseX = e.touches[0].clientX
        prevMouseY = e.touches[0].clientY
      }
    }

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return
      const deltaX = e.touches[0].clientX - prevMouseX
      const deltaY = e.touches[0].clientY - prevMouseY
      globeGroup.rotation.y += deltaX * 0.008
      globeGroup.rotation.x += deltaY * 0.008
      prevMouseX = e.touches[0].clientX
      prevMouseY = e.touches[0].clientY
    }

    const onTouchEnd = () => {
      isDragging = false
      setTimeout(() => {
        autoRotate = true
      }, 3000)
    }

    dom.addEventListener("touchstart", onTouchStart)
    window.addEventListener("touchmove", onTouchMove)
    window.addEventListener("touchend", onTouchEnd)

    // 7. Render Loop
    let animId: number
    const animate = () => {
      animId = requestAnimationFrame(animate)

      if (autoRotate) {
        globeGroup.rotation.y += 0.0025
      }

      // Animate pulsing beacon rings
      beaconRings.forEach((b) => {
        b.mesh.scale.x += b.speed
        b.mesh.scale.y += b.speed
        b.mesh.scale.z += b.speed

        const mat = b.mesh.material as THREE.MeshBasicMaterial
        mat.opacity = Math.max(0, 0.8 * (1 - b.mesh.scale.x / b.maxScale))

        if (b.mesh.scale.x >= b.maxScale) {
          b.mesh.scale.set(1, 1, 1)
          mat.opacity = 0.8
        }
      })

      renderer.render(scene, camera)
    }
    animate()

    // 8. Handle Window Resize
    const handleResize = () => {
      if (!mountRef.current) return
      const w = mountRef.current.clientWidth
      const h = mountRef.current.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", handleResize)
      dom.removeEventListener("mousedown", onMouseDown)
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
      dom.removeEventListener("touchstart", onTouchStart)
      window.removeEventListener("touchmove", onTouchMove)
      window.removeEventListener("touchend", onTouchEnd)
      if (container.contains(dom)) {
        container.removeChild(dom)
      }
      renderer.dispose()
    }
  }, [topCountries])

  return (
    <div
      ref={mountRef}
      style={{
        width: "100%",
        height: "440px",
        position: "relative",
        cursor: "grab",
        userSelect: "none",
      }}
    />
  )
}

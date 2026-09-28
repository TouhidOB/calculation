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

// Representative Lat/Lng for top countries
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

    // 2. Earth Globe Geometry
    const globeRadius = 60
    const globeGroup = new THREE.Group()
    scene.add(globeGroup)

    // Inner glowing core
    const sphereGeo = new THREE.SphereGeometry(globeRadius, 64, 64)
    const sphereMat = new THREE.MeshPhongMaterial({
      color: 0x0f172a,
      emissive: 0x050d1a,
      specular: 0x3b82f6,
      shininess: 40,
      transparent: true,
      opacity: 0.95,
    })
    const globe = new THREE.Mesh(sphereGeo, sphereMat)
    globeGroup.add(globe)

    // Wireframe Grid Overlay for futuristic look
    const wireframeGeo = new THREE.WireframeGeometry(new THREE.SphereGeometry(globeRadius + 0.3, 32, 16))
    const wireframeMat = new THREE.LineBasicMaterial({
      color: 0x1e3a8a,
      transparent: true,
      opacity: 0.25,
    })
    const wireframe = new THREE.LineSegments(wireframeGeo, wireframeMat)
    globeGroup.add(wireframe)

    // Atmosphere halo ring
    const atmosphereGeo = new THREE.SphereGeometry(globeRadius + 2.5, 64, 64)
    const atmosphereMat = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.08,
      side: THREE.BackSide,
    })
    const atmosphere = new THREE.Mesh(atmosphereGeo, atmosphereMat)
    globeGroup.add(atmosphere)

    // 3. Country Markers / Beacons
    const beacons: THREE.Mesh[] = []
    topCountries.forEach((c) => {
      const coords = COUNTRY_COORDS[c.code] || { lat: 20, lng: 0 }
      const pos = latLngToVector3(coords.lat, coords.lng, globeRadius + 0.8)

      // Beacon pin point
      const pinGeo = new THREE.SphereGeometry(1.4, 16, 16)
      const pinMat = new THREE.MeshBasicMaterial({ color: 0x10b981 })
      const pin = new THREE.Mesh(pinGeo, pinMat)
      pin.position.copy(pos)
      globeGroup.add(pin)

      // Beacon pulsing cylinder/beam
      const beamHeight = 8 + Math.min(c.count / 200, 25)
      const beamGeo = new THREE.CylinderGeometry(0.3, 0.8, beamHeight, 8)
      beamGeo.translate(0, beamHeight / 2, 0)
      beamGeo.rotateX(Math.PI / 2)
      const beamMat = new THREE.MeshBasicMaterial({
        color: 0x34d399,
        transparent: true,
        opacity: 0.75,
      })
      const beam = new THREE.Mesh(beamGeo, beamMat)
      beam.position.copy(pos)
      beam.lookAt(pos.clone().multiplyScalar(2))
      globeGroup.add(beam)
      beacons.push(beam)
    })

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
    scene.add(ambientLight)

    const dirLight1 = new THREE.DirectionalLight(0x60a5fa, 2.5)
    dirLight1.position.set(100, 100, 150)
    scene.add(dirLight1)

    const dirLight2 = new THREE.DirectionalLight(0x10b981, 1.2)
    dirLight2.position.set(-100, -80, -100)
    scene.add(dirLight2)

    // 5. Interactive Mouse Rotation Drag
    let isDragging = false
    let prevMousePos = { x: 0, y: 0 }

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true
      prevMousePos = { x: e.clientX, y: e.clientY }
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      const deltaX = e.clientX - prevMousePos.x
      const deltaY = e.clientY - prevMousePos.y
      globeGroup.rotation.y += deltaX * 0.005
      globeGroup.rotation.x += deltaY * 0.005
      prevMousePos = { x: e.clientX, y: e.clientY }
    }

    const onMouseUp = () => {
      isDragging = false
    }

    container.addEventListener("mousedown", onMouseDown)
    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)

    // 6. Animation Loop
    let animId: number
    const animate = () => {
      animId = requestAnimationFrame(animate)
      if (!isDragging) {
        globeGroup.rotation.y += 0.0025 // smooth auto-rotation
      }
      renderer.render(scene, camera)
    }
    animate()

    // Resize handler
    const handleResize = () => {
      if (!container) return
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(animId)
      container.removeEventListener("mousedown", onMouseDown)
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
      window.removeEventListener("resize", handleResize)
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [topCountries])

  return (
    <div
      ref={mountRef}
      style={{
        width: "100%",
        height: "100%",
        minHeight: "440px",
        cursor: "grab",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    />
  )
}

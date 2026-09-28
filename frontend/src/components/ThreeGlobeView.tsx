"use client"

import React, { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Tooltip from "@mui/material/Tooltip"
import IconButton from "@mui/material/IconButton"
import PauseIcon from "@mui/icons-material/Pause"
import PlayArrowIcon from "@mui/icons-material/PlayArrow"
import RestartAltIcon from "@mui/icons-material/RestartAlt"
import ZoomInIcon from "@mui/icons-material/ZoomIn"
import ZoomOutIcon from "@mui/icons-material/ZoomOut"

interface CountryBeacon {
  code: string
  name: string
  count: number
  lat: number
  lng: number
}

// Lat/Lng for top countries
const COUNTRY_COORDS: Record<string, { lat: number; lng: number }> = {
  BD: { lat: 23.685, lng: 90.3563 },
  US: { lat: 37.0902, lng: -95.7129 },
  RU: { lat: 61.524, lng: 105.3188 },
  ID: { lat: -0.7893, lng: 113.9213 },
  HK: { lat: 22.3193, lng: 114.1694 },
  DE: { lat: 51.1657, lng: 10.4515 },
  SG: { lat: 1.3521, lng: 103.8198 },
  BR: { lat: -14.235, lng: -51.9253 },
  CN: { lat: 35.8617, lng: 104.1954 },
  CA: { lat: 56.1304, lng: -106.3468 },
  GB: { lat: 55.3781, lng: -3.436 },
  JP: { lat: 36.2048, lng: 138.2529 },
  KR: { lat: 35.9078, lng: 127.7669 },
  FR: { lat: 46.2276, lng: 2.2137 },
  TR: { lat: 38.9637, lng: 35.2433 },
  IN: { lat: 20.5937, lng: 78.9629 },
  AU: { lat: -25.2744, lng: 133.7751 },
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
  const [isRotating, setIsRotating] = useState(true)
  const isRotatingRef = useRef(true)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const globeGroupRef = useRef<THREE.Group | null>(null)

  useEffect(() => {
    isRotatingRef.current = isRotating
  }, [isRotating])

  useEffect(() => {
    if (!mountRef.current) return

    const container = mountRef.current
    const width = container.clientWidth || 600
    const height = container.clientHeight || 450

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.z = 210
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // 2. Earth Globe Geometry (Light theme: pearl/porcelain sphere with azure & cobalt accents)
    const globeRadius = 60
    const globeGroup = new THREE.Group()
    // Initial tilt to show Bangladesh / Asia prominently
    globeGroup.rotation.y = 2.2
    globeGroup.rotation.x = 0.25
    scene.add(globeGroup)
    globeGroupRef.current = globeGroup

    // Inner sphere
    const sphereGeo = new THREE.SphereGeometry(globeRadius, 64, 64)
    const sphereMat = new THREE.MeshPhongMaterial({
      color: 0xf8fafc,
      emissive: 0xf1f5f9,
      specular: 0x3b82f6,
      shininess: 30,
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

    // Equator accent ring
    const ringGeo = new THREE.RingGeometry(globeRadius + 0.3, globeRadius + 0.6, 64)
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x60a5fa,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4,
    })
    const ring = new THREE.Mesh(ringGeo, ringMat)
    ring.rotation.x = Math.PI / 2
    globeGroup.add(ring)

    // 3. Country Beacons & Trajectory Curves
    const pulseBeacons: { mesh: THREE.Mesh; scale: number; speed: number }[] = []
    const trajectoryCurves: { line: THREE.Line; material: THREE.LineDashedMaterial }[] = []
    const bdPos = latLngToVector3(COUNTRY_COORDS.BD.lat, COUNTRY_COORDS.BD.lng, globeRadius)

    // Add Central Hub for Bangladesh (Origin / Server Telemetry HQ)
    const hubDotGeo = new THREE.SphereGeometry(2.2, 16, 16)
    const hubDotMat = new THREE.MeshBasicMaterial({ color: 0x10b981 }) // Emerald Green
    const hubDot = new THREE.Mesh(hubDotGeo, hubDotMat)
    hubDot.position.copy(bdPos)
    globeGroup.add(hubDot)

    // Hub pulse ring
    const hubRingGeo = new THREE.RingGeometry(2.5, 3.2, 32)
    const hubRingMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
    })
    const hubRing = new THREE.Mesh(hubRingGeo, hubRingMat)
    hubRing.position.copy(bdPos)
    hubRing.lookAt(bdPos.clone().multiplyScalar(2))
    globeGroup.add(hubRing)
    pulseBeacons.push({ mesh: hubRing, scale: 1.0, speed: 0.015 })

    // Render Country Beacons & Dynamic Trajectory Arcs
    topCountries.forEach((c) => {
      const coords = COUNTRY_COORDS[c.code]
      if (!coords) return

      const pos = latLngToVector3(coords.lat, coords.lng, globeRadius)

      // Color code by traffic volume
      const isTopTier = c.count > 1000
      const pinColor = c.code === "BD" ? 0x10b981 : isTopTier ? 0x2563eb : 0x0284c7

      // Country marker pin
      const dotGeo = new THREE.SphereGeometry(isTopTier ? 1.8 : 1.4, 16, 16)
      const dotMat = new THREE.MeshBasicMaterial({ color: pinColor })
      const dot = new THREE.Mesh(dotGeo, dotMat)
      dot.position.copy(pos)
      globeGroup.add(dot)

      // Pulsing wave ring around pin
      const pulseGeo = new THREE.RingGeometry(2.0, 2.7, 32)
      const pulseMat = new THREE.MeshBasicMaterial({
        color: pinColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
      })
      const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat)
      pulseMesh.position.copy(pos)
      pulseMesh.lookAt(pos.clone().multiplyScalar(2))
      globeGroup.add(pulseMesh)
      pulseBeacons.push({
        mesh: pulseMesh,
        scale: 1.0 + Math.random() * 0.5,
        speed: 0.012 + Math.random() * 0.008,
      })

      // Draw Trajectory Curved Arc from Origin (Bangladesh) to this country
      if (c.code !== "BD") {
        const midPoint = new THREE.Vector3().addVectors(bdPos, pos).multiplyScalar(0.5)
        const distance = bdPos.distanceTo(pos)
        // Elevate midpoint above globe surface based on distance for 3D flight effect
        const elevation = Math.min(distance * 0.45, 32)
        midPoint.normalize().multiplyScalar(globeRadius + elevation)

        const curve = new THREE.QuadraticBezierCurve3(bdPos, midPoint, pos)
        const curvePoints = curve.getPoints(40)
        const curveGeo = new THREE.BufferGeometry().setFromPoints(curvePoints)

        const curveMat = new THREE.LineDashedMaterial({
          color: isTopTier ? 0x3b82f6 : 0x93c5fd,
          dashSize: 3,
          gapSize: 2,
          transparent: true,
          opacity: isTopTier ? 0.75 : 0.45,
        })

        const curveLine = new THREE.Line(curveGeo, curveMat)
        curveLine.computeLineDistances()
        globeGroup.add(curveLine)
        trajectoryCurves.push({ line: curveLine, material: curveMat })
      }
    })

    // 4. Subtle Outer Atmosphere Glow
    const atmosGeo = new THREE.SphereGeometry(globeRadius + 3.0, 32, 32)
    const atmosMat = new THREE.MeshBasicMaterial({
      color: 0xbfdbfe,
      transparent: true,
      opacity: 0.15,
      side: THREE.BackSide,
    })
    const atmos = new THREE.Mesh(atmosGeo, atmosMat)
    globeGroup.add(atmos)

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4)
    scene.add(ambientLight)

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.2)
    dirLight1.position.set(150, 150, 150)
    scene.add(dirLight1)

    const dirLight2 = new THREE.DirectionalLight(0x93c5fd, 0.8)
    dirLight2.position.set(-150, -100, -100)
    scene.add(dirLight2)

    // 6. Interactive Drag & Momentum Rotation
    let isDragging = false
    let prevMouseX = 0
    let prevMouseY = 0
    let velX = 0
    let velY = 0

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true
      prevMouseX = e.clientX
      prevMouseY = e.clientY
      velX = 0
      velY = 0
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      const deltaX = e.clientX - prevMouseX
      const deltaY = e.clientY - prevMouseY
      velX = deltaX * 0.005
      velY = deltaY * 0.005
      globeGroup.rotation.y += velX
      globeGroup.rotation.x += velY
      prevMouseX = e.clientX
      prevMouseY = e.clientY
    }

    const onMouseUp = () => {
      isDragging = false
    }

    // Touch support for mobile devices
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true
        prevMouseX = e.touches[0].clientX
        prevMouseY = e.touches[0].clientY
        velX = 0
        velY = 0
      }
    }

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return
      const deltaX = e.touches[0].clientX - prevMouseX
      const deltaY = e.touches[0].clientY - prevMouseY
      velX = deltaX * 0.005
      velY = deltaY * 0.005
      globeGroup.rotation.y += velX
      globeGroup.rotation.x += velY
      prevMouseX = e.touches[0].clientX
      prevMouseY = e.touches[0].clientY
    }

    const onTouchEnd = () => {
      isDragging = false
    }

    // Scroll to zoom
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      camera.position.z = Math.max(130, Math.min(320, camera.position.z + e.deltaY * 0.12))
    }

    container.addEventListener("mousedown", onMouseDown)
    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)
    container.addEventListener("touchstart", onTouchStart, { passive: true })
    window.addEventListener("touchmove", onTouchMove, { passive: true })
    window.addEventListener("touchend", onTouchEnd)
    container.addEventListener("wheel", onWheel, { passive: false })

    // 7. Animation Loop
    let animId: number
    const animate = () => {
      animId = requestAnimationFrame(animate)

      // Automatic slow rotation when not dragging and rotation enabled
      if (!isDragging) {
        if (isRotatingRef.current) {
          globeGroup.rotation.y += 0.0018
        }
        // Friction damping for velocity
        globeGroup.rotation.y += velX
        globeGroup.rotation.x += velY
        velX *= 0.94
        velY *= 0.94
      }

      // Animate pulsing beacons
      pulseBeacons.forEach((b) => {
        b.scale += b.speed
        if (b.scale > 2.6) {
          b.scale = 1.0
        }
        b.mesh.scale.set(b.scale, b.scale, b.scale)
        const mat = b.mesh.material as THREE.MeshBasicMaterial
        mat.opacity = Math.max(0, 0.85 * (1 - (b.scale - 1) / 1.6))
      })

      renderer.render(scene, camera)
    }
    animate()

    // Resize Handler
    const onResize = () => {
      if (!container) return
      const newW = container.clientWidth || 600
      const newH = container.clientHeight || 450
      camera.aspect = newW / newH
      camera.updateProjectionMatrix()
      renderer.setSize(newW, newH)
    }
    window.addEventListener("resize", onResize)

    // Cleanup
    return () => {
      cancelAnimationFrame(animId)
      container.removeEventListener("mousedown", onMouseDown)
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
      container.removeEventListener("touchstart", onTouchStart)
      window.removeEventListener("touchmove", onTouchMove)
      window.removeEventListener("touchend", onTouchEnd)
      container.removeEventListener("wheel", onWheel)
      window.removeEventListener("resize", onResize)
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [topCountries])

  const handleReset = () => {
    if (cameraRef.current) cameraRef.current.position.z = 210
    if (globeGroupRef.current) {
      globeGroupRef.current.rotation.y = 2.2
      globeGroupRef.current.rotation.x = 0.25
    }
  }

  const handleZoomIn = () => {
    if (cameraRef.current) {
      cameraRef.current.position.z = Math.max(130, cameraRef.current.position.z - 25)
    }
  }

  const handleZoomOut = () => {
    if (cameraRef.current) {
      cameraRef.current.position.z = Math.min(320, cameraRef.current.position.z + 25)
    }
  }

  return (
    <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
      <Box
        ref={mountRef}
        sx={{
          width: "100%",
          height: { xs: 380, sm: 460 },
          cursor: "grab",
          "&:active": { cursor: "grabbing" },
          borderRadius: 3,
          overflow: "hidden",
        }}
      />

      {/* Floating 3D Control Bar */}
      <Box
        sx={{
          position: "absolute",
          top: 14,
          right: 14,
          display: "flex",
          gap: 0.75,
          bgcolor: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(8px)",
          p: 0.6,
          borderRadius: 2,
          border: "1px solid #e2e8f0",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
          zIndex: 10,
        }}
      >
        <Tooltip title={isRotating ? "Pause Rotation" : "Resume Rotation"}>
          <IconButton size="small" onClick={() => setIsRotating(!isRotating)} sx={{ color: "#334155" }}>
            {isRotating ? <PauseIcon fontSize="small" /> : <PlayArrowIcon fontSize="small" />}
          </IconButton>
        </Tooltip>
        <Tooltip title="Zoom In">
          <IconButton size="small" onClick={handleZoomIn} sx={{ color: "#334155" }}>
            <ZoomInIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Zoom Out">
          <IconButton size="small" onClick={handleZoomOut} sx={{ color: "#334155" }}>
            <ZoomOutIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Reset View (Asia / BD Focus)">
          <IconButton size="small" onClick={handleReset} sx={{ color: "#334155" }}>
            <RestartAltIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Interactive Legend Hint */}
      <Box
        sx={{
          position: "absolute",
          bottom: 12,
          left: 14,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          bgcolor: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(8px)",
          px: 1.5,
          py: 0.75,
          borderRadius: 2,
          border: "1px solid #e2e8f0",
          boxShadow: "0 2px 4px rgba(0,0,0,0.03)",
          pointerEvents: "none",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#10b981" }} />
          <Typography variant="caption" sx={{ color: "#475569", fontWeight: 600, fontSize: 11 }}>
            Dhaka Hub (Origin)
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#2563eb" }} />
          <Typography variant="caption" sx={{ color: "#475569", fontWeight: 600, fontSize: 11 }}>
            Global Visitors
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

"use client"

import React, { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Tooltip from "@mui/material/Tooltip"
import IconButton from "@mui/material/IconButton"
import Button from "@mui/material/Button"
import Chip from "@mui/material/Chip"
import CircularProgress from "@mui/material/CircularProgress"
import PauseIcon from "@mui/icons-material/Pause"
import PlayArrowIcon from "@mui/icons-material/PlayArrow"
import RestartAltIcon from "@mui/icons-material/RestartAlt"
import ZoomInIcon from "@mui/icons-material/ZoomIn"
import ZoomOutIcon from "@mui/icons-material/ZoomOut"
import CloudQueueIcon from "@mui/icons-material/CloudQueue"
import AltRouteIcon from "@mui/icons-material/AltRoute"
import PublicIcon from "@mui/icons-material/Public"

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
  const [showClouds, setShowClouds] = useState(true)
  const [showArcs, setShowArcs] = useState(true)
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isRotatingRef = useRef(true)
  const showCloudsRef = useRef(true)
  const showArcsRef = useRef(true)
  const resetCameraRef = useRef(false)
  const zoomActionRef = useRef<number | null>(null)

  useEffect(() => {
    isRotatingRef.current = isRotating
  }, [isRotating])

  useEffect(() => {
    showCloudsRef.current = showClouds
  }, [showClouds])

  useEffect(() => {
    showArcsRef.current = showArcs
  }, [showArcs])

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    const width = container.clientWidth || 600
    const height = 480

    // Scene
    const scene = new THREE.Scene()

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.set(0, 1.2, 5.2)

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    container.innerHTML = ""
    container.appendChild(renderer.domElement)

    // Main Group (Rotates Earth, Clouds, Beacons, and Arcs together)
    const globeGroup = new THREE.Group()
    scene.add(globeGroup)

    // Initial orientation: tilt slightly and face towards Asia / Bangladesh
    globeGroup.rotation.x = 0.22
    globeGroup.rotation.y = -1.45

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65)
    scene.add(ambientLight)

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.85)
    sunLight.position.set(6, 4, 6)
    scene.add(sunLight)

    const fillLight = new THREE.DirectionalLight(0x93c5fd, 0.6)
    fillLight.position.set(-6, -2, -4)
    scene.add(fillLight)

    // Textures
    const textureLoader = new THREE.TextureLoader()
    const EARTH_RADIUS = 1.95

    let earthMesh: THREE.Mesh
    let cloudMesh: THREE.Mesh
    let atmosphereMesh: THREE.Mesh

    // Loading manager to track realistic Earth textures
    let loadedCount = 0
    const totalTextures = 4

    const onTextureLoad = () => {
      loadedCount++
      if (loadedCount >= totalTextures) {
        setIsLoading(false)
      }
    }

    const dayTexture = textureLoader.load("/textures/earth/earth_daymap.jpg", onTextureLoad)
    const normalTexture = textureLoader.load("/textures/earth/earth_normal.jpg", onTextureLoad)
    const specularTexture = textureLoader.load("/textures/earth/earth_specular.jpg", onTextureLoad)
    const cloudsTexture = textureLoader.load("/textures/earth/earth_clouds.png", onTextureLoad)

    dayTexture.colorSpace = THREE.SRGBColorSpace

    // 1. Realistic Earth Surface Mesh
    const earthGeometry = new THREE.SphereGeometry(EARTH_RADIUS, 64, 64)
    const earthMaterial = new THREE.MeshPhongMaterial({
      map: dayTexture,
      normalMap: normalTexture,
      normalScale: new THREE.Vector2(0.75, 0.75),
      specularMap: specularTexture,
      specular: new THREE.Color(0x2a3b4c),
      shininess: 18,
    })
    earthMesh = new THREE.Mesh(earthGeometry, earthMaterial)
    globeGroup.add(earthMesh)

    // 2. Realistic Dynamic Cloud Layer Mesh
    const cloudGeometry = new THREE.SphereGeometry(EARTH_RADIUS * 1.012, 64, 64)
    const cloudMaterial = new THREE.MeshStandardMaterial({
      map: cloudsTexture,
      transparent: true,
      opacity: 0.42,
      blending: THREE.NormalBlending,
      depthWrite: false,
    })
    cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial)
    globeGroup.add(cloudMesh)

    // 3. Realistic Atmospheric Rim Glow (Fresnel Limb Effect)
    const atmosphereGeometry = new THREE.SphereGeometry(EARTH_RADIUS * 1.075, 64, 64)
    const atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.62 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.2);
          gl_FragColor = vec4(0.23, 0.65, 1.0, 1.0) * intensity;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    })
    atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial)
    scene.add(atmosphereMesh)

    // Country Beacons and Pulse Waves
    const waveRings: { mesh: THREE.Mesh; scale: number; speed: number; baseRadius: number }[] = []
    const raycastTargets: THREE.Object3D[] = []

    const hubCoord = COUNTRY_COORDS["BD"] || { lat: 23.685, lng: 90.3563 }
    const hubPos = latLngToVector3(hubCoord.lat, hubCoord.lng, EARTH_RADIUS)

    // 4. Country Beacons (Pins, Pillars, and Pulse Waves)
    topCountries.forEach((c) => {
      const coord = COUNTRY_COORDS[c.code]
      if (!coord) return

      const pos = latLngToVector3(coord.lat, coord.lng, EARTH_RADIUS)
      const normal = pos.clone().normalize()
      const isHub = c.code === "BD"
      const pinColor = isHub ? 0x10b981 : 0x2563eb
      const emissiveColor = isHub ? 0x059669 : 0x3b82f6

      // Glowing Sphere Pin
      const pinGeo = new THREE.SphereGeometry(isHub ? 0.045 : 0.032, 16, 16)
      const pinMat = new THREE.MeshStandardMaterial({
        color: pinColor,
        emissive: emissiveColor,
        emissiveIntensity: 2.2,
        roughness: 0.2,
      })
      const pinMesh = new THREE.Mesh(pinGeo, pinMat)
      pinMesh.position.copy(pos.clone().multiplyScalar(1.008))
      pinMesh.userData = { country: c.name, code: c.code, count: c.count }
      globeGroup.add(pinMesh)
      raycastTargets.push(pinMesh)

      // Vertical Light Pillar shooting up into space
      const pillarHeight = isHub ? 0.28 : 0.18
      const pillarGeo = new THREE.CylinderGeometry(0.006, 0.012, pillarHeight, 12)
      const pillarMat = new THREE.MeshBasicMaterial({
        color: emissiveColor,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending,
      })
      const pillarMesh = new THREE.Mesh(pillarGeo, pillarMat)
      pillarMesh.position.copy(pos.clone().add(normal.clone().multiplyScalar(pillarHeight / 2)))
      pillarMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal)
      globeGroup.add(pillarMesh)

      // Expanding Animated Wave Rings
      const ringGeo = new THREE.RingGeometry(0.015, 0.035, 32)
      const ringMat = new THREE.MeshBasicMaterial({
        color: emissiveColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
        depthWrite: false,
      })
      const ringMesh = new THREE.Mesh(ringGeo, ringMat)
      ringMesh.position.copy(pos.clone().multiplyScalar(1.004))
      ringMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal)
      globeGroup.add(ringMesh)

      waveRings.push({
        mesh: ringMesh,
        scale: 1,
        speed: 0.02 + Math.random() * 0.01,
        baseRadius: 1,
      })
    })

    // 5. Great-Circle 3D Curved Bézier Flight/Traffic Arcs to Dhaka Hub
    const arcGroup = new THREE.Group()
    globeGroup.add(arcGroup)

    const arcPhotons: { curve: THREE.QuadraticBezierCurve3; photon: THREE.Mesh; progress: number; speed: number }[] = []

    topCountries.forEach((c) => {
      if (c.code === "BD") return
      const coord = COUNTRY_COORDS[c.code]
      if (!coord) return

      const start = latLngToVector3(coord.lat, coord.lng, EARTH_RADIUS)
      const end = hubPos.clone()
      const distance = start.distanceTo(end)

      // High arched midpoint leaping realistically above Earth
      const mid = start.clone().lerp(end, 0.5)
      const midElevation = Math.max(0.35, distance * 0.32)
      mid.normalize().multiplyScalar(EARTH_RADIUS + midElevation)

      const curve = new THREE.QuadraticBezierCurve3(start, mid, end)
      const points = curve.getPoints(50)
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points)

      // Gradient glowing arc line
      const lineMat = new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending,
      })
      const arcLine = new THREE.Line(lineGeo, lineMat)
      arcGroup.add(arcLine)

      // Traveling glowing photon along the arc
      const photonGeo = new THREE.SphereGeometry(0.022, 12, 12)
      const photonMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        blending: THREE.AdditiveBlending,
      })
      const photonMesh = new THREE.Mesh(photonGeo, photonMat)
      arcGroup.add(photonMesh)

      arcPhotons.push({
        curve,
        photon: photonMesh,
        progress: Math.random(),
        speed: 0.004 + (c.count / 15000) * 0.006,
      })
    })

    // Mouse Interaction: Rotate & Drag
    let isDragging = false
    let prevMouseX = 0
    let prevMouseY = 0
    let velX = 0
    let velY = 0

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true
      prevMouseX = e.clientX
      prevMouseY = e.clientY
    }

    const onMouseMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect()
      const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1

      if (isDragging) {
        const deltaX = e.clientX - prevMouseX
        const deltaY = e.clientY - prevMouseY
        velX = deltaX * 0.005
        velY = deltaY * 0.005
        globeGroup.rotation.y += velX
        globeGroup.rotation.x += velY
        prevMouseX = e.clientX
        prevMouseY = e.clientY
      } else {
        // Raycasting for country hover
        const raycaster = new THREE.Raycaster()
        raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), camera)
        const intersects = raycaster.intersectObjects(raycastTargets)
        if (intersects.length > 0) {
          const target = intersects[0].object
          setHoveredCountry(
            `${target.userData.country} (${target.userData.code}): ${target.userData.count.toLocaleString()} visits`
          )
          renderer.domElement.style.cursor = "pointer"
        } else {
          setHoveredCountry(null)
          renderer.domElement.style.cursor = "grab"
        }
      }
    }

    const onMouseUp = () => {
      isDragging = false
    }

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      camera.position.z = Math.max(3.2, Math.min(8.0, camera.position.z + e.deltaY * 0.004))
    }

    const dom = renderer.domElement
    dom.addEventListener("mousedown", onMouseDown)
    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)
    dom.addEventListener("wheel", onWheel, { passive: false })

    // Animation Loop
    let animationFrameId: number

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)

      // Handle UI Zoom Action
      if (zoomActionRef.current !== null) {
        camera.position.z = Math.max(3.2, Math.min(8.0, camera.position.z + zoomActionRef.current))
        zoomActionRef.current = null
      }

      // Handle Reset Camera
      if (resetCameraRef.current) {
        globeGroup.rotation.x += (0.22 - globeGroup.rotation.x) * 0.08
        globeGroup.rotation.y += (-1.45 - globeGroup.rotation.y) * 0.08
        camera.position.z += (5.2 - camera.position.z) * 0.08
        if (
          Math.abs(globeGroup.rotation.x - 0.22) < 0.01 &&
          Math.abs(globeGroup.rotation.y - -1.45) < 0.01 &&
          Math.abs(camera.position.z - 5.2) < 0.05
        ) {
          resetCameraRef.current = false
        }
      }

      // Natural Auto-Rotation
      if (isRotatingRef.current && !isDragging) {
        globeGroup.rotation.y += 0.0016
      }

      // Smooth inertia damping on release
      if (!isDragging) {
        velX *= 0.94
        velY *= 0.94
        globeGroup.rotation.y += velX
        globeGroup.rotation.x += velY
      }

      // Rotate Clouds slightly faster to simulate real atmospheric winds
      if (cloudMesh) {
        cloudMesh.visible = showCloudsRef.current
        if (showCloudsRef.current) {
          cloudMesh.rotation.y += 0.0022
        }
      }

      // Visibility of Flight Arcs
      arcGroup.visible = showArcsRef.current

      // Animate Beacon Wave Rings
      waveRings.forEach((w) => {
        w.scale += w.speed
        if (w.scale > 3.8) {
          w.scale = 1
        }
        w.mesh.scale.set(w.scale, w.scale, 1)
        const mat = w.mesh.material as THREE.MeshBasicMaterial
        mat.opacity = Math.max(0, 0.85 * (1 - (w.scale - 1) / 2.8))
      })

      // Animate Photons traveling on Flight Arcs
      if (showArcsRef.current) {
        arcPhotons.forEach((p) => {
          p.progress = (p.progress + p.speed) % 1
          const pt = p.curve.getPoint(p.progress)
          p.photon.position.copy(pt)
        })
      }

      renderer.render(scene, camera)
    }

    animate()

    // Handle Window Resize
    const handleResize = () => {
      if (!container) return
      const newWidth = container.clientWidth || 600
      camera.aspect = newWidth / height
      camera.updateProjectionMatrix()
      renderer.setSize(newWidth, height)
    }
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      dom.removeEventListener("mousedown", onMouseDown)
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
      dom.removeEventListener("wheel", onWheel)
      cancelAnimationFrame(animationFrameId)
      renderer.dispose()
    }
  }, [topCountries])

  return (
    <Box sx={{ position: "relative", width: "100%", height: 480, overflow: "hidden", borderRadius: "14px" }}>
      {/* 3D WebGL Canvas Mount */}
      <Box
        ref={mountRef}
        sx={{
          width: "100%",
          height: "100%",
          cursor: "grab",
          background: "radial-gradient(circle at 50% 50%, #ffffff 0%, #f1f5f9 65%, #e2e8f0 100%)",
        }}
      />

      {/* Loading Overlay */}
      {isLoading && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(6px)",
            zIndex: 10,
          }}
        >
          <CircularProgress size={42} sx={{ color: "#2563eb", mb: 2 }} />
          <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: "#0f172a" }}>
            Loading Photorealistic NASA Earth Textures...
          </Typography>
          <Typography sx={{ fontSize: "0.75rem", color: "#64748b" }}>
            Surface relief • Ocean specular • Cloud dynamics
          </Typography>
        </Box>
      )}

      {/* Hovered Country Floating Tag */}
      {hoveredCountry && (
        <Box
          sx={{
            position: "absolute",
            top: 14,
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(15, 23, 42, 0.9)",
            color: "#ffffff",
            px: 2,
            py: 0.6,
            borderRadius: "20px",
            fontSize: "0.8rem",
            fontWeight: 700,
            letterSpacing: "0.5px",
            boxShadow: "0 10px 15px -3px rgba(0,0,0,0.2)",
            pointerEvents: "none",
            zIndex: 20,
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          {hoveredCountry}
        </Box>
      )}

      {/* Top Floating Controls */}
      <Box
        sx={{
          position: "absolute",
          top: 12,
          right: 12,
          display: "flex",
          gap: 1,
          background: "rgba(255, 255, 255, 0.88)",
          backdropFilter: "blur(12px)",
          border: "1px solid #e2e8f0",
          borderRadius: "10px",
          p: 0.5,
          zIndex: 15,
          boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
        }}
      >
        <Tooltip title={isRotating ? "Pause Earth Rotation" : "Resume Earth Rotation"}>
          <IconButton
            size="small"
            onClick={() => setIsRotating(!isRotating)}
            sx={{
              color: isRotating ? "#2563eb" : "#64748b",
              "&:hover": { background: "rgba(37, 99, 235, 0.08)" },
            }}
          >
            {isRotating ? <PauseIcon fontSize="small" /> : <PlayArrowIcon fontSize="small" />}
          </IconButton>
        </Tooltip>

        <Tooltip title={showClouds ? "Hide Atmospheric Clouds" : "Show Atmospheric Clouds"}>
          <IconButton
            size="small"
            onClick={() => setShowClouds(!showClouds)}
            sx={{
              color: showClouds ? "#0284c7" : "#cbd5e1",
              "&:hover": { background: "rgba(2, 132, 199, 0.08)" },
            }}
          >
            <CloudQueueIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title={showArcs ? "Hide Traffic Trajectory Arcs" : "Show Traffic Trajectory Arcs"}>
          <IconButton
            size="small"
            onClick={() => setShowArcs(!showArcs)}
            sx={{
              color: showArcs ? "#10b981" : "#cbd5e1",
              "&:hover": { background: "rgba(16, 185, 129, 0.08)" },
            }}
          >
            <AltRouteIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Reset View to Bangladesh HQ">
          <IconButton
            size="small"
            onClick={() => {
              resetCameraRef.current = true
            }}
            sx={{
              color: "#64748b",
              "&:hover": { background: "rgba(15, 23, 42, 0.06)" },
            }}
          >
            <RestartAltIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Bottom Floating Legend & Zoom Controls */}
      <Box
        sx={{
          position: "absolute",
          bottom: 12,
          left: 12,
          right: 12,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pointerEvents: "none",
          zIndex: 15,
        }}
      >
        {/* Visual Legend */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            background: "rgba(255, 255, 255, 0.92)",
            backdropFilter: "blur(12px)",
            border: "1px solid #e2e8f0",
            borderRadius: "20px",
            px: 1.8,
            py: 0.6,
            pointerEvents: "auto",
            boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981" }} />
            <Typography sx={{ fontSize: "0.72rem", fontWeight: 700, color: "#0f172a" }}>
              Dhaka Hub (BD)
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: "50%", background: "#2563eb" }} />
            <Typography sx={{ fontSize: "0.72rem", fontWeight: 600, color: "#475569" }}>
              Visitor Beacons
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
            <Box sx={{ width: 14, height: 2, background: "#38bdf8", borderRadius: 1 }} />
            <Typography sx={{ fontSize: "0.72rem", fontWeight: 600, color: "#475569" }}>
              Live Arcs
            </Typography>
          </Box>
        </Box>

        {/* Zoom Controls */}
        <Box
          sx={{
            display: "flex",
            gap: 0.5,
            background: "rgba(255, 255, 255, 0.92)",
            backdropFilter: "blur(12px)",
            border: "1px solid #e2e8f0",
            borderRadius: "10px",
            p: 0.4,
            pointerEvents: "auto",
            boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
          }}
        >
          <Tooltip title="Zoom In">
            <IconButton
              size="small"
              onClick={() => {
                zoomActionRef.current = -0.6
              }}
              sx={{ color: "#475569" }}
            >
              <ZoomInIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Zoom Out">
            <IconButton
              size="small"
              onClick={() => {
                zoomActionRef.current = 0.6
              }}
              sx={{ color: "#475569" }}
            >
              <ZoomOutIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  )
}

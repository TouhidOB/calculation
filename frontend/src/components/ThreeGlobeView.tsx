"use client"

import React, { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Tooltip from "@mui/material/Tooltip"
import IconButton from "@mui/material/IconButton"
import Button from "@mui/material/Button"
import Chip from "@mui/material/Chip"
import PauseIcon from "@mui/icons-material/Pause"
import PlayArrowIcon from "@mui/icons-material/PlayArrow"
import RestartAltIcon from "@mui/icons-material/RestartAlt"
import ZoomInIcon from "@mui/icons-material/ZoomIn"
import ZoomOutIcon from "@mui/icons-material/ZoomOut"
import PublicIcon from "@mui/icons-material/Public"
import SatelliteAltIcon from "@mui/icons-material/SatelliteAlt"
import FlareIcon from "@mui/icons-material/Flare"
import CloseIcon from "@mui/icons-material/Close"

interface CountryCoord {
  lat: number
  lng: number
  name: string
  flag: string
  capital?: string
}

// Comprehensive Lat/Lng for worldwide countries
const COUNTRY_COORDS: Record<string, CountryCoord> = {
  BD: { lat: 23.685, lng: 90.3563, name: "Bangladesh", flag: "🇧🇩", capital: "Dhaka" },
  US: { lat: 37.0902, lng: -95.7129, name: "United States", flag: "🇺🇸", capital: "Washington, D.C." },
  RU: { lat: 61.524, lng: 105.3188, name: "Russia", flag: "🇷🇺", capital: "Moscow" },
  ID: { lat: -0.7893, lng: 113.9213, name: "Indonesia", flag: "🇮🇩", capital: "Jakarta" },
  HK: { lat: 22.3193, lng: 114.1694, name: "Hong Kong", flag: "🇭🇰", capital: "Hong Kong" },
  DE: { lat: 51.1657, lng: 10.4515, name: "Germany", flag: "🇩🇪", capital: "Berlin" },
  SG: { lat: 1.3521, lng: 103.8198, name: "Singapore", flag: "🇸🇬", capital: "Singapore" },
  BR: { lat: -14.235, lng: -51.9253, name: "Brazil", flag: "🇧🇷", capital: "Brasilia" },
  CN: { lat: 35.8617, lng: 104.1954, name: "China", flag: "🇨🇳", capital: "Beijing" },
  CA: { lat: 56.1304, lng: -106.3468, name: "Canada", flag: "🇨🇦", capital: "Ottawa" },
  GB: { lat: 55.3781, lng: -3.436, name: "United Kingdom", flag: "🇬🇧", capital: "London" },
  JP: { lat: 36.2048, lng: 138.2529, name: "Japan", flag: "🇯🇵", capital: "Tokyo" },
  KR: { lat: 35.9078, lng: 127.7669, name: "South Korea", flag: "🇰🇷", capital: "Seoul" },
  FR: { lat: 46.2276, lng: 2.2137, name: "France", flag: "🇫🇷", capital: "Paris" },
  TR: { lat: 38.9637, lng: 35.2433, name: "Turkey", flag: "🇹🇷", capital: "Ankara" },
  IN: { lat: 20.5937, lng: 78.9629, name: "India", flag: "🇮🇳", capital: "New Delhi" },
  AU: { lat: -25.2744, lng: 133.7751, name: "Australia", flag: "🇦🇺", capital: "Canberra" },
  NL: { lat: 52.1326, lng: 5.2913, name: "Netherlands", flag: "🇳🇱", capital: "Amsterdam" },
  PL: { lat: 51.9194, lng: 19.1451, name: "Poland", flag: "🇵🇱", capital: "Warsaw" },
  FI: { lat: 61.9241, lng: 25.7482, name: "Finland", flag: "🇫🇮", capital: "Helsinki" },
  SE: { lat: 60.1282, lng: 18.6435, name: "Sweden", flag: "🇸🇪", capital: "Stockholm" },
  NO: { lat: 60.472, lng: 8.4689, name: "Norway", flag: "🇳🇴", capital: "Oslo" },
  DK: { lat: 56.2639, lng: 9.5018, name: "Denmark", flag: "🇩🇰", capital: "Copenhagen" },
  IT: { lat: 41.8719, lng: 12.5674, name: "Italy", flag: "🇮🇹", capital: "Rome" },
  ES: { lat: 40.4637, lng: -3.7492, name: "Spain", flag: "🇪🇸", capital: "Madrid" },
  CH: { lat: 46.8182, lng: 8.2275, name: "Switzerland", flag: "🇨🇭", capital: "Bern" },
  AT: { lat: 47.5162, lng: 14.5501, name: "Austria", flag: "🇦🇹", capital: "Vienna" },
  BE: { lat: 50.5039, lng: 4.4699, name: "Belgium", flag: "🇧🇪", capital: "Brussels" },
  IE: { lat: 53.1424, lng: -7.6921, name: "Ireland", flag: "🇮🇪", capital: "Dublin" },
  NZ: { lat: -40.9006, lng: 174.886, name: "New Zealand", flag: "🇳🇿", capital: "Wellington" },
  AE: { lat: 23.4241, lng: 53.8478, name: "United Arab Emirates", flag: "🇦🇪", capital: "Abu Dhabi" },
  SA: { lat: 23.8859, lng: 45.0792, name: "Saudi Arabia", flag: "🇸🇦", capital: "Riyadh" },
  PK: { lat: 30.3753, lng: 69.3451, name: "Pakistan", flag: "🇵🇰", capital: "Islamabad" },
  EG: { lat: 26.8206, lng: 30.8025, name: "Egypt", flag: "🇪🇬", capital: "Cairo" },
  ZA: { lat: -30.5595, lng: 22.9375, name: "South Africa", flag: "🇿🇦", capital: "Pretoria" },
  MY: { lat: 4.2105, lng: 101.9758, name: "Malaysia", flag: "🇲🇾", capital: "Kuala Lumpur" },
  TH: { lat: 15.87, lng: 100.9925, name: "Thailand", flag: "🇹🇭", capital: "Bangkok" },
  VN: { lat: 14.0583, lng: 108.2772, name: "Vietnam", flag: "🇻🇳", capital: "Hanoi" },
  PH: { lat: 12.8797, lng: 121.774, name: "Philippines", flag: "🇵🇭", capital: "Manila" },
  MX: { lat: 23.6345, lng: -102.5528, name: "Mexico", flag: "🇲🇽", capital: "Mexico City" },
  AR: { lat: -38.4161, lng: -63.6167, name: "Argentina", flag: "🇦🇷", capital: "Buenos Aires" },
  CL: { lat: -35.6751, lng: -71.543, name: "Chile", flag: "🇨🇱", capital: "Santiago" },
  CO: { lat: 4.5709, lng: -74.2973, name: "Colombia", flag: "🇨🇴", capital: "Bogota" },
  NG: { lat: 9.082, lng: 8.6753, name: "Nigeria", flag: "🇳🇬", capital: "Abuja" },
  KE: { lat: -0.0236, lng: 37.9062, name: "Kenya", flag: "🇰🇪", capital: "Nairobi" },
  GH: { lat: 7.9465, lng: -1.0232, name: "Ghana", flag: "🇬🇭", capital: "Accra" },
  UA: { lat: 48.3794, lng: 31.1656, name: "Ukraine", flag: "🇺🇦", capital: "Kyiv" },
  RO: { lat: 45.9432, lng: 24.9668, name: "Romania", flag: "🇷🇴", capital: "Bucharest" },
  CZ: { lat: 49.8175, lng: 15.473, name: "Czech Republic", flag: "🇨🇿", capital: "Prague" },
  GR: { lat: 39.0742, lng: 21.8243, name: "Greece", flag: "🇬🇷", capital: "Athens" },
  PT: { lat: 39.3999, lng: -8.2245, name: "Portugal", flag: "🇵🇹", capital: "Lisbon" },
  IL: { lat: 31.0461, lng: 34.8516, name: "Israel", flag: "🇮🇱", capital: "Jerusalem" },
  QA: { lat: 25.3548, lng: 51.1839, name: "Qatar", flag: "🇶🇦", capital: "Doha" },
  KW: { lat: 29.3117, lng: 47.4818, name: "Kuwait", flag: "🇰🇼", capital: "Kuwait City" },
  TW: { lat: 23.6978, lng: 120.9605, name: "Taiwan", flag: "🇹🇼", capital: "Taipei" },
  LK: { lat: 7.8731, lng: 80.7718, name: "Sri Lanka", flag: "🇱🇰", capital: "Colombo" },
  NP: { lat: 28.3949, lng: 84.124, name: "Nepal", flag: "🇳🇵", capital: "Kathmandu" },
  HU: { lat: 47.1625, lng: 19.5033, name: "Hungary", flag: "🇭🇺", capital: "Budapest" },
  HR: { lat: 45.1, lng: 15.2, name: "Croatia", flag: "🇭🇷", capital: "Zagreb" },
  BG: { lat: 42.7339, lng: 25.4858, name: "Bulgaria", flag: "🇧🇬", capital: "Sofia" },
  RS: { lat: 44.0165, lng: 21.0059, name: "Serbia", flag: "🇷🇸", capital: "Belgrade" },
  SK: { lat: 48.669, lng: 19.699, name: "Slovakia", flag: "🇸🇰", capital: "Bratislava" },
  LT: { lat: 55.1694, lng: 23.8813, name: "Lithuania", flag: "🇱🇹", capital: "Vilnius" },
  LV: { lat: 56.8796, lng: 24.6032, name: "Latvia", flag: "🇱🇻", capital: "Riga" },
  EE: { lat: 58.5953, lng: 25.0136, name: "Estonia", flag: "🇪🇪", capital: "Tallinn" },
  IS: { lat: 64.9631, lng: -19.0208, name: "Iceland", flag: "🇮🇸", capital: "Reykjavik" },
  LU: { lat: 49.8153, lng: 6.1296, name: "Luxembourg", flag: "🇱🇺", capital: "Luxembourg" },
  CY: { lat: 35.1264, lng: 33.4299, name: "Cyprus", flag: "🇨🇾", capital: "Nicosia" },
  HN: { lat: 15.2, lng: -86.2419, name: "Honduras", flag: "🇭🇳", capital: "Tegucigalpa" },
  MA: { lat: 31.7917, lng: -7.0926, name: "Morocco", flag: "🇲🇦", capital: "Rabat" },
  DZ: { lat: 28.0339, lng: 1.6596, name: "Algeria", flag: "🇩🇿", capital: "Algiers" },
  TN: { lat: 33.8869, lng: 9.5375, name: "Tunisia", flag: "🇹🇳", capital: "Tunis" },
  KZ: { lat: 48.0196, lng: 66.9237, name: "Kazakhstan", flag: "🇰🇿", capital: "Astana" },
  UZ: { lat: 41.3775, lng: 64.5853, name: "Uzbekistan", flag: "🇺🇿", capital: "Tashkent" },
  PE: { lat: -9.19, lng: -75.0152, name: "Peru", flag: "🇵🇪", capital: "Lima" },
  EC: { lat: -1.8312, lng: -78.1834, name: "Ecuador", flag: "🇪🇨", capital: "Quito" },
  UY: { lat: -32.5228, lng: -55.7658, name: "Uruguay", flag: "🇺🇾", capital: "Montevideo" },
  CR: { lat: 9.7489, lng: -83.7534, name: "Costa Rica", flag: "🇨🇷", capital: "San Jose" },
  PA: { lat: 8.5379, lng: -80.7821, name: "Panama", flag: "🇵🇦", capital: "Panama City" },
  DO: { lat: 18.7357, lng: -70.1627, name: "Dominican Republic", flag: "🇩🇴", capital: "Santo Domingo" },
  PR: { lat: 18.2208, lng: -66.5901, name: "Puerto Rico", flag: "🇵🇷", capital: "San Juan" },
  JM: { lat: 18.1096, lng: -77.2975, name: "Jamaica", flag: "🇯🇲", capital: "Kingston" },
  TT: { lat: 10.6918, lng: -61.2225, name: "Trinidad and Tobago", flag: "🇹🇹", capital: "Port of Spain" },
  ET: { lat: 9.145, lng: 40.4897, name: "Ethiopia", flag: "🇪🇹", capital: "Addis Ababa" },
  TZ: { lat: -6.369, lng: 34.8888, name: "Tanzania", flag: "🇹🇿", capital: "Dodoma" },
  UG: { lat: 1.3733, lng: 32.2903, name: "Uganda", flag: "🇺🇬", capital: "Kampala" },
  SN: { lat: 14.4974, lng: -14.4524, name: "Senegal", flag: "🇸🇳", capital: "Dakar" },
  CI: { lat: 7.54, lng: -5.5471, name: "Ivory Coast", flag: "🇨🇮", capital: "Yamoussoukro" },
  CM: { lat: 7.3697, lng: 12.3547, name: "Cameroon", flag: "🇨🇲", capital: "Yaounde" },
  OM: { lat: 21.4735, lng: 55.9754, name: "Oman", flag: "🇴🇲", capital: "Muscat" },
  BH: { lat: 26.0667, lng: 50.5577, name: "Bahrain", flag: "🇧🇭", capital: "Manama" },
  JO: { lat: 30.5852, lng: 36.2384, name: "Jordan", flag: "🇯🇴", capital: "Amman" },
  LB: { lat: 33.8547, lng: 35.8623, name: "Lebanon", flag: "🇱🇧", capital: "Beirut" },
  IQ: { lat: 33.2232, lng: 43.6793, name: "Iraq", flag: "🇮🇶", capital: "Baghdad" },
  AZ: { lat: 40.1431, lng: 47.5769, name: "Azerbaijan", flag: "🇦🇿", capital: "Baku" },
  GE: { lat: 42.3154, lng: 43.3569, name: "Georgia", flag: "🇬🇪", capital: "Tbilisi" },
  AM: { lat: 40.0691, lng: 45.0382, name: "Armenia", flag: "🇦🇲", capital: "Yerevan" },
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
  topCountries: { code: string; name: string; count: number; percentage?: number }[]
  selectedCountryCode?: string | null
  onCountrySelect?: (code: string) => void
}

export default function ThreeGlobeView({
  topCountries,
  selectedCountryCode,
  onCountrySelect,
}: GlobeProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const [isRotating, setIsRotating] = useState(true)
  const [showClouds, setShowClouds] = useState(true)
  const [showArcs, setShowArcs] = useState(true)
  const [showSatellites, setShowSatellites] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [activeCountryInfo, setActiveCountryInfo] = useState<{
    code: string
    name: string
    flag: string
    capital?: string
    count: number
    percentage: number
  } | null>(null)

  const isRotatingRef = useRef(true)
  const showCloudsRef = useRef(true)
  const showArcsRef = useRef(true)
  const showSatellitesRef = useRef(true)
  const resetCameraRef = useRef(false)
  const zoomActionRef = useRef<number | null>(null)
  const targetRotationRef = useRef<{ x: number; y: number } | null>(null)
  const targetCameraDistanceRef = useRef<number>(5.2)

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
    showSatellitesRef.current = showSatellites
  }, [showSatellites])

  // Handle selectedCountryCode prop changes from parent
  useEffect(() => {
    if (!selectedCountryCode) {
      setActiveCountryInfo(null)
      return
    }

    const coord = COUNTRY_COORDS[selectedCountryCode]
    if (!coord) return

    const countryData = topCountries.find((c) => c.code === selectedCountryCode)
    setActiveCountryInfo({
      code: selectedCountryCode,
      name: coord.name,
      flag: coord.flag,
      capital: coord.capital,
      count: countryData?.count || 0,
      percentage: countryData?.percentage || 0,
    })

    // Compute target rotation to center the country in front of camera
    // Camera is looking at origin along z-axis, looking from +Z
    // When rotation.y rotates the globe, longitude lng moves
    const phi = (coord.lat * Math.PI) / 180
    const targetY = -((coord.lng + 90) * Math.PI) / 180
    const targetX = Math.max(-0.6, Math.min(0.6, phi * 0.75))

    targetRotationRef.current = { x: targetX, y: targetY }
    targetCameraDistanceRef.current = 3.65 // Smooth zoom into country
    setIsRotating(false) // Pause auto-rotation during inspection
  }, [selectedCountryCode, topCountries])

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    const width = container.clientWidth || 600
    const height = 500

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

    // Main Group (Rotates Earth, Clouds, Beacons, Arcs, and Satellites)
    const globeGroup = new THREE.Group()
    scene.add(globeGroup)

    // Initial orientation: tilt slightly and face towards Asia / Bangladesh
    globeGroup.rotation.x = 0.22
    globeGroup.rotation.y = -1.45

    // Lighting (Realistic Sunlight synced with real-time UTC)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65)
    scene.add(ambientLight)

    const now = new Date()
    const utcHours = now.getUTCHours() + now.getUTCMinutes() / 60
    const sunAngle = ((12 - utcHours) / 24) * Math.PI * 2

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.95)
    sunLight.position.set(Math.sin(sunAngle) * 8, 4, Math.cos(sunAngle) * 8)
    scene.add(sunLight)

    const fillLight = new THREE.DirectionalLight(0x93c5fd, 0.55)
    fillLight.position.set(-sunLight.position.x * 0.7, -2, -sunLight.position.z * 0.7)
    scene.add(fillLight)

    // Textures
    const textureLoader = new THREE.TextureLoader()
    const EARTH_RADIUS = 1.95

    let earthMesh: THREE.Mesh
    let cloudMesh: THREE.Mesh
    let atmosphereMesh: THREE.Mesh

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

    // 4. Country Beacons and Pulse Waves
    const waveRings: { mesh: THREE.Mesh; scale: number; speed: number; baseRadius: number }[] = []
    const raycastPins: THREE.Mesh[] = []

    const hubCoord = COUNTRY_COORDS["BD"] || { lat: 23.685, lng: 90.3563, name: "Bangladesh", flag: "🇧🇩" }
    const hubPos = latLngToVector3(hubCoord.lat, hubCoord.lng, EARTH_RADIUS)

    topCountries.forEach((c) => {
      const coord = COUNTRY_COORDS[c.code]
      if (!coord) return

      const pos = latLngToVector3(coord.lat, coord.lng, EARTH_RADIUS)
      const normal = pos.clone().normalize()
      const isHub = c.code === "BD"
      const pinColor = isHub ? 0x10b981 : 0x2563eb
      const emissiveColor = isHub ? 0x059669 : 0x3b82f6

      // Glowing Sphere Pin
      const pinGeo = new THREE.SphereGeometry(isHub ? 0.048 : 0.035, 16, 16)
      const pinMat = new THREE.MeshStandardMaterial({
        color: pinColor,
        emissive: emissiveColor,
        emissiveIntensity: 2.5,
        roughness: 0.15,
      })
      const pinMesh = new THREE.Mesh(pinGeo, pinMat)
      pinMesh.position.copy(pos.clone().multiplyScalar(1.01))
      pinMesh.userData = { country: c.name, code: c.code, count: c.count, percentage: c.percentage }
      globeGroup.add(pinMesh)
      raycastPins.push(pinMesh)

      // Vertical Light Pillar shooting up into space
      const pillarHeight = isHub ? 0.32 : 0.22
      const pillarGeo = new THREE.CylinderGeometry(0.007, 0.014, pillarHeight, 12)
      const pillarMat = new THREE.MeshBasicMaterial({
        color: emissiveColor,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
      })
      const pillarMesh = new THREE.Mesh(pillarGeo, pillarMat)
      pillarMesh.position.copy(pos.clone().add(normal.clone().multiplyScalar(pillarHeight / 2)))
      pillarMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal)
      globeGroup.add(pillarMesh)

      // Expanding Animated Wave Rings
      const ringGeo = new THREE.RingGeometry(0.015, 0.038, 32)
      const ringMat = new THREE.MeshBasicMaterial({
        color: emissiveColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85,
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

    const photonRays: { curve: THREE.QuadraticBezierCurve3; mesh: THREE.Mesh; progress: number; speed: number }[] = []

    topCountries.forEach((c) => {
      if (c.code === "BD") return
      const coord = COUNTRY_COORDS[c.code]
      if (!coord) return

      const startPos = latLngToVector3(coord.lat, coord.lng, EARTH_RADIUS)
      const endPos = hubPos.clone()

      // Calculate midpoint elevated into space for the 3D arc apex
      const midPoint = new THREE.Vector3().addVectors(startPos, endPos).multiplyScalar(0.5)
      const distance = startPos.distanceTo(endPos)
      const altitude = EARTH_RADIUS + Math.max(0.4, distance * 0.38)
      midPoint.normalize().multiplyScalar(altitude)

      const curve = new THREE.QuadraticBezierCurve3(startPos, midPoint, endPos)
      const points = curve.getPoints(50)
      const arcGeometry = new THREE.BufferGeometry().setFromPoints(points)

      const arcMaterial = new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending,
      })
      const arcLine = new THREE.Line(arcGeometry, arcMaterial)
      arcGroup.add(arcLine)

      // Traveling glowing photon packet along the arc
      const photonGeo = new THREE.SphereGeometry(0.024, 12, 12)
      const photonMat = new THREE.MeshBasicMaterial({
        color: 0x67e8f9,
        blending: THREE.AdditiveBlending,
      })
      const photonMesh = new THREE.Mesh(photonGeo, photonMat)
      arcGroup.add(photonMesh)

      photonRays.push({
        curve,
        mesh: photonMesh,
        progress: Math.random(),
        speed: 0.006 + Math.random() * 0.005,
      })
    })

    // 6. 3D Orbiting Telemetry Satellites (Starlink & Geo Relays)
    const satelliteGroup = new THREE.Group()
    scene.add(satelliteGroup)

    const satellites: {
      group: THREE.Group
      orbitRadius: number
      inclination: number
      speed: number
      angle: number
    }[] = []

    const satConfigs = [
      { name: "TryCalc Relay-1", orbitRadius: 2.7, inclination: 0.45, speed: 0.008, color: 0x38bdf8 },
      { name: "Global Edge-2", orbitRadius: 3.1, inclination: -0.65, speed: 0.006, color: 0x10b981 },
      { name: "Pulse Telemetry-3", orbitRadius: 2.9, inclination: 1.1, speed: 0.01, color: 0xf59e0b },
    ]

    satConfigs.forEach((sat) => {
      const satG = new THREE.Group()

      // Satellite Core Body
      const bodyGeo = new THREE.BoxGeometry(0.045, 0.035, 0.065)
      const bodyMat = new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        metalness: 0.8,
        roughness: 0.2,
      })
      const body = new THREE.Mesh(bodyGeo, bodyMat)
      satG.add(body)

      // Solar Panel Wings (Gold Foil)
      const panelGeo = new THREE.PlaneGeometry(0.14, 0.035)
      const panelMat = new THREE.MeshStandardMaterial({
        color: 0xd97706,
        roughness: 0.3,
        metalness: 0.9,
        side: THREE.DoubleSide,
      })
      const panelLeft = new THREE.Mesh(panelGeo, panelMat)
      panelLeft.position.set(-0.09, 0, 0)
      satG.add(panelLeft)

      const panelRight = new THREE.Mesh(panelGeo, panelMat)
      panelRight.position.set(0.09, 0, 0)
      satG.add(panelRight)

      // Glowing Antenna Beacon
      const antGeo = new THREE.SphereGeometry(0.015, 8, 8)
      const antMat = new THREE.MeshBasicMaterial({ color: sat.color })
      const ant = new THREE.Mesh(antGeo, antMat)
      ant.position.set(0, 0.025, 0)
      satG.add(ant)

      // Orbit Path Ring
      const orbitCurve = new THREE.EllipseCurve(
        0, 0,
        sat.orbitRadius, sat.orbitRadius,
        0, 2 * Math.PI,
        false, 0
      )
      const orbitPoints = orbitCurve.getPoints(64)
      const orbitGeo = new THREE.BufferGeometry().setFromPoints(
        orbitPoints.map((p) => new THREE.Vector3(p.x, 0, p.y))
      )
      const orbitMat = new THREE.LineBasicMaterial({
        color: sat.color,
        transparent: true,
        opacity: 0.2,
      })
      const orbitLine = new THREE.Line(orbitGeo, orbitMat)
      orbitLine.rotation.x = sat.inclination
      satelliteGroup.add(orbitLine)

      satelliteGroup.add(satG)

      satellites.push({
        group: satG,
        orbitRadius: sat.orbitRadius,
        inclination: sat.inclination,
        speed: sat.speed,
        angle: Math.random() * Math.PI * 2,
      })
    })

    // 7. Mouse Orbit Controls and Drag Interaction
    let isDragging = false
    let prevMouseX = 0
    let prevMouseY = 0
    let velocityX = 0
    let velocityY = 0

    const raycaster = new THREE.Raycaster()
    const mousePos = new THREE.Vector2()

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true
      prevMouseX = e.clientX
      prevMouseY = e.clientY
      velocityX = 0
      velocityY = 0
    }

    const onPointerMove = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect()
      mousePos.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mousePos.y = -((e.clientY - rect.top) / rect.height) * 2 + 1

      if (isDragging) {
        const deltaX = e.clientX - prevMouseX
        const deltaY = e.clientY - prevMouseY
        prevMouseX = e.clientX
        prevMouseY = e.clientY

        velocityX = deltaX * 0.005
        velocityY = deltaY * 0.005

        globeGroup.rotation.y += velocityX
        globeGroup.rotation.x = Math.max(-1.1, Math.min(1.1, globeGroup.rotation.x + velocityY))
        targetRotationRef.current = null // User took manual control
      }
    }

    const onPointerUp = (e: PointerEvent) => {
      // Check if user clicked on a pin without dragging
      if (Math.abs(velocityX) < 0.002 && Math.abs(velocityY) < 0.002) {
        raycaster.setFromCamera(mousePos, camera)
        const intersects = raycaster.intersectObjects(raycastPins, false)
        if (intersects.length > 0) {
          const hit = intersects[0].object as THREE.Mesh
          const code = hit.userData.code
          if (code && onCountrySelect) {
            onCountrySelect(code)
          }
        }
      }
      isDragging = false
    }

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const zoomDelta = e.deltaY * 0.0025
      targetCameraDistanceRef.current = Math.max(2.8, Math.min(7.5, targetCameraDistanceRef.current + zoomDelta))
    }

    const domEl = renderer.domElement
    domEl.addEventListener("pointerdown", onPointerDown)
    window.addEventListener("pointermove", onPointerMove)
    window.addEventListener("pointerup", onPointerUp)
    domEl.addEventListener("wheel", onWheel, { passive: false })

    // Animation Loop
    let animId: number
    const animate = () => {
      animId = requestAnimationFrame(animate)

      // Handle Smooth Zoom Lerp
      camera.position.z += (targetCameraDistanceRef.current - camera.position.z) * 0.08

      // Handle Smooth Camera Fly-To Target Rotation (Slerp-style Euler Lerp)
      if (targetRotationRef.current) {
        globeGroup.rotation.y += (targetRotationRef.current.y - globeGroup.rotation.y) * 0.065
        globeGroup.rotation.x += (targetRotationRef.current.x - globeGroup.rotation.x) * 0.065

        const diffY = Math.abs(targetRotationRef.current.y - globeGroup.rotation.y)
        const diffX = Math.abs(targetRotationRef.current.x - globeGroup.rotation.x)
        if (diffY < 0.005 && diffX < 0.005) {
          targetRotationRef.current = null // Reached destination
        }
      } else if (!isDragging && isRotatingRef.current) {
        // Natural Earth Day/Night Spin
        globeGroup.rotation.y += 0.0016
      } else if (!isDragging) {
        // Inertia damping after drag
        velocityX *= 0.92
        velocityY *= 0.92
        globeGroup.rotation.y += velocityX
        globeGroup.rotation.x = Math.max(-1.1, Math.min(1.1, globeGroup.rotation.x + velocityY))
      }

      // Handle Clouds Visibility and Atmospheric Winds
      if (cloudMesh) {
        cloudMesh.visible = showCloudsRef.current
        if (showCloudsRef.current) {
          cloudMesh.rotation.y += 0.0006 // Clouds drift faster than land
        }
      }

      // Handle Flight Arcs Visibility and Photon Flow
      arcGroup.visible = showArcsRef.current
      if (showArcsRef.current) {
        photonRays.forEach((p) => {
          p.progress = (p.progress + p.speed) % 1
          const pt = p.curve.getPoint(p.progress)
          p.mesh.position.copy(pt)
        })
      }

      // Handle Orbiting Satellites
      satelliteGroup.visible = showSatellitesRef.current
      if (showSatellitesRef.current) {
        satellites.forEach((sat) => {
          sat.angle += sat.speed
          const x = Math.cos(sat.angle) * sat.orbitRadius
          const z = Math.sin(sat.angle) * sat.orbitRadius
          const y = Math.sin(sat.angle) * Math.sin(sat.inclination) * sat.orbitRadius * 0.45

          sat.group.position.set(x, y, z)
          sat.group.lookAt(0, 0, 0)
        })
      }

      // Expanding Radar Pulse Wave Rings
      waveRings.forEach((r) => {
        r.scale += r.speed
        if (r.scale > 3.2) {
          r.scale = 1
        }
        r.mesh.scale.set(r.scale, r.scale, 1)
        const mat = r.mesh.material as THREE.MeshBasicMaterial
        mat.opacity = Math.max(0, 0.85 * (1 - (r.scale - 1) / 2.2))
      })

      // Handle Zoom Buttons Action
      if (zoomActionRef.current !== null) {
        targetCameraDistanceRef.current = Math.max(
          2.8,
          Math.min(7.5, targetCameraDistanceRef.current + zoomActionRef.current * 0.15)
        )
        zoomActionRef.current = null
      }

      // Handle Reset Camera Action
      if (resetCameraRef.current) {
        targetRotationRef.current = { x: 0.22, y: -1.45 }
        targetCameraDistanceRef.current = 5.2
        resetCameraRef.current = false
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
      domEl.removeEventListener("pointerdown", onPointerDown)
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("pointerup", onPointerUp)
      domEl.removeEventListener("wheel", onWheel)
      cancelAnimationFrame(animId)
      renderer.dispose()
    }
  }, [topCountries, onCountrySelect])

  return (
    <Box sx={{ position: "relative", width: "100%", height: 500, overflow: "hidden", borderRadius: 3 }}>
      {/* 3D WebGL Canvas Container */}
      <Box ref={mountRef} sx={{ width: "100%", height: "100%", cursor: "grab", "&:active": { cursor: "grabbing" } }} />

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
            bgcolor: "rgba(248, 250, 252, 0.85)",
            backdropFilter: "blur(6px)",
            zIndex: 10,
          }}
        >
          <Typography variant="body2" sx={{ color: "#0f172a", fontWeight: 700, mb: 1 }}>
            Streaming NASA Photorealistic High-Res Earth & Atmosphere...
          </Typography>
          <Typography variant="caption" sx={{ color: "#64748b" }}>
            Synchronizing WebGL Shaders & Satellites
          </Typography>
        </Box>
      )}

      {/* 3D Interactive Country HUD Badge (Appears when country is clicked or selected) */}
      {activeCountryInfo && (
        <Box
          sx={{
            position: "absolute",
            top: 16,
            left: 16,
            bgcolor: "rgba(255, 255, 255, 0.94)",
            backdropFilter: "blur(12px)",
            border: "1px solid #38bdf8",
            borderRadius: 3,
            p: 2,
            boxShadow: "0 12px 28px rgba(15, 23, 42, 0.12)",
            maxWidth: 280,
            zIndex: 15,
            animation: "fadeIn 0.3s ease-out",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography sx={{ fontSize: 22 }}>{activeCountryInfo.flag}</Typography>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#0f172a", lineHeight: 1.2 }}>
                  {activeCountryInfo.name}
                </Typography>
                <Typography variant="caption" sx={{ color: "#64748b" }}>
                  {activeCountryInfo.capital ? `Capital: ${activeCountryInfo.capital}` : `Code: ${activeCountryInfo.code}`}
                </Typography>
              </Box>
            </Box>
            <IconButton size="small" onClick={() => setActiveCountryInfo(null)} sx={{ color: "#64748b" }}>
              <CloseIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", bgcolor: "#f8fafc", p: 1.25, borderRadius: 2, mb: 1 }}>
            <Box>
              <Typography variant="caption" sx={{ color: "#64748b", display: "block" }}>
                TOTAL TRAFFIC
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 800, color: "#2563eb" }}>
                {activeCountryInfo.count.toLocaleString()}
              </Typography>
            </Box>
            <Box sx={{ textAlign: "right" }}>
              <Typography variant="caption" sx={{ color: "#64748b", display: "block" }}>
                GLOBAL SHARE
              </Typography>
              <Chip
                label={`${activeCountryInfo.percentage}%`}
                size="small"
                sx={{ bgcolor: "#dbeafe", color: "#1e40af", fontWeight: 700, height: 22 }}
              />
            </Box>
          </Box>

          <Typography variant="caption" sx={{ color: "#059669", display: "flex", alignItems: "center", gap: 0.5, fontWeight: 600 }}>
            <FlareIcon sx={{ fontSize: 13 }} /> 3D Camera Focused & Beacons Active
          </Typography>
        </Box>
      )}

      {/* Floating 3D Telemetry Controls HUD (Top-Right) */}
      <Box
        sx={{
          position: "absolute",
          top: 14,
          right: 14,
          display: "flex",
          alignItems: "center",
          gap: 1,
          bgcolor: "rgba(255, 255, 255, 0.88)",
          backdropFilter: "blur(12px)",
          border: "1px solid #e2e8f0",
          borderRadius: 2.5,
          p: 0.5,
          boxShadow: "0 6px 16px rgba(15, 23, 42, 0.06)",
          zIndex: 10,
        }}
      >
        <Tooltip title={isRotating ? "Pause Earth Rotation" : "Resume Earth Rotation"} arrow>
          <IconButton size="small" onClick={() => setIsRotating(!isRotating)} sx={{ color: isRotating ? "#2563eb" : "#64748b" }}>
            {isRotating ? <PauseIcon fontSize="small" /> : <PlayArrowIcon fontSize="small" />}
          </IconButton>
        </Tooltip>

        <Tooltip title={showClouds ? "Hide Cloud Atmosphere" : "Show Cloud Atmosphere"} arrow>
          <IconButton size="small" onClick={() => setShowClouds(!showClouds)} sx={{ color: showClouds ? "#0284c7" : "#cbd5e1" }}>
            <PublicIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title={showArcs ? "Hide 3D Flight Arcs" : "Show 3D Flight Arcs"} arrow>
          <IconButton size="small" onClick={() => setShowArcs(!showArcs)} sx={{ color: showArcs ? "#4f46e5" : "#cbd5e1" }}>
            <FlareIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title={showSatellites ? "Hide Telemetry Satellites" : "Show Telemetry Satellites"} arrow>
          <IconButton size="small" onClick={() => setShowSatellites(!showSatellites)} sx={{ color: showSatellites ? "#d97706" : "#cbd5e1" }}>
            <SatelliteAltIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Box sx={{ width: 1, height: 16, bgcolor: "#e2e8f0", mx: 0.5 }} />

        <Tooltip title="Zoom In (+)" arrow>
          <IconButton size="small" onClick={() => (zoomActionRef.current = -1)} sx={{ color: "#334155" }}>
            <ZoomInIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Zoom Out (-)" arrow>
          <IconButton size="small" onClick={() => (zoomActionRef.current = 1)} sx={{ color: "#334155" }}>
            <ZoomOutIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Reset View to Bangladesh HQ" arrow>
          <IconButton size="small" onClick={() => (resetCameraRef.current = true)} sx={{ color: "#10b981" }}>
            <RestartAltIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Subtle Hint Footer */}
      <Box
        sx={{
          position: "absolute",
          bottom: 12,
          left: 14,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          bgcolor: "rgba(255, 255, 255, 0.75)",
          backdropFilter: "blur(8px)",
          border: "1px solid #e2e8f0",
          borderRadius: 2,
          px: 1.5,
          py: 0.5,
          zIndex: 5,
        }}
      >
        <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 600 }}>
          💡 Click any country beacon or table row to fly camera • Drag to rotate • Scroll to zoom
        </Typography>
      </Box>
    </Box>
  )
}

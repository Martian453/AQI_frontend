"use client"

import { useEffect, useState } from "react"
import { AirQualityCard } from "@/components/air-quality-card"
import { EnvironmentalCore } from "@/components/environmental-core"
import { WaterQualityCard } from "@/components/water-quality-card"
import { SidebarNavigation } from "@/components/sidebar-navigation"
import { PollutantDonutChart } from "@/components/charts/pollutant-donut-chart"
import { AQIForecastChart } from "@/components/charts/aqi-forecast-chart"
import dynamic from "next/dynamic"

// Dynamically import Leaflet map to avoid SSR issues
const LeafletMapCard = dynamic(
  () => import("@/components/leaflet-map-card").then((mod) => mod.LeafletMapCard),
  { ssr: false }
)
import { Download, Wifi, WifiOff } from "lucide-react"

export default function Dashboard() {
  const [isOnline, setIsOnline] = useState(true)
  const [lastUpdate, setLastUpdate] = useState("--:--")
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [maxWaterLevel, setMaxWaterLevel] = useState(0)

  // Mock data - replace with real API calls
  const [airData, setAirData] = useState({
    pm25: 0,
    pm10: 0,
    co: 0,
    no2: 0,
    o3: 0,
    so2: 44,
    chartData: {
      labels: ["10:00", "10:15", "10:30", "10:45", "11:00", "11:15", "11:30", "11:45", "12:00", "12:15"],
      pm25: [120, 250, 180, 300, 220, 150, 280, 200, 350, 250],
      pm10: [80, 150, 100, 200, 130, 90, 170, 120, 220, 160],
      co: [200, 400, 300, 500, 350, 250, 450, 320, 550, 400],
      no2: [150, 300, 200, 400, 280, 180, 350, 250, 450, 320],
    },
  })

  const [waterData, setWaterData] = useState({
    level: 0,
    ph: 0,
    turbidity: 0,
  })

  const [stars, setStars] = useState<Array<{ left: string; top: string; delay: string; duration: string }>>([])

  const maxPm25Recorded = Math.max(airData.pm25, ...airData.chartData.pm25)

  // Simulate real-time updates
  useEffect(() => {
    const updateData = () => {
      const now = new Date()
      setLastUpdate(
        `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`
      )

      // Simulate fluctuating values
      setAirData((prev) => ({
        ...prev,
        pm25: Math.random() * 50,
        pm10: Math.random() * 30,
        co: Math.random() * 10,
        no2: Math.random() * 20,
        o3: Math.random() * 15,
        so2: 40 + Math.random() * 10,
      }))

      setWaterData({
        level: 5 + Math.random() * 3,
        ph: 6.5 + Math.random() * 2,
        turbidity: 20 + Math.random() * 30,
      })
    }

    updateData()
    const interval = setInterval(updateData, 3000)
    return () => clearInterval(interval)
  }, [])

  // Track max water level observed
  useEffect(() => {
    setMaxWaterLevel((prev) => Math.max(prev, waterData.level))
  }, [waterData.level])

  // Track mouse for parallax effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Generate stars on client side only
  useEffect(() => {
    const newStars = Array.from({ length: 100 }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 3}s`,
      duration: `${2 + Math.random() * 2}s`,
    }))
    setStars(newStars)
  }, [])

  const handleDownload = () => {
    // In a real app, this would trigger CSV download
    alert("Download functionality would export CSV data")
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050511]">
      <SidebarNavigation isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen((v) => !v)} />

      {/* Animated Gradient Background */}
      <div className="fixed inset-0 z-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0520] via-[#050511] to-[#000208]" />

        {/* Animated gradient orbs */}
        <div
          className="absolute h-[600px] w-[600px] rounded-full bg-gradient-to-br from-emerald-600/20 via-cyan-600/10 to-transparent blur-[100px]"
          style={{
            left: `calc(15% + ${mousePosition.x}px)`,
            top: `calc(15% + ${mousePosition.y}px)`,
            transition: "left 0.3s ease-out, top 0.3s ease-out",
          }}
        />
        <div
          className="animation-delay-2000 absolute h-[500px] w-[500px] rounded-full bg-gradient-to-br from-purple-600/15 via-indigo-600/10 to-transparent blur-[100px]"
          style={{
            right: `calc(10% + ${-mousePosition.x}px)`,
            top: `calc(20% + ${-mousePosition.y}px)`,
            transition: "right 0.3s ease-out, top 0.3s ease-out",
          }}
        />
        <div
          className="animation-delay-4000 absolute h-[400px] w-[400px] rounded-full bg-gradient-to-br from-cyan-600/15 via-teal-600/10 to-transparent blur-[100px]"
          style={{
            left: `calc(50% + ${mousePosition.x * 0.5}px)`,
            bottom: `calc(10% + ${-mousePosition.y * 0.5}px)`,
            transition: "left 0.3s ease-out, bottom 0.3s ease-out",
          }}
        />

        {/* Starfield */}
        <div className="absolute inset-0 opacity-70">
          {stars.map((star, i) => (
            <div
              key={i}
              className="absolute h-[2px] w-[2px] animate-twinkle rounded-full bg-white"
              style={{
                left: star.left,
                top: star.top,
                animationDelay: star.delay,
                animationDuration: star.duration,
              }}
            />
          ))}
        </div>

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(124, 255, 154, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(124, 255, 154, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-white/5 px-6 py-5 backdrop-blur-sm lg:px-10">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute -inset-1 animate-pulse rounded-full bg-emerald-500/30 blur-md" />
              <div className="relative h-3 w-3 rounded-full bg-emerald-400" />
            </div>
            <h1 className="text-2xl font-bold tracking-wide lg:text-3xl" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
              <span className="bg-gradient-to-r from-cyan-400 to-[#7CFF9A] bg-clip-text text-transparent">
                Air & Groundwater Intelligence
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleDownload}
              className="group relative flex items-center gap-2 overflow-hidden rounded-lg border border-emerald-500/30 bg-transparent px-4 py-2.5 text-sm font-semibold text-emerald-400 transition-all duration-300 hover:border-emerald-400/50 hover:shadow-[0_0_20px_rgba(124,255,154,0.3)]"
            >
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
              <Download className="h-4 w-4" />
              <span className="relative">Download Excel | CSV</span>
            </button>

            <div
              className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-xs font-bold tracking-wider transition-all duration-300 ${isOnline
                ? "animate-pulse-subtle border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-[0_0_20px_rgba(124,255,154,0.15)]"
                : "border-cyan-500/30 bg-cyan-500/10 text-cyan-400"
                }`}
            >
              {isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
              {isOnline ? "SYSTEM ONLINE" : "SYSTEM OFFLINE"}
            </div>
          </div>
        </header>

        {/* Main Dashboard Grid */}
        <main className="flex-1 p-6 lg:p-8">
          <div className="grid h-full grid-cols-1 gap-6 lg:grid-cols-[1fr_1.5fr_1fr] lg:gap-8">
            {/* Column 1: Air Quality */}
            <div className="flex flex-col h-full gap-6">
              <div className="flex-1">
                <AirQualityCard data={airData} />
              </div>
            </div>

            {/* Column 2: Environmental Core (Modified Layout) */}
            <EnvironmentalCore
              aqi={airData.pm25}
              lastUpdate={lastUpdate}
              maxPm25={maxPm25Recorded}
              currentPm25={airData.pm25}
              maxWaterLevel={maxWaterLevel}
              currentWaterLevel={waterData.level}
            />

            {/* Column 3: Water Quality & Pollutant Cause Analysis */}
            <div className="flex flex-col gap-6 h-full">
              {/* Water Card (Reduced Height) */}
              <div className="flex-[1.5] min-h-[300px]">
                <WaterQualityCard data={waterData} />
              </div>

              {/* Pollutant Donut (New) */}
              <div className="flex-1 min-h-[250px]">
                <PollutantDonutChart />
              </div>
            </div>
          </div>

          {/* Map & Predictive Row */}
          <div className="mx-auto mt-6 grid w-full max-w-6xl grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr]">
            {/* Predictive Intelligence (Left) */}
            <div className="h-[350px]">
              <AQIForecastChart />
            </div>

            {/* Live Location Map (Right, Compact) */}
            <div className="h-[350px]">
              <LeafletMapCard />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

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

// CONFIGURATION: Change these values to update the dashboard
const DASHBOARD_CONFIG = {
  airQuality: {
    pm25: 35,
    pm10: 42,
    co: 2.5,
    no2: 12,
    o3: 28,
    so2: 5,
    // Historical trend for the chart
    chartData: {
      labels: ["10:00", "10:15", "10:30", "10:45", "11:00", "11:15", "11:30", "11:45", "12:00", "12:15"],
      pm25: [25, 30, 28, 32, 35, 38, 36, 34, 33, 35],
      pm10: [35, 38, 40, 42, 45, 43, 41, 40, 39, 42],
      co: [2.0, 2.1, 2.2, 2.3, 2.4, 2.5, 2.4, 2.3, 2.2, 2.5],
      no2: [10, 11, 12, 13, 14, 15, 14, 13, 12, 12],
      o3: [25, 28, 26, 29, 30, 28, 27, 26, 28, 29],
      so2: [4, 5, 4.5, 5, 5.5, 5, 4.8, 4.5, 5, 5.2],
    },
  },
  waterQuality: {
    level: 6.5,
    ph: 7.2,
    turbidity: 3.5,
  },
  // Predictive Graph Data
  forecastData: [
    { time: "Now", actual: 145, predicted: 145 },
    { time: "+1h", actual: null, predicted: 152 },
    { time: "+2h", actual: null, predicted: 158 },
    { time: "+3h", actual: null, predicted: 165 },
    { time: "+4h", actual: null, predicted: 160 },
    { time: "+5h", actual: null, predicted: 155 },
    { time: "+6h", actual: null, predicted: 148 },
  ],
  // Donut Chart Data
  pollutantDonutData: [
    { name: "PM2.5", value: 45, color: "#7CFF9A" }, // Neon Green
    { name: "PM10", value: 30, color: "#FFD36A" },  // Neon Yellow
    { name: "NO2", value: 15, color: "#8FD3FF" },   // Neon Blue
    { name: "SO2", value: 10, color: "#FF6B6B" },   // Neon Red
  ]
}

export default function Dashboard() {
  const [isOnline, setIsOnline] = useState(true)
  const [lastUpdate, setLastUpdate] = useState("--:--")
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Initialize with constant configuration
  const [maxWaterLevel, setMaxWaterLevel] = useState(DASHBOARD_CONFIG.waterQuality.level)
  const [airData, setAirData] = useState(DASHBOARD_CONFIG.airQuality)
  const [waterData, setWaterData] = useState(DASHBOARD_CONFIG.waterQuality)
  const [forecastData] = useState(DASHBOARD_CONFIG.forecastData)
  const [donutData] = useState(DASHBOARD_CONFIG.pollutantDonutData)

  const [stars, setStars] = useState<Array<{ left: string; top: string; delay: string; duration: string }>>([])

  const maxPm25Recorded = Math.max(airData.pm25, ...airData.chartData.pm25)

  // Clock update only - Data remains constant
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setLastUpdate(
        `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`
      )
    }

    updateTime()
    const interval = setInterval(updateTime, 1000) // Update clock every second
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
                <PollutantDonutChart data={donutData} />
              </div>
            </div>
          </div>

          {/* Map & Predictive Row */}
          <div className="mx-auto mt-6 grid w-full max-w-6xl grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr]">
            {/* Predictive Intelligence (Left) */}
            <div className="h-[350px]">
              <AQIForecastChart data={forecastData} />
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

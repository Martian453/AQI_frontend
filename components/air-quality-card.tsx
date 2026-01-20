"use client"

import { useEffect, useRef, useState } from "react"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

interface AirQualityData {
  pm25: number
  pm10: number
  co: number
  no2: number
  o3: number
  so2: number
  chartData: {
    labels: string[]
    pm25: number[]
    pm10: number[]
    co: number[]
    no2: number[]
  }
}

interface AirQualityCardProps {
  data: AirQualityData
}

export function AirQualityCard({ data }: AirQualityCardProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredPollutant, setHoveredPollutant] = useState<string | null>(null)
  const [animatedValues, setAnimatedValues] = useState({
    pm25: 0,
    pm10: 0,
    co: 0,
    no2: 0,
    o3: 0,
    so2: 0,
  })
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Animate values when data changes
  useEffect(() => {
    const duration = 800
    const startTime = Date.now()
    const startValues = { ...animatedValues }

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)

      setAnimatedValues({
        pm25: startValues.pm25 + (data.pm25 - startValues.pm25) * eased,
        pm10: startValues.pm10 + (data.pm10 - startValues.pm10) * eased,
        co: startValues.co + (data.co - startValues.co) * eased,
        no2: startValues.no2 + (data.no2 - startValues.no2) * eased,
        o3: startValues.o3 + (data.o3 - startValues.o3) * eased,
        so2: startValues.so2 + (data.so2 - startValues.so2) * eased,
      })

      if (progress < 1) requestAnimationFrame(animate)
    }

    animate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.pm25, data.pm10, data.co, data.no2, data.o3, data.so2])

  const getAqiStatus = (pm25: number) => {
    if (pm25 <= 50)
      return {
        text: "Good",
        color: "text-emerald-400",
        bg: "bg-emerald-500/20",
        border: "border-emerald-500/30",
        glow: "shadow-[0_0_20px_rgba(52,211,153,0.4)]",
      }
    if (pm25 <= 100)
      return {
        text: "Moderate",
        color: "text-amber-400",
        bg: "bg-amber-500/20",
        border: "border-amber-500/30",
        glow: "shadow-[0_0_20px_rgba(251,191,36,0.4)]",
      }
    return {
      text: "Unhealthy",
      color: "text-red-400",
      bg: "bg-red-500/20",
      border: "border-red-500/30",
      glow: "shadow-[0_0_20px_rgba(248,113,113,0.4)]",
    }
  }

  const status = getAqiStatus(data.pm25)

  const chartData = {
    labels: data.chartData.labels,
    datasets: [
      {
        label: "Good Limit",
        data: data.chartData.pm25.map((v) => v * 1.1),
        borderColor: "#7CFF9A",
        backgroundColor: "rgba(124,255,154,0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: hoveredPollutant === "pm25" ? 5 : 3,
        pointHoverRadius: 7,
        borderWidth: 2,
      },
      {
        label: "Moderate",
        data: data.chartData.pm10.map((v) => v * 0.9),
        borderColor: "#FFD36A",
        backgroundColor: "rgba(255,211,106,0.08)",
        fill: true,
        tension: 0.4,
        pointRadius: hoveredPollutant === "pm10" ? 5 : 3,
        pointHoverRadius: 7,
        borderWidth: hoveredPollutant === "pm10" ? 3 : 2,
      },
      {
        label: "50%",
        data: data.chartData.co.map((v) => v * 0.5),
        borderColor: "#8FD3FF",
        backgroundColor: "rgba(143,211,255,0.08)",
        fill: false,
        tension: 0.4,
        pointRadius: 2,
        pointHoverRadius: 5,
        borderWidth: 2,
      },
      {
        label: "Unhealthy",
        data: data.chartData.no2.map((v) => v * 0.8),
        borderColor: "#B68FFF",
        backgroundColor: "rgba(182,143,255,0.08)",
        fill: false,
        tension: 0.4,
        pointRadius: 2,
        pointHoverRadius: 5,
        borderWidth: 2,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    plugins: {
      legend: {
        display: true,
        position: "bottom" as const,
        labels: {
          color: "#9aa7d9",
          font: { size: 10 },
          padding: 8,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: "rgba(10, 15, 40, 0.95)",
        titleColor: "#fff",
        bodyColor: "#9aa7d9",
        borderColor: "rgba(124, 255, 154, 0.3)",
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: (context: { dataset: { label?: string }; parsed: { y: number } }) =>
            `${context.dataset.label}: ${context.parsed.y.toFixed(1)} units`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#5a6b9f", font: { size: 9 } },
        grid: { display: false },
      },
      y: {
        ticks: { color: "#5a6b9f", font: { size: 9 } },
        grid: { color: "rgba(124, 255, 154, 0.05)" },
      },
    },
    animation: {
      duration: 750,
      easing: "easeInOutQuart" as const,
    },
  }

  const pollutants = [
    { label: "PM2.5", key: "pm25", value: animatedValues.pm25, unit: "ug/m3" },
    { label: "PM10", key: "pm10", value: animatedValues.pm10, unit: "ug/m3" },
    { label: "CO", key: "co", value: animatedValues.co, unit: "ppb" },
    { label: "NO2", key: "no2", value: animatedValues.no2, unit: "ppb" },
    { label: "O3", key: "o3", value: animatedValues.o3, unit: "ppb" },
    { label: "SO2", key: "so2", value: animatedValues.so2, unit: "ppb" },
  ]

  return (
    <div
      ref={cardRef}
      className={`card-vibrant card-air group relative flex h-full flex-col transition-all duration-700 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
    >
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl">
        <div className="absolute -left-1/4 -top-1/4 h-1/2 w-1/2 animate-blob rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="animation-delay-2000 absolute -right-1/4 bottom-1/4 h-1/2 w-1/2 animate-blob rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <h2 className="relative z-10 mb-4 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-sm font-medium uppercase tracking-[0.2em] text-transparent">
        Air Quality
      </h2>

      {/* AQI Display */}
      <div className="relative z-10 mb-4 flex items-center gap-4">
        <div className="animate-pulse-glow relative">
          <span className="bg-gradient-to-br from-emerald-300 via-emerald-400 to-cyan-400 bg-clip-text text-7xl font-extrabold text-transparent drop-shadow-[0_0_30px_rgba(124,255,154,0.5)]">
            {Math.round(animatedValues.pm25)}
          </span>
        </div>
        <div
          className={`rounded-lg px-4 py-2 ${status.bg} ${status.border} ${status.glow} border ${status.color} font-bold transition-all duration-500`}
        >
          {status.text}
        </div>
      </div>

      {/* Pollutants Grid - Interactive */}
      <div className="relative z-10 mb-4 grid grid-cols-3 gap-2">
        {pollutants.map((p, i) => (
          <div
            key={p.label}
            className={`group/item cursor-pointer rounded-xl border bg-slate-900/50 p-3 text-center backdrop-blur-sm transition-all duration-300 ${
              hoveredPollutant === p.key
                ? "border-emerald-500/50 bg-emerald-500/10 scale-105 shadow-[0_0_20px_rgba(124,255,154,0.2)]"
                : "border-white/5 hover:border-emerald-500/30 hover:bg-slate-800/50"
            }`}
            style={{ animationDelay: `${i * 100}ms` }}
            onMouseEnter={() => setHoveredPollutant(p.key)}
            onMouseLeave={() => setHoveredPollutant(null)}
          >
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              {p.label}
            </div>
            <div
              className={`text-xl font-bold transition-all duration-300 ${
                hoveredPollutant === p.key
                  ? "text-emerald-400 scale-110"
                  : "text-white group-hover/item:text-emerald-400"
              }`}
            >
              {Math.round(p.value)}
            </div>
            <div className="text-[10px] text-slate-500">{p.unit}</div>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="relative z-10 flex-1">
        <h3 className="mb-2 text-xs font-medium uppercase tracking-widest text-slate-400">
          AQI Pollutant Levels
        </h3>
        <div className="h-[260px]">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Animated border */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl border border-emerald-500/10 transition-colors duration-300 group-hover:border-emerald-500/30" />
    </div>
  )
}

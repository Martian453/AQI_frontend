"use client"

import { useEffect, useState } from "react"
import { Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface WaterQualityData {
  level: number
  ph: number
  turbidity: number
}

interface WaterQualityCardProps {
  data: WaterQualityData
}

export function WaterQualityCard({ data }: WaterQualityCardProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null)
  const [animatedValues, setAnimatedValues] = useState({
    level: 0,
    ph: 0,
    turbidity: 0,
  })

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Animate values when data changes
  useEffect(() => {
    const duration = 1200
    const startTime = Date.now()
    const startValues = { ...animatedValues }

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)

      setAnimatedValues({
        level: startValues.level + (data.level - startValues.level) * eased,
        ph: startValues.ph + (data.ph - startValues.ph) * eased,
        turbidity: startValues.turbidity + (data.turbidity - startValues.turbidity) * eased,
      })

      if (progress < 1) requestAnimationFrame(animate)
    }

    animate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.level, data.ph, data.turbidity])

  const chartData = {
    labels: ["Ground Water Level", "pH Level", "Turbidity"],
    datasets: [
      {
        data: [animatedValues.level, animatedValues.ph, animatedValues.turbidity],
        backgroundColor: [
          hoveredMetric === "level" ? "rgba(143, 211, 255, 1)" : "rgba(143, 211, 255, 0.8)",
          hoveredMetric === "ph" ? "rgba(124, 255, 154, 1)" : "rgba(124, 255, 154, 0.8)",
          hoveredMetric === "turbidity" ? "rgba(255, 211, 106, 1)" : "rgba(255, 211, 106, 0.8)",
        ],
        borderRadius: 8,
        barThickness: 40,
        hoverBackgroundColor: ["rgba(143, 211, 255, 1)", "rgba(124, 255, 154, 1)", "rgba(255, 211, 106, 1)"],
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(10, 15, 40, 0.95)",
        titleColor: "#fff",
        bodyColor: "#9aa7d9",
        borderColor: "rgba(143, 211, 255, 0.3)",
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (context: { parsed: { y: number } }) => `Value: ${context.parsed.y.toFixed(2)}`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#5a6b9f", font: { size: 10 } },
        grid: { display: false },
      },
      y: {
        ticks: { color: "#5a6b9f", font: { size: 10 } },
        beginAtZero: true,
        grid: { color: "rgba(143, 211, 255, 0.05)" },
      },
    },
    animation: {
      duration: 750,
      easing: "easeInOutQuart" as const,
    },
  }

  const metrics = [
    { 
      key: "level",
      label: "Ground\nWater Level", 
      value: animatedValues.level.toFixed(1), 
      unit: "ft", 
      color: "text-cyan-400",
      hoverColor: "text-cyan-300",
      glow: "drop-shadow-[0_0_10px_rgba(143,211,255,0.5)]",
      bgGlow: "shadow-[0_0_25px_rgba(143,211,255,0.3)]"
    },
    { 
      key: "ph",
      label: "pH Level", 
      value: animatedValues.ph.toFixed(1), 
      range: "Within 6.5 - 8.5", 
      color: "text-emerald-400",
      hoverColor: "text-emerald-300",
      glow: "drop-shadow-[0_0_10px_rgba(124,255,154,0.5)]",
      bgGlow: "shadow-[0_0_25px_rgba(124,255,154,0.3)]"
    },
    { 
      key: "turbidity",
      label: "Turbidity", 
      value: animatedValues.turbidity.toFixed(1), 
      unit: "ppb", 
      color: "text-amber-400",
      hoverColor: "text-amber-300",
      glow: "drop-shadow-[0_0_10px_rgba(255,211,106,0.5)]",
      bgGlow: "shadow-[0_0_25px_rgba(255,211,106,0.3)]"
    },
  ]

  return (
    <div
      className={`card-vibrant card-water group relative flex h-full flex-col transition-all duration-700 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
      style={{ transitionDelay: "200ms" }}
    >
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl">
        <div className="absolute -right-1/4 -top-1/4 h-1/2 w-1/2 animate-blob rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="animation-delay-2000 absolute -left-1/4 bottom-1/4 h-1/2 w-1/2 animate-blob rounded-full bg-blue-500/15 blur-3xl" />
        {/* Water ripple effect */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-cyan-500/5 to-transparent" />
      </div>

      <h2 className="relative z-10 mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-sm font-medium uppercase tracking-[0.2em] text-transparent">
        Water Quality
      </h2>

      {/* Metrics Grid */}
      <div className="relative z-10 mb-4 grid grid-cols-3 gap-2">
        {metrics.map((m, i) => (
          <div
            key={m.label}
            className={`group/item cursor-pointer rounded-xl border bg-slate-900/50 p-3 text-center backdrop-blur-sm transition-all duration-300 ${
              hoveredMetric === m.key
                ? `border-cyan-500/50 bg-cyan-500/10 scale-105 ${m.bgGlow}`
                : "border-white/5 hover:border-cyan-500/30 hover:bg-slate-800/50"
            }`}
            style={{ animationDelay: `${i * 100}ms` }}
            onMouseEnter={() => setHoveredMetric(m.key)}
            onMouseLeave={() => setHoveredMetric(null)}
          >
            <div className="mb-2 whitespace-pre-line text-[9px] font-semibold uppercase tracking-wider text-slate-500">
              {m.label}
            </div>
            <div
              className={`text-2xl font-bold transition-all duration-300 ${
                hoveredMetric === m.key ? `${m.hoverColor} ${m.glow} scale-110` : `${m.color} ${m.glow}`
              }`}
            >
              {m.value}
            </div>
            {m.unit && <div className="text-[10px] text-slate-500">{m.unit}</div>}
            {m.range && <div className="text-[8px] text-slate-500">{m.range}</div>}
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="relative z-10 mb-4 flex-1">
        <h3 className="mb-2 text-xs font-medium uppercase tracking-widest text-slate-400">
          Water Quality
        </h3>
        <div className="h-[180px]">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Large Water Level Display */}
      <div
        className={`relative z-10 rounded-xl border border-cyan-500/20 bg-slate-900/60 p-4 text-center backdrop-blur-sm transition-all duration-300 ${
          hoveredMetric === "level" ? "border-cyan-400/50 shadow-[0_0_30px_rgba(143,211,255,0.2)]" : ""
        }`}
        onMouseEnter={() => setHoveredMetric("level")}
        onMouseLeave={() => setHoveredMetric(null)}
      >
        <div className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
          Ground Water Level (ft)
        </div>
        <div className="relative">
          <span
            className={`bg-gradient-to-br from-cyan-300 via-cyan-400 to-blue-400 bg-clip-text text-5xl font-extrabold text-transparent transition-all duration-300 ${
              hoveredMetric === "level"
                ? "drop-shadow-[0_0_40px_rgba(143,211,255,0.6)] scale-105"
                : "drop-shadow-[0_0_30px_rgba(143,211,255,0.5)]"
            }`}
          >
            {animatedValues.level.toFixed(1)}
          </span>
          <span className="ml-1 text-lg font-semibold text-slate-400">ft</span>
        </div>
        {/* Animated wave effect */}
        <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden rounded-b-xl">
          <div className="animate-wave h-full w-[200%] bg-gradient-to-r from-cyan-500/50 via-blue-500/50 to-cyan-500/50" />
        </div>
      </div>

      {/* Animated border */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl border border-cyan-500/10 transition-colors duration-300 group-hover:border-cyan-500/30" />
    </div>
  )
}

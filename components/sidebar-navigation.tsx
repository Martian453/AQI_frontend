"use client"

import { useState } from "react"
import { LayoutDashboard, Radar, MapPin, Sun, Moon, Monitor, ChevronRight, X } from "lucide-react"
import { useTheme } from "next-themes"

interface SidebarNavigationProps {
  isOpen: boolean
  onToggle: () => void
}

export function SidebarNavigation({ isOpen, onToggle }: SidebarNavigationProps) {
  const { theme, setTheme } = useTheme()
  const [activeItem, setActiveItem] = useState("dashboard")

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      description: "Main monitoring view",
    },
    {
      id: "nearby-devices",
      label: "Nearby Devices",
      icon: Radar,
      description: "Connected sensors",
    },
    {
      id: "other-locations",
      label: "Other Location Dashboards",
      icon: MapPin,
      description: "View other sites",
    },
  ]

  const themes = [
    { id: "light" as const, label: "Light", icon: Sun },
    { id: "dark" as const, label: "Dark", icon: Moon },
    { id: "system" as const, label: "System", icon: Monitor },
  ]

  const handleNavClick = (itemId: string) => {
    setActiveItem(itemId)
    if (itemId === "dashboard") onToggle()
  }

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={onToggle}
        className="fixed left-2 top-6 z-[100] flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-slate-900/90 shadow-xl backdrop-blur-md transition-all duration-300 hover:border-emerald-500/30 hover:bg-slate-800/90 dark:border-white/10 dark:bg-slate-900/90"
        aria-label="Toggle menu"
      >
        <div className="relative h-5 w-5">
          <span
            className={`absolute left-0 top-0 h-0.5 w-5 rounded-full bg-emerald-400 transition-all duration-300 ${isOpen ? "top-2.5 rotate-45" : ""
              }`}
          />
          <span
            className={`absolute left-0 top-2 h-0.5 w-5 rounded-full bg-emerald-400 transition-all duration-300 ${isOpen ? "opacity-0" : ""
              }`}
          />
          <span
            className={`absolute left-0 top-4 h-0.5 w-5 rounded-full bg-emerald-400 transition-all duration-300 ${isOpen ? "top-2.5 -rotate-45" : ""
              }`}
          />
        </div>
      </button>

      {/* Backdrop Overlay */}
      <div
        className={`fixed inset-0 z-[90] bg-black/60 transition-all duration-500 ${isOpen ? "opacity-100 backdrop-blur-md" : "pointer-events-none opacity-0 backdrop-blur-none"
          }`}
        onClick={onToggle}
      />

      {/* Sidebar Panel */}
      <aside
        className={`fixed left-0 top-0 z-[95] flex h-screen w-[340px] flex-col border-r border-emerald-500/10 bg-gradient-to-b from-[#0a0f1a]/98 via-[#0d1425]/98 to-[#0a0f1a]/98 shadow-[0_0_60px_rgba(0,0,0,0.5)] backdrop-blur-2xl transition-all duration-500 ease-out dark:border-emerald-500/5 ${isOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
          }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 p-6 dark:border-white/5">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute -inset-1 animate-pulse rounded-full bg-emerald-500/30 blur-md" />
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500">
                <LayoutDashboard className="h-5 w-5 text-black" />
              </div>
            </div>
            <div>
              <h2 className="font-semibold text-white">Environmental</h2>
              <p className="text-xs text-slate-400">Intelligence System</p>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
            Navigation
          </div>
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = activeItem === item.id
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavClick(item.id)}
                    className={`group relative flex w-full items-center gap-3 rounded-xl px-4 py-4 text-left transition-all duration-300 ${isActive
                        ? "bg-gradient-to-r from-emerald-500/20 to-cyan-500/10 text-white"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                      }`}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 h-10 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-emerald-400 to-cyan-400" />
                    )}
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-300 ${isActive
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-white/5 text-slate-400 group-hover:bg-white/10 group-hover:text-white"
                        }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs text-slate-500">{item.description}</div>
                    </div>
                    <ChevronRight
                      className={`h-4 w-4 transition-all duration-300 ${isActive ? "text-emerald-400" : "opacity-0 group-hover:opacity-100"
                        }`}
                    />
                  </button>
                </li>
              )
            })}
          </ul>

          {/* Theme Selector */}
          <div className="mt-10">
            <div className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
              Theme
            </div>
            <div className="flex gap-2 rounded-xl bg-white/5 p-2">
              {themes.map((t) => {
                const Icon = t.icon
                const isActive = theme === t.id
                return (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-3 text-xs font-medium transition-all duration-300 ${isActive
                        ? "bg-gradient-to-r from-emerald-500/30 to-cyan-500/20 text-white shadow-lg"
                        : "text-slate-400 hover:text-white"
                      }`}
                  >
                    <Icon className="h-4 w-4" />
                    {t.label}
                  </button>
                )
              })}
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-white/10 p-4 dark:border-white/5">
          <div className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-emerald-500/10 to-cyan-500/5 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 text-sm font-bold text-black">
              EI
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-white">Environmental Intel</div>
              <div className="text-xs text-slate-400">v2.0.26</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}


"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

// Fix for default marker icon in Next.js
const icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
})

function MapController({ center }: { center: [number, number] }) {
    const map = useMap()
    useEffect(() => {
        map.flyTo(center, 13, {
            duration: 2
        })
    }, [center, map])
    return null
}

export function LeafletMapCard() {
    const [position, setPosition] = useState<[number, number]>([28.6139, 77.209]) // Default: New Delhi
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setPosition([pos.coords.latitude, pos.coords.longitude])
                    setLoading(false)
                },
                () => {
                    setLoading(false) // Keep default if error
                }
            )
        } else {
            setLoading(false)
        }
    }, [])

    return (
        <div className="card-vibrant relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-slate-950/60 via-slate-900/50 to-slate-950/70 p-0">
            <div className="absolute left-6 top-6 z-[1000] rounded-xl border border-emerald-500/20 bg-slate-900/80 p-4 backdrop-blur-md">
                <h2 className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-sm font-semibold uppercase tracking-[0.2em] text-transparent">
                    Live Location
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                    Showing real-time environmental data for your area
                </p>
            </div>

            <MapContainer
                center={position}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
                zoomControl={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />
                <Marker position={position} icon={icon}>
                    <Popup>
                        <div className="text-slate-900 font-sans text-xs font-semibold">
                            Current Location<br />
                            Monitoring Active
                        </div>
                    </Popup>
                </Marker>
                <MapController center={position} />
            </MapContainer>

            {/* Overlay Gradients */}
            <div className="pointer-events-none absolute inset-0 z-[500] bg-gradient-to-t from-[#050511] via-transparent to-transparent opacity-60" />
            <div className="pointer-events-none absolute inset-0 z-[500] ring-1 ring-inset ring-white/10 rounded-2xl" />
        </div>
    )
}

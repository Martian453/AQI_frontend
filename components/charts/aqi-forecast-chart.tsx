"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Area } from "recharts"

const data = [
    { time: "Now", actual: 145, predicted: 145 },
    { time: "+1h", actual: null, predicted: 152 },
    { time: "+2h", actual: null, predicted: 158 },
    { time: "+3h", actual: null, predicted: 165 },
    { time: "+4h", actual: null, predicted: 160 },
    { time: "+5h", actual: null, predicted: 155 },
    { time: "+6h", actual: null, predicted: 148 },
]

export function AQIForecastChart() {
    return (
        <div className="h-full w-full flex flex-col p-4 bg-slate-900/40 rounded-xl border border-emerald-500/10 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
                        Predictive Intelligence
                    </h3>
                    <p className="text-[10px] text-slate-400">6-Hour AQI Forecast</p>
                </div>
                <div className="flex items-center gap-2 text-[10px]">
                    <div className="flex items-center gap-1">
                        <div className="h-0.5 w-3 bg-cyan-400" />
                        <span className="text-slate-300">Actual</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="h-0.5 w-3 border-t border-dashed border-white/60" />
                        <span className="text-slate-300">Predicted</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 w-full min-h-[140px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <XAxis
                            dataKey="time"
                            stroke="#64748b"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#64748b"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            domain={['auto', 'auto']}
                            hide={true}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "rgba(10, 15, 40, 0.95)",
                                border: "1px solid rgba(124, 255, 154, 0.3)",
                                borderRadius: "8px",
                                fontSize: "12px",
                            }}
                            labelStyle={{ color: "#9aa7d9" }}
                        />
                        {/* Actual Data Line */}
                        <Line
                            type="monotone"
                            dataKey="actual"
                            stroke="#22d3ee"
                            strokeWidth={3}
                            dot={{ r: 4, fill: "#22d3ee", strokeWidth: 0 }}
                            isAnimationActive={true}
                            connectNulls
                        />
                        {/* Predicted Data Line */}
                        <Line
                            type="monotone"
                            dataKey="predicted"
                            stroke="#ffffff"
                            strokeWidth={2}
                            strokeDasharray="4 4"
                            dot={{ r: 3, fill: "#fff", strokeWidth: 0 }}
                            isAnimationActive={true}
                            opacity={0.7}
                            connectNulls
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import type { LanguageStats } from "@/types/github"

interface LanguagesChartProps {
  languages: LanguageStats
  showDetails?: boolean
}

const LANGUAGE_COLORS: { [key: string]: string } = {
  JavaScript: "#f1e05a",
  TypeScript: "#2b7489",
  Python: "#3572A5",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#239120",
  PHP: "#4F5D95",
  Ruby: "#701516",
  Go: "#00ADD8",
  Rust: "#dea584",
  Swift: "#ffac45",
  Kotlin: "#F18E33",
  Dart: "#00B4AB",
  HTML: "#e34c26",
  CSS: "#1572B6",
  Shell: "#89e051",
  Vue: "#2c3e50",
  React: "#61dafb",
}

export default function LanguagesChart({ languages, showDetails = false }: LanguagesChartProps) {
  const totalBytes = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0)

  const languageData = Object.entries(languages)
    .map(([name, bytes]) => ({
      name,
      bytes,
      percentage: (bytes / totalBytes) * 100,
      color: LANGUAGE_COLORS[name] || `hsl(${Math.random() * 360}, 70%, 60%)`,
    }))
    .sort((a, b) => b.bytes - a.bytes)

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-surface border border-border rounded-lg p-3 shadow-lg">
          <p className="text-text-primary font-medium">{data.name}</p>
          <p className="text-accent">{formatBytes(data.bytes)}</p>
          <p className="text-text-muted">{data.percentage.toFixed(1)}%</p>
        </div>
      )
    }
    return null
  }

  if (Object.keys(languages).length === 0) {
    return (
      <div className="bg-surface rounded-lg border border-border p-6">
        <h3 className="text-xl font-semibold text-text-primary mb-4">Linguagens</h3>
        <p className="text-text-muted">Nenhuma linguagem detectada</p>
      </div>
    )
  }

  return (
    <div className="bg-surface rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-text-primary">
          {showDetails ? "Distribuição de Linguagens" : "Linguagens"}
        </h3>
        <div className="text-text-muted text-sm">
          {Object.keys(languages).length} linguagens • {formatBytes(totalBytes)}
        </div>
      </div>

      {showDetails ? (
        <div className="space-y-6">
          {/* Gráfico de barras detalhado */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={languageData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="name"
                  stroke="var(--text-muted)"
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickFormatter={(value) => `${value.toFixed(0)}%`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="percentage" radius={[4, 4, 0, 0]} fill={(entry: any) => entry.color} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Lista detalhada */}
          <div className="space-y-3">
            {languageData.map((lang, index) => (
              <div key={lang.name} className="flex items-center gap-4 p-3 bg-base rounded border border-border">
                <div className="text-text-muted text-sm w-8">#{index + 1}</div>
                <div className="w-4 h-4 rounded" style={{ backgroundColor: lang.color }} />
                <div className="flex-1">
                  <p className="text-text-primary font-medium">{lang.name}</p>
                  <p className="text-text-muted text-sm">
                    {formatBytes(lang.bytes)} ({lang.percentage.toFixed(1)}%)
                  </p>
                </div>
                <div className="w-24 bg-base rounded-full h-2">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${lang.percentage}%`,
                      backgroundColor: lang.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Gráfico de pizza */}
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={languageData}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  dataKey="percentage"
                  label={({ name, percentage }) => (percentage > 5 ? `${name}` : "")}
                  labelLine={false}
                  fontSize={11}
                >
                  {languageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Lista resumida */}
          <div className="space-y-2">
            {languageData.slice(0, 6).map((lang) => (
              <div key={lang.name} className="flex items-center gap-3 p-2">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: lang.color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-text-primary font-medium truncate">{lang.name}</p>
                  <p className="text-text-muted text-sm">{lang.percentage.toFixed(1)}%</p>
                </div>
              </div>
            ))}
            {languageData.length > 6 && (
              <p className="text-text-muted text-sm text-center pt-2">+{languageData.length - 6} outras linguagens</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

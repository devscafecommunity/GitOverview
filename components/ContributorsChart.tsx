"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import type { GitHubContributor } from "@/types/github"

interface ContributorsChartProps {
  contributors: GitHubContributor[]
  showAll?: boolean
}

export default function ContributorsChart({ contributors, showAll = false }: ContributorsChartProps) {
  const displayContributors = showAll ? contributors : contributors.slice(0, 8)

  // Dados para o gráfico de pizza
  const pieData = displayContributors.map((contributor, index) => ({
    name: contributor.login,
    value: contributor.contributions,
    color: `hsl(${(index * 45) % 360}, 70%, 60%)`,
  }))

  // Dados para o gráfico de barras
  const barData = displayContributors.map((contributor) => ({
    name: contributor.login.length > 10 ? contributor.login.substring(0, 10) + "..." : contributor.login,
    contributions: contributor.contributions,
    fullName: contributor.login,
  }))

  const totalContributions = contributors.reduce((sum, c) => sum + c.contributions, 0)

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface border border-border rounded-lg p-3 shadow-lg">
          <p className="text-text-primary font-medium">{payload[0].payload.fullName || label}</p>
          <p className="text-accent">
            {payload[0].value} contribuições ({((payload[0].value / totalContributions) * 100).toFixed(1)}%)
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-surface rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-text-primary">
          {showAll ? "Todos os Colaboradores" : "Top Colaboradores"}
        </h3>
        <div className="text-text-muted text-sm">
          {contributors.length} colaboradores • {totalContributions.toLocaleString()} contribuições
        </div>
      </div>

      {showAll ? (
        // Lista completa de colaboradores
        <div className="space-y-4">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="name"
                  stroke="var(--text-muted)"
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis stroke="var(--text-muted)" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="contributions" fill="var(--accent)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid gap-3 max-h-96 overflow-y-auto">
            {contributors.map((contributor, index) => (
              <div key={contributor.id} className="flex items-center gap-4 p-3 bg-base rounded border border-border">
                <div className="text-text-muted text-sm w-8">#{index + 1}</div>
                <img
                  src={contributor.avatar_url || "/placeholder.svg"}
                  alt={contributor.login}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <p className="text-text-primary font-medium">{contributor.login}</p>
                  <p className="text-text-muted text-sm">
                    {contributor.contributions} contribuições (
                    {((contributor.contributions / totalContributions) * 100).toFixed(1)}%)
                  </p>
                </div>
                <div className="w-20 bg-base rounded-full h-2">
                  <div
                    className="bg-accent h-2 rounded-full"
                    style={{ width: `${(contributor.contributions / contributors[0].contributions) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Visão resumida com gráfico de pizza
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                  fontSize={12}
                  fill="var(--accent)"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3">
            {displayContributors.map((contributor, index) => (
              <div key={contributor.id} className="flex items-center gap-3 p-2">
                <img
                  src={contributor.avatar_url || "/placeholder.svg"}
                  alt={contributor.login}
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-text-primary font-medium truncate">{contributor.login}</p>
                  <p className="text-text-muted text-sm">{contributor.contributions} contribuições</p>
                </div>
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: pieData[index]?.color }} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

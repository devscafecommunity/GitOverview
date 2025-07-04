"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  Area,
  AreaChart,
} from "recharts"

interface CommitActivity {
  date: string
  commits: number
  additions: number
  deletions: number
  authors: string[]
  authorCount: number
  netChanges: number
}

interface CommitGraphProps {
  commits: CommitActivity[]
  showDetails?: boolean
}

export default function CommitGraph({ commits, showDetails = false }: CommitGraphProps) {
  // Pegar os últimos 30 dias de atividade
  const recentCommits = commits.slice(-30)

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-surface border border-border rounded-lg p-3 shadow-lg">
          <p className="text-text-primary font-medium">{new Date(label).toLocaleDateString("pt-BR")}</p>
          <p className="text-accent">{data.commits} commits</p>
          <p className="text-success">+{data.additions} adições</p>
          <p className="text-danger">-{data.deletions} remoções</p>
          <p className="text-text-muted">{data.authorCount} autor(es)</p>
        </div>
      )
    }
    return null
  }

  const totalCommits = commits.reduce((sum, day) => sum + day.commits, 0)
  const totalAdditions = commits.reduce((sum, day) => sum + day.additions, 0)
  const totalDeletions = commits.reduce((sum, day) => sum + day.deletions, 0)
  const uniqueAuthors = new Set(commits.flatMap((day) => day.authors)).size

  return (
    <div className="bg-surface rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-text-primary">
          {showDetails ? "Análise Detalhada de Commits" : "Atividade de Commits"}
        </h3>
        <div className="text-text-muted text-sm">Últimos {recentCommits.length} dias</div>
      </div>

      {/* Estatísticas resumidas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-base rounded-lg p-4 border border-border">
          <div className="text-2xl font-bold text-accent">{totalCommits}</div>
          <div className="text-text-muted text-sm">Total de Commits</div>
        </div>
        <div className="bg-base rounded-lg p-4 border border-border">
          <div className="text-2xl font-bold text-success">+{totalAdditions.toLocaleString()}</div>
          <div className="text-text-muted text-sm">Linhas Adicionadas</div>
        </div>
        <div className="bg-base rounded-lg p-4 border border-border">
          <div className="text-2xl font-bold text-danger">-{totalDeletions.toLocaleString()}</div>
          <div className="text-text-muted text-sm">Linhas Removidas</div>
        </div>
        <div className="bg-base rounded-lg p-4 border border-border">
          <div className="text-2xl font-bold text-warning">{uniqueAuthors}</div>
          <div className="text-text-muted text-sm">Contribuidores</div>
        </div>
      </div>

      {showDetails ? (
        <div className="space-y-6">
          {/* Gráfico de commits por dia */}
          <div className="h-64">
            <h4 className="text-lg font-medium text-text-primary mb-3">Commits por Dia</h4>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={recentCommits}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="date"
                  stroke="var(--text-muted)"
                  fontSize={12}
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString("pt-BR", { month: "short", day: "numeric" })
                  }
                />
                <YAxis stroke="var(--text-muted)" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="commits" fill="var(--accent)" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico de mudanças de código */}
          <div className="h-64">
            <h4 className="text-lg font-medium text-text-primary mb-3">Mudanças de Código</h4>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={recentCommits}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="date"
                  stroke="var(--text-muted)"
                  fontSize={12}
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString("pt-BR", { month: "short", day: "numeric" })
                  }
                />
                <YAxis stroke="var(--text-muted)" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="additions"
                  stackId="1"
                  stroke="var(--success)"
                  fill="var(--success)"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="deletions"
                  stackId="2"
                  stroke="var(--danger)"
                  fill="var(--danger)"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={recentCommits}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="date"
                stroke="var(--text-muted)"
                fontSize={12}
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("pt-BR", { month: "short", day: "numeric" })
                }
              />
              <YAxis stroke="var(--text-muted)" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="commits"
                stroke="var(--accent)"
                strokeWidth={2}
                dot={{ fill: "var(--accent)", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "var(--accent)", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

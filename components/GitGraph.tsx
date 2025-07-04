"use client"

import { useState, useRef } from "react"
import { GitMerge, AlertTriangle, Info, CheckCircle, XCircle, RotateCcw, Copy, Eye, GitCommit } from "lucide-react"
import type { GitGraphNode, GitBranch as GitBranchType, GitAlert, GitRecommendation } from "@/types/git-graph"
import type { JSX } from "react"

interface GitGraphProps {
  nodes: GitGraphNode[]
  branches: GitBranchType[]
  alerts: GitAlert[]
  recommendations: GitRecommendation[]
  onCommandGenerated: (command: string) => void
}

export default function GitGraph({ nodes, branches, alerts, recommendations, onCommandGenerated }: GitGraphProps) {
  const [selectedNode, setSelectedNode] = useState<GitGraphNode | null>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [showAlerts, setShowAlerts] = useState(true)
  const [showRecommendations, setShowRecommendations] = useState(true)
  const svgRef = useRef<SVGSVGElement>(null)

  const COMMIT_RADIUS = 6
  const BRANCH_SPACING = 40
  const COMMIT_SPACING = 60
  const GRAPH_PADDING = 20

  const graphWidth = Math.max(branches.length * BRANCH_SPACING + GRAPH_PADDING * 2, 400)
  const graphHeight = nodes.length * COMMIT_SPACING + GRAPH_PADDING * 2

  // Gerar linhas de conexão entre commits
  const generateConnections = () => {
    const connections: JSX.Element[] = []

    nodes.forEach((node, index) => {
      node.parents.forEach((parentSha) => {
        const parentNode = nodes.find((n) => n.sha === parentSha)
        if (parentNode) {
          const startX = GRAPH_PADDING + node.x * BRANCH_SPACING
          const startY = GRAPH_PADDING + node.y * COMMIT_SPACING
          const endX = GRAPH_PADDING + parentNode.x * BRANCH_SPACING
          const endY = GRAPH_PADDING + parentNode.y * COMMIT_SPACING

          // Linha curva para merges
          if (node.isMerge && node.x !== parentNode.x) {
            const midX = (startX + endX) / 2
            connections.push(
              <path
                key={`${node.sha}-${parentSha}`}
                d={`M ${startX} ${startY} Q ${midX} ${startY} ${endX} ${endY}`}
                stroke={node.color}
                strokeWidth="2"
                fill="none"
                opacity={0.7}
              />,
            )
          } else {
            // Linha reta para commits normais
            connections.push(
              <line
                key={`${node.sha}-${parentSha}`}
                x1={startX}
                y1={startY}
                x2={endX}
                y2={endY}
                stroke={node.color}
                strokeWidth="2"
                opacity={0.7}
              />,
            )
          }
        }
      })
    })

    return connections
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getAlertIcon = (type: GitAlert["type"]) => {
    switch (type) {
      case "conflict":
        return <AlertTriangle className="w-4 h-4 text-danger" />
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-warning" />
      case "info":
        return <Info className="w-4 h-4 text-accent" />
      case "danger":
        return <XCircle className="w-4 h-4 text-danger" />
      default:
        return <Info className="w-4 h-4 text-text-muted" />
    }
  }

  const getPriorityColor = (priority: GitRecommendation["priority"]) => {
    switch (priority) {
      case "high":
        return "text-danger"
      case "medium":
        return "text-warning"
      case "low":
        return "text-accent"
      default:
        return "text-text-muted"
    }
  }

  return (
    <div className="bg-surface rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-text-primary">Histórico Git</h3>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowAlerts(!showAlerts)}
            className={`flex items-center gap-2 px-3 py-1 rounded text-sm transition-colors ${
              showAlerts ? "bg-warning text-black" : "bg-base text-text-muted"
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            Alertas ({alerts.length})
          </button>
          <button
            onClick={() => setShowRecommendations(!showRecommendations)}
            className={`flex items-center gap-2 px-3 py-1 rounded text-sm transition-colors ${
              showRecommendations ? "bg-accent text-black" : "bg-base text-text-muted"
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            Recomendações ({recommendations.length})
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Gráfico Git */}
        <div className="lg:col-span-2">
          <div className="bg-base rounded-lg border border-border p-4 overflow-auto">
            {/* Legenda de branches */}
            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-border">
              {branches.map((branch) => (
                <div key={branch.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: branch.color }} />
                  <span className="text-text-primary text-sm font-medium">{branch.name}</span>
                  {branch.isActive && <span className="text-xs bg-accent text-black px-2 py-0.5 rounded">ATIVA</span>}
                </div>
              ))}
            </div>

            {/* SVG do gráfico */}
            <svg ref={svgRef} width={graphWidth} height={graphHeight} className="overflow-visible">
              {/* Linhas de conexão */}
              {generateConnections()}

              {/* Commits */}
              {nodes.map((node) => {
                const x = GRAPH_PADDING + node.x * BRANCH_SPACING
                const y = GRAPH_PADDING + node.y * COMMIT_SPACING
                const isSelected = selectedNode?.sha === node.sha
                const isHovered = hoveredNode === node.sha

                return (
                  <g key={node.sha}>
                    {/* Círculo do commit */}
                    <circle
                      cx={x}
                      cy={y}
                      r={COMMIT_RADIUS}
                      fill={node.color}
                      stroke={isSelected ? "#fff" : node.color}
                      strokeWidth={isSelected ? 3 : 2}
                      className="cursor-pointer transition-all"
                      style={{
                        filter: isHovered ? "brightness(1.2)" : "none",
                        transform: isSelected ? "scale(1.2)" : "scale(1)",
                      }}
                      onClick={() => setSelectedNode(node)}
                      onMouseEnter={() => setHoveredNode(node.sha)}
                      onMouseLeave={() => setHoveredNode(null)}
                    />

                    {/* Ícone para merge commits */}
                    {node.isMerge && (
                      <GitMerge
                        x={x - 6}
                        y={y - 6}
                        width="12"
                        height="12"
                        className="fill-current text-white pointer-events-none"
                      />
                    )}

                    {/* Ícone de conflito */}
                    {node.isConflict && (
                      <AlertTriangle
                        x={x + 8}
                        y={y - 8}
                        width="12"
                        height="12"
                        className="fill-current text-danger pointer-events-none"
                      />
                    )}

                    {/* Tags */}
                    {node.tags.map((tag, tagIndex) => (
                      <rect
                        key={`${node.sha}-${tag}`}
                        x={x + 12}
                        y={y - 6 + tagIndex * 14}
                        width={tag.length * 6 + 8}
                        height="12"
                        rx="6"
                        fill="var(--accent)"
                        className="pointer-events-none"
                      />
                    ))}
                    {node.tags.map((tag, tagIndex) => (
                      <text
                        key={`${node.sha}-${tag}-text`}
                        x={x + 16}
                        y={y + 2 + tagIndex * 14}
                        fontSize="8"
                        fill="black"
                        className="pointer-events-none font-medium"
                      >
                        {tag}
                      </text>
                    ))}
                  </g>
                )
              })}
            </svg>
          </div>

          {/* Detalhes do commit selecionado */}
          {selectedNode && (
            <div className="mt-4 bg-base rounded-lg border border-border p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedNode.author.avatar_url || "/placeholder.svg?height=32&width=32"}
                    alt={selectedNode.author.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <p className="text-text-primary font-medium">{selectedNode.author.name}</p>
                    <p className="text-text-muted text-sm">{formatDate(selectedNode.author.date)}</p>
                  </div>
                </div>
                <code className="text-accent text-sm bg-surface px-2 py-1 rounded">
                  {selectedNode.sha.substring(0, 7)}
                </code>
              </div>

              <p className="text-text-primary mb-3">{selectedNode.message}</p>

              {selectedNode.stats && (
                <div className="flex items-center gap-4 text-sm mb-3">
                  <span className="text-success">+{selectedNode.stats.additions}</span>
                  <span className="text-danger">-{selectedNode.stats.deletions}</span>
                  <span className="text-text-muted">{selectedNode.stats.total} mudanças</span>
                </div>
              )}

              {/* Ações do commit */}
              <div className="flex items-center gap-2 pt-3 border-t border-border">
                <button
                  onClick={() => onCommandGenerated(`git show ${selectedNode.sha}`)}
                  className="flex items-center gap-2 px-3 py-1 bg-accent hover:bg-accent-alt text-black text-sm rounded transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  Ver Mudanças
                </button>
                <button
                  onClick={() => onCommandGenerated(`git revert ${selectedNode.sha}`)}
                  className="flex items-center gap-2 px-3 py-1 bg-danger hover:bg-red-600 text-white text-sm rounded transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reverter
                </button>
                <button
                  onClick={() => onCommandGenerated(`git cherry-pick ${selectedNode.sha}`)}
                  className="flex items-center gap-2 px-3 py-1 bg-success hover:bg-green-600 text-white text-sm rounded transition-colors"
                >
                  <GitCommit className="w-4 h-4" />
                  Cherry-pick
                </button>
              </div>

              {/* Conflitos */}
              {selectedNode.isConflict && selectedNode.conflictFiles && (
                <div className="mt-3 p-3 bg-danger/10 border border-danger/20 rounded">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-danger" />
                    <span className="text-danger font-medium">Conflito Detectado</span>
                  </div>
                  <p className="text-text-muted text-sm mb-2">Arquivos com conflito:</p>
                  <ul className="text-sm text-text-muted">
                    {selectedNode.conflictFiles.map((file) => (
                      <li key={file} className="font-mono">
                        • {file}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => onCommandGenerated(`git checkout --ours ${selectedNode.conflictFiles?.join(" ")}`)}
                    className="mt-2 flex items-center gap-2 px-3 py-1 bg-warning hover:bg-yellow-500 text-black text-sm rounded transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Resolver Conflito
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Painel lateral */}
        <div className="space-y-6">
          {/* Alertas */}
          {showAlerts && alerts.length > 0 && (
            <div className="bg-base rounded-lg border border-border p-4">
              <h4 className="text-lg font-medium text-text-primary mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-warning" />
                Alertas
              </h4>
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div key={alert.id} className="p-3 bg-surface rounded border border-border">
                    <div className="flex items-start gap-3">
                      {getAlertIcon(alert.type)}
                      <div className="flex-1">
                        <p className="text-text-primary font-medium text-sm">{alert.title}</p>
                        <p className="text-text-muted text-xs mt-1">{alert.description}</p>
                        {alert.files && (
                          <div className="mt-2">
                            <p className="text-text-muted text-xs">Arquivos:</p>
                            <ul className="text-xs text-text-muted font-mono">
                              {alert.files.map((file) => (
                                <li key={file}>• {file}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {alert.action && (
                          <button
                            onClick={() => onCommandGenerated(alert.action!.command)}
                            className="mt-2 flex items-center gap-1 px-2 py-1 bg-accent hover:bg-accent-alt text-black text-xs rounded transition-colors"
                          >
                            <Copy className="w-3 h-3" />
                            {alert.action.label}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recomendações */}
          {showRecommendations && recommendations.length > 0 && (
            <div className="bg-base rounded-lg border border-border p-4">
              <h4 className="text-lg font-medium text-text-primary mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-accent" />
                Recomendações
              </h4>
              <div className="space-y-3">
                {recommendations.map((rec) => (
                  <div key={rec.id} className="p-3 bg-surface rounded border border-border">
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${getPriorityColor(rec.priority)}`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-text-primary font-medium text-sm">{rec.title}</p>
                          <span className={`text-xs px-2 py-0.5 rounded ${getPriorityColor(rec.priority)}`}>
                            {rec.priority.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-text-muted text-xs mb-2">{rec.description}</p>
                        <div className="space-y-1">
                          {rec.commands.map((cmd, index) => (
                            <button
                              key={index}
                              onClick={() => onCommandGenerated(cmd.command)}
                              className="block w-full text-left p-2 bg-base hover:bg-surface-hover rounded text-xs transition-colors"
                              title={cmd.description}
                            >
                              <div className="flex items-center gap-2">
                                <Copy className="w-3 h-3 text-accent" />
                                <span className="text-text-primary font-medium">{cmd.label}</span>
                              </div>
                              <code className="text-accent text-xs block mt-1">{cmd.command}</code>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export interface GitGraphNode {
  sha: string
  message: string
  author: {
    name: string
    email: string
    date: string
    avatar_url?: string
  }
  parents: string[]
  branch: string
  tags: string[]
  isMerge: boolean
  isConflict: boolean
  conflictFiles?: string[]
  stats?: {
    additions: number
    deletions: number
    total: number
  }
  x: number // Posição horizontal no gráfico
  y: number // Posição vertical no gráfico
  color: string // Cor da branch
}

export interface GitBranch {
  name: string
  color: string
  isActive: boolean
  lastCommit: string
  ahead: number
  behind: number
}

export interface GitAlert {
  id: string
  type: "conflict" | "warning" | "info" | "danger"
  title: string
  description: string
  commit?: string
  files?: string[]
  action?: {
    label: string
    command: string
  }
}

export interface GitRecommendation {
  id: string
  type: "merge" | "rebase" | "cleanup" | "security"
  priority: "high" | "medium" | "low"
  title: string
  description: string
  commands: Array<{
    label: string
    command: string
    description: string
  }>
}

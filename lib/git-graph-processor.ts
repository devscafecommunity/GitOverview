import type { GitHubCommit } from "@/types/github"
import type { GitGraphNode, GitBranch, GitAlert, GitRecommendation } from "@/types/git-graph"

const BRANCH_COLORS = [
  "#4cc2ff", // accent
  "#4ade80", // success
  "#fbbf24", // warning
  "#ff6b81", // danger
  "#a78bfa", // purple
  "#fb7185", // pink
  "#34d399", // emerald
  "#60a5fa", // blue
  "#f472b6", // pink
  "#10b981", // green
]

export function processCommitsToGraph(commits: GitHubCommit[]): {
  nodes: GitGraphNode[]
  branches: GitBranch[]
  alerts: GitAlert[]
  recommendations: GitRecommendation[]
} {
  const nodes: GitGraphNode[] = []
  const branchMap = new Map<string, { color: string; x: number }>()
  const alerts: GitAlert[] = []
  const recommendations: GitRecommendation[] = []

  let colorIndex = 0
  let maxX = 0

  // Processar commits em ordem cronológica reversa
  commits.reverse().forEach((commit, index) => {
    const parents = commit.parents?.map((p) => p.sha) || []
    const isMerge = parents.length > 1

    // Detectar branch (simplificado - em produção usaria refs da API)
    const branchName = isMerge ? "main" : detectBranchFromMessage(commit.commit.message)

    // Atribuir cor e posição X para a branch
    if (!branchMap.has(branchName)) {
      branchMap.set(branchName, {
        color: BRANCH_COLORS[colorIndex % BRANCH_COLORS.length],
        x: maxX++,
      })
      colorIndex++
    }

    const branchInfo = branchMap.get(branchName)!

    // Detectar conflitos potenciais
    const isConflict = detectPotentialConflict(commit, commits, index)
    const conflictFiles = isConflict ? extractConflictFiles(commit) : undefined

    const node: GitGraphNode = {
      sha: commit.sha,
      message: commit.commit.message,
      author: {
        name: commit.commit.author.name,
        email: commit.commit.author.email,
        date: commit.commit.author.date,
        avatar_url: commit.author?.avatar_url,
      },
      parents,
      branch: branchName,
      tags: extractTags(commit.commit.message),
      isMerge,
      isConflict,
      conflictFiles,
      stats: commit.stats,
      x: branchInfo.x,
      y: index,
      color: branchInfo.color,
    }

    nodes.push(node)

    // Gerar alertas para conflitos
    if (isConflict) {
      alerts.push({
        id: `conflict-${commit.sha}`,
        type: "conflict",
        title: "Conflito Detectado",
        description: `Possível conflito no commit "${commit.commit.message.split("\n")[0]}"`,
        commit: commit.sha,
        files: conflictFiles,
        action: {
          label: "Resolver Conflito",
          command: `git checkout ${commit.sha} && git merge --abort`,
        },
      })
    }

    // Detectar outros alertas
    if (commit.commit.message.toLowerCase().includes("fix") && commit.stats && commit.stats.total > 100) {
      alerts.push({
        id: `large-fix-${commit.sha}`,
        type: "warning",
        title: "Grande Correção",
        description: `Commit de correção com ${commit.stats.total} mudanças - considere revisar`,
        commit: commit.sha,
        action: {
          label: "Revisar Commit",
          command: `git show ${commit.sha}`,
        },
      })
    }
  })

  // Gerar branches
  const branches: GitBranch[] = Array.from(branchMap.entries()).map(([name, info]) => ({
    name,
    color: info.color,
    isActive: name === "main",
    lastCommit: nodes.find((n) => n.branch === name)?.sha || "",
    ahead: 0,
    behind: 0,
  }))

  // Gerar recomendações
  recommendations.push(...generateRecommendations(nodes, branches))

  return { nodes, branches, alerts, recommendations }
}

function detectBranchFromMessage(message: string): string {
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes("feature") || lowerMessage.includes("feat")) return "feature"
  if (lowerMessage.includes("fix") || lowerMessage.includes("hotfix")) return "hotfix"
  if (lowerMessage.includes("develop") || lowerMessage.includes("dev")) return "develop"
  if (lowerMessage.includes("release")) return "release"

  return "main"
}

function detectPotentialConflict(commit: GitHubCommit, allCommits: GitHubCommit[], index: number): boolean {
  // Lógica simplificada para detectar conflitos
  const message = commit.commit.message.toLowerCase()

  // Commits de merge são potenciais conflitos
  if (commit.parents && commit.parents.length > 1) return true

  // Commits com palavras-chave de conflito
  if (message.includes("conflict") || message.includes("merge") || message.includes("resolve")) return true

  // Commits que modificam muitos arquivos
  if (commit.stats && commit.stats.total > 200) return true

  return false
}

function extractConflictFiles(commit: GitHubCommit): string[] {
  // Em uma implementação real, você buscaria os arquivos modificados
  // Por agora, retornamos arquivos comuns que geram conflitos
  const commonConflictFiles = [
    "package.json",
    "package-lock.json",
    "yarn.lock",
    "README.md",
    "src/index.js",
    "src/App.js",
  ]

  return commonConflictFiles.slice(0, Math.floor(Math.random() * 3) + 1)
}

function extractTags(message: string): string[] {
  const tags: string[] = []
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes("breaking")) tags.push("BREAKING")
  if (lowerMessage.includes("feat")) tags.push("FEATURE")
  if (lowerMessage.includes("fix")) tags.push("FIX")
  if (lowerMessage.includes("docs")) tags.push("DOCS")
  if (lowerMessage.includes("test")) tags.push("TEST")

  return tags
}

function generateRecommendations(nodes: GitGraphNode[], branches: GitBranch[]): GitRecommendation[] {
  const recommendations: GitRecommendation[] = []

  // Recomendação para merge de branches
  const featureBranches = branches.filter((b) => b.name.includes("feature"))
  if (featureBranches.length > 0) {
    recommendations.push({
      id: "merge-features",
      type: "merge",
      priority: "medium",
      title: "Merge de Features Pendentes",
      description: `Você tem ${featureBranches.length} branch(es) de feature que podem ser mescladas`,
      commands: [
        {
          label: "Merge Feature Branch",
          command: `git checkout main && git merge ${featureBranches[0].name}`,
          description: "Mesclar branch de feature na main",
        },
        {
          label: "Rebase Feature Branch",
          command: `git checkout ${featureBranches[0].name} && git rebase main`,
          description: "Rebase da feature branch com a main",
        },
      ],
    })
  }

  // Recomendação para limpeza
  const oldCommits = nodes.filter((n) => {
    const commitDate = new Date(n.author.date)
    const monthsAgo = new Date()
    monthsAgo.setMonth(monthsAgo.getMonth() - 6)
    return commitDate < monthsAgo
  })

  if (oldCommits.length > 50) {
    recommendations.push({
      id: "cleanup-history",
      type: "cleanup",
      priority: "low",
      title: "Limpeza do Histórico",
      description: "Considere fazer squash de commits antigos para manter o histórico limpo",
      commands: [
        {
          label: "Interactive Rebase",
          command: "git rebase -i HEAD~20",
          description: "Rebase interativo dos últimos 20 commits",
        },
        {
          label: "Squash Commits",
          command: "git reset --soft HEAD~5 && git commit",
          description: "Combinar últimos 5 commits em um",
        },
      ],
    })
  }

  // Recomendação de segurança
  const hasLargeFiles = nodes.some((n) => n.stats && n.stats.total > 1000)
  if (hasLargeFiles) {
    recommendations.push({
      id: "security-review",
      type: "security",
      priority: "high",
      title: "Revisão de Segurança",
      description: "Commits com muitas mudanças detectados - revisar por questões de segurança",
      commands: [
        {
          label: "Audit Changes",
          command: 'git log --stat --since="1 week ago"',
          description: "Auditar mudanças da última semana",
        },
        {
          label: "Check Sensitive Files",
          command: 'git log --follow -- "*.env" "*.key" "*.pem"',
          description: "Verificar histórico de arquivos sensíveis",
        },
      ],
    })
  }

  return recommendations
}

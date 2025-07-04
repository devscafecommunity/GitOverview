"use client"

import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import RepoHeader from "@/components/RepoHeader"
import CommitGraph from "@/components/CommitGraph"
import ContributorsChart from "@/components/ContributorsChart"
import LanguagesChart from "@/components/LanguagesChart"
import GitActions from "@/components/GitActions"
import CommandBox from "@/components/CommandBox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getRepository, getCommits, getContributors, getLanguages, processCommitsForChart } from "@/lib/github-api"
import type { GitHubRepository, GitHubCommit, GitHubContributor, LanguageStats } from "@/types/github"

// Adicionar import do processador de gráfico Git
import { processCommitsToGraph } from "@/lib/git-graph-processor"
import GitGraph from "@/components/GitGraph"

export default function RepoPage() {
  const params = useParams()
  const [repoData, setRepoData] = useState<GitHubRepository | null>(null)
  const [commits, setCommits] = useState<GitHubCommit[]>([])
  const [contributors, setContributors] = useState<GitHubContributor[]>([])
  const [languages, setLanguages] = useState<LanguageStats>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [generatedCommand, setGeneratedCommand] = useState("")

  // No useEffect onde buscamos os dados, adicionar processamento do gráfico:
  const [gitGraphData, setGitGraphData] = useState<{
    nodes: any[]
    branches: any[]
    alerts: any[]
    recommendations: any[]
  } | null>(null)

  useEffect(() => {
    const fetchRepoData = async () => {
      try {
        setLoading(true)
        setError(null)

        const owner = params.owner as string
        const repo = params.repo as string

        // Buscar dados em paralelo
        const [repoInfo, commitsData, contributorsData, languagesData] = await Promise.all([
          getRepository(owner, repo),
          getCommits(owner, repo, 1, 100),
          getContributors(owner, repo),
          getLanguages(owner, repo),
        ])

        setRepoData(repoInfo)
        setCommits(commitsData)
        setContributors(contributorsData)
        setLanguages(languagesData)

        // Dentro do fetchRepoData, após buscar os commits:
        const graphData = processCommitsToGraph(commitsData)
        setGitGraphData(graphData)
      } catch (err) {
        console.error("Error fetching repo data:", err)
        setError(err instanceof Error ? err.message : "Erro ao carregar repositório")
      } finally {
        setLoading(false)
      }
    }

    fetchRepoData()
  }, [params.owner, params.repo])

  if (loading) {
    return (
      <div className="min-h-screen bg-base flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-text-muted">Carregando repositório...</p>
        </div>
      </div>
    )
  }

  if (error || !repoData) {
    return (
      <div className="min-h-screen bg-base flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-danger text-lg">Erro ao carregar repositório</p>
          <p className="text-text-muted">{error || "Verifique se a URL está correta"}</p>
        </div>
      </div>
    )
  }

  const processedCommits = processCommitsForChart(commits)

  return (
    <div className="min-h-screen bg-base">
      <RepoHeader repoData={repoData} />

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-surface border border-border">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="commits">Commits</TabsTrigger>
            <TabsTrigger value="contributors">Colaboradores</TabsTrigger>
            <TabsTrigger value="languages">Linguagens</TabsTrigger>
            <TabsTrigger value="actions">Ações Git</TabsTrigger>
            {/* Adicionar nova tab no TabsList: */}
            <TabsTrigger value="git-graph">Histórico Git</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <CommitGraph commits={processedCommits} />
              <ContributorsChart contributors={contributors.slice(0, 10)} />
            </div>
            <LanguagesChart languages={languages} />
          </TabsContent>

          <TabsContent value="commits" className="space-y-6">
            <CommitGraph commits={processedCommits} showDetails />
            <div className="bg-surface rounded-lg border border-border p-6">
              <h3 className="text-xl font-semibold text-text-primary mb-4">Commits Recentes</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {commits.slice(0, 20).map((commit) => (
                  <div key={commit.sha} className="flex items-start gap-4 p-3 bg-base rounded border border-border">
                    <img
                      src={commit.author?.avatar_url || "/placeholder.svg?height=32&width=32"}
                      alt={commit.commit.author.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-text-primary font-medium line-clamp-2">{commit.commit.message}</p>
                      <div className="flex items-center gap-4 mt-1 text-sm text-text-muted">
                        <span>{commit.commit.author.name}</span>
                        <span>{new Date(commit.commit.author.date).toLocaleDateString("pt-BR")}</span>
                        {commit.stats && (
                          <span className="text-success">
                            +{commit.stats.additions} -{commit.stats.deletions}
                          </span>
                        )}
                      </div>
                    </div>
                    <code className="text-accent text-xs bg-surface px-2 py-1 rounded">
                      {commit.sha.substring(0, 7)}
                    </code>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="contributors" className="space-y-6">
            <ContributorsChart contributors={contributors} showAll />
          </TabsContent>

          <TabsContent value="languages" className="space-y-6">
            <LanguagesChart languages={languages} showDetails />
          </TabsContent>

          <TabsContent value="actions" className="space-y-6">
            <GitActions onCommandGenerated={setGeneratedCommand} />
          </TabsContent>

          {/* Adicionar novo TabsContent: */}
          <TabsContent value="git-graph" className="space-y-6">
            {gitGraphData && (
              <GitGraph
                nodes={gitGraphData.nodes}
                branches={gitGraphData.branches}
                alerts={gitGraphData.alerts}
                recommendations={gitGraphData.recommendations}
                onCommandGenerated={setGeneratedCommand}
              />
            )}
          </TabsContent>
        </Tabs>

        {generatedCommand && <CommandBox command={generatedCommand} onClose={() => setGeneratedCommand("")} />}
      </div>
    </div>
  )
}

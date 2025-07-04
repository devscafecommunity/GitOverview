"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Github, ArrowRight, GitBranch, Users, Activity } from "lucide-react"

export default function Home() {
  const [repoUrl, setRepoUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!repoUrl.trim()) return

    setIsLoading(true)

    // Extract owner and repo from GitHub URL
    const match = repoUrl.match(/github\.com\/([^/]+)\/([^/?]+)/)
    if (match) {
      const [, owner, repo] = match
      const cleanRepo = repo.replace(/\.git$/, "")
      router.push(`/repo/${owner}/${cleanRepo}`)
    } else {
      alert("Por favor, insira uma URL válida do GitHub")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-base flex flex-col">
      {/* Header */}
      <header className="border-b border-border p-6">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <Github className="w-5 h-5 text-black" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary">GitOverview</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-text-primary">
              Gerencie seus repositórios
              <span className="text-accent"> visualmente</span>
            </h2>
            <p className="text-xl text-text-muted max-w-lg mx-auto">
              Analise commits, resolva conflitos e execute comandos Git com uma interface intuitiva
            </p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-surface p-6 rounded-lg border border-border">
              <Activity className="w-8 h-8 text-accent mb-3" />
              <h3 className="font-semibold text-text-primary mb-2">Análise Visual</h3>
              <p className="text-text-muted text-sm">Gráficos de commits, timeline e insights detalhados</p>
            </div>
            <div className="bg-surface p-6 rounded-lg border border-border">
              <GitBranch className="w-8 h-8 text-success mb-3" />
              <h3 className="font-semibold text-text-primary mb-2">Resolução de Conflitos</h3>
              <p className="text-text-muted text-sm">Interface visual para resolver conflitos de merge</p>
            </div>
            <div className="bg-surface p-6 rounded-lg border border-border">
              <Users className="w-8 h-8 text-warning mb-3" />
              <h3 className="font-semibold text-text-primary mb-2">Colaboradores</h3>
              <p className="text-text-muted text-sm">Visualize contribuições e estatísticas da equipe</p>
            </div>
          </div>

          {/* URL Input Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="url"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/usuario/repositorio"
                className="w-full px-4 py-4 bg-surface border border-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-accent transition-colors"
                disabled={isLoading}
              />
              <Github className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
            </div>

            <button
              type="submit"
              disabled={isLoading || !repoUrl.trim()}
              className="w-full bg-accent hover:bg-accent-alt disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Analisando...
                </>
              ) : (
                <>
                  Analisar Repositório
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Example */}
          <div className="text-center">
            <p className="text-text-muted text-sm mb-2">Exemplo:</p>
            <button
              onClick={() => setRepoUrl("https://github.com/vercel/next.js")}
              className="text-accent hover:text-accent-alt text-sm underline transition-colors"
            >
              https://github.com/vercel/next.js
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

import { Star, GitFork, ExternalLink, Eye, AlertCircle } from "lucide-react"
import Link from "next/link"
import type { GitHubRepository } from "@/types/github"

interface RepoHeaderProps {
  repoData: GitHubRepository
}

export default function RepoHeader({ repoData }: RepoHeaderProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatSize = (sizeInKB: number) => {
    if (sizeInKB < 1024) return `${sizeInKB} KB`
    return `${(sizeInKB / 1024).toFixed(1)} MB`
  }

  return (
    <header className="bg-surface border-b border-border">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-4">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-text-muted">
              <Link href="/" className="hover:text-accent transition-colors">
                GitOverview
              </Link>
              <span>/</span>
              <span className="text-text-primary">{repoData.full_name}</span>
            </div>

            {/* Repo Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={repoData.owner.avatar_url || "/placeholder.svg"}
                  alt={repoData.owner.login}
                  className="w-8 h-8 rounded-full"
                />
                <h1 className="text-2xl font-bold text-text-primary">{repoData.full_name}</h1>
                <span className="px-2 py-1 bg-base border border-border rounded text-xs text-text-muted">
                  {repoData.owner.type}
                </span>
              </div>

              {repoData.description && <p className="text-text-muted max-w-2xl">{repoData.description}</p>}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-2 text-text-muted">
                <Star className="w-4 h-4" />
                <span>{repoData.stargazers_count.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2 text-text-muted">
                <GitFork className="w-4 h-4" />
                <span>{repoData.forks_count.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2 text-text-muted">
                <Eye className="w-4 h-4" />
                <span>{repoData.watchers_count.toLocaleString()}</span>
              </div>
              {repoData.open_issues_count > 0 && (
                <div className="flex items-center gap-2 text-warning">
                  <AlertCircle className="w-4 h-4" />
                  <span>{repoData.open_issues_count} issues</span>
                </div>
              )}
              {repoData.language && (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-accent rounded-full" />
                  <span className="text-text-muted">{repoData.language}</span>
                </div>
              )}
              <div className="text-text-muted text-sm">{formatSize(repoData.size)}</div>
            </div>

            {/* Dates */}
            <div className="flex items-center gap-6 text-sm text-text-muted">
              <span>Criado em {formatDate(repoData.created_at)}</span>
              <span>Atualizado em {formatDate(repoData.updated_at)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <a
              href={`https://github.com/${repoData.full_name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-base border border-border rounded-lg text-text-primary hover:bg-surface-hover transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Ver no GitHub
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}

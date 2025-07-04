"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, Star, GitFork, Lock, Globe, Calendar, TrendingUp, Users, Building, RefreshCw } from "lucide-react"
import type { GitHubUser, UserRepository } from "@/types/auth"
import { getAuthenticatedUser, getUserRepositories, getUserOrganizations } from "@/lib/github-auth-api"

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [user, setUser] = useState<GitHubUser | null>(null)
  const [repositories, setRepositories] = useState<UserRepository[]>([])
  const [organizations, setOrganizations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState<"all" | "public" | "private" | "forks">("all")
  const [sortBy, setSortBy] = useState<"updated" | "created" | "pushed" | "name">("updated")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
      return
    }

    if (session?.accessToken) {
      fetchUserData()
    }
  }, [session, status, router])

  const fetchUserData = async () => {
    if (!session?.accessToken) return

    try {
      setLoading(true)
      const [userData, reposData, orgsData] = await Promise.all([
        getAuthenticatedUser(session.accessToken),
        getUserRepositories(session.accessToken, 1, 100, sortBy),
        getUserOrganizations(session.accessToken),
      ])

      setUser(userData)
      setRepositories(reposData)
      setOrganizations(orgsData)
    } catch (error) {
      console.error("Error fetching user data:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredRepositories = repositories.filter((repo) => {
    const matchesSearch =
      repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repo.description?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = (() => {
      switch (filter) {
        case "public":
          return !repo.private
        case "private":
          return repo.private
        case "forks":
          return repo.fork
        default:
          return true
      }
    })()

    return matchesSearch && matchesFilter
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-base flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-text-muted">Carregando seus repositórios...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-base flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-danger text-lg">Erro ao carregar dados do usuário</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base">
      {/* Header */}
      <header className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={user.avatar_url || "/placeholder.svg"} alt={user.name} className="w-12 h-12 rounded-full" />
              <div>
                <h1 className="text-2xl font-bold text-text-primary">{user.name || user.login}</h1>
                <p className="text-text-muted">@{user.login}</p>
              </div>
            </div>
            <button
              onClick={fetchUserData}
              className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-alt text-black rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Atualizar
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-surface rounded-lg border border-border p-4">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-accent" />
              <div>
                <p className="text-2xl font-bold text-text-primary">{user.public_repos}</p>
                <p className="text-text-muted text-sm">Repositórios Públicos</p>
              </div>
            </div>
          </div>
          <div className="bg-surface rounded-lg border border-border p-4">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-warning" />
              <div>
                <p className="text-2xl font-bold text-text-primary">{user.private_repos || 0}</p>
                <p className="text-text-muted text-sm">Repositórios Privados</p>
              </div>
            </div>
          </div>
          <div className="bg-surface rounded-lg border border-border p-4">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-success" />
              <div>
                <p className="text-2xl font-bold text-text-primary">{user.followers}</p>
                <p className="text-text-muted text-sm">Seguidores</p>
              </div>
            </div>
          </div>
          <div className="bg-surface rounded-lg border border-border p-4">
            <div className="flex items-center gap-3">
              <Building className="w-5 h-5 text-accent" />
              <div>
                <p className="text-2xl font-bold text-text-primary">{organizations.length}</p>
                <p className="text-text-muted text-sm">Organizações</p>
              </div>
            </div>
          </div>
        </div>

        {/* Organizations */}
        {organizations.length > 0 && (
          <div className="bg-surface rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Suas Organizações</h3>
            <div className="flex flex-wrap gap-3">
              {organizations.map((org) => (
                <div key={org.id} className="flex items-center gap-2 bg-base rounded-lg p-3 border border-border">
                  <img src={org.avatar_url || "/placeholder.svg"} alt={org.login} className="w-6 h-6 rounded" />
                  <span className="text-text-primary font-medium">{org.login}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-surface rounded-lg border border-border p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  placeholder="Buscar repositórios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-base border border-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="px-3 py-2 bg-base border border-border rounded-lg text-text-primary focus:outline-none focus:border-accent"
              >
                <option value="all">Todos</option>
                <option value="public">Públicos</option>
                <option value="private">Privados</option>
                <option value="forks">Forks</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 bg-base border border-border rounded-lg text-text-primary focus:outline-none focus:border-accent"
              >
                <option value="updated">Atualizado</option>
                <option value="created">Criado</option>
                <option value="pushed">Push</option>
                <option value="name">Nome</option>
              </select>
            </div>
          </div>

          <div className="mt-4 text-text-muted text-sm">
            Mostrando {filteredRepositories.length} de {repositories.length} repositórios
          </div>
        </div>

        {/* Repositories Grid */}
        <div className="grid gap-4">
          {filteredRepositories.map((repo) => (
            <div
              key={repo.id}
              onClick={() => router.push(`/repo/${repo.owner.login}/${repo.name}`)}
              className="bg-surface rounded-lg border border-border p-6 hover:bg-surface-hover transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-text-primary truncate">{repo.name}</h3>
                    {repo.private ? (
                      <Lock className="w-4 h-4 text-warning" />
                    ) : (
                      <Globe className="w-4 h-4 text-success" />
                    )}
                    {repo.fork && <span className="text-xs bg-base px-2 py-1 rounded text-text-muted">FORK</span>}
                  </div>

                  {repo.description && <p className="text-text-muted mb-3 line-clamp-2">{repo.description}</p>}

                  <div className="flex items-center gap-6 text-sm text-text-muted">
                    {repo.language && (
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-accent rounded-full" />
                        <span>{repo.language}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      <span>{repo.stargazers_count}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <GitFork className="w-4 h-4" />
                      <span>{repo.forks_count}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Atualizado {formatDate(repo.updated_at)}</span>
                    </div>
                  </div>
                </div>

                <TrendingUp className="w-5 h-5 text-text-muted ml-4" />
              </div>
            </div>
          ))}
        </div>

        {filteredRepositories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-text-muted text-lg">Nenhum repositório encontrado</p>
            <p className="text-text-muted text-sm mt-2">Tente ajustar os filtros de busca</p>
          </div>
        )}
      </div>
    </div>
  )
}

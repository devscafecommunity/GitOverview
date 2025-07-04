import type { GitHubRepository, GitHubCommit, GitHubContributor, LanguageStats } from "@/types/github"

const GITHUB_API_BASE = "https://api.github.com"

// Função para fazer requests à API do GitHub
async function githubFetch(endpoint: string) {
  const response = await fetch(`${GITHUB_API_BASE}${endpoint}`, {
    headers: {
      Accept: "application/vnd.github.v3+json",
      // Adicione seu token aqui se necessário: 'Authorization': `token ${process.env.GITHUB_TOKEN}`
    },
  })

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`)
  }

  return response.json()
}

export async function getRepository(owner: string, repo: string): Promise<GitHubRepository> {
  return githubFetch(`/repos/${owner}/${repo}`)
}

export async function getCommits(owner: string, repo: string, page = 1, perPage = 100): Promise<GitHubCommit[]> {
  return githubFetch(`/repos/${owner}/${repo}/commits?page=${page}&per_page=${perPage}`)
}

export async function getContributors(owner: string, repo: string): Promise<GitHubContributor[]> {
  return githubFetch(`/repos/${owner}/${repo}/contributors`)
}

export async function getLanguages(owner: string, repo: string): Promise<LanguageStats> {
  return githubFetch(`/repos/${owner}/${repo}/languages`)
}

// Função para processar commits e criar dados para gráficos
export function processCommitsForChart(commits: GitHubCommit[]) {
  const commitsByDate = commits.reduce((acc: { [key: string]: any }, commit) => {
    const date = new Date(commit.commit.author.date).toISOString().split("T")[0]
    const author = commit.commit.author.name

    if (!acc[date]) {
      acc[date] = {
        date,
        commits: 0,
        additions: 0,
        deletions: 0,
        authors: new Set(),
      }
    }

    acc[date].commits += 1
    acc[date].additions += commit.stats?.additions || 0
    acc[date].deletions += commit.stats?.deletions || 0
    acc[date].authors.add(author)

    return acc
  }, {})

  return Object.values(commitsByDate)
    .map((day: any) => ({
      ...day,
      authors: Array.from(day.authors),
      authorCount: day.authors.length,
      netChanges: day.additions - day.deletions,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

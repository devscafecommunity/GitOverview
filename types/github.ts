// Tipos baseados na API real do GitHub
export interface GitHubRepository {
  id: number
  name: string
  full_name: string
  owner: {
    login: string
    avatar_url: string
    type: string
  }
  description: string | null
  stargazers_count: number
  forks_count: number
  language: string | null
  created_at: string
  updated_at: string
  pushed_at: string
  default_branch: string
  open_issues_count: number
  watchers_count: number
  size: number
}

export interface GitHubCommit {
  sha: string
  commit: {
    author: {
      name: string
      email: string
      date: string
    }
    committer: {
      name: string
      email: string
      date: string
    }
    message: string
  }
  author: {
    login: string
    avatar_url: string
  } | null
  committer: {
    login: string
    avatar_url: string
  } | null
  stats?: {
    additions: number
    deletions: number
    total: number
  }
}

export interface GitHubContributor {
  login: string
  id: number
  avatar_url: string
  contributions: number
  type: string
}

export interface CommitActivity {
  date: string
  commits: number
  additions: number
  deletions: number
  authors: string[]
}

export interface LanguageStats {
  [language: string]: number
}

import type { GitHubUser, UserRepository } from "@/types/auth"
import type { GitHubRepository, GitHubCommit, GitHubContributor, LanguageStats } from "@/types/github"

const GITHUB_API_BASE = "https://api.github.com"

// Função para fazer requests autenticados à API do GitHub
async function authenticatedGitHubFetch(endpoint: string, accessToken: string) {
  const response = await fetch(`${GITHUB_API_BASE}${endpoint}`, {
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} - ${response.statusText}`)
  }

  return response.json()
}

// Buscar dados do usuário autenticado
export async function getAuthenticatedUser(accessToken: string): Promise<GitHubUser> {
  return authenticatedGitHubFetch("/user", accessToken)
}

// Buscar repositórios do usuário (incluindo privados)
export async function getUserRepositories(
  accessToken: string,
  page = 1,
  perPage = 30,
  sort: "created" | "updated" | "pushed" | "full_name" = "updated",
): Promise<UserRepository[]> {
  return authenticatedGitHubFetch(`/user/repos?page=${page}&per_page=${perPage}&sort=${sort}`, accessToken)
}

// Buscar repositórios de uma organização
export async function getOrgRepositories(
  org: string,
  accessToken: string,
  page = 1,
  perPage = 30,
): Promise<UserRepository[]> {
  return authenticatedGitHubFetch(`/orgs/${org}/repos?page=${page}&per_page=${perPage}`, accessToken)
}

// Buscar organizações do usuário
export async function getUserOrganizations(accessToken: string) {
  return authenticatedGitHubFetch("/user/orgs", accessToken)
}

// Versões autenticadas das funções existentes
export async function getAuthenticatedRepository(
  owner: string,
  repo: string,
  accessToken: string,
): Promise<GitHubRepository> {
  return authenticatedGitHubFetch(`/repos/${owner}/${repo}`, accessToken)
}

export async function getAuthenticatedCommits(
  owner: string,
  repo: string,
  accessToken: string,
  page = 1,
  perPage = 100,
): Promise<GitHubCommit[]> {
  return authenticatedGitHubFetch(`/repos/${owner}/${repo}/commits?page=${page}&per_page=${perPage}`, accessToken)
}

export async function getAuthenticatedContributors(
  owner: string,
  repo: string,
  accessToken: string,
): Promise<GitHubContributor[]> {
  return authenticatedGitHubFetch(`/repos/${owner}/${repo}/contributors`, accessToken)
}

export async function getAuthenticatedLanguages(
  owner: string,
  repo: string,
  accessToken: string,
): Promise<LanguageStats> {
  return authenticatedGitHubFetch(`/repos/${owner}/${repo}/languages`, accessToken)
}

// Buscar branches do repositório
export async function getRepositoryBranches(owner: string, repo: string, accessToken: string) {
  return authenticatedGitHubFetch(`/repos/${owner}/${repo}/branches`, accessToken)
}

// Buscar pull requests
export async function getRepositoryPullRequests(owner: string, repo: string, accessToken: string) {
  return authenticatedGitHubFetch(`/repos/${owner}/${repo}/pulls?state=all&per_page=50`, accessToken)
}

// Buscar issues
export async function getRepositoryIssues(owner: string, repo: string, accessToken: string) {
  return authenticatedGitHubFetch(`/repos/${owner}/${repo}/issues?state=all&per_page=50`, accessToken)
}

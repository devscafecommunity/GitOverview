import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
  }
}

export interface GitHubUser {
  login: string
  id: number
  avatar_url: string
  name: string
  email: string
  bio: string
  public_repos: number
  private_repos: number
  followers: number
  following: number
  created_at: string
}

export interface UserRepository {
  id: number
  name: string
  full_name: string
  private: boolean
  owner: {
    login: string
    avatar_url: string
  }
  description: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  updated_at: string
  pushed_at: string
}

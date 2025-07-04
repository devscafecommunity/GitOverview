"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import { Github, LogOut, User, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function AuthButton() {
  const { data: session, status } = useSession()
  const [isSigningIn, setIsSigningIn] = useState(false)

  const handleSignIn = async () => {
    try {
      setIsSigningIn(true)
      await signIn("github", { callbackUrl: "/dashboard" })
    } catch (error) {
      console.error("Sign in error:", error)
    } finally {
      setIsSigningIn(false)
    }
  }

  if (status === "loading") {
    return <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
  }

  if (session) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-3 py-2 bg-accent hover:bg-accent-alt text-black rounded-lg transition-colors"
        >
          <User className="w-4 h-4" />
          Dashboard
        </Link>
        <div className="flex items-center gap-2">
          <img
            src={session.user?.image || "/placeholder.svg"}
            alt={session.user?.name || "User"}
            className="w-8 h-8 rounded-full"
          />
          <span className="text-text-primary text-sm font-medium">{session.user?.name}</span>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-2 px-3 py-2 bg-base border border-border hover:bg-surface-hover text-text-primary rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </div>
    )
  }

  // Check if environment variables are missing (client-side check)
  const isMissingConfig = !process.env.NEXT_PUBLIC_NEXTAUTH_URL

  if (isMissingConfig) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-danger/20 border border-danger/30 text-danger rounded-lg">
        <AlertCircle className="w-4 h-4" />
        <span className="text-sm">Auth não configurado</span>
      </div>
    )
  }

  return (
    <button
      onClick={handleSignIn}
      disabled={isSigningIn}
      className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-alt disabled:opacity-50 disabled:cursor-not-allowed text-black font-medium rounded-lg transition-colors"
    >
      {isSigningIn ? (
        <>
          <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
          Entrando...
        </>
      ) : (
        <>
          <Github className="w-4 h-4" />
          Entrar com GitHub
        </>
      )}
    </button>
  )
}

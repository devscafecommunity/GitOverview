"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { AlertTriangle, Home, RefreshCw } from "lucide-react"

export default function AuthError() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "Configuration":
        return {
          title: "Erro de Configuração",
          description: "Há um problema com a configuração do servidor. Tente novamente mais tarde.",
        }
      case "AccessDenied":
        return {
          title: "Acesso Negado",
          description: "Você negou o acesso à sua conta GitHub. Tente fazer login novamente.",
        }
      case "Verification":
        return {
          title: "Erro de Verificação",
          description: "O token de verificação expirou ou é inválido.",
        }
      default:
        return {
          title: "Erro de Autenticação",
          description: "Ocorreu um erro durante o processo de login. Tente novamente.",
        }
    }
  }

  const errorInfo = getErrorMessage(error)

  return (
    <div className="min-h-screen bg-base flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-danger/20 rounded-2xl flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8 text-danger" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">{errorInfo.title}</h1>
            <p className="text-text-muted mt-2">{errorInfo.description}</p>
          </div>
        </div>

        <div className="bg-surface rounded-lg border border-border p-6 space-y-4">
          <h3 className="text-lg font-semibold text-text-primary">O que você pode fazer:</h3>
          <ul className="space-y-2 text-text-muted">
            <li>• Verifique sua conexão com a internet</li>
            <li>• Tente fazer login novamente</li>
            <li>• Limpe o cache do navegador</li>
            <li>• Entre em contato com o suporte se o problema persistir</li>
          </ul>
        </div>

        <div className="flex gap-3">
          <Link
            href="/auth/signin"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-accent hover:bg-accent-alt text-black font-medium rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Tentar Novamente
          </Link>
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-base border border-border hover:bg-surface-hover text-text-primary rounded-lg transition-colors"
          >
            <Home className="w-4 h-4" />
            Início
          </Link>
        </div>

        {error && (
          <div className="bg-base border border-border rounded-lg p-4">
            <p className="text-text-muted text-sm">
              <strong>Código do erro:</strong> {error}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

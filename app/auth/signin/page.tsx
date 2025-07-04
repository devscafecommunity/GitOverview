"use client"

import { signIn, getProviders } from "next-auth/react"
import { useEffect, useState } from "react"
import { Github, Shield, Eye, GitBranch, Users } from "lucide-react"
import Link from "next/link"

export default function SignIn() {
  const [providers, setProviders] = useState<any>(null)

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders()
      setProviders(res)
    }
    fetchProviders()
  }, [])

  return (
    <div className="min-h-screen bg-base flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto">
            <Github className="w-8 h-8 text-black" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Entrar no GitOverview</h1>
            <p className="text-text-muted mt-2">Acesse seus repositórios privados e públicos</p>
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-surface rounded-lg border border-border p-6 space-y-4">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Com sua conta GitHub você pode:</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-accent" />
              <span className="text-text-primary">Acessar repositórios privados</span>
            </div>
            <div className="flex items-center gap-3">
              <GitBranch className="w-5 h-5 text-success" />
              <span className="text-text-primary">Visualizar todas as branches e PRs</span>
            </div>
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-warning" />
              <span className="text-text-primary">Acessar repositórios de organizações</span>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-accent" />
              <span className="text-text-primary">Maior limite de requisições à API</span>
            </div>
          </div>
        </div>

        {/* Sign In Button */}
        {providers &&
          Object.values(providers).map((provider: any) => (
            <button
              key={provider.name}
              onClick={() => signIn(provider.id, { callbackUrl: "/dashboard" })}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-accent hover:bg-accent-alt text-black font-semibold rounded-lg transition-colors"
            >
              <Github className="w-5 h-5" />
              Continuar com {provider.name}
            </button>
          ))}

        {/* Privacy Notice */}
        <div className="bg-base border border-border rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-accent mt-0.5" />
            <div>
              <h4 className="text-text-primary font-medium mb-1">Privacidade e Segurança</h4>
              <p className="text-text-muted text-sm">
                Solicitamos apenas as permissões necessárias para visualizar seus repositórios. Não armazenamos nem
                modificamos seus dados.
              </p>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link href="/" className="text-accent hover:text-accent-alt text-sm transition-colors">
            ← Voltar para página inicial
          </Link>
        </div>
      </div>
    </div>
  )
}

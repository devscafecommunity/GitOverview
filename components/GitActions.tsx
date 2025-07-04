"use client"

import { useState } from "react"
import {
  GitBranch,
  GitMerge,
  RotateCcw,
  Archive,
  Copy,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Upload,
  Download,
} from "lucide-react"

interface GitActionsProps {
  onCommandGenerated: (command: string) => void
}

export default function GitActions({ onCommandGenerated }: GitActionsProps) {
  const [selectedBranch, setSelectedBranch] = useState("main")
  const [newBranchName, setNewBranchName] = useState("")
  const [commitMessage, setCommitMessage] = useState("")

  const branches = ["main", "develop", "feature/auth", "hotfix/bug-123"]

  const generateCommand = (command: string, description: string) => {
    onCommandGenerated(command)
  }

  const actionCategories = [
    {
      title: "Resolução de Conflitos",
      icon: AlertTriangle,
      color: "text-warning",
      actions: [
        {
          name: "Aceitar versão local",
          description: "Manter suas mudanças",
          command: "git checkout --ours .",
          icon: CheckCircle,
        },
        {
          name: "Aceitar versão remota",
          description: "Usar versão do repositório",
          command: "git checkout --theirs .",
          icon: Download,
        },
        {
          name: "Continuar merge",
          description: "Após resolver conflitos",
          command: "git merge --continue",
          icon: GitMerge,
        },
        {
          name: "Abortar merge",
          description: "Cancelar operação de merge",
          command: "git merge --abort",
          icon: XCircle,
        },
      ],
    },
    {
      title: "Gerenciamento de Branches",
      icon: GitBranch,
      color: "text-accent",
      actions: [
        {
          name: "Criar nova branch",
          description: "Criar e trocar para nova branch",
          command: `git checkout -b ${newBranchName || "nova-branch"}`,
          icon: GitBranch,
          hasInput: true,
          inputValue: newBranchName,
          onInputChange: setNewBranchName,
          placeholder: "Nome da nova branch",
        },
        {
          name: "Trocar de branch",
          description: "Mudar para branch selecionada",
          command: `git checkout ${selectedBranch}`,
          icon: RefreshCw,
          hasSelect: true,
          selectValue: selectedBranch,
          onSelectChange: setSelectedBranch,
          options: branches,
        },
        {
          name: "Deletar branch local",
          description: "Remover branch do repositório local",
          command: `git branch -d ${selectedBranch}`,
          icon: XCircle,
        },
        {
          name: "Push nova branch",
          description: "Enviar branch para repositório remoto",
          command: `git push -u origin ${selectedBranch}`,
          icon: Upload,
        },
      ],
    },
    {
      title: "Manipulação de Commits",
      icon: RotateCcw,
      color: "text-success",
      actions: [
        {
          name: "Reset soft (manter mudanças)",
          description: "Desfazer último commit mantendo alterações",
          command: "git reset --soft HEAD~1",
          icon: RotateCcw,
        },
        {
          name: "Reset hard (descartar tudo)",
          description: "Desfazer e apagar todas as mudanças",
          command: "git reset --hard HEAD~1",
          icon: XCircle,
        },
        {
          name: "Alterar mensagem do commit",
          description: "Modificar mensagem do último commit",
          command: `git commit --amend -m "${commitMessage || "Nova mensagem"}"`,
          icon: Copy,
          hasInput: true,
          inputValue: commitMessage,
          onInputChange: setCommitMessage,
          placeholder: "Nova mensagem do commit",
        },
      ],
    },
    {
      title: "Stash e Backup",
      icon: Archive,
      color: "text-warning",
      actions: [
        {
          name: "Salvar alterações temporariamente",
          description: "Guardar mudanças sem fazer commit",
          command: 'git stash push -m "Alterações temporárias"',
          icon: Archive,
        },
        {
          name: "Recuperar alterações salvas",
          description: "Aplicar último stash",
          command: "git stash apply",
          icon: RefreshCw,
        },
        {
          name: "Ver lista de stashes",
          description: "Listar todas as alterações salvas",
          command: "git stash list",
          icon: Copy,
        },
      ],
    },
  ]

  return (
    <div className="space-y-6">
      <div className="bg-surface rounded-lg border border-border p-6">
        <h3 className="text-xl font-semibold text-text-primary mb-6">Ações Git Visuais</h3>
        <p className="text-text-muted mb-6">Clique nas ações abaixo para gerar os comandos Git correspondentes</p>

        <div className="space-y-8">
          {actionCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="space-y-4">
              <div className="flex items-center gap-3">
                <category.icon className={`w-5 h-5 ${category.color}`} />
                <h4 className="text-lg font-medium text-text-primary">{category.title}</h4>
              </div>

              <div className="grid gap-3">
                {category.actions.map((action, actionIndex) => (
                  <div key={actionIndex} className="bg-base border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <action.icon className="w-5 h-5 text-text-muted mt-0.5" />
                        <div className="flex-1 space-y-2">
                          <div>
                            <h5 className="font-medium text-text-primary">{action.name}</h5>
                            <p className="text-sm text-text-muted">{action.description}</p>
                          </div>

                          {/* Input field for actions that need it */}
                          {action.hasInput && (
                            <input
                              type="text"
                              value={action.inputValue}
                              onChange={(e) => action.onInputChange?.(e.target.value)}
                              placeholder={action.placeholder}
                              className="w-full px-3 py-2 bg-surface border border-border rounded text-text-primary placeholder-text-muted focus:outline-none focus:border-accent"
                            />
                          )}

                          {/* Select field for actions that need it */}
                          {action.hasSelect && (
                            <select
                              value={action.selectValue}
                              onChange={(e) => action.onSelectChange?.(e.target.value)}
                              className="w-full px-3 py-2 bg-surface border border-border rounded text-text-primary focus:outline-none focus:border-accent"
                            >
                              {action.options?.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          )}

                          <code className="block text-sm bg-surface border border-border rounded px-3 py-2 text-accent">
                            {action.command}
                          </code>
                        </div>
                      </div>

                      <button
                        onClick={() => generateCommand(action.command, action.description)}
                        className="px-4 py-2 bg-accent hover:bg-accent-alt text-black font-medium rounded transition-colors flex items-center gap-2"
                      >
                        <Copy className="w-4 h-4" />
                        Gerar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Copy, Check, X, Terminal } from "lucide-react"

interface CommandBoxProps {
  command: string
  onClose: () => void
}

export default function CommandBox({ command, onClose }: CommandBoxProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(command)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Erro ao copiar:", err)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 bg-surface border border-border rounded-lg shadow-lg p-4 max-w-md">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-accent" />
          <h4 className="font-medium text-text-primary">Comando Gerado</h4>
        </div>
        <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-base border border-border rounded p-3 mb-3">
        <code className="text-accent text-sm break-all">{command}</code>
      </div>

      <div className="flex gap-2">
        <button
          onClick={copyToClipboard}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-accent hover:bg-accent-alt text-black font-medium rounded transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copiado!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copiar
            </>
          )}
        </button>
      </div>
    </div>
  )
}

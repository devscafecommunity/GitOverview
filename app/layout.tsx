import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"
import AuthButton from "@/components/AuthButton"
import Link from "next/link"
import { Github } from "lucide-react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "GitOverview - Visual Git Repository Manager",
  description: "Analyze and manage Git repositories with visual tools and intelligent command generation",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-base text-text-primary antialiased`}>
        <Providers>
          {/* Navigation */}
          <nav className="border-b border-border bg-surface">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                    <Github className="w-5 h-5 text-black" />
                  </div>
                  <span className="text-xl font-bold text-text-primary">GitOverview</span>
                </Link>
                <AuthButton />
              </div>
            </div>
          </nav>
          {children}
        </Providers>
      </body>
    </html>
  )
}

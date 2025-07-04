# GitOverview

GitOverview é um web app visual e interativo que permite **analisar e gerenciar repositórios Git** diretamente do navegador, sem a necessidade de instalar nada. Basta colar o link do seu repositório GitHub e o GitOverview cuida do resto.

## ✨ Principais Funcionalidades

- 📊 **Dashboard do Repositório** com:
  - Gráfico de commits
  - Lista de commits e colaboradores
  - Insights rápidos sobre o repositório

- ⚙️ **Ações Git Visuais**:
  - Resolver conflitos de merge com um clique
  - Resetar commits
  - Criar e trocar de branches
  - Stash, cherry-pick, squash, rebase e mais

- 🧠 **Geração Inteligente de Comandos Git**:
  - Para cada ação executada, o GitOverview exibe e copia automaticamente o comando correspondente.

- ☁️ **Sem Backend ou Banco de Dados**:
  - O aplicativo é 100% estático e utiliza apenas a [GitHub API](https://docs.github.com/en/rest).

## 🚀 Como Usar

1. Acesse o site (ou rode localmente)
2. Cole a URL do repositório GitHub
3. Navegue pelas seções do projeto
4. Use a interface para gerar comandos úteis

## 🛠️ Tecnologias Utilizadas

- [Next.js](https://nextjs.org/) — Framework React para apps estáticos e dinâmicos
- [Tailwind CSS](https://tailwindcss.com/) — Estilização moderna e responsiva
- [GitHub REST API](https://docs.github.com/en/rest) — Dados do repositório
- [Recharts / Chart.js](https://recharts.org/en-US) — Visualizações gráficas
- [Octokit](https://github.com/octokit/octokit.js) — SDK para GitHub API

## 🎨 Tema Escuro (Nightly)

O app utiliza um design minimalista com foco em contraste e clareza, ideal para quem trabalha em ambientes escuros.

## 📦 Instalação Local

```bash
git clone https://github.com/seu-usuario/gitoverview.git
cd gitoverview
pnpm install
pnpm run dev

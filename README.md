# 🚗 VW Urban Mobility Dashboard

**Candidate:** Camila Silva

## 🎯 Project Overview

This dashboard is a specialized fleet management tool for Volkswagen's urban mobility assets. This initial phase focuses on establishing a **high-stability, enterprise-grade development environment** and automated quality pipelines before moving into the architectural implementation.

---

## 🤖 AI-First Disclosure

As part of the **AI-First Engineering** approach, this project's infrastructure was developed using an agentic workflow.

1. **Tools Used:** Cursor (Pro), Gemini 3 Flash, and Claude 3.5 Sonnet.
2. **Workflow:** I utilized **Cursor's Agentic Mode** for boilerplate generation and multi-file infrastructure setup. I directed the AI to solve complex environment conflicts through iterative prompting and context-sharing.
3. **Quality Assurance:** AI-generated configurations (like ESLint Flat Config) were manually reviewed and refactored to align with the latest industry standards. I rejected experimental AI suggestions (e.g., Node v24) in favor of LTS stability.
4. **Automated AI Code Review:** Integrated **Google Gemini** (`gemini-1.5-flash`) as an automated code reviewer directly into the CI/CD pipeline via GitHub Actions. On every pull request, Gemini reviews the diff with a focus on Clean Architecture, SOLID principles, React 19 / TypeScript best practices, and potential performance issues. This creates a continuous, AI-powered feedback loop that complements human review. **Location:** `.github/workflows/ai-code-review.yml`
5. **Ownership:** I defined the **Architectural Vision** and **Infrastructure Strategy**. The AI acted as a high-speed pair programmer to implement the boilerplate and configuration files based on my technical constraints.

---

## 🛡️ Post-Mortem: Infrastructure & Environment Stability

### 🔍 Root Cause Analysis (Native Bindings & Versions)

During orchestration on **macOS (Apple Silicon)**, I identified and resolved three critical blockers to ensure a "clean" environment for the entire team:

1. **Tailwind v4 CLI Errors:** Tailwind v4's decoupled CLI presented issues on ARM64 architectures when paired with non-LTS Node versions. **Decision:** Rollback to **Tailwind v3.4.17** for production-ready stability and PostCSS 8 compatibility.
2. **Vitest Native Bindings:** A `MODULE_NOT_FOUND` error occurred with Vitest v4/Rolldown on macOS (Darwin-arm64). **Decision:** Standardized on **Vitest v3.0.5** and forced a clean binary rebuild to ensure cross-platform compatibility.
3. **ESLint 9 Flat Config:** Addressed `TypeError` and `deprecated` warnings by implementing the official `defineConfig` and `globalIgnores` pattern from the latest ESLint 9 spec, ensuring a future-proof linting engine.

### 🛡️ Strategic Engineering Decisions

- **Standardized on pnpm v10:** Ensures strict dependency isolation, faster CI/CD cycles, and prevents "ghost dependencies."
- **Node LTS (20/22):** Explicitly targeted to align with enterprise stability standards and avoid ESM resolution failures found in experimental versions.

---

## 🤖 Automated Quality Assurance (CI/CD)

A professional **GitHub Actions** pipeline acts as a quality gate for every contribution:

- **Dependency Verification:** Uses `pnpm` for deterministic builds.
- **Linting:** Enforces strict code style via **ESLint 9 (Flat Config)** and **Prettier**.
- **Automated Testing:** Runs **Vitest** (Unit + Environment validation) on every push to `main` or `feat/*` branches.
- **AI Code Review:** Every pull request is automatically reviewed by **Google Gemini** (`gemini-1.5-flash`), configured to flag architectural and performance concerns.
- **Location:** `.github/workflows/ci.yml` | `.github/workflows/ai-code-review.yml`

---

## 🎨 Code Quality & Style

- **ESLint 9:** Configured with the modern **Flat Config** system, integrating `typescript-eslint` and `prettier` directly into the linting pipeline.
- **UI Primitives:** **Shadcn UI** has been initialized as the base component library to ensure accessibility (Radix UI) and design consistency.

---

## 🔒 Pre-Commit Quality Gate (Husky + lint-staged)

To prevent non-compliant code from ever reaching the repository, every `git commit` is intercepted by a **Husky** pre-commit hook that runs two checks automatically:

1. **lint-staged** formats and lints **only the files you're committing** -- not the entire codebase. This keeps commits fast even in large projects while guaranteeing that every committed file passes ESLint and Prettier.
2. **Vitest** runs the full test suite, ensuring no commit introduces a regression.

If either step fails, the commit is **rejected** and the developer gets immediate feedback before the code leaves their machine.

**Why this matters in an enterprise context:**

- **Shifts quality left:** Bugs and style violations are caught seconds after writing code, not minutes later in CI. This reduces feedback loops and keeps the `main` branch permanently deployable.
- **Eliminates "fix formatting" commits:** Because lint-staged auto-fixes on commit, the git history stays clean and meaningful.
- **CI cost reduction:** By catching issues locally first, CI pipelines run fewer failure cycles, saving compute time and developer context-switching.

**Configuration at a glance:**

- **Hook:** `.husky/pre-commit` runs `pnpm exec lint-staged` then `pnpm test`.
- **lint-staged rules** (in `package.json`): `*.{ts,tsx,js,jsx}` &rarr; `eslint --fix` | `*.{json,md,css}` &rarr; `prettier --write`.

---

## 🚀 Getting Started

### 🛠️ Installation & Environment Consistency

This project uses **pnpm** and **Corepack** to ensure version parity across Windows, Mac, and Linux.

> **Note for NPM users:** To maintain dependency integrity, we strictly enforce `pnpm`. Running `npm install` is discouraged as it bypasses the optimized lockfile.

1. **Enable pnpm via Corepack:**

```bash
corepack enable && corepack prepare pnpm@latest --activate
```

2. **Install dependencies:**

```bash
pnpm install
```

> **Windows users:** ensure PowerShell execution policy is set to `RemoteSigned` if scripts are blocked.

### 💻 Development Commands

- **Dev Server:** `pnpm dev`
- **Run Tests:** `pnpm test`
- **Lint & Fix:** `pnpm lint --fix`

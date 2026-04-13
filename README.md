# 🚗 VW Urban Mobility Dashboard

**Name:** Camila Silva

## 🎯 Project Overview

This dashboard is a specialized fleet management tool for Volkswagen's urban mobility assets. This initial phase focuses on establishing a **high-stability, enterprise-grade development environment** and automated quality pipelines before moving into the architectural implementation.

### Quick links

_Add your URLs when available:_

- **Walkthrough (Loom):** _—_
- **Live demo (deploy):** _—_

---

## 🚀 Getting Started

### 🛠️ Installation & environment

This project uses **pnpm** and **Corepack** to ensure version parity across Windows, Mac, and Linux.

> **Note for NPM users:** To maintain dependency integrity, we strictly enforce `pnpm`. Running `npm install` is discouraged as it bypasses the optimized lockfile.

1. **Enable pnpm via Corepack:**

```bash
corepack enable && corepack prepare pnpm@latest --activate
```

2. **Install and run:**

```bash
pnpm install
pnpm dev
```

The dev server defaults to [http://localhost:5173](http://localhost:5173).

> **Windows users:** ensure PowerShell execution policy is set to `RemoteSigned` if scripts are blocked.

**Runtime:** use **Node.js LTS** (20.x or 22.x); see the **appendix** (Post-Mortem) for version pinning rationale.

### 💻 Other commands

| Command          | Description                                                                   |
| ---------------- | ----------------------------------------------------------------------------- |
| `pnpm dev`       | **Vite** dev server with HMR.                                                 |
| `pnpm typecheck` | **TypeScript** project build (`tsc -b`). CI runs this before tests and build. |
| `pnpm build`     | **Typecheck** (`tsc -b`) then **production bundle** (`vite build`).           |
| `pnpm preview`   | Serve the **production build** locally (run `pnpm build` first).              |
| `pnpm test`      | Run **Vitest** once (`vitest run`).                                           |
| `pnpm lint`      | Run **ESLint** (`eslint .`). For auto-fixes: `pnpm exec eslint . --fix`       |

**Before a commit or PR** (aligned with CI):

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

### 🌐 Deployment

`pnpm build` produces an optimized **static site** in **`dist/`** (after `tsc -b` and `vite build`). Deploy the contents of `dist/` to any **static host** (e.g. Netlify, Vercel, AWS S3 + CloudFront, GitHub Pages). The app runs entirely in the browser; persisted vehicle edits live in **`localStorage`** via Zustand — no custom server or database is required for this challenge scope.

---

## 🧭 Architecture Decision Records (ADRs)

The project follows lightweight ADRs directly in this README to document _why_ key technical choices were made.

### ADR-001: Data fetching and cache strategy

- **Status:** Accepted
- **Context:** The app consumes Eurostat data with loading/error lifecycle and needs predictable async state.
- **Decision:** Use **TanStack Query** for server-state fetching and caching.
- **Consequences:** Consistent async state handling and easier retries/refetch patterns, with a small library overhead.

### ADR-002: Local CRUD persistence and state separation

- **Status:** Accepted
- **Context:** The Eurostat API is read-only, but this project requires full CRUD capabilities. We must clearly separate **Server State** (API data lifecycle) from **UI State** (local user mutations).
- **Decision:** Use a **Seed Pattern**: fetch data once with **TanStack Query** and seed it into **Zustand** (`persist` middleware). Zustand then becomes the single source of truth for local CRUD operations.
- **Consequences:** Fast and simple local persistence with minimal boilerplate. This elegantly solves the read-only API limitation while preserving strict server-state vs UI-state separation.

### ADR-003: Table engine and filtering model

- **Status:** Accepted
- **Context:** Column filters are required; global search and pagination were planned as follow-ups (see ADR-006 for search).
- **Decision:** Standardize table state on **TanStack Table** with `getFilteredRowModel()` for column + global filters, **`getSortedRowModel()`** for ordered rows, and exact string matching (`equalsString`) for dropdown filters. **Sorting is applied with `table.setSorting` everywhere:** the mobile drawer uses preset `SortingState` values (`AGGREGATED_TABLE_SORT_PRESETS` in `constants/vehicle-table.ts`), and desktop header sort buttons use the same mechanism via **`cycleAggregatedColumnSort`** / **`nextAggregatedColumnSortingState`** (`utils/vehicle-table.ts`) instead of `column.getToggleSortingHandler()`. Each user action replaces the full sort array (single-column sort from the UI—no shift-click multi-sort). Default sort remains **newest year first, then country A–Z** (`DEFAULT_AGGREGATED_TABLE_SORTING`).
- **Consequences:** Scalable foundation for pagination, sorting, and global search; introduces table abstraction but avoids ad-hoc filter logic. Desktop and mobile stay consistent. Header cycles: **year**, **total count**, and **motor-type count** use **desc → asc → cleared**; **country** uses **asc → desc → cleared** (implemented in `nextAggregatedColumnSortingState` in `utils/vehicle-table.ts`).

### ADR-004: Responsive data visualization pattern

- **Status:** Accepted
- **Context:** Dense desktop tables create poor UX on mobile screens — columns get squeezed, text overflows, and touch targets become too small.
- **Decision:** Use a **dual responsive pattern**: a full data table on desktop (`md+`) and **card-based layout** on mobile (`<md`). Cards are the modern standard for mobile data display — each record gets its own vertical card with readable typography and large touch targets. Mobile filters and **sort presets** live in the same bottom sheet (`Drawer`/`vaul`) to save screen real estate; sort choices call **`table.setSorting`** with the same state shape the desktop table uses (see ADR-003). **Pagination over infinite scroll** was a deliberate choice: in a data-driven dashboard, users need to know exactly how many records exist and where they are in the dataset. Infinite scroll is suited for content feeds (social media), not for informational pages where users scan, compare, and navigate with intent.
- **Consequences:** Better mobile readability and touch usability; pagination gives users a sense of position and control. The trade-off is maintaining two presentation layouts (table + cards) over the same row model, but TanStack Table's headless architecture makes this manageable since both layouts consume the same data and state.

### ADR-005: UI system and styling strategy

- **Status:** Accepted
- **Context:** The project requires fast delivery with consistent UI quality and maintainable component patterns.
- **Decision:** Use **Shadcn UI + Tailwind CSS v3.4.17** as the design system baseline.
- **Consequences:** Strong accessibility defaults and consistent component patterns; some generated primitives require project-level adaptation and maintenance.

### ADR-006: Global search (debounce and layering)

- **Status:** Accepted
- **Context:** Users need to search across all table fields. Filtering large in-memory datasets on every keystroke would waste work; debounce logic also does not belong inside generic `ui/` primitives (see ADR-005).
- **Decision:** Use TanStack Table’s **global filter** by passing a debounced string into `state.globalFilter` while keeping an immediate `searchQuery` in `useVehicleTable` for the controlled input. Debouncing is implemented with **`use-debounce`** (`useDebounce`). The **`SearchInput`** component stays presentational: it composes Shadcn `Input` with icons and a clear action; native WebKit/Chrome clear controls for `type="search"` are hidden with CSS so only one clear affordance is shown.
- **Consequences:** Snappier typing UX with fewer filter passes; one small runtime dependency (`use-debounce`); search behavior stays testable and centralized in the table hook rather than scattered in components.

### ADR-007: Master–Detail navigation and data aggregation

- **Status:** Accepted
- **Context:** The Eurostat dataset returns one record per country × year × motor energy combination, producing hundreds of rows. Displaying all of them on the main dashboard creates information overload, especially on mobile. Users need a quick overview first, then the ability to drill into specifics.
- **Decision:** Adopt a **Master–Detail** pattern. The dashboard aggregates records by country and year (using `useMemo` + `aggregateByCountryYear`), showing total registrations and motor-type count per group. A "View Details" action navigates to `/vehicles/:country/:year`, where the full motor energy breakdown is displayed with charts, individual record editing, and deletion.
- **Consequences:** The dashboard becomes scannable and mobile-friendly; routing by dimension keys (`country`/`year`) avoids the need for surrogate IDs that the statistical API does not provide. Two views must be maintained, but each has a clear, focused responsibility.

### ADR-008: Data visualization and provenance tracking

- **Status:** Accepted
- **Context:** The detail page needs to communicate motor energy distribution at a glance. Additionally, users can create and edit records locally, so there must be a clear visual distinction between original API data and user-modified data to maintain trust.
- **Decision:** Use **Recharts** (BarChart + PieChart) for visualization. Records carry a `source` field (`'eurostat'` | `'local'`); editing any record automatically sets `source` to `'local'`. In charts, local records are rendered with faded color opacity and a `(Local)` label suffix, while Eurostat records use solid colors — avoiding merging counts from different sources, which would be misleading.
- **Consequences:** Users can immediately identify which data is original vs. user-modified. Recharts adds ~180 KB to the bundle but provides a rich, responsive charting experience with minimal configuration. The `source` tracking also enables potential future features like "reset to original" or audit trails.

### ADR-009: Feature-based micro-frontend architecture

- **Status:** Accepted
- **Context:** As the application grew (API layer, store, hooks, components, utils, types, constants), the flat folder structure (`src/api/`, `src/hooks/`, `src/stores/`, etc.) made it difficult to understand module boundaries and reason about dependencies between layers.
- **Decision:** Restructure into a **feature-based layout** under `src/features/vehicles/`, consolidating all vehicle-related code behind a single **barrel export** (`features/vehicles/index.ts`). Shared cross-cutting concerns (`components/ui/`, `components/layout/`, `lib/`) remain at the root.
- **Consequences:** Clear module boundaries — pages import only from the public API, never from internal feature paths. This mirrors how a real micro-frontend would expose its contract. Adding a second feature (e.g., `features/charging-stations/`) would follow the same pattern without touching existing code, adhering to the Open/Closed Principle.

---

## 🤖 AI-First Disclosure

As part of the **AI-First Engineering** approach, this project's infrastructure was developed using an agentic workflow.

1. **Tools Used:** Cursor (Pro) with Agentic Mode — **Claude Opus** for complex architectural decisions and multi-file implementations, **Cursor Auto** for simpler refactors and quick fixes (cost-efficient for routine tasks), and **Google Gemini Pro** for product/UX discussions and getting a second AI opinion without consuming the Opus budget. **Gemini Flash** powers the automated CI code review.
2. **Workflow:** I used Cursor's Agentic Mode across the entire development lifecycle — infrastructure setup, feature implementation, testing, refactoring, and documentation. I directed the AI step-by-step, reviewing and approving each change before proceeding. For architectural decisions, I used conversational AI (Gemini, Claude) to discuss trade-offs before committing to an approach.
3. **Quality Assurance:** Every AI-generated change went through the same pipeline a human contribution would: `tsc --strict`, ESLint, Vitest, and a production build. I reviewed diffs before each commit, ran checks locally, and iterated when the output didn't meet my standards.
4. **Automated AI Code Review:** Integrated **Google Gemini** (`gemini-2.5-flash`) as an automated reviewer in the CI/CD pipeline via GitHub Actions. On every pull request, Gemini reviews the diff with a focus on Clean Architecture, SOLID principles, and React 19 / TypeScript best practices. The workflow is configured with `continue-on-error: true` because the Gemini API occasionally returns transient failures (rate limits, timeouts) — the review is additive and should never block a merge. **Location:** `.github/workflows/ai-code-review.yml`
5. **Ownership:** I defined the architectural vision, data model, and UX strategy. The AI acted as a high-speed pair programmer — I directed what to build, reviewed how it was built, and refined the output until it met my quality bar.

### Concrete Examples: Improved or Rejected AI Output

| Situation                   | AI Suggestion                                                                                                                                                                       | My Decision                                                                                                                                                                                                                                                                      | Why                                                                                                                                                                         |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Table engine                | AI built a plain HTML table with manual filter/sort logic                                                                                                                           | **I suggested TanStack Table** as a headless table engine                                                                                                                                                                                                                        | Manual filtering and sorting doesn't scale; TanStack Table provides a composable, declarative API for column filters, global search, sorting, and pagination out of the box |
| Node version                | AI suggested Node v24 (experimental)                                                                                                                                                | **Rejected** — pinned to Node LTS 20/22                                                                                                                                                                                                                                          | Enterprise stability; ESM resolution failures in experimental versions                                                                                                      |
| Tailwind version            | AI scaffolded with Tailwind v4                                                                                                                                                      | **Rolled back** to v3.4.17                                                                                                                                                                                                                                                       | v4 had ARM64 CLI issues on Apple Silicon; v3 is production-proven                                                                                                           |
| Search debounce             | AI built a simple search filter but omitted debounce entirely                                                                                                                       | **I requested debounce** — essential to avoid re-rendering the table on every keystroke. AI then added it, but inside the `SearchInput` component. **I moved it** to the `useVehicleTable` hook                                                                                  | Debounce is a performance concern, not a UI concern. `SearchInput` should stay presentational; the hook owns filtering logic (SoC)                                          |
| Data merging for charts     | AI initially merged Eurostat and local record counts                                                                                                                                | **Rejected** — kept records separate with visual distinction                                                                                                                                                                                                                     | Merging different data sources would produce misleading totals; visual separation preserves trust                                                                           |
| `getGlobalFilteredRowModel` | AI imported a non-existent TanStack Table function                                                                                                                                  | **Removed** — `getFilteredRowModel()` handles global filtering implicitly                                                                                                                                                                                                        | Hallucination; verified against the official TanStack Table v8 documentation                                                                                                |
| `"use client"` directives   | AI-generated Shadcn components included `"use client"` at the top of files                                                                                                          | **Removed** — this is a Vite SPA, not Next.js                                                                                                                                                                                                                                    | `"use client"` is a Next.js RSC directive for marking client components; in a pure client-side React app it's unnecessary and misleading                                    |
| Component decomposition     | AI generated large monolithic components with duplicated code and inline logic                                                                                                      | **I directed AI to extract** reusable components (`VehicleCard`, `TableHeaderFilters`, `SourceBadge`, etc.), move shared values into a `constants/` module, and extract business logic into custom hooks (`useVehicleTable`, `useVehicleForm`)                                   | Keeps components small and presentational, eliminates duplication, and follows Single Responsibility Principle — UI renders, hooks own logic, constants are shared          |
| Mobile pagination           | AI rendered full desktop pagination on mobile                                                                                                                                       | **Refactored** — hid non-essential controls, enlarged touch targets                                                                                                                                                                                                              | Violated Apple HIG 44×44px minimum; caused "fat finger" errors on mobile                                                                                                    |
| Desktop vs mobile sort      | **Previously:** desktop used TanStack’s header toggle (`getToggleSortingHandler`), which follows TanStack’s multi-sort cycle; mobile already called `table.setSorting` with presets | **Now both use `table.setSorting`:** desktop headers go through `cycleAggregatedColumnSort` → `nextAggregatedColumnSortingState`; mobile drawer still applies preset `SortingState` values. Same API and same idea (replace full `SortingState`, single-column sort from the UI) | One code path to reason about; behavior matches across breakpoints and tests stay predictable                                                                               |

### Lessons Learned & Trade-offs

**Where AI accelerated me:**

- **Boilerplate and configuration:** ESLint flat config, Tailwind setup, Vite config, CI/CD pipelines — AI generated 80% of infrastructure in minutes instead of hours.
- **Multi-file refactoring:** The micro-frontend restructuring (moving 30+ files and updating all imports) was completed in one pass with AI assistance. Manually, this would have been error-prone and tedious.
- **Test generation:** AI produced well-structured test suites (currently **177** Vitest cases) that I then reviewed and refined. This saved significant time while maintaining coverage quality.
- **JSDoc documentation:** AI generated accurate JSDoc for all public APIs, which I reviewed and edited for precision.

**Where AI slowed me down or required intervention:**

- **Monolithic components:** AI's default tendency was to generate everything in a single file — logic, constants, and UI. I had to consistently direct it to extract hooks, create shared constants, and decompose components. Without this guidance, the codebase would violate SRP and be difficult to test or reuse.
- **Hallucinated APIs:** AI sometimes referenced TanStack Table functions that don't exist (e.g., `getGlobalFilteredRowModel`). I had to verify imports against documentation.
- **Over-engineering:** AI occasionally added unnecessary abstractions. I had to prune code to keep the architecture simple and aligned with the project's actual needs.
- **Strict mode gaps:** AI-generated code initially passed without `strict: true`. When I enabled strict mode later, 5 null-safety issues surfaced — showing that AI doesn't proactively adopt the strictest type-checking unless directed.

**Key takeaway:** AI is a powerful accelerator for implementation, but architectural decisions, quality standards, and UX judgment must come from the engineer. I treated AI as a pair programmer, not an autopilot.

### Prompt Engineering Strategies

Throughout the project, I iterated on how I communicated with AI to get better results:

- **Step-by-step with approval gates:** Instead of asking AI to build an entire feature at once, I used prompts like _"go step by step, explain everything, and wait for me to approve before moving on."_ This kept changes small, reviewable, and easy to revert if needed.
- **Scoped context-setting:** Before complex refactors, I provided tight scope and explicit task lists. For example: _"Context: I ONLY want to change how data is displayed in the main table. Task: 1) Aggregate by country and year. 2) Replace Edit/Delete with View Details. 3) Ensure mobile cards work."_ This prevented AI from making unrelated changes.
- **Quality constraints upfront:** I opened every feature with _"remember to keep the same pattern, clean code, SOLID principles"_ — framing the AI's output quality from the start rather than fixing it after the fact.
- **Cross-AI validation:** I used Gemini Pro as a second opinion on architecture and UX decisions made with Claude. This helped me weigh different perspectives before committing to an approach — especially for product-level decisions like the "1+N" data entry pattern and the master-detail navigation.
- **Challenging AI-generated complexity:** The `transformResponse` function for the Eurostat JSON-stat format was initially generated with deeply nested `for` loops and `if` chains. I questioned the AI: _"why is this so complex?"_ and iterated until the logic was cleaner and more readable. Understanding _what_ the code does — not just that it works — is essential when you own it.
- **Directing architecture, not just code:** I didn't just ask AI to "add debounce" — I told it _where_ it should live (the hook, not the component) because I knew a reusable UI component shouldn't contain business logic. Similarly, I told AI to remove `"use client"` directives because I understood they're a Next.js RSC pattern, not applicable in a Vite SPA.

---

## 🎨 Code quality, CI/CD, and pre-commit gates

This section ties together **how the codebase is written**, **what runs on every push in GitHub Actions**, and **what blocks a bad commit locally**.

### TypeScript, linting, and UI baseline

- **TypeScript Strict Mode:** `strict: true` is enabled in `tsconfig.app.json`, activating `strictNullChecks`, `noImplicitAny`, `strictFunctionTypes`, and all other strict flags. This catches null/undefined issues at compile time rather than at runtime.
- **ESLint 9:** Configured with the modern **Flat Config** system, integrating `typescript-eslint` and `prettier` directly into the linting pipeline.
- **UI Primitives:** **Shadcn UI** has been initialized as the base component library to ensure accessibility (Radix UI) and design consistency.
- **JSDoc API Documentation:** Public-facing exports (hooks, utilities, store, types, and reusable components) are documented with JSDoc where it helps maintainability—parameter and return descriptions, and `{@link ...}` cross-references where they add clarity (plain prose is used elsewhere). Key documented modules:
  - **Reusable components:** `SearchInput`, `FormTextField`, `ErrorBoundary`
  - **Custom hooks:** `useVehicles`, `useVehicleTable`, `useVehicleForm`
  - **Utilities:** `aggregateByCountryYear`, `buildChartData`, `formatCount`
  - **Store:** `useVehicleStore` (Zustand with persistence)
  - **Types:** `VehicleRecord`, `AggregatedRecord`, `VehicleFormData`

### Testing strategy

- **Unit tests:** Pure utilities (`aggregateByCountryYear`, `buildChartData` / merge helpers, `formatCount`, form validation, query-key serialization), Zustand store behavior, and HTTP/Eurostat parsing edge cases — fast, deterministic, no DOM.
- **Component-level tests (integration-style):** **Vitest + React Testing Library** for critical UI flows — dashboard table (filters, search, sort, pagination), vehicle form dialog, pagination controls, and shared inputs. These exercise multiple modules together without a separate E2E runner (acceptable for the **Mid** bar; **E2E** would be a natural next step for Senior depth).

### Reusable components (documented)

| Component       | Location                                  | Role                                                                                           |
| --------------- | ----------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `SearchInput`   | `src/components/ui/search-input.tsx`      | Presentational search field with clear control; debounce lives in `useVehicleTable`, not here. |
| `FormTextField` | `src/components/ui/form-text-field.tsx`   | Label + `Input` + inline error text for controlled forms.                                      |
| `ErrorBoundary` | `src/components/layout/ErrorBoundary.tsx` | Catches render errors and shows a fallback UI instead of a blank screen.                       |

Additional feature-level building blocks (`VehicleCard`, `TableHeaderFilters`, `SourceBadge`, chart wrappers) are documented via JSDoc and colocated under `src/features/vehicles/components/`.

### Accessibility (basic)

- **Semantics:** `Header` and pages use landmark-friendly structure; tables use proper `TableHead` / `TableBody` semantics from Shadcn/Radix patterns.
- **Keyboard & focus:** Dialogs, alerts, popovers, and the command combobox use **Radix** primitives (focus trap, `Escape`, focus restoration).
- **Icons:** Icon-only controls (e.g. edit/delete) expose meaningful text via **`aria-label`** (and similar patterns on the dashboard).
- **Design tokens:** Tailwind + Shadcn defaults support consistent contrast for core UI; no separate WCAG audit was run — this meets a **basic Mid** bar, not a full WCAG AA compliance claim.

### Error handling

- **React:** The route tree is wrapped in **`ErrorBoundary`** (`App.tsx`) so unexpected render failures surface a controlled message instead of a white screen.
- **Async / API:** Eurostat fetch errors are surfaced in the UI on the dashboard; HTTP helpers map failures to typed outcomes where tested (`eurostat-http-errors` tests).
- **User actions:** Store validation and duplicate natural keys throw **descriptive `Error` messages**; pages catch these and show **`sonner` toasts** so users get immediate, readable feedback.

### Notable implementation details

- **TanStack Query:** Eurostat requests use a **stable query key** (`vehiclesQueryKey` / `stableEurostatParamsKey` in `constants/vehicles-query.ts`) so identical params do not churn the cache. `main.tsx` configures `QueryClient` with **`refetchOnWindowFocus: false`** for predictable dashboard behavior.
- **Vehicle form:** `useVehicleForm` resets when the dialog opens using **`stableVehicleRecordKey`** and **`stablePartialVehicleFormKey`** so inline `defaults` objects with the same fields do not wipe in-progress edits. Country selection uses a **Command + Popover combobox** (`CountryCombobox`) backed by `constants/countries.ts`.
- **Zustand store:** `updateRecord` guards missing ids and **duplicate natural keys** (`country` + `year` + `motorEnergyName`); consumers surface `Error.message` (e.g. toasts on dashboard/detail pages).
- **Charts:** `buildChartData` **merges rows by `motorEnergyName`** (`utils/merge-by-motor-energy.ts`) with unit tests; aggregation and table filter options **normalize country codes to uppercase** for consistent grouping.
- **Aggregated table sort:** Mobile **Sort by** and desktop header sort both drive TanStack **`sorting` via `setSorting`**. Shared helpers: **`nextAggregatedColumnSortingState`** (pure next state) and **`cycleAggregatedColumnSort`** (applies it on the table instance). Presets and default multi-column sort live in **`constants/vehicle-table.ts`**; unit tests cover the sort-state transitions in **`utils/__tests__/vehicle-table.test.ts`**.
- **Routing / bootstrap:** `App.tsx` sends unknown paths to **`/`**; `main.tsx` asserts **`#root`** before `createRoot`. **`test-setup.ts`** stubs **`ResizeObserver`** for Recharts under jsdom.
- **Performance (Mid bar):** **Route-level code splitting** — `DashboardPage` and `VehicleDetailPage` are loaded with **`React.lazy`** and **`Suspense`** (`App.tsx`) so initial bundle stays smaller. **Debounced global search** (ADR-006) and **`useMemo`** for aggregations, chart inputs, and expensive table derivations reduce unnecessary work. **Stable TanStack Query keys** avoid redundant refetches (see above).
- **Linting:** Shadcn `ui/` primitives disable **`react-refresh/only-export-components`** in `eslint.config.js` (variant exports are intentional). Two hook sites use **documented `eslint-disable-next-line`** for intentional dependency lists (`useVehicleForm`, `useVehicleTable`).

### Continuous integration (GitHub Actions)

A **GitHub Actions** pipeline acts as a quality gate for every contribution:

- **Dependency verification:** Uses `pnpm` for deterministic builds.
- **Linting:** Enforces strict code style via **ESLint 9 (Flat Config)** and **Prettier**.
- **Automated testing:** Runs **Vitest** (unit tests, component tests with **jsdom**, and API/util tests) on every push to `main` or `feat/*` branches.
- **Production build verification:** CI runs `pnpm typecheck` (`tsc -b`) then `pnpm build` (`tsc -b && vite build`) so TypeScript is validated in a dedicated step and again before bundling. No PR is merged without a successful production build.
- **AI code review:** Every pull request is automatically reviewed by **Google Gemini** (`gemini-2.5-flash`), configured to flag architectural and performance concerns.

**Workflow files:** `.github/workflows/ci.yml` | `.github/workflows/ai-code-review.yml`

### Pre-commit quality gate (Husky + lint-staged)

Every `git commit` is intercepted by a **Husky** pre-commit hook:

1. **lint-staged** formats and lints **only the files you're committing** — not the entire codebase. This keeps commits fast while guaranteeing that every committed file passes ESLint and Prettier.
2. **Vitest** runs the full test suite, ensuring no commit introduces a regression.

If either step fails, the commit is **rejected** and the developer gets immediate feedback before the code leaves their machine.

**Why this matters in an enterprise context:**

- **Shifts quality left:** Bugs and style violations are caught seconds after writing code, not minutes later in CI.
- **Eliminates "fix formatting" commits:** lint-staged auto-fixes on commit keep git history clean.
- **CI cost reduction:** Fewer failure cycles on the remote pipeline.

**Configuration at a glance:**

- **Hook:** `.husky/pre-commit` runs `pnpm exec lint-staged` then `pnpm test`.
- **lint-staged rules** (in `package.json`): `*.{ts,tsx,js,jsx}` &rarr; `eslint --fix` | `*.{json,md,css}` &rarr; `prettier --write`.

---

## 🧩 Assumptions, trade-offs, and future improvements

### Assumptions

- **Data source:** [Eurostat](https://ec.europa.eu/eurostat) vehicle registration statistics via a public API; the API is **read-only**, so create/update/delete apply to a **local persisted copy** (Zustand `persist` in the browser), not to Eurostat.
- **Identity & routing:** Rows are keyed by app-generated ids for CRUD; the **detail route** uses natural dimensions **`/vehicles/:country/:year`** (ISO country code + year) because the upstream dataset has no single surrogate id for an aggregated group.
- **Scope:** Single-feature SPA (vehicles); no authentication, multi-tenant routing, or backend beyond static hosting.
- **Environment:** Modern evergreen browsers; **Node.js LTS 20/22** and **pnpm** for development and CI (see **Getting Started**).

### Product and engineering trade-offs

- **Vehicle form validation:** The create/edit dialog uses **controlled React state** via `useVehicleForm`, with shared rules in `vehicle-form.ts` (`isFormValid`, `isFormYearValid`, `getMinVehicleFormYear`, `getMaxVehicleFormYear`). The **year must be a four-digit value between 2018 and the current calendar year** — 2018 is the same **`EUROSTAT_SINCE_YEAR`** lower bound as the Eurostat query (`sinceTimePeriod`), so local rows stay comparable to seeded API data and years like 1994 cannot be saved. The same validation runs in **`useVehicleStore` (`addRecord` / `updateRecord`)** so invalid payloads are not persisted if anything bypasses the UI.
- **Why not React Hook Form + Zod (for now):** For this project’s scope, that stack would add dependencies and a structural refactor without changing end-user behavior. The current approach stays small, readable, and appropriate for a time-boxed challenge.
- **Likely evolution:** If the app gained many forms, cross-field async rules, or a first-party API, adopting **Zod** (and optionally **React Hook Form** with Shadcn’s `Form` primitives) would be a natural upgrade: one schema for rules, clearer per-field errors, and—when the backend is Node—potential to **share** the same schema between client and server.

---

## Appendix: 🛡️ Post-mortem — infrastructure & environment stability

_Deep-dive for reviewers who care about toolchain choices and Apple Silicon quirks._

### Root cause analysis (native bindings & versions)

During orchestration on **macOS (Apple Silicon)**, I identified and resolved three critical blockers to ensure a "clean" environment for the entire team:

1. **Tailwind v4 CLI errors:** Tailwind v4's decoupled CLI presented issues on ARM64 architectures when paired with non-LTS Node versions. **Decision:** Rollback to **Tailwind v3.4.17** for production-ready stability and PostCSS 8 compatibility.
2. **Vitest native bindings:** A `MODULE_NOT_FOUND` error occurred with Vitest v4/Rolldown on macOS (Darwin-arm64). **Decision:** Standardized on **Vitest v3.0.5** and forced a clean binary rebuild to ensure cross-platform compatibility.
3. **ESLint 9 flat config:** Addressed `TypeError` and `deprecated` warnings by implementing the official `defineConfig` and `globalIgnores` pattern from the latest ESLint 9 spec, ensuring a future-proof linting engine.

### Strategic engineering decisions

- **Standardized on pnpm v10:** Ensures strict dependency isolation, faster CI/CD cycles, and prevents "ghost dependencies."
- **Node LTS (20/22):** Explicitly targeted to align with enterprise stability standards and avoid ESM resolution failures found in experimental versions.

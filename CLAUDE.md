# BudgetBook — AI Agent Context

> This file is read automatically by Claude Code. GitHub Copilot reads `.github/copilot-instructions.md`.

## Project Overview

BudgetBook is a personal budgeting web app built with **SvelteKit + Svelte 5 (runes)**, **Drizzle ORM**, **PostgreSQL**, and **Better Auth**. Users create budget books, define spending categories with monthly budgets, track items (vendors/payees) within each category, and log individual dated transactions.

---

## Tech Stack

| Layer         | Library / Tool                                                                   |
| ------------- | -------------------------------------------------------------------------------- |
| Framework     | SvelteKit `^2.50` + Svelte `^5.51` (runes syntax `$props`, `$state`, `$derived`) |
| Language      | TypeScript (strict)                                                              |
| Styling       | Tailwind CSS v4 (`@tailwindcss/vite` plugin — no `tailwind.config.js`)           |
| UI Components | shadcn-svelte (components go in `src/lib/components/ui/`)                        |
| Icons         | `@lucide/svelte`                                                                 |
| ORM           | Drizzle ORM `^0.45` with postgres-js driver                                      |
| Database      | PostgreSQL (Docker Compose locally via `npm run db:start`)                       |
| Auth          | Better Auth `^1.5` — email/password, drizzle adapter, `sveltekitCookies` plugin  |
| Utilities     | `clsx` + `tailwind-merge` via `cn()` helper in `src/lib/utils.ts`                |
| Path alias    | `@` → `src/lib` (configured in `svelte.config.js`)                               |

---

## Directory Structure

```
src/
├── app.d.ts                      ← App.Locals: { user?, session? }
├── app.html
├── hooks.server.ts               ← injects user/session into event.locals via Better Auth
└── lib/
│   ├── index.ts
│   ├── utils.ts                  ← cn(), type helpers
│   ├── assets/
│   ├── components/
│   │   └── ui/                   ← shadcn-svelte component installs land here
│   ├── hooks/
│   └── server/
│       ├── auth.ts               ← Better Auth config (email/password, drizzle adapter)
│       └── db/
│           ├── index.ts          ← exports `db` (drizzle instance)
│           ├── auth.schema.ts    ← user, session, account, verification tables (Better Auth managed)
│           └── schema.ts         ← app tables: budgetBook, budgetBookMember, category, item, budgetTransaction
└── routes/
    ├── +layout.svelte            ← root layout: imports layout.css, sets favicon
    ├── +page.svelte
    ├── layout.css
    ├── (auth)/
    │   └── login/
    │       ├── +page.svelte      ← unstyled demo form; needs proper styling
    │       └── +page.server.ts   ← signInEmail / signUpEmail actions (redirects to /demo/better-auth — needs updating)
    └── (app)/
        ├── +layout.server.ts     ← EMPTY — needs auth guard (redirect to /login if no session)
        ├── +layout.svelte        ← EMPTY — needs Sidebar + <slot />
        └── [bookId]/             ← TO BE CREATED
            ├── +page.svelte
            ├── +page.server.ts
            └── settings/
                ├── +page.svelte
                └── +page.server.ts
```

---

## Database Schema (`src/lib/server/db/schema.ts`)

```
budgetBook         id (uuid), name, createdBy→user.id, updatedBy→user.id, createdAt, updatedAt
budgetBookMember   bookId→budgetBook.id, userId→user.id, role (owner|editor|viewer)  [PK: bookId+userId]
category           id, bookId→budgetBook.id, name, icon, budgetAmount (decimal 12,2), sortOrder, audit cols
item               id, categoryId→category.id, name, sortOrder, audit cols
budgetTransaction  id, itemId→item.id, amount (decimal 12,2), transactionDate (date), note, audit cols
```

**Cascade deletes:** budgetBook → category → item → budgetTransaction.

---

## Auth Pattern

`hooks.server.ts` calls `auth.api.getSession()` on every request and populates `event.locals.user` and `event.locals.session`.

**Auth guard pattern** (use in `(app)/+layout.server.ts`):

```ts
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	if (!event.locals.user) throw redirect(302, '/login');
	return { user: event.locals.user };
};
```

---

## Key Conventions

### Svelte 5 Runes (always use, never use Svelte 4 syntax)

```svelte
<script lang="ts">
	let { propName }: { propName: string } = $props();
	let count = $state(0);
	let doubled = $derived(count * 2);
</script>
```

### Decimal Parsing (CRITICAL)

Drizzle returns `decimal` columns as **strings**. Always parse before arithmetic:

```ts
// ❌ Bug: "100.00" + "200.00" = "100.00200.00"
// ✅ Correct:
transactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
```

### Import Alias

Use `@/` for imports from `src/lib/`:

```ts
import { db } from '@/server/db';
import { cn } from '@/utils';
```

### Tailwind CSS v4

No `tailwind.config.js`. Config lives in CSS (`@theme { ... }`). Use standard utility classes.

---

## Component Hierarchy (planned)

```
(app)/+layout.svelte
├── Sidebar
│   ├── SidebarBookList        ← "MY BUDGET BOOKS" section
│   ├── SidebarSharedList      ← "SHARED WITH ME" section (books where role=editor|viewer)
│   └── SidebarSettingsLink
└── <slot />
    └── [bookId]/+page.svelte
        ├── PageHeader          ← book title, Month/Year toggle, date picker or "Overview", Share btn
        ├── MonthView           ← active when "Month" tab selected
        │   └── CategoryCard
        │       ├── CategoryHeader   ← icon, name, "$spent / $budget"
        │       ├── ProgressBar
        │       ├── ItemRow          ← click opens TransactionDrawer
        │       └── CategoryFooter   ← "Total Spent"
        ├── YearView            ← active when "Year" tab selected
        │   ├── SpreadsheetToolbar   ← title, Export CSV, + Add Category
        │   └── SpreadsheetTable    ← horizontally scrollable, 12 month columns
        │       ├── ColumnHeaders    ← Category/Item | Jan–Dec (current month highlighted)
        │       ├── CategoryRow      ← bold, monthly totals, + to add item
        │       │   └── ItemRow      ← indented, monthly amounts; click opens TransactionDrawer
        │       │       └── EntryRow ← individual dated entry (e.g. "March 1, 2026 - Bulk Supplies")
        │       └── TotalRow         ← "Total Net Worth Change", dark bg, green text
        └── TransactionDrawer   ← shared slide-in panel (Month + Year views)
            ├── DrawerHeader    ← item name, "BookName • Category" breadcrumb, × close
            ├── DrawerTable     ← DATE | DESCRIPTION | AMOUNT columns
            │   ├── TransactionRow
            │   └── DrawerFooter ← "Total for [Item]" + sum
            └── AddTransactionButton ← sticky bottom, opens inline form / sub-modal
```

---

## Build Order (from PLANNING.md)

1. **[DONE]** DB schema + migrations (`npm run db:push`)
2. **[DONE]** Better Auth setup (hooks, login page actions)
3. **[IN PROGRESS]** Route + layout shell — `(app)/+layout.svelte` with Sidebar + auth guard in `+layout.server.ts`
4. **[TODO]** `[bookId]/+page.server.ts` — load categories + transactions for selected month/year
5. **[TODO]** Dashboard page + components — `PageHeader`, `CategoryCard`, `ProgressBar`, `ItemRow`
6. **[TODO]** `TransactionDrawer` — shared slide-in panel for both Month and Year views
7. **[TODO]** Year view — `SpreadsheetTable` with 12-month columns
8. **[TODO]** Settings page
9. **[TODO]** Login page — proper styling matching design mocks

---

## Dev Commands

```bash
npm run dev           # start dev server
npm run db:start      # start PostgreSQL via Docker Compose
npm run db:push       # push schema changes to DB (no migration files)
npm run db:studio     # Drizzle Studio UI
npm run db:generate   # generate migration SQL files
npm run db:migrate    # run migration files
npm run auth:schema   # regenerate auth.schema.ts from auth.ts config
npm run check         # svelte-check type checking
npm run format        # prettier format
npm run lint          # lint check
```

Environment variables required: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `ORIGIN`.

---

## Design Reference

See `/mocks/` folder for UI screenshots. Key design decisions visible in mocks:

- Sidebar: white, 180px wide, "MY BUDGET BOOKS" and "SHARED WITH ME" sections with blue dot/icon indicators
- Active book: blue filled dot; inactive: grey dot
- Category cards: white rounded cards with icon, name, budget summary, blue progress bar, item rows
- Transaction drawer: slides in from right, white panel with grey header area, table layout
- Year view: sticky left column for Category/Item, horizontal scroll for months, current month column highlighted in bold
- Total row: dark background (`#1a1a2e` or similar), green text for amounts

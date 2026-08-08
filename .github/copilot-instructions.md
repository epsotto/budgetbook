# BudgetBook — Copilot Instructions

## Project Overview

BudgetBook is a personal budgeting web app. Users create **budget books**, define spending **categories** with monthly budgets, track **items** (vendors/payees) per category, and log individual dated **transactions**. There are two main views: a **Month view** (category cards with progress bars) and a **Year view** (spreadsheet-style with 12 month columns).

---

## Tech Stack

| Layer         | Library / Tool                                                            |
| ------------- | ------------------------------------------------------------------------- |
| Framework     | SvelteKit `^2.50` + Svelte `^5.51` — **always use Svelte 5 runes syntax** |
| Language      | TypeScript (strict)                                                       |
| Styling       | Tailwind CSS v4 (no `tailwind.config.js` — config is in CSS `@theme {}`)  |
| UI Components | shadcn-svelte → `src/lib/components/ui/`                                  |
| Icons         | `@lucide/svelte`                                                          |
| ORM           | Drizzle ORM `^0.45` + postgres-js                                         |
| Database      | PostgreSQL (Docker: `npm run db:start`)                                   |
| Auth          | Better Auth `^1.5` — email/password, drizzle adapter                      |
| Utilities     | `cn()` from `src/lib/utils.ts` (clsx + tailwind-merge)                    |
| Path alias    | `@` → `src/lib`                                                           |

---

## Directory Structure

```
src/
├── app.d.ts                      ← App.Locals: { user?, session? }
├── hooks.server.ts               ← populates event.locals.user/session via Better Auth
└── lib/
│   ├── utils.ts                  ← cn(), WithoutChild/WithoutChildren types
│   ├── components/ui/            ← shadcn-svelte installs land here
│   └── server/
│       ├── auth.ts               ← Better Auth config
│       └── db/
│           ├── index.ts          ← exports `db` (drizzle instance)
│           ├── auth.schema.ts    ← user/session tables (Better Auth managed — do not edit manually)
│           └── schema.ts         ← app tables (budgetBook, category, item, budgetTransaction)
└── routes/
    ├── (auth)/login/             ← login page (needs styling)
    └── (app)/
        ├── +layout.server.ts     ← auth guard (currently empty — needs implementation)
        ├── +layout.svelte        ← sidebar shell (currently empty — needs implementation)
        └── [bookId]/             ← to be created: book dashboard
```

---

## Database Tables

```
budgetBook         id (uuid PK), name, createdBy, updatedBy, createdAt, updatedAt
budgetBookMember   bookId, userId, role (owner|editor|viewer)  — PK (bookId, userId)
category           id, bookId, name, icon, budgetAmount (decimal 12,2), sortOrder
item               id, categoryId, name, sortOrder
budgetTransaction  id, itemId, amount (decimal 12,2), transactionDate (date), note
```

All tables have `createdBy`, `updatedBy` (→ user.id), `createdAt`, `updatedAt` audit columns.
Cascade deletes: `budgetBook → category → item → budgetTransaction`.

---

## Critical Rules

### 1. Always use Svelte 5 runes — never Svelte 4 syntax

```svelte
<script lang="ts">
	// ✅ Svelte 5
	let { title }: { title: string } = $props();
	let count = $state(0);
	let doubled = $derived(count * 2);

	// ❌ never use: export let, $: reactive, on:click (use onclick={})
</script>
```

### 2. Decimal columns come back as strings from Drizzle — always parseFloat

```ts
// ❌ Silent bug: "100.00" + "200.00" = "100.00200.00"
// ✅ Correct:
const total = transactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
```

### 3. Auth guard pattern for `(app)/+layout.server.ts`

```ts
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	if (!event.locals.user) throw redirect(302, '/login');
	return { user: event.locals.user };
};
```

### 4. Import alias

```ts
import { db } from '@/server/db'; // → src/lib/server/db
import { cn } from '@/utils'; // → src/lib/utils
import { Button } from '@/components/ui/button';
```

### 5. Tailwind CSS v4 — no config file

Use standard utility classes. Theme customisation goes in a CSS file using `@theme {}`.

---

## Current Build Status

| Step                                          | Status                               |
| --------------------------------------------- | ------------------------------------ |
| DB schema + `npm run db:push`                 | ✅ Done                              |
| Better Auth setup + hooks                     | ✅ Done                              |
| `(app)/+layout.server.ts` auth guard          | ⬜ Empty file — needs implementation |
| `(app)/+layout.svelte` sidebar shell          | ⬜ Empty file — needs implementation |
| `[bookId]/` route + load function             | ⬜ Not created yet                   |
| Dashboard components (CategoryCard, ItemRow…) | ⬜ Not created yet                   |
| TransactionDrawer                             | ⬜ Not created yet                   |
| Year view spreadsheet                         | ⬜ Not created yet                   |
| Settings page                                 | ⬜ Not created yet                   |
| Login page styling                            | ⬜ Unstyled placeholder exists       |

---

## Component Hierarchy (planned)

```
(app)/+layout.svelte
└── Sidebar
    ├── SidebarBookList        ← "MY BUDGET BOOKS" + "SHARED WITH ME"
    └── SidebarSettingsLink

[bookId]/+page.svelte
├── PageHeader                 ← title, Month/Year toggle, date picker, Share btn
├── MonthView
│   └── CategoryCard
│       ├── CategoryHeader     ← icon, name, "$spent / $budget"
│       ├── ProgressBar
│       ├── ItemRow            ← click → opens TransactionDrawer
│       └── CategoryFooter     ← "Total Spent"
├── YearView
│   └── SpreadsheetTable       ← horizontally scrollable, 12 month columns
│       ├── CategoryRow        ← bold totals, + add item
│       │   └── ItemRow        ← monthly totals; click → opens TransactionDrawer
│       │       └── EntryRow   ← individual dated entry
│       └── TotalRow           ← dark bg, green text
└── TransactionDrawer          ← shared by Month + Year views
    ├── DrawerHeader           ← item name, "BookName • Category" breadcrumb, × close
    ├── DrawerTable            ← DATE | DESCRIPTION | AMOUNT
    └── AddTransactionButton   ← sticky bottom
```

---

## Dev Commands

```bash
npm run dev           # start Vite dev server
npm run db:start      # start PostgreSQL via Docker Compose
npm run db:push       # sync schema to DB (no migration files generated)
npm run db:studio     # Drizzle Studio browser UI
npm run db:generate   # generate migration SQL
npm run db:migrate    # run migrations
npm run auth:schema   # regenerate auth.schema.ts from auth.ts
npm run check         # TypeScript + svelte-check
npm run format        # prettier
```

Required env vars: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `ORIGIN`.

---

## Design Mocks Summary

See `/mocks/` for reference screenshots:

- **Sidebar**: white, ~180px, blue dot = active book, grey = inactive, gear icon for Settings
- **Month view**: white category cards, orange/blue category icons, blue progress bar (spent/budget ratio), item rows show total spend, green "Total Spent" footer
- **Year view**: spreadsheet table, sticky left column, current month column bold/highlighted, "+" buttons on rows to add items, TotalRow has dark background with green amounts
- **TransactionDrawer**: right-side slide-in panel, "ItemName Transactions" title, "BookName • Category" subtitle in grey, DATE/DESCRIPTION/AMOUNT table, blue amount text, "Total for [Item]" footer, "Add Transaction" button at bottom

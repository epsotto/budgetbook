# BudgetBook — Project Planning

## Route Structure

```
src/routes/
├── (auth)/
│   └── login/
│       ├── +page.svelte
│       └── +page.server.ts
├── (app)/
│   ├── +layout.svelte          ← shell with sidebar
│   ├── +layout.server.ts       ← auth guard
│   ├── [bookId]/
│   │   ├── +page.svelte        ← dashboard
│   │   ├── +page.server.ts
│   │   └── +layout.svelte      ← optional per-book layout
│   └── settings/
│       ├── +page.svelte
│       └── +page.server.ts
└── +layout.svelte              ← root layout (already exists)
```

`(auth)` and `(app)` are route groups — they don't affect the URL but let you share layouts.

---

## Component Breakdown

```
(app)/+layout.svelte
├── Sidebar
│   ├── SidebarBookList        ← "MY BUDGET BOOKS" section
│   ├── SidebarSharedList      ← "SHARED WITH ME" section
│   └── SidebarSettingsLink
└── <slot />
    └── [bookId]/+page.svelte
        ├── PageHeader          ← title, Month/Year toggle, context btn (date picker or "Overview"), Share btn
        ├── MonthView           ← rendered when "Month" is active
        │   └── CategoryCard    ← repeating card
        │       ├── CategoryHeader  ← icon, name, spent/budget
        │       ├── ProgressBar
        │       ├── ItemRow         ← clickable row; opens TransactionDrawer on click
        │       └── CategoryFooter  ← "Total Spent"
        ├── YearView            ← rendered when "Year" is active
        │   ├── SpreadsheetToolbar  ← "Yearly Budget Spreadsheet" title, Export CSV, + Add Category
        │   └── SpreadsheetTable   ← scrollable horizontally across 12 months
        │       ├── ColumnHeaders  ← Category/Item + Jan–Dec (current month highlighted)
        │       ├── CategoryRow    ← bold, shows monthly totals per category, + to add item
        │       │   └── ItemRow    ← indented item (e.g. Costco), monthly amounts; opens TransactionDrawer on click
        │       │       └── EntryRow   ← individual dated entry (e.g. "March 1, 2026 - Bulk Supplies")
        │       └── TotalRow       ← "Total Net Worth Change", sums per month (dark bg, green text)
        └── TransactionDrawer   ← shared slide-in panel, triggered from ItemRow in either view
            ├── DrawerHeader    ← item name as title, "BookName • Category" breadcrumb, close (×) btn
            ├── DrawerTable     ← columns: DATE, DESCRIPTION, AMOUNT
            │   ├── TransactionRow  ← one row per transaction entry
            │   └── DrawerFooter    ← "Total for [Item]" + summed amount
            └── AddTransactionButton  ← sticky at bottom; opens inline form or sub-modal to add a new transaction
```

---

## Database Schema (rough)

```ts
// src/lib/server/db/schema.ts
budgetBook        // id, name, ownerId
budgetBookMember  // bookId, userId, role  ← for future collaboration
category          // id, bookId, name, icon, budgetAmount (per month)
item              // id, categoryId, name  ← e.g. "Costco", "Maccas"
transaction       // id, itemId, amount, date, note  ← individual dated entries
```

### Decimal Parsing Note

Drizzle returns `decimal` columns (e.g. `amount`, `budgetAmount`) as **strings** in TypeScript, not numbers. Always parse before any math:

```ts
// ❌ String concatenation — silent bug
"100.00" + "200.00" = "100.00200.00"

// ⚠️ Deceptively works — but only by accident
"100.00" * 2 = 200  // * coerces strings to numbers, but relying on this is fragile and unintentional

// ✅ Correct
parseFloat(transaction.amount) + parseFloat(another.amount) // → 300
transactions.reduce((sum, t) => sum + parseFloat(t.amount), 0)
```

`parseFloat` converts back to a JS float (IEEE 754), which can reintroduce rounding errors for very large values or many accumulated operations (e.g. `0.1 + 0.2 → 0.30000000000000004`). For a typical budget app this is acceptable in practice. If precision is critical, use `decimal.js`:

```ts
import Decimal from 'decimal.js';
const total = transactions.reduce((sum, t) => sum.plus(t.amount), new Decimal(0));
total.toFixed(2) // → "300.00"
```

---

The three-level hierarchy (category → item → transaction) mirrors both views:

- **Month view**: item rows inside a category card, transactions expand under each item
- **Year view**: category rows → item rows → dated entry rows across 12 columns

---

## Build Order

1. **Route + layout shell** — `(app)/+layout.svelte` with sidebar, auth guard in `+layout.server.ts`
2. **DB schema + migrations** — define tables above, run `npm run db:push`
3. **`[bookId]/+page.server.ts`** — load function fetching categories + transactions
4. **Dashboard page + components** — `CategoryCard`, `ProgressBar`, `ItemRow`, `PageHeader`
5. **TransactionDrawer** — shared panel used by both Month and Year views to view/add transactions
6. **Settings page** — user profile, preferences
7. **Login page** — style the existing demo login page properly

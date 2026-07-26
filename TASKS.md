# BudgetBook — Task Breakdown

> Reference: [PLANNING.md](PLANNING.md) · Mocks: `mocks/dashboard_screen.png`, `mocks/yearly_view_screen.png`, `mocks/transaction_drawer_screen.png`

---

## Milestone 0 — Environment & Better Auth Bootstrap

> Most of `auth.ts` and `hooks.server.ts` are already wired up. These are the remaining one-time setup steps.

### Environment variables

- [x] Create `.env` (gitignored) with:
  - `DATABASE_URL` — Postgres connection string matching `compose.yaml`
  - `BETTER_AUTH_SECRET` — random secret (e.g. `openssl rand -hex 32`)
  - `ORIGIN` — e.g. `http://localhost:5173` for local dev

### Auth schema generation

- [x] Run `npm run auth:schema` to generate Better Auth tables into `src/lib/server/db/auth.schema.ts` (currently still a placeholder)
- [x] Re-export `auth.schema.ts` from `src/lib/server/db/schema.ts` (already has `export * from './auth.schema'` — verify it resolves after generation)
- [x] Run `npm run db:push` to apply the generated auth tables (`user`, `session`, `account`, `verification`) to Postgres

### Optional auth providers

- [ ] To add Google OAuth: install `@better-auth/oauth-providers`, add `socialProviders: { google: { ... } }` to `auth.ts`, add `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` to `.env`

### Verify

- [x] Start the app (`npm run dev`) and confirm `/api/auth/sign-in/email` responds
- [x] Log in via the existing demo login page and confirm `event.locals.user` / `event.locals.session` are populated

---

## Milestone 1 — Database Schema & Migrations

- [x] Replace placeholder `task` table in `src/lib/server/db/schema.ts` with the full app schema
- [x] Define `budgetBook` table — `id`, `name`, `ownerId`, `createdAt`, `updatedAt`
- [x] Define `budgetBookMember` table — `bookId`, `userId`, `role` (`owner | editor | viewer`)
- [x] Define `category` table — `id`, `bookId`, `name`, `icon`, `budgetAmount` (monthly ceiling), `sortOrder`
- [x] Define `item` table — `id`, `categoryId`, `name`, `sortOrder`, `createdBy` (userId), `createdAt`, `updatedBy` (userId), `updatedAt`
- [x] Define `transaction` table — `id`, `itemId`, `amount`, `date`, `note`, `createdBy` (userId), `createdAt`, `updatedBy` (userId), `updatedAt`
- [x] Add foreign key relations and indexes (bookId, categoryId, itemId, date, createdBy)
- [x] `createdBy` / `updatedBy` on `item` and `transaction` reference the auth `user` table, enabling per-user attribution in shared books
- [x] Run `npm run db:push` to apply schema to local Postgres
- [x] Verify schema with `npm run db:studio`

---

## Milestone 2 — Route & Layout Shell

### Route groups

- [x] Create `src/routes/(auth)/` group directory
- [x] Move existing `demo/better-auth/login/` pages into `src/routes/(auth)/login/`
- [x] Create `src/routes/(app)/` group directory

### Auth guard

- [x] Create `src/routes/(app)/+layout.server.ts` — redirect to `/login` if no session
- [x] Create `src/routes/(app)/+layout.svelte` — renders Sidebar + `<slot />`

### Root cleanup

- [x] Remove `/demo` routes once login is migrated
- [x] Update root `+layout.svelte` if needed (fonts, global CSS resets)

---

## Milestone 3 — Sidebar

> Reference: left panel in `mocks/dashboard_screen.png`

### Components (`src/lib/components/sidebar/`)

- [x] `Sidebar.svelte` — fixed left panel, dark background, full height
- [x] `SidebarBookList.svelte` — "MY BUDGET BOOKS" section heading + list of book links; active book highlighted
- [x] `SidebarSharedList.svelte` — "SHARED WITH ME" section heading + list
- [x] `SidebarSettingsLink.svelte` — settings icon + label, links to `/settings`
- [x] `SidebarUserAvatar.svelte` — bottom of sidebar, shows avatar + name, logout button

### Wiring

- [ ] Load user's budget books in `(app)/+layout.server.ts` and pass to layout
- [ ] Sidebar links navigate to `/<bookId>`

---

## Milestone 4 — Book Dashboard (Month View)

> Reference: `mocks/dashboard_screen.png`

### Server

- [ ] Create `src/routes/(app)/[bookId]/+page.server.ts`
  - [ ] Validate `bookId`, check membership
  - [ ] Load categories + items + transactions for the selected month/year
  - [ ] Return typed `PageData`

### Page

- [ ] Create `src/routes/(app)/[bookId]/+page.svelte`
  - [ ] Conditionally render `<MonthView>` or `<YearView>` based on active toggle

### `PageHeader` component

> Top bar visible in both views

- [ ] Book title on the left
- [ ] Month/Year toggle (pill/tab switcher)
- [ ] Context button: date picker (Month view) or "Overview" (Year view)
- [ ] "Share" button (opens share modal — deferred to Milestone 8)

### `MonthView` component (`src/lib/components/month-view/`)

- [ ] `MonthView.svelte` — scrollable list of `CategoryCard`s

### `CategoryCard` component

- [ ] `CategoryCard.svelte` — card wrapper
- [ ] `CategoryHeader.svelte` — category icon (Lucide), name, "spent / budget" amounts
- [ ] `ProgressBar.svelte` — coloured fill based on spent ÷ budget ratio; turns red when over budget
- [ ] `ItemRow.svelte` — item name on left, total amount on right; clicking opens `TransactionDrawer`
- [ ] `CategoryFooter.svelte` — "Total Spent" label + summed amount for the card

---

## Milestone 5 — Transaction Drawer

> Reference: `mocks/transaction_drawer_screen.png`

### Component (`src/lib/components/transaction-drawer/`)

- [ ] `TransactionDrawer.svelte` — slide-in panel from the right, backdrop overlay
- [ ] `DrawerHeader.svelte` — item name as title, "BookName • Category" breadcrumb, close (×) button
- [ ] `DrawerTable.svelte` — table with columns DATE, DESCRIPTION, AMOUNT
- [ ] `TransactionRow.svelte` — one row per transaction; inline edit/delete on hover
- [ ] `DrawerFooter.svelte` — "Total for [Item]" label + summed amount
- [ ] `AddTransactionButton.svelte` — sticky button at the bottom of the drawer

### Add Transaction form

- [ ] Inline form (within drawer) with fields: date, description, amount
- [ ] Form action in `[bookId]/+page.server.ts` — `addTransaction`
- [ ] Optimistic UI update after submit (or full page invalidation)
- [ ] Form action — `deleteTransaction`
- [ ] Form action — `editTransaction` (inline row editing)

---

## Milestone 6 — Year View

> Reference: `mocks/yearly_view_screen.png`

### Components (`src/lib/components/year-view/`)

- [ ] `YearView.svelte` — horizontally scrollable container
- [ ] `SpreadsheetToolbar.svelte` — "Yearly Budget Spreadsheet" title, Export CSV button, "+ Add Category" button
- [ ] `SpreadsheetTable.svelte` — CSS grid / table for the 12-month layout
- [ ] `ColumnHeaders.svelte` — "Category / Item" fixed column + Jan–Dec headers; current month visually highlighted
- [ ] `CategoryRow.svelte` — bold row showing monthly category totals; "+" button to add an item
- [ ] `ItemRow.svelte` (year variant) — indented under category, monthly amounts per column; opens `TransactionDrawer` on click
- [ ] `EntryRow.svelte` — optional expandable sub-row showing individual dated entries (e.g. "March 1, 2026 – Bulk Supplies")
- [ ] `TotalRow.svelte` — dark background, green text; sums all categories per month

### Server

- [ ] Load full year of transactions in `+page.server.ts` when year view is active
- [ ] Group/aggregate by category → item → month in the load function

### Actions

- [ ] Export CSV — serialize year data to CSV and trigger download
- [ ] "+ Add Category" — form action `createCategory`
- [ ] "+ Add Item" — form action `createItem` (triggered per category row)

---

## Milestone 7 — Settings Page

### Database & Schema Setup

- [ ] Define `userSetting` table in `src/lib/server/db/schema.ts` — `id`, `userId`, `key`, `value`, `updatedAt`
- [ ] Run `npm run db:push` to apply the settings schema changes

### Server-Side Implementation

- [ ] Create `src/routes/(app)/settings/+page.server.ts`
  - [ ] Load user settings config, user profile, books, categories, and establishments/items
  - [ ] Implement `updateSettingsConfig` form action to save user preferences in `userSetting`
  - [ ] Implement category management form actions (create, update budget/icon, delete)
  - [ ] Implement establishment/provider management form actions (create, edit name, change assigned category)
  - [ ] Implement account actions: update name/contact info, change password, delete account
- [ ] Implement `deleteAccount` action with cascading deletion across auth and database tables

### User Interface Layout (`src/routes/(app)/settings/+page.svelte`)

- [ ] Build multi-tab settings navigation (General Settings, Categories, Establishments, Account, Books)
- [ ] **General Settings Tab**: UI to manage application settings config (theme, default currency, etc.)
- [ ] **Categories Tab**: Edit expense category names, monthly budget ceilings, and Lucide icons
- [ ] **Establishments/Providers Tab**: Manage known establishments/providers and assign/select which category they map to (e.g. power, internet, groceries)
- [ ] **Account Tab**: Edit name, password, and contact info (email); include a destructive "Delete Account" action with a confirmation dialog
- [ ] **Budget Book Management**: Rename, delete, and manage roles for budget books (owner/editor/viewer)

---

## Milestone 8 — Login Page Polish

- [ ] Style `(auth)/login/+page.svelte` to match app design (dark theme, centered card)
- [ ] Add app logo / wordmark
- [ ] "Sign in with Google" or email+password toggle (based on existing Better Auth config)
- [ ] Redirect to last visited book after login; fall back to first book or onboarding

---

## Milestone 9 — Onboarding Flow

- [ ] Detect new user with no budget books after login
- [ ] Redirect to `/new` or show modal: "Create your first budget book"
- [ ] Form action `createBudgetBook` — inserts book + adds owner member row
- [ ] After creation, redirect to `/<newBookId>`

---

## Milestone 10 — Collaboration (Deferred)

- [ ] Share modal — input email, select role (editor/viewer), send invite
- [ ] Server action `inviteMember` — creates `budgetBookMember` row with pending status
- [ ] Accept/decline invite page or email link
- [ ] `SidebarSharedList` shows books where user is not the owner
- [ ] Role-based access control: viewers cannot add/edit/delete transactions

---

## Cross-Cutting Concerns

### Error handling & loading states

- [ ] Skeleton loaders for `CategoryCard` and `SpreadsheetTable` while data loads
- [ ] Empty state for a book with no categories yet
- [ ] Error boundary / `+error.svelte` for `(app)` routes

### Accessibility

- [ ] Focus trap in `TransactionDrawer`
- [ ] Keyboard navigation for sidebar book list
- [ ] ARIA labels on icon-only buttons (close, add, export)
- [ ] Colour contrast check on `ProgressBar` states (normal / warning / over-budget)

### Mobile / Responsive

- [ ] Sidebar collapses to bottom nav or hamburger on small screens
- [ ] `TransactionDrawer` takes full screen width on mobile
- [ ] Year view horizontal scroll works on touch devices

### Testing

- [ ] Unit tests for amount aggregation helpers (category totals, month sums)
- [ ] Integration tests for `addTransaction`, `createCategory`, `createItem` form actions
- [ ] E2E smoke test: login → create book → add category → add transaction → verify in drawer

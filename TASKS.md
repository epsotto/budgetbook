# BudgetBook — Task Breakdown

> Reference: [PLANNING.md](PLANNING.md) · Mocks: `mocks/dashboard_screen.png`, `mocks/yearly_view_screen.png`, `mocks/transaction_drawer_screen.png`

---

## Milestone 0 — Environment & Better Auth Bootstrap

> Most of `auth.ts` and `hooks.server.ts` are already wired up. These are the remaining one-time setup steps.

### Environment variables
- [ ] Create `.env` (gitignored) with:
  - `DATABASE_URL` — Postgres connection string matching `compose.yaml`
  - `BETTER_AUTH_SECRET` — random secret (e.g. `openssl rand -hex 32`)
  - `ORIGIN` — e.g. `http://localhost:5173` for local dev

### Auth schema generation
- [ ] Run `npm run auth:schema` to generate Better Auth tables into `src/lib/server/db/auth.schema.ts` (currently still a placeholder)
- [ ] Re-export `auth.schema.ts` from `src/lib/server/db/schema.ts` (already has `export * from './auth.schema'` — verify it resolves after generation)
- [ ] Run `npm run db:push` to apply the generated auth tables (`user`, `session`, `account`, `verification`) to Postgres

### Optional auth providers
- [ ] To add Google OAuth: install `@better-auth/oauth-providers`, add `socialProviders: { google: { ... } }` to `auth.ts`, add `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` to `.env`

### Verify
- [ ] Start the app (`npm run dev`) and confirm `/api/auth/sign-in/email` responds
- [ ] Log in via the existing demo login page and confirm `event.locals.user` / `event.locals.session` are populated

---

## Milestone 1 — Database Schema & Migrations

- [ ] Replace placeholder `task` table in `src/lib/server/db/schema.ts` with the full app schema
- [ ] Define `budgetBook` table — `id`, `name`, `ownerId`, `createdAt`, `updatedAt`
- [ ] Define `budgetBookMember` table — `bookId`, `userId`, `role` (`owner | editor | viewer`)
- [ ] Define `category` table — `id`, `bookId`, `name`, `icon`, `budgetAmount` (monthly ceiling), `sortOrder`
- [ ] Define `item` table — `id`, `categoryId`, `name`, `sortOrder`, `createdBy` (userId), `createdAt`, `updatedBy` (userId), `updatedAt`
- [ ] Define `transaction` table — `id`, `itemId`, `amount`, `date`, `note`, `createdBy` (userId), `createdAt`, `updatedBy` (userId), `updatedAt`
- [ ] Add foreign key relations and indexes (bookId, categoryId, itemId, date, createdBy)
- [ ] `createdBy` / `updatedBy` on `item` and `transaction` reference the auth `user` table, enabling per-user attribution in shared books
- [ ] Run `npm run db:push` to apply schema to local Postgres
- [ ] Verify schema with `npm run db:studio`

---

## Milestone 2 — Route & Layout Shell

### Route groups

- [ ] Create `src/routes/(auth)/` group directory
- [ ] Move existing `demo/better-auth/login/` pages into `src/routes/(auth)/login/`
- [ ] Create `src/routes/(app)/` group directory

### Auth guard

- [ ] Create `src/routes/(app)/+layout.server.ts` — redirect to `/login` if no session
- [ ] Create `src/routes/(app)/+layout.svelte` — renders Sidebar + `<slot />`

### Root cleanup

- [ ] Remove `/demo` routes once login is migrated
- [ ] Update root `+layout.svelte` if needed (fonts, global CSS resets)

---

## Milestone 3 — Sidebar

> Reference: left panel in `mocks/dashboard_screen.png`

### Components (`src/lib/components/sidebar/`)

- [ ] `Sidebar.svelte` — fixed left panel, dark background, full height
- [ ] `SidebarBookList.svelte` — "MY BUDGET BOOKS" section heading + list of book links; active book highlighted
- [ ] `SidebarSharedList.svelte` — "SHARED WITH ME" section heading + list
- [ ] `SidebarSettingsLink.svelte` — settings icon + label, links to `/settings`
- [ ] `SidebarUserAvatar.svelte` — bottom of sidebar, shows avatar + name, logout button

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

- [ ] Create `src/routes/(app)/settings/+page.server.ts` — load user profile
- [ ] Create `src/routes/(app)/settings/+page.svelte`
  - [ ] Display name / email fields with update form action
  - [ ] Change password section
  - [ ] Delete account (with confirmation)
  - [ ] Budget book management: rename, delete, change member roles

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

# BudgetBook — Task Breakdown

> Current status overview: [PROGRESS.md](PROGRESS.md). Reference: [PLANNING.md](PLANNING.md) · Mocks: `mocks/dashboard_screen.png`, `mocks/yearly_view_screen.png`, `mocks/transaction_drawer_screen.png`

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

- [x] Create the `(landing)` route group for public pages, including login and signup
- [x] Create `src/routes/(app)/` group directory

### Auth guard

- [x] Create `src/routes/(app)/+layout.server.ts` — redirect to `/login` if no session
- [x] Create `src/routes/(app)/+layout.svelte` — renders Sidebar + child route content

### Root cleanup

- [x] Keep the root layout and global CSS in place for the route groups

---

## Milestone 3 — Sidebar

> Reference: left panel in `mocks/dashboard_screen.png`

### Components (`src/lib/components/sidebar/`)

- [x] `Sidebar.svelte` — full-height sidebar shell
- [x] `SidebarBookList.svelte` — "MY BUDGET BOOKS" section UI (currently placeholder books)
- [x] `SidebarSharedList.svelte` — "SHARED WITH ME" section UI
- [x] `SidebarSettingsLink.svelte` — settings icon + label, links to `/settings`
- [x] `SidebarUserAvatar.svelte` — user avatar area
- [x] `SidebarSignout.svelte` — sign-out control

### Wiring

- [ ] Load user's budget books in `(app)/+layout.server.ts` and pass to layout
- [ ] Replace placeholder book entries and `#` links with database-backed navigation to a selected book

---

## Milestone 4 — Book Dashboard (Month View)

> Reference: `mocks/dashboard_screen.png`

> The current `/dashboard` is a client-side prototype with seeded sample data. The intended per-book route and database-backed page are not implemented yet.

### Server

- [ ] Create `src/routes/(app)/[bookId]/+page.server.ts`
  - [ ] Validate `bookId`, check membership
  - [ ] Load categories + merchants + transactions for the selected month/year
  - [ ] Return typed `PageData`

### Page

- [ ] Create `src/routes/(app)/[bookId]/+page.svelte`
  - [ ] Conditionally render `<MonthView>` or `<YearView>` based on active toggle

### `PageHeader` component

> Top bar visible in both views

- [x] Book title on the left
- [x] Month/Year toggle (pill/tab switcher)
- [x] Month/year date picker
- [ ] "Share" button (opens share modal — deferred to Milestone 8)

### `MonthView` component (`src/lib/components/dashboard/month-view/`)

- [x] `MonthView.svelte` — category navigation and scrollable list of category sections

### `CategoryCard` component

- [x] `CategoryCard.svelte` — category card with icon, budget/spend summary, progress indicator, merchant rows, and add-item UI
- [x] Clicking a merchant row opens the transaction drawer
- [ ] Persist category and merchant data; replace the current in-memory sample data and draft-only item creation

---

## Milestone 5 — Transaction Drawer

> Reference: `mocks/transaction_drawer_screen.png`

### Component (`src/lib/components/dashboard/month-view/TransactionDrawer.svelte`)

- [x] Slide-in drawer with header, book/category context, transaction list, total, and close control
- [x] Add Transaction button switches the drawer into an inline entry form
- [x] Validate description, positive amount, and date before accepting an entry
- [x] Cancel the draft, and confirm before discarding it when closing the drawer or pressing Escape

### Add Transaction form

- [x] Inline form within the drawer with date, description, and amount fields
- [x] Pass a valid new transaction to the dashboard and display it in the current in-memory session
- [ ] Form action in `[bookId]/+page.server.ts` — `addTransaction`; persist the transaction and refresh/reconcile the UI from saved data
- [ ] Form action — `deleteTransaction`
- [ ] Form action — `editTransaction` (inline row editing)

> The current add flow is client-side only: submitted transactions are not saved to the database and are lost on reload.

---

## Milestone 6 — Year View

> Reference: `mocks/yearly_view_screen.png`

### Components (`src/lib/components/year-view/`)

- [ ] `YearView.svelte` — implement and connect a horizontally scrollable year view (current component is empty)
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

### Security / crypto (low priority — noted, not scheduled)

- [ ] Replace or harden `crypto.randomUUID()` usage in `Dashboard.svelte`, `TransactionDrawer.svelte`, and `CategorySections.svelte` — it requires a secure context (HTTPS or `localhost`) and throws over plain HTTP on other hosts. Add a fallback ID generator or enforce HTTPS before deploying anywhere non-local.
- [ ] Do not add the npm `crypto` package (v1.0.1, deprecated name-holding stub with no code); keep using the built-in Web Crypto API in the browser and `node:crypto` on the server.

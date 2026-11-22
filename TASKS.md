# BudgetBook — Task Breakdown

> Current status overview: [PROGRESS.md](PROGRESS.md). Reference: [PLANNING.md](PLANNING.md) · Mocks: `mocks/dashboard_screen.png`, `mocks/yearly_view_screen.png`, `mocks/transaction_drawer_screen.png`, `mocks/html mocks/settings_page.html`

> **Status snapshot (2026-11-13):** Milestones 0–2 complete. Milestones 3–6 have their UI built but still run on in-memory sample data — the server layer is the critical path. Milestones 7–10 not started. Details in [PROGRESS.md](PROGRESS.md).

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
- [x] Define `budgetBook` table — `id`, `name`, `createdBy`, `createdAt`, `updatedBy`, `updatedAt` (ownership comes from `budgetBookMember.role`, there is no separate `ownerId`)
- [x] Define `budgetBookMember` table — `bookId`, `userId`, `role` (`owner | editor | viewer`)
- [x] Define `category` table — `id`, `bookId`, `name`, `icon`, `budgetAmount` (monthly ceiling), `sortOrder`
- [x] Define `item` table (named `merchant` in the actual schema) — `id`, `categoryId`, `name`, `sortOrder`, `createdBy` (userId), `createdAt`, `updatedBy` (userId), `updatedAt`
- **Merchant scope:** a merchant row belongs to exactly one category. The same merchant name can appear in several categories as separate rows — Pak'nSave under Food for groceries and under Transportation for petrol. There is no global merchant registry and no merchant→category mapping table.
- [x] Define `transaction` table (named `budgetTransaction` / `budget_transaction`) — `id`, `itemId`, `amount`, `transactionDate`, `note`, `createdBy` (userId), `createdAt`, `updatedBy` (userId), `updatedAt`
- [x] Add foreign key relations and indexes (bookId, categoryId, itemId, date, createdBy) — FKs and indexes are in place; no Drizzle `relations()` helpers for app tables yet
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
- [x] `SidebarBookList.svelte` — "MY BUDGET BOOKS" section UI (backed by the in-memory `SAMPLE_BOOKS` store)
- [x] `SidebarSharedList.svelte` — "SHARED WITH ME" section UI (still three hardcoded placeholder entries)
- [x] `SidebarSettingsLink.svelte` — settings icon + label, links to `/settings`
- [x] `SidebarUserAvatar.svelte` — user avatar area
- [x] `SidebarSignout.svelte` — sign-out control

### Wiring

- [x] Load user's budget books in `(app)/+layout.server.ts` and pass to layout
- [x] Replace placeholder book entries and `#` links with database-backed navigation to a selected book
- [ ] Point `SidebarUserAvatar` at `/settings/profile` — the account nav button deep-links to the Profile tab inside Settings. `SidebarSettingsLink` keeps opening `/settings`, which defaults to Category Library.

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
  - [x] Conditionally render `<MonthView>` or `<YearView>` based on active toggle — implemented today in `src/lib/components/dashboard/Dashboard.svelte`, rendered from `/dashboard`; still needs moving under the `[bookId]` route

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
- [x] Edit an existing transaction from the drawer (client-side, in-memory)
- [x] Delete a transaction from the drawer with a confirmation dialog (client-side, in-memory)
- [ ] Form action in `[bookId]/+page.server.ts` — `addTransaction`; persist the transaction and refresh/reconcile the UI from saved data
- [ ] Form action — `deleteTransaction`
- [ ] Form action — `editTransaction` (inline row editing)

> The add/edit/delete flow is client-side only: changes are not saved to the database and are lost on reload.

---

## Milestone 6 — Year View

> Reference: `mocks/yearly_view_screen.png`

### Components (`src/lib/components/year-view/`)

- [x] `YearView.svelte` — implement and connect a horizontally scrollable year view
- [x] `SpreadsheetToolbar.svelte` — "Yearly Budget Spreadsheet" title, Export CSV button, "+ Add Category" button
- [x] `SpreadsheetTable.svelte` — CSS grid / table for the 12-month layout
- [x] `ColumnHeaders.svelte` — "Category / Item" fixed column + Jan–Dec headers; current month visually highlighted
- [x] `CategoryRow.svelte` — bold row showing monthly category totals; "+" button to add an item
- [x] `ItemRow.svelte` (year variant) — indented under category, monthly amounts per column; opens `TransactionDrawer` on click
- [x] `EntryRow.svelte` — optional expandable sub-row showing individual dated entries (e.g. "March 1, 2026 – Bulk Supplies")
- [x] `TotalRow.svelte` — dark background, green text; sums all categories per month

> The year view currently reads from the same in-memory sample data as the month view. Category and item creation are client-side only until the server actions below are implemented.

### Server

- [ ] Load full year of transactions in `+page.server.ts` when year view is active
- [ ] Group/aggregate by category → item → month in the load function

### Actions

- [x] Export CSV — serialize year data to CSV and trigger download
- [x] "+ Add Category" UI — inline name/budget form, wired to in-memory data
- [x] "+ Add Item" UI — per-category-row add flow, wired to in-memory data
- [ ] "+ Add Category" — form action `createCategory`
- [ ] "+ Add Item" — form action `createItem` (triggered per category row)

---

## Milestone 7 — Settings Page

> Reference: `mocks/html mocks/settings_page.html`

### Navigation contract

- The sidebar keeps both entry points exactly as mocked: the **gear** (`SidebarSettingsLink`) opens `/settings`; the **account button** (`SidebarUserAvatar`, labelled with the user's name) deep-links to `/settings/profile`.
- Settings uses nested routes, so the account entry is a real deep link rather than client-side tab state: `/settings/profile`, `/settings/categories`, `/settings/localisation`, `/settings/notifications`.
- `/settings` redirects to `/settings/categories` (the mock's active tab). `/profile` redirects to `/settings/profile`; the placeholder route is removed.
- The settings rail mirrors the mock's three items. Profile is a fourth tab, reachable from the sidebar account button and from an account chip pinned to the bottom of the settings rail.
- Settings renders its own rail instead of the app sidebar on `/settings/*`; the wordmark links back to the active book.
- Mobile bottom nav keeps the mock's three icons. Profile is reached from the account button, not a fourth nav item.

### Tab scope

- **Profile** — identity, security, data export, and account deletion.
- **Category Library** — categories for one book, plus that book's budget rules.
- **Localisation** — currency, region, timezone, formats, week start, theme, and density.
- **Notifications** — delivery channel, digest frequency, and alert types.

### Database & Schema Setup

- [ ] Define `userSetting` as a typed table with one row per user (`userId` PK/FK → `user.id`, cascade on delete) instead of a generic key/value store:
  - `currency` (ISO 4217), `locale`, `timeZone`, `dateFormat`, `timeFormat`, `numberFormat`, `weekStart` (0–6)
  - `theme` (`light | dark | system`), `density` (`comfortable | compact`)
  - `emailNotifications` (bool), `digestFrequency` (`off | daily | weekly`), `notifyOverBudget` (bool), `notifyAtPercent` (int, default 80)
  - `updatedAt`
- [ ] Make `userId` unique. Create the row with defaults on first visit to Settings.
- [ ] Add `category.color` — a palette key backed by an enum shared with the UI, not a hex string. The TS type already carries `iconColor` (`src/lib/types/Settings/category.ts`); align it with the schema.
- [ ] Add `category.isArchived` (bool, default false). Archiving is the default destructive action; the row stays in the DB.
- [ ] Add to `budgetBook`: `isArchived` (bool, default false), `budgetPeriodStartDay` (int, 1–28, default 1), `carryOverEnabled` (bool, default false), `startingBalance` (decimal 12,2, default 0). `startingBalance` anchors the year view's "Total Net Worth Change".
- [ ] Stay single-currency: one `currency` per user, no FX and no per-book currency override.
- [ ] Run `npm run db:push` and verify in `npm run db:studio`.

### Server-Side Implementation

- [ ] Create `src/routes/(app)/settings/+layout.server.ts` — load the user, the `userSetting` row, books (including archived), and the active book. Return typed `LayoutData`.
- [ ] `src/routes/(app)/settings/profile/+page.server.ts`
  - [ ] `updateProfile` — first/last name, email (Better Auth change-email flow)
  - [ ] `changePassword`
  - [ ] `revokeOtherSessions` — list `session` rows and sign out other devices
  - [ ] `exportAccountData` — full export (books, categories, merchants, transactions, settings) as JSON/CSV zip
  - [ ] `deleteAccount` — confirmation, export prompt first, cascade across auth and app tables
- [ ] `src/routes/(app)/settings/categories/+page.server.ts`
  - [ ] `createCategory`, `updateCategory` (name, icon, color, monthly cap)
  - [ ] `archiveCategory` / `restoreCategory`
  - [ ] `reorderCategories` — persist `sortOrder`
  - [ ] `updateBookBudgetRules` — period start day, carryover, starting balance; owner-only
  - [ ] Permanent delete stays an explicit secondary action with confirmation; archive is the default
- [ ] `src/routes/(app)/settings/localisation/+page.server.ts` — `updateLocalisation` for currency, region, timezone, formats, week start, theme, density
- [ ] `src/routes/(app)/settings/notifications/+page.server.ts` — `updateNotifications` for channel, frequency, alert toggles
- [ ] Validate every action server-side. Respect `budgetBookMember.role` for category and budget-rule writes once role enforcement lands in Milestone 10 (viewers read-only).
- [ ] Notification delivery is blocked on an email transport: `src/lib/server/auth.ts` currently runs `emailAndPassword` with no provider configured. Wire SMTP/API before promising any email.

### User Interface Layout

- [ ] `src/routes/(app)/settings/+layout.svelte` — the mock's rail, active states, and `SETTINGS / <TAB>` breadcrumb.
- [ ] `src/routes/(app)/settings/+page.svelte` — redirect to `/settings/categories`.
- [ ] Suppress the app sidebar on `/settings/*` so the settings rail does not nest inside it.
- [ ] **Profile tab** — name/email/password forms, session list with "sign out other devices", data export, delete-account dialog in a visually separated danger zone (tonal separation, not a 1px border, per `DESIGN.md`).
- [ ] **Category Library tab** — book selector at the top (defaults to the active book); category grid per the mock; create/edit sheet with name, Lucide icon, preset color swatch, and monthly cap; archive/restore; "Show archived" toggle.
- [ ] **Category Library — Budget rules** — period start day, carryover toggle, starting balance. Book-level, but grouped here because this is the book-scoped tab.
- [ ] **Color choice** — roughly eight preset swatches mapped to contrast-safe icon/background pairs in light and dark. No free-form hex picker: it breaks the tonal palette and produces unreadable icons.
- [ ] **Localisation tab** — currency, region (sets defaults), timezone, date format, 12/24h time, number format with a live preview, week start, theme, density. Theme and density sit here for now so we avoid a fifth tab; split into Appearance if this section grows.
- [ ] **Language** — English only, shown read-only. No language dropdown until translations exist.
- [ ] **Notifications tab** — email channel, digest frequency, over-budget / approaching-budget / weekly-summary toggles. Leave per-category granularity and quiet hours out until delivery works.
- [ ] **Archive behavior** — archived categories are hidden from month and year views, excluded from totals and new entries, and still show in historical exports. Archived books drop out of the sidebar's active list and can be restored.

### Out of scope (deliberately)

- **Merchant → category mapping.** A merchant row already belongs to exactly one category. The same merchant name can appear in several categories as separate rows — Pak'nSave under Food for groceries and under Transportation for petrol. No global merchant registry, no mapping table, no Establishments/Providers tab.
- **Multi-currency / FX**, **free-form color picker**, **per-category notification matrix**, **language switcher**, **2FA**, **quiet hours**.
- **Book management as a Settings tab.** Rename/archive/delete stays in the sidebar; members and roles belong to the Share modal (Milestone 10).

---

## Milestone 8 — Login Page Polish

- [x] Style `(landing)/login/+page.svelte` to match app design (centered card using design tokens). Note: there is no `(auth)` route group; login lives under `(landing)`
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
- [x] Keyboard navigation for sidebar book list — ArrowUp/ArrowDown/Home/End implemented in `SidebarBookList.svelte`
- [x] ARIA labels on icon-only buttons (close, add, export) — present on sidebar add/edit/delete, drawer close, and view toggles; re-audit as new icon buttons are added
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

# BudgetBook — Progress

> Last updated: **2026-11-13**. Task-level detail lives in [TASKS.md](TASKS.md). Product/architecture reference: [PLANNING.md](PLANNING.md).

## TL;DR

- The **UI is largely built**: sidebar, month view, year view, transaction drawer, CSV export, and the login/signup screens all render and work.
- **Nothing is persisted.** The dashboard, sidebar books, and transactions all read from in-memory sample data (`src/lib/data/sample-*`, `src/lib/stores/budget-books.svelte.ts`). The database tables exist but are empty.
- **Only two server actions exist**: `login` and `signup`. Every create/edit/delete in the app is client-side only.
- **The critical path is the server layer**: a `[bookId]` route, load functions, and form actions. Milestones 4–6 are all blocked on this.

## Milestone status

| #   | Milestone                 | Status                | Notes                                                                                                                                                     |
| --- | ------------------------- | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0   | Environment & Better Auth | ✅ Complete           | `.env`, generated auth schema, DB push, session guard all working. Optional Google OAuth not configured.                                                  |
| 1   | Database schema           | ✅ Complete           | All app tables exist and are pushed to Postgres. Some naming differs from TASKS.md (see below).                                                           |
| 2   | Route & layout shell      | ✅ Complete           | `(landing)` + `(app)` groups with a session guard.                                                                                                        |
| 3   | Sidebar                   | 🟡 UI done, not wired | All six components built. Book list is driven by `SAMPLE_BOOKS`; shared list is hardcoded; every link points at `/dashboard`.                             |
| 4   | Month dashboard           | 🟡 UI done, no server | `Dashboard.svelte` renders month/year and is mounted at `/dashboard`. No `[bookId]` route; `dashboard/+page.server.ts` is empty. Share button is a no-op. |
| 5   | Transaction drawer        | 🟡 UI done, no server | Add, edit, and delete work in-memory. No form actions, so changes are lost on reload.                                                                     |
| 6   | Year view                 | 🟡 UI done, no server | Full spreadsheet layout, CSV export, client-side add category/item. No year load/aggregation and no `createCategory`/`createItem` actions.                |
| 7   | Settings page             | 🔴 Not started        | `settings/+page.svelte` is a placeholder. No `userSetting` table.                                                                                         |
| 8   | Login polish              | 🟡 Partial            | Login is a styled centered card. Missing: logo/wordmark, Google toggle, redirect-to-last-book.                                                            |
| 9   | Onboarding                | 🔴 Not started        | No new-user detection, no `createBudgetBook` action, no `/new` route.                                                                                     |
| 10  | Collaboration             | ⏸ Deferred            | No share modal, invites, or role enforcement.                                                                                                             |

Legend: ✅ complete · 🟡 partial · 🔴 not started · ⏸ deferred

## What actually works today

- Email/password login and signup via Better Auth; `event.locals.user` / `event.locals.session` populate correctly.
- Authenticated `(app)` layout redirects to `/login` when there is no session.
- Sidebar: add/rename/delete books (in memory), keyboard navigation (Arrow keys, Home/End), active-book highlight.
- Month view: category cards, budget progress, merchant rows, category jump bar.
- Year view: 12-month grid, category/item/entry/total rows, current-month highlight, CSV export.
- Transaction drawer: view transactions, add, inline edit, delete with confirmation, discard-changes prompt.
- `npm run check` → **0 errors, 5 warnings** (placeholder `href="#"` in `SidebarSharedList` and related).

## Known deviations from TASKS.md / schema

- Items are stored in a table named **`merchant`**, transactions in **`budget_transaction`** (TASKS.md calls them `item` / `transaction`).
- **`budgetBook` has no `ownerId`**; it uses `createdBy` / `updatedBy` plus `budgetBookMember.role`.
- The `[bookId]` route **does not exist yet**; the UI lives at `/dashboard`.
- Login lives under `(landing)/login`, not `(auth)/login` (there is no `(auth)` group).
- `PROGRESS.md` was referenced by TASKS.md but missing until this file was created.
- `src/routes/(app)/profile/+page.svelte` is a placeholder not tracked by any milestone.

## Infrastructure state

- Postgres is running via `docker compose` (`budgetbook-db-1`, host port `5433`).
- Tables present: `user`, `session`, `account`, `verification`, `budget_book`, `budget_book_member`, `category`, `merchant`, `budget_transaction`.
- Row counts at last check: `user` = 1; all app tables = 0.
- Available scripts: `dev`, `build`, `check`, `lint`, `format`, `db:start`, `db:push`, `db:generate`, `db:migrate`, `db:studio`, `auth:schema`.
- No test framework or test files are configured yet.

## Next steps (recommended order)

1. **Create `src/routes/(app)/[bookId]/+page.server.ts`** — validate `bookId`, verify membership via `budget_book_member`, and load the active book, categories, merchants, and transactions for the selected month/year.
2. **Create `src/routes/(app)/[bookId]/+page.svelte`** — move the `Dashboard.svelte` mount here and feed it server data instead of `getSampleBookData()`.
3. **Add transaction actions** — `addTransaction`, `editTransaction`, `deleteTransaction`; have the drawer post to them and invalidate/reload.
4. **Add category/item actions** — `createCategory`, `createItem` for both month and year views.
5. **Wire the sidebar** — load books (owned + shared) in `(app)/+layout.server.ts`, replace `SAMPLE_BOOKS`, and link to `/<bookId>`.
6. **Onboarding** — `createBudgetBook` action, new-user detection, redirect to the new book.
7. **Settings** — add `userSetting`, build the tabs, implement account/book/category actions.
8. **Polish** — loading/empty/error states, focus trap, mobile layout, tests.

## Verification

```bash
npm run dev        # app at http://localhost:5173
npm run check      # svelte-check
npm run db:studio  # inspect tables
docker compose ps  # confirm Postgres is up
```

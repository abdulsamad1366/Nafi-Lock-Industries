# Nafi Lock Industries — Website Project Documentation

This folder is the single source of truth for the website project. Everything
decided during planning lives here so nothing gets lost or re-discussed later.
Hand this whole `docs/` folder to Antigravity (or any developer) alongside the
code — it's the brief.

## Files in this set

| File | Contents |
|---|---|
| `01-OVERVIEW.md` | What the site is, who it's for, business context |
| `02-ARCHITECTURE.md` | Tech stack, folder structure, frontend/backend split, hosting |
| `03-DESIGN-SYSTEM.md` | Colors, typography, layout principles, per-brand themes |
| `04-DATA-MODEL.md` | Database schema (Brand, Category, Product, Inquiry, AdminUser) |
| `05-SITE-MAP-AND-PAGES.md` | Every page, its sections, and what each contains |
| `06-DECISIONS-LOG.md` | Every decision made during planning, in order, with reasoning |
| `07-OPEN-QUESTIONS.md` | Things not yet answered — must be resolved before/during build |
| `08-PLACEHOLDER-ASSETS.md` | Where placeholder icons live and how to replace them later |
| `09-SAMPLE-PRODUCT-CATALOG.md` | Placeholder product data to seed the database until the real catalog is ready |

## How to use this

- **Before building anything:** read `02-ARCHITECTURE.md` and `04-DATA-MODEL.md` first.
- **When styling any page:** check `03-DESIGN-SYSTEM.md` for the correct palette —
  note that Greek and Raksham use different accent colors than Nafi/S-Nafi.
- **If something seems undecided:** check `07-OPEN-QUESTIONS.md` before guessing —
  if it's not answered there either, ask before building around an assumption.
- **Update `06-DECISIONS-LOG.md`** whenever a new decision is made in future
  conversations, so this stays a living record instead of going stale.

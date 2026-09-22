# Data Model

Database: PostgreSQL via Prisma ORM. This is the core of the "ERP-level"
scalability requirement — brands, categories, and products are all rows in the
database, managed through the admin panel, not hardcoded in the frontend.

## Brand
| Field | Type | Notes |
|---|---|---|
| id | string (uuid) | |
| slug | string | e.g. `s-nafi`, `greek`, `raksham` — used in URL `/brands/[slug]` |
| name | string | Display name |
| tagline | string | One-line brand promise |
| description | text | Brand story / paragraph |
| logoUrl | string | |
| heroImageUrl | string | |
| themeKey | string | Which palette to apply (`nafi`, `greek`, `raksham`) |
| order | integer | Display order on Home's brand strip |
| isActive | boolean | Show/hide without deleting |

## Category
Product type — not brand-specific, shared across all brands (future-proofs
beyond "classic lock only").
| Field | Type | Notes |
|---|---|---|
| id | string (uuid) | |
| slug | string | |
| name | string | e.g. Padlocks, Door Locks (Mortise), Cylindrical/Knob Locks, Cabinet/Drawer Locks, Hasp & Staple |

## Product
| Field | Type | Notes |
|---|---|---|
| id | string (uuid) | |
| slug | string | |
| name | string | |
| brandId | FK → Brand | |
| categoryId | FK → Category | |
| description | text | |
| material | string | e.g. brass, iron, zinc alloy, stainless steel |
| size | string | e.g. 50mm, 65mm |
| finish | string | e.g. chrome, brass polish, antique, black |
| numberOfKeys | integer | |
| lockingMechanism | string | e.g. single bolt, double bolt |
| warranty | string | e.g. "1 year" |
| images | string[] | Array of image URLs (uploaded via admin) |
| isActive | boolean | |
| dealerPrice | decimal, nullable | **Distributor-only visibility** — stripped from API response unless requester is an APPROVED distributor. See `10-AUTH-AND-DISTRIBUTOR-PORTAL.md`. |
| minOrderQty | integer, nullable | Minimum order quantity for distributor orders — same visibility rule as dealerPrice |

## Inquiry (contact form submissions)
| Field | Type | Notes |
|---|---|---|
| id | string (uuid) | |
| name | string | |
| company | string | optional |
| email | string | |
| phone | string | |
| message | text | |
| brandId | FK → Brand | optional — set if inquiry made from a brand page |
| productId | FK → Product | optional |
| userId | FK → User, nullable | set if submitted while logged in, so it shows in that user's inquiry history; null for guest submissions |
| status | enum | `new`, `contacted`, `closed` |
| createdAt | datetime | |

## AdminUser
| Field | Type | Notes |
|---|---|---|
| id | string (uuid) | |
| email | string | |
| passwordHash | string | |
| role | string | for future multi-admin support |

## Relationships
- `Brand` 1 — many `Product`
- `Category` 1 — many `Product`
- `Brand` 1 — many `Inquiry` (optional link)
- `Product` 1 — many `Inquiry` (optional link)
- `User` 1 — many `Inquiry` (optional link, see `10-AUTH-AND-DISTRIBUTOR-PORTAL.md`)

## Auth, distributor portal, orders, ledger, and liked products
The `User`, `DistributorProfile`, `Order`, `OrderItem`, `LedgerRequest`,
`Ledger`, `Catalog`, `SalesRep`, and `LikedProduct` models are documented in
full in **`10-AUTH-AND-DISTRIBUTOR-PORTAL.md`** rather than repeated here, to
keep this file focused on the core catalog models. `AdminUser` stays as
defined above — it is a deliberately separate system, not merged with `User`.

## Status
Field-level structure is set. **Actual product catalog content (real product
names, specs per brand) is not yet finalized** — see `07-OPEN-QUESTIONS.md`.
**Dealer pricing values and minimum order quantities are also not yet
finalized** — same open-questions file.

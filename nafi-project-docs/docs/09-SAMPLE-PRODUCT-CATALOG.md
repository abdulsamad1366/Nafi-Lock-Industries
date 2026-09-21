# Sample Product Catalog (PLACEHOLDER — not real data)

This is a realistic **sample** catalog so the database can be seeded and the
UI (grids, filters, product cards) can be built and tested against real-shaped
data before the client's actual product list is ready. Every product here
should be replaced or removed via `/admin/products` once real products exist.
Do not present this list to customers as final.

Categories used: Padlocks, Door Locks (Mortise), Cylindrical/Knob Locks,
Cabinet/Drawer Locks, Hasp & Staple.

## S-Nafi (sample)
| Name | Category | Material | Size | Finish | Keys | Locking Mechanism |
|---|---|---|---|---|---|---|
| S-Nafi Classic Padlock 50 | Padlocks | Brass | 50mm | Brass Polish | 3 | Single bolt |
| S-Nafi Classic Padlock 65 | Padlocks | Brass | 65mm | Chrome | 3 | Double bolt |
| S-Nafi Mortise Lock Set | Door Locks (Mortise) | Stainless Steel | Standard | Satin Steel | 3 | Double bolt |
| S-Nafi Cylindrical Knob Lock | Cylindrical/Knob Locks | Zinc Alloy | Standard | Antique Brass | 2 | Single bolt |

## Greek (sample)
| Name | Category | Material | Size | Finish | Keys | Locking Mechanism |
|---|---|---|---|---|---|---|
| Greek Heritage Padlock 40 | Padlocks | Iron | 40mm | Black | 2 | Single bolt |
| Greek Heritage Padlock 50 | Padlocks | Iron | 50mm | Antique Bronze | 2 | Single bolt |
| Greek Cabinet Lock Set | Cabinet/Drawer Locks | Zinc Alloy | Standard | Chrome | 2 | Single bolt |

## Raksham (sample)
| Name | Category | Material | Size | Finish | Keys | Locking Mechanism |
|---|---|---|---|---|---|---|
| Raksham Guard Padlock 50 | Padlocks | Hardened Steel | 50mm | Black | 3 | Double bolt |
| Raksham Guard Padlock 65 | Padlocks | Hardened Steel | 65mm | Gunmetal | 3 | Double bolt |
| Raksham Hasp & Staple Heavy Duty | Hasp & Staple | Steel | 6 inch | Zinc Plated | — | — |
| Raksham Mortise Lock Set | Door Locks (Mortise) | Steel | Standard | Black | 3 | Double bolt |

## Notes for seeding
- `warranty` field left blank in this sample — set a realistic default (e.g.
  "1 year") in `seed.ts` if a per-product value isn't specified.
- Use the matching category placeholder SVG (`08-PLACEHOLDER-ASSETS.md`) as
  the default image for each sample product until real photos are uploaded.
- This file should be deleted or archived once the real catalog replaces it.

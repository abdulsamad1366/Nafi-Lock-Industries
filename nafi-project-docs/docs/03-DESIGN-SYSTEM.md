# Design System

## Typography (same across the entire site, all brands)
- **Headlines / brand name:** `Fraunces` — weight 600–700
- **Body / navigation / UI text:** `IBM Plex Sans`
- **Spec labels / dimensions / model numbers only:** `IBM Plex Mono`
  (used for genuine technical data, not decoration)

## Layout principles
- Left-aligned text throughout (technical/catalog feel, not marketing brochure)
- Body line length under ~75 characters
- Generous whitespace between sections
- One deliberate motion moment (e.g. hero reveal) — no hover animation on every card
- Product cards: consistent grid, image placeholder on top, name + brand tag +
  key spec below

## Color palettes — one per brand identity

Nafi (parent company) and S-Nafi share the primary palette. Greek and Raksham
each have their own distinct palette. **Home page uses the Nafi/brass palette**
since it represents the parent company; each brand's own page switches to its
palette via `ThemeProvider`.

### Nafi / S-Nafi — brass & charcoal (premium/flagship)
| Role | Hex |
|---|---|
| Background | `#15130F` |
| Surface | `#1E1B16` |
| Border/divider | `#33302A` |
| Accent (brass, primary) | `#B8923F` |
| Accent hover | `#D4AF6A` |
| Secondary (steel) | `#9C9C94` |
| Text primary | `#F2EDE2` |
| Text muted | `#B5AFA2` |

### Greek — Aegean marble (classical/cool)
| Role | Hex |
|---|---|
| Background | `#0E141B` |
| Surface | `#161E27` |
| Border/divider | `#263241` |
| Accent (Aegean blue) | `#4A7FA6` |
| Secondary (marble white) | `#EDEAE1` |
| Text primary | `#F0EDE4` |
| Text muted | `#94A0AC` |

### Raksham — guardian red & gunmetal (protection/strength)
| Role | Hex |
|---|---|
| Background | `#12100F` |
| Surface | `#1A1D19` |
| Border/divider | `#2C2A25` |
| Accent (guard red) | `#A13A2E` |
| Secondary (steel grey) | `#7C8A82` |
| Text primary | `#EFEDE6` |
| Text muted | `#A3A79C` |

## Rationale for the split
- **Nafi/S-Nafi:** established, premium, flagship — warm brass conveys heritage
  manufacturing quality.
- **Greek:** name evokes classical architecture (marble, columns, Aegean Sea) —
  cool blue/white instead of warm brass, deliberately different family of color.
- **Raksham:** name means "protection" in Hindi/Sanskrit — bold guardian red
  conveys vigilance/strength, distinct from both other palettes.

All three keep the same dark, premium "showroom" feel and the same typography —
only the accent and surface tones shift, so the site still reads as one company
with three distinct brand identities, not three unrelated sites.

# Red Broadcast — Design System

A content-first design system engineered for video consumption at scale. Red
Broadcast uses a signature red accent **sparingly** against clean white and dark
surfaces, letting video thumbnails dominate the visual landscape. The aesthetic
is efficient and grid-driven — designed for rapid scanning across thousands of
videos while staying recognizable from mobile to living-room screens.

> **Where this lives in the code:** the design tokens are CSS custom properties
> in [`src/app/globals.css`](../src/app/globals.css) (`:root` for light,
> `.dark` for dark). They are exposed as Tailwind v4 utilities through the
> `@theme inline` block — e.g. `--color-primary` → `bg-primary` / `text-primary`.
> Fonts are loaded with `next/font/google` in the route-group root layouts
> ([`(front)/layout.tsx`](../src/app/(front)/layout.tsx) and
> [`(auth)/layout.tsx`](../src/app/(auth)/layout.tsx)).

---

## Colors

| Token | Hex (light) | Hex (dark) | Tailwind utility | Usage |
| --- | --- | --- | --- | --- |
| **Primary** | `#FF0000` | `#FF0000` | `bg-primary` / `text-primary-foreground` | Primary CTA, selected chip, key actions (Broadcast Red) |
| **Ink** | `#0F0F0F` | `#FFFFFF` | `bg-foreground` / `text-foreground` | Near-black "Subscribe"-style dark fills when a neutral CTA is needed |
| **Brand** | `#FF0000` | `#FF0000` | `bg-brand` / `text-brand` | Broadcast Red — live badges, progress bars |
| **Brand Hover** | `#CC0000` | `#CC0000` | `hover:bg-brand-hover` | Hover state for red interactive elements |
| **Link** | `#065FD4` | `#3EA6FF` | `text-link` | Text links, hashtags, channel mentions (Link Blue) |
| **Neutral / Muted fg** | `#606060` | `#AAAAAA` | `text-muted-foreground` | Secondary text, metadata, icon buttons (Gray 600) |
| **Background** | `#FFFFFF` | `#0F0F0F` | `bg-background` | Page background |
| **Surface / Secondary** | `#F2F2F2` | `#272727` | `bg-secondary` / `bg-muted` | Chip bar, sidebar hover, comment input (Gray 100) |
| **Text Primary / Foreground** | `#0F0F0F` | `#F1F1F1` | `text-foreground` | Video titles, channel names, primary content |
| **Border** | `#E5E5E5` | `#303030` | `border-border` | Dividers, card outlines (rarely used — Gray 200) |
| **Success** | `#2BA640` | `#2BA640` | `bg-success` / `text-success` | Verified badges, successful uploads, monetization |
| **Warning** | `#FB8C00` | `#FB8C00` | `bg-warning` / `text-warning` | Age-restricted content, copyright claims, review pending |
| **Error / Destructive** | `#FF0000` | `#FF0000` | `bg-destructive` / `text-destructive` | Strikes, policy violations, upload failures (reuses red) |

**Red-forward.** Broadcast Red is the primary action colour (`--primary`) — used
for primary CTAs, the selected chip, and key actions — and it stays red in both
light and dark mode. `--brand` / `--destructive` share the same red for live
indicators, progress bars, and error states. Use the near-black `--foreground`
when a neutral dark fill is genuinely needed.

All tokens accept Tailwind opacity modifiers via `color-mix`, e.g.
`bg-primary/80`, `ring-ring/30`, `bg-destructive/10`.

---

## Typography

- **Display / Body Font:** Roboto (Google Fonts, variable) — `font-sans`
- **Code Font:** Roboto Mono (Google Fonts) — `font-mono`
- **Headings:** `font-heading` is aliased to Roboto (no separate display face)

Roboto is used everywhere for its neutral versatility and extensive language
support. Headlines use weight 500/700; body text uses 400. The type system is
compact — most UI text is 12–14px to maximize space for content. Video titles
are the most prominent text: weight 500 at 14–16px, clamped to **exactly 2
lines** for grid consistency.

> **Thai text:** the app is Thai-language (`<html lang="th">`). Roboto's Latin
> subset is loaded; Thai glyphs fall back to the system Thai face via the
> `next/font` fallback chain.

| Role | Spec |
| --- | --- |
| Page Title | Roboto 24px/32px, weight 700 |
| Section Title | Roboto 20px/28px, weight 500 |
| Video Title (Grid) | Roboto 14px/20px, weight 500, max 2 lines, ellipsis |
| Video Title (Watch) | Roboto 20px/28px, weight 700 |
| Channel Name | Roboto 14px/20px, weight 500 |
| Body | Roboto 14px/20px, weight 400 |
| Body Small | Roboto 12px/18px, weight 400 |
| Metadata | Roboto 12px/16px, weight 400 |
| Label | Roboto 12px/16px, weight 500, tracking 0.02em |
| Button Text | Roboto 14px/20px, weight 500 |
| Code | Roboto Mono 14px/20px, weight 400 |

---

## Elevation

Elevation is minimal in the browsing experience — **borders are preferred over
shadows**.

| Level | Shadow | Usage |
| --- | --- | --- |
| 0 | none (flat) | Default for cards and most surfaces |
| 1 | `0 1px 2px rgba(0,0,0,0.1)` | Sticky header on scroll, mini-player |
| 2 | `0 4px 32px rgba(0,0,0,0.1)` | Dropdown menus, share dialogs, comment menus |
| 3 | `0 8px 40px rgba(0,0,0,0.2)` | Modals, full-screen overlays |

The video player uses no elevation — it sits flush within the page. In dark
mode, prefer a `rgba(255,255,255,0.05)` border over box-shadows.

---

## Spacing

- **Base unit:** 8px
- **Scale:** 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 (px)
- **Component padding:** 12px standard, 16px for sidebar items, 24px for page sections
- **Section spacing:** 24px between major sections, 8px between metadata lines
- **Container:** 100% fluid, adapts to sidebar state; max content width 2200px
- **Video grid:** auto-fill, 320px minimum column width
- **Card grid gap:** 16px horizontal, 40px vertical (room for title + metadata)

---

## Border Radius

The base token is `--radius: 0.75rem` (12px). The Tailwind radius scale derives
from it (`rounded-sm` … `rounded-4xl`).

| Radius | Usage |
| --- | --- |
| 2px | Badges, duration tags, timestamp links |
| 4px | Dropdown menus, tooltips, duration overlays |
| 8px | Mini-player, modals, settings panels |
| 12px | Thumbnails, video player, large cards (`--radius`) |
| 9999px | Buttons, chips, search button, avatars, channel pills (`rounded-full`) |

---

## Components

- **Buttons** — Subscribe: `#0F0F0F` fill (`bg-primary`), white text, 36px
  height, 16px horizontal padding, `rounded-full`, weight 500. Subscribed state:
  `#F2F2F2` fill (`bg-secondary`), dark text, bell icon. Icon buttons: 40px
  circles, transparent, `#606060` icon, hover `bg-secondary`. Like/dislike: a
  segmented pair with a 1px `border-border`. Outlined: 1px `border-border`,
  `rounded-full`, dark text.
- **Cards** — No visible card container; grid items are raw thumbnail + text
  stack. Thumbnail: 16:9, 12px radius, duration badge bottom-right (12px/500,
  white on `rgba(0,0,0,0.6)`, 4/8px padding, 4px radius). Below: 36px channel
  avatar left, title + channel + metadata right. **Don't** add borders or
  shadows to video cards.
- **Inputs** — 40px height, `bg-secondary` (or transparent with a 1px bottom
  border for comments), 0px radius for search / `rounded-full` for comments,
  16px horizontal padding. Search: flat bottom border, focus shows a 1px
  `#0F0F0F` bottom border. Comment: bottom border only, expands to a textarea
  with cancel/submit buttons.
- **Chips** — Pill (`rounded-full`), `bg-secondary`, dark text, 14px/500, 8/12px
  padding. Selected: `bg-primary` + white text. Horizontally scrolling chip bar
  below the header; first chip is always "All" (selected by default).
- **Lists** — Search/sidebar items use a horizontal layout: 168×94px thumbnail
  left, title + channel + metadata right. Up-Next sidebar: stacked, 8px gap.
  Comments: 40px avatar left, name + timestamp, body, then like/reply actions;
  threaded replies indented 56px.
- **Checkboxes** — 18px square, 2px radius. Unchecked: 2px `#606060` border.
  Checked: `#065FD4` (`bg-link`) fill with a white check. Toggle switches for
  notification preferences.
- **Tooltips** — `#606060` background, white text, 4px radius, 4/8px padding,
  12px. Delay: 500ms on hover.
- **Navigation** — Top bar 56px, white, Level 1 shadow on scroll. Hamburger +
  logo left, search center, voice/create/notifications/avatar right. Left
  sidebar 240px, collapsible to a 72px icon rail. Active item: `bg-secondary`
  with weight-700 text.
- **Search** — Center of the top bar, 44px, white, 1px `border-border`, square
  left corners, attached search button (magnifier, `#F8F8F8`, 64px wide).
  Suggestions dropdown with history (clock) and trending icons; voice-search
  (microphone) adjacent.

---

## Do's and Don'ts

- ✅ Make video thumbnails the dominant visual element — they drive clicks more than any UI.
- ✅ Use a 16:9 aspect ratio consistently for all video thumbnails.
- ❌ Don't overuse the red — reserve it for Subscribe, live indicators, and progress bars.
- ✅ Clamp video titles to exactly 2 lines with ellipsis for grid consistency.
- ❌ Don't add borders or shadows to video cards — let thumbnails sit on the background.
- ✅ Show metadata compactly: "channel · views · time" (e.g. "TechChannel · 1.2M views · 3 days ago").
- ❌ Don't auto-play previews on hover immediately — use a 2-second delay to prevent flickering.
- ✅ Prioritize the comment section with clear threading and easy reply interactions.
- ❌ Don't use custom scrollbars — rely on native scrolling for performance.

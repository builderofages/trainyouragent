# v29 — Blog + Newsletter

## What was added

### Blog (MDX)
- `src/content/blog/*.mdx` — MDX files. Frontmatter required: `title, slug, date, author, excerpt, category, tags`. `heroImage` optional.
- `src/lib/blog.ts` — type-safe loader using `import.meta.glob` (eager). Sorts newest-first.
- `src/pages/blog/BlogIndex.tsx` — `/blog` (hero post + 2-col grid + category filter via `?category=`).
- `src/pages/blog/BlogPost.tsx` — `/blog/:slug` (rendered MDX, prev/next, newsletter CTA, floater).
- `src/pages/blog/BlogCategory.tsx` — `/blog/category/:category`.
- `src/pages/blog/BlogTag.tsx` — `/blog/tag/:tag`.
- `vite-plugin-rss.ts` — generates `dist/rss.xml` and merges blog URLs into `dist/sitemap.xml` at build time.
- `src/mdx.d.ts` — type shim so TS understands `.mdx` imports.

### Newsletter (beehiiv)
- `src/components/NewsletterCapture.tsx` — upgraded; posts to `/api/lead` with `subscribeToNewsletter: true`.
- `src/components/NewsletterFloater.tsx` — slides in from bottom-right after 30s on blog post pages, one-time per session via `sessionStorage`.
- `src/pages/Newsletter.tsx` — `/newsletter` landing page with 3 sample issues and full text of Issue 001.
- `api/lead.ts` — upgraded to forward newsletter signups to beehiiv (POST `/v2/publications/{pub}/subscriptions`).

## Required env vars in Vercel

| Var | Required | Purpose |
|---|---|---|
| `BEEHIIV_API_KEY` | yes (for newsletter) | Bearer token from beehiiv dashboard → Settings → Integrations → API |
| `BEEHIIV_PUB_ID` | yes (for newsletter) | Publication ID, format `pub_xxxxxxxxxxxxxxxx` |
| `RESEND_API_KEY` | optional | Internal lead email notification (unchanged) |
| `SLACK_WEBHOOK_URL` | optional | Internal Slack notification (unchanged) |
| `LEAD_NOTIFY_TO` | optional | Defaults to `hello@trainyouragent.com` |
| `LEAD_NOTIFY_FROM` | optional | Defaults to `leads@trainyouragent.com` |

## New npm dependencies

Install with:
```
npm install @mdx-js/react
npm install -D @mdx-js/rollup remark-frontmatter remark-mdx-frontmatter remark-gfm
```

(Already added to `package.json`. CI/Vercel will pick them up on next deploy.)

## Routes added to App.tsx

```
/blog
/blog/:slug
/blog/category/:category
/blog/tag/:tag
/newsletter
```

## Sample posts seeded

1. `real-cost-ai-voice-agent-2026.mdx` — AI Voice
2. `reverse-engineering-bland-ai-pricing.mdx` — AI Infrastructure
3. `hvac-after-hours-playbook.mdx` — Vertical Playbooks

## RSS / sitemap

- `/rss.xml` is generated at build time by `vite-plugin-rss.ts` from MDX frontmatter.
- The plugin also appends `/blog` and every `/blog/:slug` to `dist/sitemap.xml`.
- `<link rel="alternate" type="application/rss+xml">` is added on the BlogIndex page.

## Adding a new post

1. Create `src/content/blog/your-slug.mdx` with the required frontmatter.
2. Commit + push. The route, RSS entry, and sitemap entry all generate automatically.

# Contributing to TrainYourAgent

Thanks for considering a contribution.

This repo is the source for trainyouragent.com. We accept PRs that:
- Fix bugs (any size)
- Improve mobile or accessibility
- Add tests
- Improve performance
- Improve docs

PRs we'll likely decline:
- New brand directions (we have a brand)
- New marketing copy (we have a voice)
- New playbook content (it's editorial, not community-sourced)
- Adding new third-party AI providers without a fallback story

## How to PR

1. Fork the repo
2. Create a branch: `git checkout -b fix-something-specific`
3. Make changes, keep them small and focused
4. Run `npm install --legacy-peer-deps && npm run build` to verify it builds
5. Commit with a clear message
6. Open a PR against `main` with a 1-paragraph description

## Local dev

See README for setup. Note: most demos require API keys (Groq is free tier — start there).

## Reporting security issues

Email security@trainyouragent.com. See [SECURITY.md](./SECURITY.md).

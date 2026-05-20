# 07 — Internal Ops Copilot

**Status:** Draft for Alexander review · Cornerstone: `/capabilities/ops-copilot`

---

Your customer-facing AI agent is the easy build. Your internal ops copilot is the hard one — and it's the one that compounds.

An ops copilot is a Slack-side agent your team @-mentions to do the things humans do worst: cross-system lookups, status reports, document generation, exception handling.

Real examples I've shipped in the last 6 months:

**Recruiting agency.** "@ops give me the status of every active candidate in the Acme Corp pipeline." Agent queries their Bullhorn ATS, cross-references the last-touch in their Gmail, summarizes the 14 active candidates with one-line context. 8 minutes of work for a recruiter → 4 seconds.

**Property management co.** "@ops which tenants are 8+ days late on rent and haven't been contacted in the last 5 days." Agent queries AppFolio, joins against the call log in their phone system, returns 23 names with last-contact dates. The agent then offers to draft personalized follow-up SMS to all 23 — they say yes, agent drafts, manager approves, sends. 3 hours of work → 12 minutes.

**Solo consultant.** "@ops every Friday at 4pm, summarize my week. Hours billed per client, deliverables shipped per client, next-week priorities I committed to in Slack." Agent reads Toggl + their email outbox + the #commitments Slack channel. Sends a Friday digest that took her 2 hours of manual reconciliation before.

The stack:

- **Slack bot** as the entrypoint (works via @mention or DM)
- **Anthropic Claude with tool use** for the reasoning + planning layer
- **MCP servers** for each tool — your CRM (HubSpot MCP, Salesforce MCP), your inbox (Gmail MCP), your file store (Google Drive MCP), your vertical-specific tools (Bullhorn, AppFolio, ServiceTitan custom MCPs we write)
- **Cron triggers** for recurring tasks ("every Friday at 4pm")
- **Approval gates** for any action that writes to a system of record (drafts go to Slack for human ok before sending)

What makes ops copilots dangerous if built wrong: the model decides to "help" by taking actions you didn't authorize. We hard-code the action-allowlist per tool. Read-only by default. Writes require explicit user confirmation in the same Slack thread.

Cost: $7,500 base + $1,500–$3,000 per MCP integration depending on auth complexity. Ongoing: $499/mo + LLM passthrough.

The cumulative value: an ops copilot pays back in 4–6 weeks at one user. With 10 users at the same company it pays back in days, and stays paying back forever as new tools get added to the MCP layer.

Full playbook with the MCP integration patterns + the action-allowlist schema we use: https://trainyouragent.com/capabilities/ops-copilot

— Alexander

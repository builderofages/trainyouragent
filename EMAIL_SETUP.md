# Email aliases for trainyouragent.com — 90-second setup

**Current DNS state (verified live):**
- Nameservers: GoDaddy (`ns23.domaincontrol.com`, `ns24.domaincontrol.com`)
- MX records: Google Workspace (`aspmx.l.google.com` + 4 alt records)
- SPF: Set via Mailfly (`include:dc-aa8e722993._spfm.trainyouragent.com`)
- Google site-verification: 2 TXT records present

**Translation:** You already have Google Workspace email set up on this domain. Mail sent to anything@trainyouragent.com is hitting Google's servers right now.

You need to add aliases inside Workspace so those addresses route to you.

---

## Path A — You already pay for Google Workspace ($6/mo)

This is the most likely path given your MX records.

1. Go to https://admin.google.com → log in as `trainyouragent@gmail.com` (or whichever account owns the Workspace).
2. **Users** → click your primary user (probably `alexander@trainyouragent.com` or `hello@trainyouragent.com`).
3. Scroll to **User Information** → **Add alternate email addresses** (this is the Google Workspace term for aliases).
4. Add each of these 12 aliases, one per line:
   ```
   careers@trainyouragent.com
   press@trainyouragent.com
   legal@trainyouragent.com
   security@trainyouragent.com
   support@trainyouragent.com
   billing@trainyouragent.com
   info@trainyouragent.com
   sales@trainyouragent.com
   partners@trainyouragent.com
   investors@trainyouragent.com
   media@trainyouragent.com
   hello@trainyouragent.com
   ```
5. Save. Aliases take ~5 minutes to propagate, then all 12 forward into the primary mailbox.

**To forward that mailbox to trainyouragent@gmail.com:**
1. Log into the Workspace mailbox at https://mail.google.com (signed in as the primary Workspace account, not your personal Gmail).
2. **Settings → See all settings → Forwarding and POP/IMAP**.
3. **Add a forwarding address** → `trainyouragent@gmail.com`. Verify via email Google sends.
4. **Forward a copy of incoming mail to** → `trainyouragent@gmail.com` → "keep Gmail's copy in the inbox".
5. Done. Anything sent to any of the 12 aliases now lands in your personal Gmail within seconds.

---

## Path B — You do NOT pay for Google Workspace

If admin.google.com says "you don't have a Workspace account," your MX records are leftover from a trial that never converted. In that case Gmail is *rejecting* mail to @trainyouragent.com right now (it bounces).

Fastest fix: ImprovMX. Free for 25 aliases, no Workspace required.

1. **Sign up at https://improvmx.com** with `trainyouragent@gmail.com`.
2. **Add domain** `trainyouragent.com`.
3. ImprovMX will tell you to add these MX records (you'll do this at GoDaddy):
   - Priority `10` → `mx1.improvmx.com`
   - Priority `20` → `mx2.improvmx.com`
4. Go to https://dcc.godaddy.com/control/portfolio (or wherever you bought the domain) → DNS → **delete the 5 existing aspmx.l.google.com MX records** → **add the 2 ImprovMX MX records above**.
5. Back in ImprovMX dashboard → for each alias below, click **Add alias** → forward to `trainyouragent@gmail.com`:
   - careers, press, legal, security, support, billing, info, sales, partners, investors, media, hello

Propagation: ~5–15 minutes for MX changes to spread globally.

---

## Path C (BEST long-term) — Cloudflare Email Routing (free, unlimited)

If you're willing to move DNS from GoDaddy to Cloudflare (~10 min one-time), this is the cleanest. Free forever, unlimited aliases, catch-all support, Cloudflare's bot-filtering built in.

1. **Cloudflare → Add site** → `trainyouragent.com` → Free plan.
2. Cloudflare gives you 2 nameservers. Go to GoDaddy → Nameservers → change to those 2.
3. Wait 10 min for the nameserver change to propagate (Cloudflare emails you when ready).
4. In Cloudflare dashboard → **Email → Email Routing → Get started** → it auto-adds the MX records (replacing Google's).
5. Add aliases: `Routes → Create address` → `careers@trainyouragent.com → trainyouragent@gmail.com`. Repeat for the 11 others.
6. (Optional but recommended) Enable **catch-all** → forwards anything@trainyouragent.com to your Gmail. Future-proof.

**Trade-off:** Cloudflare takes over DNS, which is great for free DDoS/CDN/caching but means any future DNS change goes through Cloudflare's panel instead of GoDaddy's. Most people prefer Cloudflare DNS anyway.

---

## My recommendation

Try **Path A first** (you probably already have Workspace given your MX records). If admin.google.com says you don't have an account, switch to **Path C** (Cloudflare) — it's the long-term right answer and free.

Once the aliases are live, every `careers@`, `press@`, `legal@` etc. will route to your personal `trainyouragent@gmail.com` inbox. To **reply** from those addresses, set up Gmail "Send mail as" for each: Gmail Settings → Accounts and Import → Send mail as → Add another email → use the alias.

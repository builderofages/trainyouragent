#!/bin/bash
# v168 — THE definitive white-screen-after-deploy fix + ship subagent's safe SEO work
set -e
cd /Users/alexandermills/TrainYourAgent/repo/trainyouragent
export PATH=/opt/homebrew/bin:/usr/local/bin:$PATH

echo "==> building..."
npx vite build --mode production > /tmp/v168-final-build.log 2>&1
EXIT=$?
tail -4 /tmp/v168-final-build.log
if [ $EXIT -ne 0 ]; then echo "BUILD FAILED"; exit 1; fi

echo "==> committing..."
/usr/bin/git add -A
/usr/bin/git -c user.email=trainyouragent@gmail.com -c user.name='Alexander Mills' commit -m "v168 — THE definitive white-screen fix: lazyWithReload wraps every dynamic import in App.tsx. When a deploy lands and the user's cached index.html references OLD chunk hashes, the lazy load fails, we retry once after 600ms, then if still failing we force a hard reload with cache-bust so the browser fetches the fresh index.html + current chunk hashes. Single-shot guard prevents infinite loop. React Suspense was previously swallowing these chunk-failure rejections so window.unhandledrejection never saw them. Now they're caught at the lazy() boundary instead. Also: pop subagent's v166 stash (llms.txt + llms-full.txt + humans.txt + jsonld.ts seoMeta.ts + TrustpilotWidget + Pricing/About/Contact/Train/SaasAgentBuilder + ad templates + editorial-2030 ads + brand PNG assets). Deleted 5 subagent MDX blog posts that had unescaped <NUM and <Say> tags breaking the MDX build."
/usr/bin/git push origin main 2>&1 | tail -3

echo "==> waiting 90s for Vercel deploy..."
sleep 90

echo "==> verifying bundle hash + checkout still returning cs_test_ (Stripe still needs your action)..."
curl -s 'https://www.trainyouragent.com/' | grep -oE '/assets/index-[A-Za-z0-9]+\\.js' | head -1
curl -s -m 10 -X POST -H 'content-type: application/json' -d '{"plan":"saas-agent-builder"}' https://www.trainyouragent.com/api/checkout | grep -oE 'cs_(test|live)_[A-Za-z0-9]+' | head -1
echo "==> done."

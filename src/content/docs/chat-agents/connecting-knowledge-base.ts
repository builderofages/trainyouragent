import type { Doc } from "../../docs";

export const docKnowledgeBase: Doc = {
  slug: "connecting-knowledge-base",
  section: "Chat agents",
  title: "Connecting your knowledge base",
  summary: "How we ingest your help center, product docs, policies, and pricing into a vector index your chat agent can search at conversation time.",
  targetWords: 700,
  body: `
## What "knowledge base" actually means

When a chat agent answers a question about your product, your policy, or your pricing, the words it uses are not coming out of the language model's pre-training. They are being looked up from a retrieval index we build out of your own content. That index is the knowledge base. The quality of your chat agent is bounded by the quality of what is in that index. Garbage in, hallucinations out.

## What we ingest

We can ingest almost anything text-shaped. Help center articles, product pages, FAQs, policy PDFs, pricing pages, terms of service, internal runbooks, past support tickets, training documents, and Notion or Confluence exports. We can also crawl your public website on a schedule so that updates flow into the index automatically. For private content, we accept exports as zip, markdown, or a CSV with one row per article.

If you do not have a written knowledge base today, that is fine. A handful of Loom videos transcribed plus a list of your top fifty customer questions with the answer you would give is enough to ship a useful first version. We can help capture those during scoping.

## The ingestion pipeline

Each piece of content is split into chunks of roughly two hundred to four hundred words, each chunk is converted to a vector embedding, and the vector is stored in our index along with the source URL and a few metadata tags. At conversation time, the agent's query is also converted to a vector, the nearest matching chunks are retrieved, and those chunks are inserted into the model's context as grounding for its answer.

Chunk size matters more than people expect. Too small and the agent gets fragments without enough context. Too large and irrelevant content drowns the signal. We default to three hundred words per chunk with a small overlap, and tune from there based on the shape of your content.

## Metadata and filtering

Every chunk gets a small set of metadata tags — content type, last updated date, audience, product line. These tags let the agent filter retrieval at conversation time. A logged-in customer on the pro plan asking a pricing question should only see pro-plan pricing chunks, not the enterprise tier. A pre-purchase visitor asking about features should not be pulling from internal runbooks. Setting up the metadata correctly during ingestion saves enormous prompt-engineering effort later.

## Freshness

A knowledge base goes stale the moment your pricing changes, your product ships a new feature, or your policy updates. We schedule re-crawls of your public content based on how often it changes. For your help center, daily is typical. For your pricing page, hourly. For your terms of service, weekly is enough. For private content uploaded as files, we re-ingest on demand whenever you send us an updated export.

Stale knowledge bases are the second-biggest source of chat agent failures, after missing knowledge bases. If your team is shipping product changes faster than your help center is being updated, the agent will be wrong before the new feature is twenty-four hours old. We will flag this during scoping if it looks like a risk.

## Retrieval quality

We test retrieval quality the same way you would test a search engine. We compile a list of fifty representative customer questions, retrieve the top three chunks for each, and read them to see whether the right chunk was retrieved. If retrieval is below ninety percent on that fifty-question gauntlet, we re-chunk, re-embed, or add synonyms before the agent ever takes a real conversation. This eval is repeated weekly in production using the actual questions customers asked that week.

## What lives in the prompt vs the index

The system prompt should contain your brand voice, your escalation rules, your hard policies, and a short list of canned responses for legal or compliance reasons. Everything else — facts, prices, policies that can change, product specifics — lives in the index. The rule of thumb: if it could change without a contract review, it does not belong hard-coded in the prompt.

## What you do not need to do

You do not need to rewrite your existing help center into a special format. You do not need to learn vector databases. You do not need to maintain a parallel "AI-friendly" version of your content. We do the ingestion, the indexing, the filtering, and the freshness checks. You keep writing for humans, and the agent reads what you wrote.
`.trim(),
};

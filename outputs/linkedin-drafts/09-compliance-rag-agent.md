# 09 — Compliance RAG Agent

**Status:** Draft for Alexander review · Cornerstone: `/capabilities/compliance-rag-agent`

---

Compliance is the AI use case nobody markets and everyone needs.

A mortgage broker spends 90 minutes on a typical pre-qualification call looking up state-specific TRID disclosures, USDA loan eligibility maps, FHA limits by county, employer-verification requirements. The information exists. It's just spread across 14 PDF sources, 3 password-protected lender portals, and an internal Confluence page that's 18 months out of date.

A compliance RAG agent answers those questions in 4 seconds, with citations.

The build is RAG done correctly, not the hello-world tutorial version.

**Document ingest:** Every PDF, regulation update, internal SOP, and lender portal export gets pulled nightly into a Pinecone index. Chunk boundaries respect structural metadata (section, subsection) — not the naive 500-token windowing every junior dev ships. Tables get extracted with Unstructured.io and stored as JSON alongside the prose chunks so we can answer "what's the FHA limit in Hillsborough County FL?" with the actual number, not paraphrased prose.

**Retrieval:** Hybrid — BM25 + dense embeddings (Voyage 3 Large) + Cohere rerank-v3 on top 30. Single-vector search misses too many edge cases for compliance work.

**Citation discipline:** Every answer includes the source document title, section, and a deep link. The agent will literally refuse to answer if confidence is below threshold rather than hallucinate — we tune this at the loan-officer's level of risk tolerance.

**Update pipeline:** Nightly ingest of any document modified in source systems. Plus a "fact-of-the-day" QA loop where Claude asks itself the 50 most common compliance questions and flags any answer that drifted vs the previous day.

**Audit trail:** Every query, every retrieved chunk, every response gets logged immutably to S3 with a SHA hash. This is the artifact compliance officers and CFPB examiners want to see.

The mortgage broker above moved typical pre-qual call duration from 90 → 22 minutes. Loan officers handle 3.5× the call volume. Compliance officer no longer spends Friday afternoons answering the same 8 questions over Slack.

Verticals where this prints money: mortgage, insurance, healthcare (HIPAA + payor rules), legal (jurisdictional case lookup), accounting (state-specific filing), education (FERPA + state department of education).

Cost: $8,500–$12,500 build depending on document complexity. Ongoing: $899/mo + ~$0.08 per query (LLM + retrieval passthrough).

Where 90% of compliance RAG projects fail: they skip the structural metadata in chunking. Without it, the agent retrieves the right paragraph but loses the section heading that gives the rule its scope. You get a confident wrong answer instead of a correctly hedged one.

Full playbook with the chunking schema + Cohere rerank config + audit-trail spec: https://trainyouragent.com/capabilities/compliance-rag-agent

— Alexander

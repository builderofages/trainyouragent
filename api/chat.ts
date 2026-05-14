// api/chat.ts — Vercel serverless function (Node runtime).
// Streams Claude responses back to the AiChat widget.
// REQUIRES env: ANTHROPIC_API_KEY

export const config = { runtime: "edge" };

export default async function handler(req: Request) {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return new Response("ANTHROPIC_API_KEY not configured", { status: 500 });

  const { system, messages } = await req.json();

  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 800,
      stream: true,
      system,
      messages: messages.map((m: { role: string; content: string }) => ({ role: m.role, content: m.content })),
    }),
  });

  if (!r.ok || !r.body) return new Response("upstream error", { status: 502 });

  // Re-emit only the text deltas as raw text/plain stream for the widget.
  const reader = r.body.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async pull(controller) {
      const { value, done } = await reader.read();
      if (done) { controller.close(); return; }
      const chunk = decoder.decode(value, { stream: true });
      // Anthropic SSE: "data: {json}\n\n" lines. Pull `delta.text`.
      for (const line of chunk.split("\n")) {
        const t = line.trim();
        if (!t.startsWith("data:")) continue;
        const payload = t.slice(5).trim();
        if (!payload || payload === "[DONE]") continue;
        try {
          const obj = JSON.parse(payload);
          if (obj.type === "content_block_delta" && obj.delta?.text) {
            controller.enqueue(encoder.encode(obj.delta.text));
          }
        } catch { /* ignore */ }
      }
    },
  });

  return new Response(stream, {
    status: 200,
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-cache, no-transform" },
  });
}

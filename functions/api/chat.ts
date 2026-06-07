/**
 * Cloudflare Pages Function — secure Anthropic proxy.
 *
 * The browser must NEVER hold the Anthropic API key. The client posts the
 * conversation here; this function injects the server-only key, calls the
 * Anthropic API with streaming, and relays plain text deltas back to the client.
 *
 * Set the key in Cloudflare Pages → Settings → Environment Variables as
 * ANTHROPIC_API_KEY (NOT prefixed with VITE_, so it stays server-side).
 */

const SYSTEM_PROMPT = `You are the official gear specialist for RC Jiu Jitsu, a premium combat sports brand. Help customers find the right gear.

PRODUCT LINEUP:
- RC Compression Rashguard ($45+): Competition-grade, 4-way stretch, moisture-wicking, anti-bacterial. Sizes XS–3XL.
- RC MMA Fight Shorts ($55+): Lightweight, full range of motion, split waistband, hook & loop closure. Sizes XS–3XL.
- RC Training Hoodie ($65+): 400gsm heavyweight fleece, kangaroo pocket, RC embroidered logo. Sizes S–3XL.
- RC Classic Tee ($30+): 100% pre-shrunk cotton, unisex cut. Sizes S–3XL.

SIZING GUIDANCE:
- Rashguards: snug but not restrictive — size up if between sizes.
- Shorts: true to size; size up if you prefer room to move while grappling.
- Hoodies/Tees: standard sizing; size up for a relaxed fit.

AVAILABILITY:
- Made-to-order via Print on Demand (Printful integration coming soon).
- Production: 3–5 business days. Shipping: 5–10 business days.
- Ships to US and internationally.

YOUR STYLE:
- Direct and confident, like a coach giving gear advice.
- Keep responses concise (2–3 sentences unless the user asks for detail).
- When a user shows clear purchase intent, naturally ask: "What's your name and email? I can have someone follow up with pricing and availability."
- Steer toward clicking "I'm Interested" on a product card for official lead capture.
- Never be pushy — be genuinely helpful.`;

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface Env {
  ANTHROPIC_API_KEY: string;
}

// Minimal Pages Function context shape (avoids needing @cloudflare/workers-types here).
interface Context {
  request: Request;
  env: Env;
}

export const onRequestPost = async (context: Context): Promise<Response> => {
  const { request, env } = context;

  if (!env.ANTHROPIC_API_KEY) {
    return new Response(JSON.stringify({ error: 'Server is missing ANTHROPIC_API_KEY.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let messages: ChatMessage[];
  try {
    const body = (await request.json()) as { messages?: ChatMessage[] };
    messages = Array.isArray(body.messages) ? body.messages : [];
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Sanitize: only role + string content, drop anything empty.
  const cleanMessages = messages
    .filter((m) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
    .map((m) => ({ role: m.role, content: m.content }));

  if (cleanMessages.length === 0) {
    return new Response(JSON.stringify({ error: 'No messages provided.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const upstream = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages: cleanMessages,
      stream: true,
    }),
  });

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => '');
    return new Response(JSON.stringify({ error: 'Upstream error', detail }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Parse Anthropic's SSE stream server-side and re-emit only the text deltas
  // as a plain-text stream, so the client stays dead simple.
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = '';

  const transform = new TransformStream<Uint8Array, Uint8Array>({
    transform(chunk, controller) {
      buffer += decoder.decode(chunk, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('data:')) continue;
        const data = trimmed.slice(5).trim();
        if (!data || data === '[DONE]') continue;
        try {
          const event = JSON.parse(data);
          if (event.type === 'content_block_delta' && event.delta?.type === 'text_delta') {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        } catch {
          // Ignore non-JSON keep-alive lines.
        }
      }
    },
  });

  return new Response(upstream.body.pipeThrough(transform), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
};

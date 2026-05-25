import { useState, useRef, useEffect, useCallback } from 'react';
import Anthropic from '@anthropic-ai/sdk';
import { ChatMessage, ChatTrigger } from '../types';

// NOTE: VITE_ env vars are bundled client-side. For production, replace this
// component's API calls with a Cloudflare Pages Function proxy to protect the key.
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

interface ChatbotProps {
  trigger: ChatTrigger | null;
}

export default function Chatbot({ trigger }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingText, setStreamingText] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const prevTriggerIdRef = useRef<number | null>(null);

  const clientRef = useRef<Anthropic | null>(null);
  if (!clientRef.current && import.meta.env.VITE_ANTHROPIC_API_KEY) {
    clientRef.current = new Anthropic({
      apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
      dangerouslyAllowBrowser: true,
    });
  }

  // Open with a product-specific greeting when triggered from a product card
  useEffect(() => {
    if (trigger && trigger.id !== prevTriggerIdRef.current) {
      prevTriggerIdRef.current = trigger.id;
      setMessages([{ role: 'assistant', content: trigger.greeting }]);
      setIsOpen(true);
    }
  }, [trigger]);

  // Scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingText]);

  // Focus input when opened; show default greeting on first open
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      if (messages.length === 0) {
        setMessages([
          {
            role: 'assistant',
            content:
              "Hey! I'm your RC Jiu Jitsu gear specialist. Looking for rashguards, shorts, hoodies, or tees? Ask me anything — sizing, fabric, or what's best for your training style.",
          },
        ]);
      }
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  const sendMessage = useCallback(
    async (text?: string) => {
      const messageText = text ?? input.trim();
      if (!messageText || isLoading) return;

      if (!clientRef.current) {
        setMessages((prev) => [
          ...prev,
          { role: 'user', content: messageText },
          {
            role: 'assistant',
            content:
              'API key not configured. Add VITE_ANTHROPIC_API_KEY to your .env file to enable the assistant.',
          },
        ]);
        setInput('');
        return;
      }

      const userMessage: ChatMessage = { role: 'user', content: messageText };
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setInput('');
      setIsLoading(true);
      setStreamingText('');

      try {
        const stream = await clientRef.current.messages.create({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 512,
          system: SYSTEM_PROMPT,
          messages: updatedMessages,
          stream: true,
        });

        let fullContent = '';
        for await (const event of stream) {
          if (
            event.type === 'content_block_delta' &&
            event.delta.type === 'text_delta'
          ) {
            fullContent += event.delta.text;
            setStreamingText(fullContent);
          }
        }

        setMessages((prev) => [...prev, { role: 'assistant', content: fullContent }]);
        setStreamingText('');
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content:
              "I'm having trouble connecting right now. Hit \"I'm Interested\" on any product card and we'll reach out directly.",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, input, isLoading],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-xl flex items-center justify-center transition-all duration-200 hover:scale-105"
        aria-label={isOpen ? 'Close chat' : 'Open AI assistant'}
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 flex flex-col bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-indigo-700">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-black text-sm tracking-tight">
              RC
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm leading-none">RC Gear Assistant</p>
              <p className="text-indigo-200 text-xs mt-0.5">Jiu Jitsu Specialist · Powered by Claude</p>
            </div>
            <span className="flex-shrink-0 w-2 h-2 rounded-full bg-green-400 animate-pulse" aria-label="Online" />
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-72">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[82%] px-3.5 py-2 text-sm leading-relaxed rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-sm'
                      : 'bg-gray-800 text-gray-100 rounded-bl-sm'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Streaming response */}
            {streamingText && (
              <div className="flex justify-start">
                <div className="max-w-[82%] bg-gray-800 text-gray-100 rounded-2xl rounded-bl-sm px-3.5 py-2 text-sm leading-relaxed">
                  {streamingText}
                  <span className="inline-block w-1 h-3.5 ml-0.5 bg-indigo-400 animate-pulse align-text-bottom" />
                </div>
              </div>
            )}

            {/* Typing indicator (before stream starts) */}
            {isLoading && !streamingText && (
              <div className="flex justify-start">
                <div className="bg-gray-800 rounded-2xl rounded-bl-sm px-3.5 py-3">
                  <div className="flex gap-1.5 items-center">
                    {[0, 150, 300].map((delay) => (
                      <span
                        key={delay}
                        className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                        style={{ animationDelay: `${delay}ms` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-700/60 flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about sizing, fabric, shipping…"
              disabled={isLoading}
              className="flex-1 bg-gray-800 text-white placeholder-gray-500 text-sm rounded-xl px-3.5 py-2.5 outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
            />
            <button
              onClick={() => sendMessage()}
              disabled={isLoading || !input.trim()}
              className="flex-shrink-0 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl px-3 py-2 transition-colors"
              aria-label="Send"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

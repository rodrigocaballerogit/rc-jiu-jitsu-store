import { useState } from 'react';
import Hero from './components/Hero';
import ProductShowcase from './components/ProductShowcase';
import Chatbot from './components/Chatbot';
import LeadCaptureModal from './components/LeadCaptureModal';
import NewsletterSignup from './components/NewsletterSignup';
import { ChatTrigger } from './types';

export default function App() {
  const [chatTrigger, setChatTrigger] = useState<ChatTrigger | null>(null);
  const [leadModal, setLeadModal] = useState({ isOpen: false, product: '' });

  const openChat = (greeting: string) => {
    setChatTrigger((prev) => ({
      greeting,
      id: (prev?.id ?? 0) + 1,
    }));
  };

  const handleHeroAskAI = () => {
    openChat(
      "Hey! I'm your RC Jiu Jitsu gear specialist. Ask me anything — sizing, fabric details, what's best for your training style, or which piece to grab first.",
    );
  };

  const handleProductAskAI = (message: string) => {
    openChat(message);
  };

  const handleInterested = (productName: string) => {
    setLeadModal({ isOpen: true, product: productName });
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <Hero onAskAI={handleHeroAskAI} />
      <ProductShowcase onAskAI={handleProductAskAI} onInterested={handleInterested} />
      <NewsletterSignup />
      <Chatbot trigger={chatTrigger} />
      <LeadCaptureModal
        isOpen={leadModal.isOpen}
        initialProduct={leadModal.product}
        onClose={() => setLeadModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}

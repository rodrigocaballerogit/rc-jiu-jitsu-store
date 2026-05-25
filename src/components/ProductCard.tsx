import { Product } from '../types';

const categoryConfig = {
  rashguard: {
    gradient: 'from-indigo-900 via-indigo-950 to-gray-950',
    accent: 'text-indigo-400',
    badge: 'bg-indigo-900/60 text-indigo-300',
    label: 'Rashguard',
    abbr: 'RG',
  },
  shorts: {
    gradient: 'from-red-900 via-red-950 to-gray-950',
    accent: 'text-red-400',
    badge: 'bg-red-900/60 text-red-300',
    label: 'Fight Shorts',
    abbr: 'FS',
  },
  hoodie: {
    gradient: 'from-gray-700 via-gray-800 to-gray-950',
    accent: 'text-gray-300',
    badge: 'bg-gray-700/60 text-gray-300',
    label: 'Hoodie',
    abbr: 'HD',
  },
  tshirt: {
    gradient: 'from-slate-700 via-slate-800 to-gray-950',
    accent: 'text-slate-300',
    badge: 'bg-slate-700/60 text-slate-300',
    label: 'T-Shirt',
    abbr: 'TS',
  },
};

interface ProductCardProps {
  product: Product;
  onAskAI: (message: string) => void;
  onInterested: (productName: string) => void;
}

export default function ProductCard({ product, onAskAI, onInterested }: ProductCardProps) {
  const config = categoryConfig[product.category];

  const handleAskAI = () => {
    onAskAI(
      `I'm interested in the ${product.name} (${product.price}). Can you tell me more about it — sizing, fabric, and who it's best for?`,
    );
  };

  return (
    <div className="group bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40 flex flex-col">
      {/* Image placeholder */}
      <div className={`relative aspect-square bg-gradient-to-br ${config.gradient} flex items-center justify-center overflow-hidden`}>
        {/* Category badge */}
        <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-sm ${config.badge}`}>
          {config.label}
        </span>

        {/* Price badge */}
        <span className="absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-black/40 text-gray-300 backdrop-blur-sm">
          {product.price}
        </span>

        {/* Decorative letters */}
        <div className="select-none pointer-events-none">
          <span className="text-[6rem] font-black text-white/5 leading-none tracking-tighter block">
            {config.abbr}
          </span>
        </div>

        {/* Subtle RC branding overlay */}
        <div className="absolute inset-0 flex items-end justify-center pb-4">
          <span className="text-xs font-bold tracking-[0.3em] text-white/20 uppercase">
            RC Jiu Jitsu
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-white font-bold text-base mb-1.5 leading-snug">{product.name}</h3>
        <p className="text-gray-400 text-sm leading-relaxed mb-4 flex-1">{product.description}</p>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {product.features.map((feature) => (
            <span
              key={feature}
              className="text-xs text-gray-500 bg-gray-800 px-2.5 py-0.5 rounded-full border border-gray-700"
            >
              {feature}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleAskAI}
            className="flex-1 flex items-center justify-center gap-1.5 border border-gray-700 hover:border-indigo-500 hover:text-indigo-300 text-gray-400 text-sm font-medium py-2.5 rounded-lg transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            Ask AI
          </button>
          <button
            onClick={() => onInterested(product.name)}
            className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
          >
            I'm Interested
          </button>
        </div>
      </div>
    </div>
  );
}

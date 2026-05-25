import { products } from '../data/products';
import ProductCard from './ProductCard';

interface ProductShowcaseProps {
  onAskAI: (message: string) => void;
  onInterested: (productName: string) => void;
}

export default function ProductShowcase({ onAskAI, onInterested }: ProductShowcaseProps) {
  return (
    <section id="products" className="bg-gray-950 py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold tracking-[0.2em] text-red-500 uppercase">
            The Collection
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-black text-white tracking-tight">
            Gear Built for the Mat
          </h2>
          <p className="mt-3 text-gray-400 max-w-md mx-auto">
            Every piece is designed with grapplers in mind. High-performance
            fabrics, RC-branded prints, made to order.
          </p>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAskAI={onAskAI}
              onInterested={onInterested}
            />
          ))}
        </div>

        {/* Bottom note */}
        <p className="mt-8 text-center text-xs text-gray-600">
          All products made to order via Printful · 3–5 day production · Ships worldwide
        </p>
      </div>
    </section>
  );
}

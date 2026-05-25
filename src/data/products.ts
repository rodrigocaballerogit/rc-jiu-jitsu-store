import { Product } from '../types';

export const products: Product[] = [
  {
    id: 'rashguard-001',
    name: 'RC Compression Rashguard',
    description:
      'Competition-grade rashguard with 4-way stretch fabric. Moisture-wicking and anti-bacterial for intense training sessions.',
    category: 'rashguard',
    price: 'From $45',
    features: ['4-way stretch', 'Moisture-wicking', 'Anti-odor', 'Sublimated print'],
  },
  {
    id: 'shorts-001',
    name: 'RC MMA Fight Shorts',
    description:
      'Lightweight MMA shorts designed for full range of motion. Perfect for grappling, striking, and cross-training.',
    category: 'shorts',
    price: 'From $55',
    features: ['Split waistband', 'Hook & loop closure', 'Quick-dry fabric', 'Reinforced seams'],
  },
  {
    id: 'hoodie-001',
    name: 'RC Training Hoodie',
    description:
      'Premium heavyweight hoodie for the serious grappler. Represent RC Jiu Jitsu between sessions.',
    category: 'hoodie',
    price: 'From $65',
    features: ['400gsm fleece', 'Kangaroo pocket', 'Ribbed cuffs', 'RC embroidered logo'],
  },
  {
    id: 'tshirt-001',
    name: 'RC Classic Tee',
    description:
      'Soft cotton tee with the RC Jiu Jitsu crest. Wear your affiliation with pride.',
    category: 'tshirt',
    price: 'From $30',
    features: ['100% cotton', 'Pre-shrunk', 'Unisex cut', 'Available S–3XL'],
  },
];

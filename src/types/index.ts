export interface Product {
  id: string;
  name: string;
  description: string;
  category: 'rashguard' | 'shorts' | 'hoodie' | 'tshirt';
  price: string;
  features: string[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface LeadFormData {
  name: string;
  email: string;
  interest: string;
}

export interface ChatTrigger {
  greeting: string;
  id: number;
}

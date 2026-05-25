import { useState, useEffect } from 'react';
import { LeadFormData } from '../types';

const PRODUCT_OPTIONS = [
  { value: 'RC Compression Rashguard', label: 'RC Compression Rashguard' },
  { value: 'RC MMA Fight Shorts', label: 'RC MMA Fight Shorts' },
  { value: 'RC Training Hoodie', label: 'RC Training Hoodie' },
  { value: 'RC Classic Tee', label: 'RC Classic Tee' },
  { value: 'General Interest', label: 'General Interest' },
];

interface LeadCaptureModalProps {
  isOpen: boolean;
  initialProduct: string;
  onClose: () => void;
}

export default function LeadCaptureModal({ isOpen, initialProduct, onClose }: LeadCaptureModalProps) {
  const [form, setForm] = useState<LeadFormData>({
    name: '',
    email: '',
    interest: initialProduct || 'General Interest',
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<LeadFormData>>({});

  useEffect(() => {
    if (isOpen) {
      setForm({ name: '', email: '', interest: initialProduct || 'General Interest' });
      setSubmitted(false);
      setErrors({});
    }
  }, [isOpen, initialProduct]);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const validate = (): boolean => {
    const errs: Partial<LeadFormData> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Enter a valid email';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    console.log('RC Jiu Jitsu lead captured:', {
      ...form,
      timestamp: new Date().toISOString(),
      source: 'rc-jiu-jitsu-store',
    });

    setSubmitted(true);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
        {/* Top accent */}
        <div className="h-1 bg-gradient-to-r from-indigo-600 via-indigo-400 to-indigo-600" />

        <div className="p-6">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-300 transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {submitted ? (
            <div className="py-4 text-center">
              <div className="w-14 h-14 rounded-full bg-indigo-600/20 flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-white text-xl font-bold mb-2">You're on the list!</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Thanks, <span className="text-white font-medium">{form.name}</span>! We'll reach
                out to <span className="text-white font-medium">{form.email}</span> with details
                on the {form.interest}.
              </p>
              <button
                onClick={onClose}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-2.5 rounded-lg transition-colors"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              <div className="mb-5">
                <span className="text-xs font-bold tracking-widest text-red-500 uppercase">
                  Stay Updated
                </span>
                <h2 id="modal-title" className="mt-1 text-xl font-black text-white">
                  I'm Interested
                </h2>
                <p className="mt-1 text-gray-400 text-sm">
                  Drop your details and we'll follow up when orders open.
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div>
                  <label htmlFor="lead-name" className="block text-sm font-medium text-gray-300 mb-1.5">
                    Name
                  </label>
                  <input
                    id="lead-name"
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Your name"
                    className={`w-full bg-gray-800 text-white placeholder-gray-500 text-sm rounded-lg px-4 py-2.5 outline-none border transition-colors ${
                      errors.name ? 'border-red-500' : 'border-gray-700 focus:border-indigo-500'
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-400">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="lead-email" className="block text-sm font-medium text-gray-300 mb-1.5">
                    Email
                  </label>
                  <input
                    id="lead-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="you@example.com"
                    className={`w-full bg-gray-800 text-white placeholder-gray-500 text-sm rounded-lg px-4 py-2.5 outline-none border transition-colors ${
                      errors.email ? 'border-red-500' : 'border-gray-700 focus:border-indigo-500'
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-400">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="lead-interest" className="block text-sm font-medium text-gray-300 mb-1.5">
                    Interested in
                  </label>
                  <select
                    id="lead-interest"
                    value={form.interest}
                    onChange={(e) => setForm((prev) => ({ ...prev, interest: e.target.value }))}
                    className="w-full bg-gray-800 text-white text-sm rounded-lg px-4 py-2.5 outline-none border border-gray-700 focus:border-indigo-500 transition-colors"
                  >
                    {PRODUCT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-lg transition-colors mt-2"
                >
                  Notify Me
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

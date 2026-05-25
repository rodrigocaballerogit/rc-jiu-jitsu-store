import { useState } from 'react';

export default function NewsletterSignup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid email address.');
      return;
    }
    setError('');

    console.log('RC Jiu Jitsu newsletter signup:', {
      name: name.trim() || 'Anonymous',
      email,
      timestamp: new Date().toISOString(),
    });

    setSubmitted(true);
  };

  return (
    <section className="bg-gray-900 border-t border-gray-800 py-20 px-6">
      <div className="max-w-xl mx-auto text-center">
        {/* Logo mark */}
        <div className="w-14 h-14 rounded-full bg-indigo-600/20 border border-indigo-600/30 flex items-center justify-center mx-auto mb-6">
          <span className="text-indigo-400 font-black text-lg tracking-tight">RC</span>
        </div>

        <span className="text-xs font-bold tracking-[0.2em] text-red-500 uppercase">
          Community
        </span>
        <h2 className="mt-2 text-2xl sm:text-3xl font-black text-white tracking-tight">
          Join the RC Jiu Jitsu Community
        </h2>
        <p className="mt-3 text-gray-400 text-sm leading-relaxed">
          Be the first to know when new gear drops, get training tips, and
          follow the RC Jiu Jitsu journey.
        </p>

        {submitted ? (
          <div className="mt-8 inline-flex items-center gap-2 bg-indigo-900/40 border border-indigo-700/50 text-indigo-300 px-5 py-3 rounded-xl text-sm font-medium">
            <svg className="w-4 h-4 text-indigo-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            You're in! Welcome to the RC community.
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="mt-8 flex flex-col gap-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name (optional)"
              className="w-full bg-gray-800 text-white placeholder-gray-500 text-sm rounded-lg px-4 py-3 outline-none border border-gray-700 focus:border-indigo-500 transition-colors"
            />
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Your email address"
                className={`flex-1 bg-gray-800 text-white placeholder-gray-500 text-sm rounded-lg px-4 py-3 outline-none border transition-colors ${
                  error ? 'border-red-500' : 'border-gray-700 focus:border-indigo-500'
                }`}
              />
              <button
                type="submit"
                className="flex-shrink-0 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-3 rounded-lg transition-colors whitespace-nowrap"
              >
                Join Now
              </button>
            </div>
            {error && <p className="text-xs text-red-400 text-left">{error}</p>}
          </form>
        )}

        <p className="mt-4 text-xs text-gray-600">
          No spam, ever. Unsubscribe anytime.
        </p>
      </div>

      {/* Footer */}
      <div className="mt-16 pt-6 border-t border-gray-800 text-center text-xs text-gray-600 space-y-1">
        <p className="font-bold tracking-widest text-gray-500 uppercase">RC Jiu Jitsu</p>
        <p>© {new Date().getFullYear()} RC Jiu Jitsu. All rights reserved.</p>
        <p className="text-gray-700">Gear made to order via Printful · Powered by Claude AI</p>
      </div>
    </section>
  );
}

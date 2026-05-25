interface HeroProps {
  onAskAI: () => void;
}

export default function Hero({ onAskAI }: HeroProps) {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-950 grid-bg"
    >
      {/* Radial glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full bg-indigo-950 opacity-60 blur-3xl" />
      </div>

      {/* Red accent bar — top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent" />

      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        {/* Badge */}
        <span className="inline-flex items-center gap-2 mb-6 text-xs font-bold tracking-[0.2em] text-red-500 uppercase">
          <span className="w-4 h-px bg-red-500" />
          Combat Sports Gear
          <span className="w-4 h-px bg-red-500" />
        </span>

        {/* Logo mark */}
        <div className="mb-2">
          <h1 className="text-[5rem] sm:text-[8rem] font-black text-white tracking-tighter leading-none">
            RC
          </h1>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-[0.15em] uppercase mb-6">
          Jiu Jitsu
        </h2>

        {/* Divider */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-indigo-600 to-transparent" />
          <span className="text-gray-500 text-xs tracking-widest uppercase font-medium">
            Official Gear Collection
          </span>
          <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-indigo-600 to-transparent" />
        </div>

        {/* Tagline */}
        <p className="text-gray-400 text-base sm:text-lg leading-relaxed mb-10 max-w-md mx-auto">
          Premium training gear designed for grapplers who train hard and
          represent harder.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="#products"
            className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3.5 rounded-lg transition-colors duration-200"
          >
            Shop the Collection
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </a>
          <button
            onClick={onAskAI}
            className="inline-flex items-center justify-center gap-2 border border-gray-600 hover:border-indigo-500 hover:text-indigo-300 text-gray-300 font-semibold px-8 py-3.5 rounded-lg transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            Ask AI Assistant
          </button>
        </div>

        {/* Scroll cue */}
        <div className="mt-16 flex justify-center">
          <div className="flex flex-col items-center gap-1 text-gray-600 text-xs tracking-widest animate-bounce">
            <span className="uppercase">Scroll</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Red accent bar — bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
    </section>
  );
}

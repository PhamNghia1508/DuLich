import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Star } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

function useRedirectParam(): string {
  const search = window.location.search;
  const params = new URLSearchParams(search);
  return params.get('redirect') || '/';
}

// ─── Saigon & Vietnam Tourism Atmospheric Slides ─────────────────────────────
const SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&h=1100&q=80",
    eyebrow: "YOUR SAIGON JOURNEY STARTS HERE",
    title: "Explore the historic heart of Saigon.",
    description: "From French colonial landmarks to hidden local coffee spots, experience Saigon alongside passionate local guides.",
    quote: "Minh made our Saigon trip unforgettable. He knew every hidden alley and the best banh mi in the city.",
    author: "Sophie L.",
    location: "France",
    avatar: "https://picsum.photos/seed/sophie-traveler/48/48"
  },
  {
    image: "https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=900&h=1100&q=80",
    eyebrow: "VIBRANT STREETS & MARKETS",
    title: "Taste the authentic local flavors.",
    description: "Navigate bustling street food hubs and local markets. Let verified guides show you Saigon's best culinary secrets.",
    quote: "The food tour with Linh was incredible. We ate things we would never have found on our own!",
    author: "Alex K.",
    location: "Germany",
    avatar: "https://picsum.photos/seed/alex-traveler/48/48"
  },
  {
    image: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=900&h=1100&q=80",
    eyebrow: "LOCAL LIFELINES & CULTURE",
    title: "Travel deeper, not just further.",
    description: "Connect with locals who can show you the city from a different perspective and make you feel right at home.",
    quote: "Highly recommend! Booking through Friendlocalcheap gave us a real friend in Ho Chi Minh City.",
    author: "Sarah M.",
    location: "Australia",
    avatar: "https://picsum.photos/seed/sarah-traveler/48/48"
  }
];

// ─── Avatar stack for social proof ───────────────────────────────────────────
const AVATARS = [
  "https://picsum.photos/seed/av1/32/32",
  "https://picsum.photos/seed/av2/32/32",
  "https://picsum.photos/seed/av3/32/32",
  "https://picsum.photos/seed/av4/32/32",
];

export default function SignInPage() {
  const [, navigate] = useLocation();
  const redirectTo = useRedirectParam();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide every 3.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    try {
      await login(email);
      navigate(redirectTo as string);
    } catch (err: any) {
      setError(err?.message || 'Failed to sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isBookingRedirect = redirectTo.startsWith('/book/') || redirectTo.startsWith('/guides/');

  return (
    <div className="h-screen w-screen flex bg-[var(--color-bg)] overflow-hidden">
      {/* ─── LEFT: Atmospheric Slideshow Panel (60%) ──────────────────────── */}
      <div className="hidden lg:flex lg:w-[58%] relative overflow-hidden h-full">
        {/* Background slide images with smooth cross-fade */}
        {SLIDES.map((slide, index) => (
          <img
            key={index}
            src={slide.image}
            alt=""
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          />
        ))}

        {/* Dark overlay for clean contrast */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#07130F]/85 via-[#132A21]/55 to-[#07130F]/80 z-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050D0A]/90 via-transparent to-transparent z-0" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between h-full p-16 text-white w-full">
          {/* Brand mark top */}
          <Link href="/" className="flex items-center gap-3 w-fit cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-[var(--color-accent)] flex items-center justify-center shadow-md">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
            <span
              className="font-bold text-xl tracking-tight text-white drop-shadow-sm"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Friendlocalcheap
            </span>
          </Link>

          {/* Editorial dynamic text and cards */}
          <div className="space-y-8 max-w-md my-auto">
            {/* Dynamic slides text containing high-contrast warm-beige text styling */}
            <div className="space-y-4 transition-all duration-500">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-accent-muted)] drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                {SLIDES[currentSlide].eyebrow}
              </p>
              <h2
                className="text-4xl xl:text-5xl font-bold leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-bg)' }}
              >
                {SLIDES[currentSlide].title}
              </h2>
              <p 
                className="text-sm xl:text-base leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]"
                style={{ color: 'var(--color-border-light)' }}
              >
                {SLIDES[currentSlide].description}
              </p>
            </div>

            {/* Testimonial slider card */}
            <div className="bg-white/12 backdrop-blur-md border border-white/20 rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={13} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-white text-sm leading-relaxed italic drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
                "{SLIDES[currentSlide].quote}"
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={SLIDES[currentSlide].avatar}
                    alt={SLIDES[currentSlide].author}
                    className="w-9 h-9 rounded-full object-cover border border-white/30"
                  />
                  <div>
                    <p className="text-white text-xs font-bold">{SLIDES[currentSlide].author}</p>
                    <p className="text-white/60 text-[10px]">{SLIDES[currentSlide].location}</p>
                  </div>
                </div>
                {/* Dots indicator */}
                <div className="flex gap-1.5">
                  {SLIDES.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentSlide(i)}
                      className={`w-1.5 h-1.5 rounded-full transition-all border-0 cursor-pointer ${
                        i === currentSlide ? 'bg-[var(--color-accent)] w-4' : 'bg-white/40 hover:bg-white/60'
                      }`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Social proof bottom */}
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {AVATARS.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  className="w-8 h-8 rounded-full border-2 border-[#132A21] object-cover"
                />
              ))}
            </div>
            <p className="text-xs xl:text-sm text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
              Join <span className="text-white font-bold">2,400+</span> travelers who've explored Saigon with local friends
            </p>
          </div>
        </div>

        {/* Grain overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* ─── RIGHT: Form Panel (42%) ───────────────────────────────────────── */}
      <div className="w-full lg:w-[42%] flex items-center justify-center p-8 sm:p-12 h-full overflow-y-auto relative">
        {/* Simple Back to Home action button for top-right */}
        <Link href="/" className="absolute top-8 right-8 text-xs font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors flex items-center gap-1 cursor-pointer">
          Back to home
        </Link>

        <div className="w-full max-w-[380px] space-y-7 py-6">
          {/* Booking context banner */}
          {isBookingRedirect && (
            <div className="bg-[var(--color-primary)]/8 border border-[var(--color-primary)]/20 rounded-xl px-4 py-3 flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[var(--color-accent)] flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg width="12" height="12" fill="white" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wide">Almost there!</p>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                  Sign in to complete your booking with your guide.
                </p>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="space-y-2">
            {/* Small branding icon for mobile view */}
            <div className="flex lg:hidden items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-[var(--color-accent)] flex items-center justify-center text-white">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                </svg>
              </div>
              <span className="font-bold text-base tracking-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
                Friendlocalcheap
              </span>
            </div>

            <h1
              className="text-3xl font-bold text-[var(--color-text)] tracking-tight"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Welcome back
            </h1>
            <p className="text-sm text-[var(--color-text-muted)]">
              Sign in to your Friendlocalcheap account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4.5" noValidate>
            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">
                Email address
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-light)] pointer-events-none"
                />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="auth-input has-icon"
                  aria-required="true"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs text-[var(--color-accent)] hover:text-[var(--color-accent-light)] font-semibold transition-colors bg-transparent border-0 cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-light)] pointer-events-none"
                />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="auth-input has-icon has-icon-right"
                  aria-required="true"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-light)] hover:text-[var(--color-text-muted)] transition-colors p-0.5 bg-transparent border-0 cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div role="alert" className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3.5 py-2.5 flex items-center gap-2">
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-accent w-full text-sm font-semibold relative overflow-hidden mt-3 cursor-pointer"
              style={{ minHeight: '48px' }}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Signing in…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign in
                  <ArrowRight size={16} />
                </span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--color-border-light)]" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[var(--color-bg)] px-3 text-xs text-[var(--color-text-light)]">or continue with</span>
            </div>
          </div>

          {/* Social login: Google & Facebook */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="btn btn-ghost text-sm font-medium gap-2.5 cursor-pointer"
            >
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"/>
                <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"/>
                <path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"/>
                <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"/>
              </svg>
              Google
            </button>
            <button
              type="button"
              className="btn btn-ghost text-sm font-medium gap-2.5 cursor-pointer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </button>
          </div>

          {/* Sign up link */}
          <p className="text-center text-sm text-[var(--color-text-muted)]">
            Don't have an account?{' '}
            <Link
              href={`/signup${redirectTo !== '/' ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`}
              className="text-[var(--color-accent)] hover:text-[var(--color-accent-light)] font-bold transition-colors cursor-pointer"
            >
              Create one free
            </Link>
          </p>

          {/* Trust line */}
          <p className="text-center text-[10px] text-[var(--color-text-light)] leading-relaxed">
            By signing in, you agree to our{' '}
            <Link href="/terms" className="underline hover:text-[var(--color-text-muted)] transition-colors cursor-pointer">Terms</Link>
            {' '}and{' '}
            <Link href="/privacy" className="underline hover:text-[var(--color-text-muted)] transition-colors cursor-pointer">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}

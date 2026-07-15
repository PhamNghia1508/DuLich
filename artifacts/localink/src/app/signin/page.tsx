import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Star } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import { useAuth } from '@/hooks/useAuth';

function useRedirectParam(): string {
  const search = window.location.search;
  const params = new URLSearchParams(search);
  return params.get('redirect') || '/';
}

// ─── Testimonials for left panel ─────────────────────────────────────────────
const TESTIMONIALS = [
  {
    text: "Minh made our Saigon trip unforgettable. He knew every hidden alley and the best banh mi in the city.",
    author: "Sophie L.",
    location: "France",
    avatar: "https://picsum.photos/seed/sophie-traveler/48/48",
    rating: 5,
  },
  {
    text: "Booking through LocalLink was the best decision we made. Our guide felt like a real friend.",
    author: "Alex K.",
    location: "Germany",
    avatar: "https://picsum.photos/seed/alex-traveler/48/48",
    rating: 5,
  },
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
  const [activeTestimonial, setActiveTestimonial] = useState(0);

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
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col">
      <Navbar />

      <main className="flex-1 flex">
        {/* ─── LEFT: Atmospheric Panel ───────────────────────────────────────── */}
        <div className="hidden lg:flex lg:w-[58%] relative overflow-hidden">
          {/* Background image */}
          <img
            src="https://picsum.photos/seed/saigon-street-night/900/1100"
            alt="Explore Vietnam with a local guide"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Gradient overlay layers */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0D2118]/80 via-[#1C3A2E]/55 to-[#0D2118]/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1A10]/90 via-transparent to-transparent" />

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-between h-full p-12 text-white">
            {/* Brand mark top */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[var(--color-accent)] flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>
              <span
                className="font-bold text-lg tracking-tight"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                Local<span className="text-[var(--color-accent)]">Link</span>
              </span>
            </div>

            {/* Center editorial text */}
            <div className="space-y-6 max-w-md">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-accent-muted)]">
                YOUR SAIGON JOURNEY STARTS HERE
              </p>
              <h2
                className="text-4xl xl:text-5xl font-bold leading-tight text-white"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                Travel deeper,<br />
                not just <em className="italic text-[var(--color-accent-muted)]">further.</em>
              </h2>
              <p className="text-[var(--color-on-dark-muted)] text-base leading-relaxed">
                Connect with verified local guides who know every hidden alley, 
                the best street food stalls, and the stories behind every corner.
              </p>

              {/* Testimonial carousel */}
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 space-y-3">
                <div className="flex gap-0.5">
                  {Array.from({ length: TESTIMONIALS[activeTestimonial].rating }).map((_, i) => (
                    <Star key={i} size={13} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-white/90 text-sm leading-relaxed italic">
                  "{TESTIMONIALS[activeTestimonial].text}"
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={TESTIMONIALS[activeTestimonial].avatar}
                      alt={TESTIMONIALS[activeTestimonial].author}
                      className="w-8 h-8 rounded-full object-cover border border-white/30"
                    />
                    <div>
                      <p className="text-white text-xs font-semibold">{TESTIMONIALS[activeTestimonial].author}</p>
                      <p className="text-white/50 text-[10px]">{TESTIMONIALS[activeTestimonial].location}</p>
                    </div>
                  </div>
                  {/* Dots */}
                  <div className="flex gap-1.5">
                    {TESTIMONIALS.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveTestimonial(i)}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${
                          i === activeTestimonial ? 'bg-white w-4' : 'bg-white/30'
                        }`}
                        aria-label={`Testimonial ${i + 1}`}
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
                    className="w-8 h-8 rounded-full border-2 border-white/30 object-cover"
                  />
                ))}
              </div>
              <p className="text-sm text-white/70">
                Join <span className="text-white font-semibold">2,400+</span> travelers who've explored with a local
              </p>
            </div>
          </div>

          {/* Grain texture overlay */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* ─── RIGHT: Form Panel ─────────────────────────────────────────────── */}
        <div className="w-full lg:w-[42%] flex items-center justify-center p-6 sm:p-10 lg:p-12">
          <div className="w-full max-w-[400px] space-y-7">

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
            <div className="space-y-1.5">
              <h1
                className="text-3xl font-bold text-[var(--color-text)] tracking-tight"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                Welcome back
              </h1>
              <p className="text-sm text-[var(--color-text-muted)]">
                Sign in to your LocalLink account
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>

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
                    className="auth-input pl-10"
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
                    className="text-xs text-[var(--color-accent)] hover:text-[var(--color-accent-light)] font-medium transition-colors"
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
                    className="auth-input pl-10 pr-11"
                    aria-required="true"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-light)] hover:text-[var(--color-text-muted)] transition-colors p-0.5"
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
                className="btn btn-accent w-full text-sm font-semibold mt-2 relative overflow-hidden"
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

            {/* Social login */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="btn btn-ghost text-sm font-medium gap-2.5"
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
                className="btn btn-ghost text-sm font-medium gap-2.5"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </button>
            </div>

            {/* Sign up link */}
            <p className="text-center text-sm text-[var(--color-text-muted)]">
              Don't have an account?{' '}
              <Link
                href={`/signup${redirectTo !== '/' ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`}
                className="text-[var(--color-accent)] hover:text-[var(--color-accent-light)] font-semibold transition-colors"
              >
                Create one free
              </Link>
            </p>

            {/* Trust line */}
            <p className="text-center text-[10px] text-[var(--color-text-light)] leading-relaxed">
              By signing in, you agree to our{' '}
              <Link href="/terms" className="underline hover:text-[var(--color-text-muted)] transition-colors">Terms</Link>
              {' '}and{' '}
              <Link href="/privacy" className="underline hover:text-[var(--color-text-muted)] transition-colors">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

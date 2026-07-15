import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Check } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';

function useRedirectParam(): string {
  const search = window.location.search;
  const params = new URLSearchParams(search);
  return params.get('redirect') || '/';
}

// ─── Password strength checker ────────────────────────────────────────────────
function getPasswordStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { score, label: 'Weak', color: '#ef4444' };
  if (score === 2) return { score, label: 'Fair', color: '#f59e0b' };
  if (score === 3) return { score, label: 'Good', color: '#3b82f6' };
  return { score, label: 'Strong', color: '#22c55e' };
}

// ─── Benefits list for left panel ────────────────────────────────────────────
const BENEFITS = [
  "Verified local guides with real reviews",
  "Secure booking & flexible cancellation",
  "24/7 traveler support from our team",
  "Instant messaging with your guide",
];

// ─── Scenic images for visual variety ────────────────────────────────────────
const AVATARS = [
  "https://picsum.photos/seed/av5/32/32",
  "https://picsum.photos/seed/av6/32/32",
  "https://picsum.photos/seed/av7/32/32",
  "https://picsum.photos/seed/av8/32/32",
];

export default function SignUpPage() {
  const [, navigate] = useLocation();
  const redirectTo = useRedirectParam();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const pwStrength = getPasswordStrength(form.password);

  const updateField = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    // Clear field error on change
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.firstName.trim()) newErrors.firstName = 'First name is required.';
    if (!form.lastName.trim()) newErrors.lastName = 'Last name is required.';
    if (!form.email.includes('@')) newErrors.email = 'Please enter a valid email.';
    if (form.password.length < 8) newErrors.password = 'Password must be at least 8 characters.';
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match.';
    if (!agreed) newErrors.agreed = 'You must agree to the terms.';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    setIsLoading(false);
    // Mock success → go to sign in
    navigate(`/signin${redirectTo !== '/' ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`);
  };

  const isBookingRedirect = redirectTo.startsWith('/book/') || redirectTo.startsWith('/guides/');

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col">
      <Navbar />

      <main className="flex-1 flex">
        {/* ─── LEFT: Atmospheric Panel ───────────────────────────────────────── */}
        <div className="hidden lg:flex lg:w-[58%] relative overflow-hidden">
          <img
            src="https://picsum.photos/seed/vietnam-market-morning/900/1100"
            alt="Vietnam local market experience"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Layered gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0D2118]/85 via-[#1C3A2E]/60 to-[#0D2118]/75" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1A10]/90 via-transparent to-transparent" />

          <div className="relative z-10 flex flex-col justify-between h-full p-12 text-white">
            {/* Brand */}
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

            {/* Editorial headline */}
            <div className="space-y-6 max-w-md">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-accent-muted)]">
                START YOUR ADVENTURE
              </p>
              <h2
                className="text-4xl xl:text-5xl font-bold leading-tight text-white"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                Every great trip<br />
                begins with a <em className="italic text-[var(--color-accent-muted)]">local.</em>
              </h2>
              <p className="text-[var(--color-on-dark-muted)] text-base leading-relaxed">
                Create your free account and get matched with verified local guides 
                who'll take you beyond the tourist trail.
              </p>

              {/* Benefits list */}
              <ul className="space-y-3">
                {BENEFITS.map((benefit, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[var(--color-accent)]/20 border border-[var(--color-accent)]/40 flex items-center justify-center flex-shrink-0">
                      <Check size={11} className="text-[var(--color-accent-muted)]" />
                    </div>
                    <span className="text-sm text-white/80">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social proof */}
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
                <span className="text-white font-semibold">Free to join</span> — book your first experience today
              </p>
            </div>
          </div>

          {/* Grain overlay */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* ─── RIGHT: Form Panel ─────────────────────────────────────────────── */}
        <div className="w-full lg:w-[42%] flex items-center justify-center p-6 sm:p-10 lg:p-12 overflow-y-auto">
          <div className="w-full max-w-[400px] space-y-6 py-4">

            {/* Booking context banner */}
            {isBookingRedirect && (
              <div className="bg-[var(--color-primary)]/8 border border-[var(--color-primary)]/20 rounded-xl px-4 py-3 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[var(--color-accent)] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg width="12" height="12" fill="white" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wide">Create an account to book</p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                    It's free and takes less than a minute.
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
                Create your account
              </h1>
              <p className="text-sm text-[var(--color-text-muted)]">
                Free forever. No credit card required.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>

              {/* Name row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label htmlFor="firstName" className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">
                    First name
                  </label>
                  <div className="relative">
                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-light)] pointer-events-none" />
                    <input
                      id="firstName"
                      type="text"
                      autoComplete="given-name"
                      value={form.firstName}
                      onChange={updateField('firstName')}
                      placeholder="Alex"
                      className={`auth-input pl-9 ${errors.firstName ? 'auth-input-error' : ''}`}
                    />
                  </div>
                  {errors.firstName && <p className="text-[10px] text-red-500">{errors.firstName}</p>}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="lastName" className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">
                    Last name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    autoComplete="family-name"
                    value={form.lastName}
                    onChange={updateField('lastName')}
                    placeholder="Kim"
                    className={`auth-input ${errors.lastName ? 'auth-input-error' : ''}`}
                  />
                  {errors.lastName && <p className="text-[10px] text-red-500">{errors.lastName}</p>}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">
                  Email address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-light)] pointer-events-none" />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={updateField('email')}
                    placeholder="you@example.com"
                    className={`auth-input pl-10 ${errors.email ? 'auth-input-error' : ''}`}
                  />
                </div>
                {errors.email && <p className="text-[10px] text-red-500">{errors.email}</p>}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label htmlFor="password" className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">
                  Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-light)] pointer-events-none" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={form.password}
                    onChange={updateField('password')}
                    placeholder="Min. 8 characters"
                    className={`auth-input pl-10 pr-11 ${errors.password ? 'auth-input-error' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-light)] hover:text-[var(--color-text-muted)] transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Password strength bar */}
                {form.password.length > 0 && (
                  <div className="space-y-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          className="h-1 flex-1 rounded-full transition-all duration-300"
                          style={{
                            backgroundColor: step <= pwStrength.score ? pwStrength.color : 'var(--color-border-light)',
                          }}
                        />
                      ))}
                    </div>
                    <p className="text-[10px] font-medium" style={{ color: pwStrength.color }}>
                      {pwStrength.label} password
                    </p>
                  </div>
                )}
                {errors.password && <p className="text-[10px] text-red-500">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label htmlFor="confirmPassword" className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">
                  Confirm password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-light)] pointer-events-none" />
                  <input
                    id="confirmPassword"
                    type={showConfirm ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={form.confirmPassword}
                    onChange={updateField('confirmPassword')}
                    placeholder="Repeat your password"
                    className={`auth-input pl-10 pr-11 ${errors.confirmPassword ? 'auth-input-error' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-light)] hover:text-[var(--color-text-muted)] transition-colors"
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-[10px] text-red-500">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Terms checkbox */}
              <div className="space-y-1">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex-shrink-0 mt-0.5">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => {
                        setAgreed(e.target.checked);
                        if (errors.agreed) setErrors((prev) => ({ ...prev, agreed: '' }));
                      }}
                      className="sr-only"
                      id="terms"
                    />
                    <div
                      className={`w-4.5 h-4.5 rounded border-2 flex items-center justify-center transition-all ${
                        agreed
                          ? 'bg-[var(--color-accent)] border-[var(--color-accent)]'
                          : 'border-[var(--color-border)] group-hover:border-[var(--color-accent)]'
                      }`}
                      style={{ width: '18px', height: '18px' }}
                    >
                      {agreed && <Check size={11} color="white" strokeWidth={3} />}
                    </div>
                  </div>
                  <span className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                    I agree to the{' '}
                    <Link href="/terms" className="text-[var(--color-accent)] hover:underline">Terms of Service</Link>
                    {' '}and{' '}
                    <Link href="/privacy" className="text-[var(--color-accent)] hover:underline">Privacy Policy</Link>
                  </span>
                </label>
                {errors.agreed && <p className="text-[10px] text-red-500 pl-6">{errors.agreed}</p>}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-accent w-full text-sm font-semibold"
                style={{ minHeight: '48px' }}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Creating account…
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Create free account
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
              <button type="button" className="btn btn-ghost text-sm font-medium gap-2.5">
                <svg width="18" height="18" viewBox="0 0 48 48">
                  <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"/>
                  <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"/>
                  <path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"/>
                  <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"/>
                </svg>
                Google
              </button>
              <button type="button" className="btn btn-ghost text-sm font-medium gap-2.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </button>
            </div>

            {/* Sign in link */}
            <p className="text-center text-sm text-[var(--color-text-muted)]">
              Already have an account?{' '}
              <Link
                href={`/signin${redirectTo !== '/' ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`}
                className="text-[var(--color-accent)] hover:text-[var(--color-accent-light)] font-semibold transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

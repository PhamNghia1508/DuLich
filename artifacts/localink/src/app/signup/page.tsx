import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Check, Star } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

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

// ─── Saigon & Vietnam Tourism Atmospheric Slides ─────────────────────────────
const SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&h=1100&q=80",
    eyebrow: "YOUR SAIGON JOURNEY STARTS HERE",
    title: "Explore the historic heart of Saigon.",
    description: "From historic architecture to hidden alleys, discover the stories behind city landmarks with passionate local guides.",
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
  const { signup } = useAuth();

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
  const [currentSlide, setCurrentSlide] = useState(0);

  const pwStrength = getPasswordStrength(form.password);

  // Auto-slide background every 3.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

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
    try {
      await signup(form.email, `${form.firstName} ${form.lastName}`);
      // Successful signup automatically logs user in -> navigate to target
      navigate(redirectTo as string);
    } catch (err: any) {
      setErrors((prev) => ({ ...prev, form: err?.message || 'Failed to create account.' }));
    } finally {
      setIsLoading(false);
    }
  };

  const isBookingRedirect = redirectTo.startsWith('/book/') || redirectTo.startsWith('/guides/');

  return (
    <div className="h-screen w-screen flex bg-[var(--color-bg)] overflow-hidden">
      {/* ─── LEFT: Form Panel (42%) (Swapped layout for signup page) ──────── */}
      <div className="w-full lg:w-[42%] flex items-center justify-center p-8 sm:p-12 h-full overflow-y-auto relative">
        {/* Simple Back to Home action button for top-left */}
        <Link href="/" className="absolute top-8 left-8 text-xs font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors flex items-center gap-1 cursor-pointer">
          Back to home
        </Link>

        <div className="w-full max-w-[380px] space-y-6 py-6">
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
          <div className="space-y-2">
            {/* Small branding icon for mobile view */}
            <div className="flex lg:hidden items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-[var(--color-accent)] flex items-center justify-center text-white">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                </svg>
              </div>
              <span className="font-bold text-base tracking-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
                Friendlocal<span className="text-[var(--color-accent)]">cheap</span>
              </span>
            </div>

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
                    className={`auth-input has-icon ${errors.firstName ? 'auth-input-error' : ''}`}
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
                  className={`auth-input has-icon ${errors.email ? 'auth-input-error' : ''}`}
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
                  className={`auth-input has-icon has-icon-right ${errors.password ? 'auth-input-error' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-light)] hover:text-[var(--color-text-muted)] transition-colors bg-transparent border-0 cursor-pointer"
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
                  className={`auth-input has-icon has-icon-right ${errors.confirmPassword ? 'auth-input-error' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-light)] hover:text-[var(--color-text-muted)] transition-colors bg-transparent border-0 cursor-pointer"
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
            <div className="space-y-1.5">
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
                  <Link href="/terms" className="text-[var(--color-accent)] hover:underline cursor-pointer">Terms of Service</Link>
                  {' '}and{' '}
                  <Link href="/privacy" className="text-[var(--color-accent)] hover:underline cursor-pointer">Privacy Policy</Link>
                </span>
              </label>
              {errors.agreed && <p className="text-[10px] text-red-500 pl-6">{errors.agreed}</p>}
            </div>

            {errors.form && (
              <div role="alert" className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3.5 py-2.5 flex items-center gap-2">
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
                {errors.form}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-accent w-full text-sm font-semibold mt-3 cursor-pointer"
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

          {/* Social login: Google & Facebook */}
          <div className="grid grid-cols-2 gap-3">
            <button type="button" className="btn btn-ghost text-sm font-medium gap-2.5 cursor-pointer">
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"/>
                <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"/>
                <path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"/>
                <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"/>
              </svg>
              Google
            </button>
            <button type="button" className="btn btn-ghost text-sm font-medium gap-2.5 cursor-pointer">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </button>
          </div>

          {/* Sign in link */}
          <p className="text-center text-sm text-[var(--color-text-muted)]">
            Already have an account?{' '}
            <Link
              href={`/signin${redirectTo !== '/' ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`}
              className="text-[var(--color-accent)] hover:text-[var(--color-accent-light)] font-bold transition-colors cursor-pointer"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* ─── RIGHT: Atmospheric Slideshow Panel (60%) ─────────────────────── */}
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
              Friendlocal<span className="text-[var(--color-accent-light)]">cheap</span>
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
    </div>
  );
}

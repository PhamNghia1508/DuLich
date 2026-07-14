'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Accessibility, Building2, Camera, Check, ChevronDown, Compass,
  History, Map, Moon, SearchX, ShieldCheck, SlidersHorizontal,
  Sparkles, Store, Utensils, X,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import GuideCard from '@/components/guides/GuideCard';
import MockMap from '@/components/guides/MockMap';
import { GUIDES } from '@/data/mockData';
import { personalityLabel } from '@/lib/utils';
import type { ExperienceCategory, GuideGender } from '@/types';

const categories = [
  { id: 'all', label: 'All Guides', icon: Compass },
  { id: 'street-food', label: 'Street Food', icon: Utensils },
  { id: 'history-culture', label: 'History & Culture', icon: History },
  { id: 'hidden-neighborhoods', label: 'Hidden Neighborhoods', icon: Store },
  { id: 'museums-architecture', label: 'Architecture', icon: Building2 },
  { id: 'nightlife', label: 'Nightlife', icon: Moon },
  { id: 'photography', label: 'Photography', icon: Camera },
  { id: 'outdoor-adventure', label: 'Outdoor', icon: Sparkles },
  { id: 'accessible-travel', label: 'Accessible Travel', icon: Accessibility },
] as const;

const languages = [
  { id: 'all', label: 'Any language' },
  { id: 'en', label: 'English' },
  { id: 'fr', label: 'French' },
  { id: 'ja', label: 'Japanese' },
  { id: 'ko', label: 'Korean' },
];

const genders = [
  { id: 'all', label: 'No preference' },
  { id: 'female', label: 'Woman guide' },
  { id: 'male', label: 'Man guide' },
];

const styleOptions = ['calm-thoughtful', 'friendly-talkative', 'energetic'];
const sortOptions = ['match', 'rating', 'price'];

function oneOf(value: string | null, values: readonly string[], fallback = 'all') {
  return value && values.includes(value) ? value : fallback;
}

function Filters({
  lang, setLang,
  date, setDate,
  gender, setGender,
  maxPrice, setMaxPrice,
  verified, setVerified,
  accessible, setAccessible,
  instant, setInstant,
  styles, setStyles,
  clear,
  active,
  hideHeader = false,
}: {
  lang: string; setLang: (v: string) => void;
  date: string; setDate: (v: string) => void;
  gender: string; setGender: (v: string) => void;
  maxPrice: number; setMaxPrice: (v: number) => void;
  verified: boolean; setVerified: (v: boolean) => void;
  accessible: boolean; setAccessible: (v: boolean) => void;
  instant: boolean; setInstant: (v: boolean) => void;
  styles: string[]; setStyles: (v: string[]) => void;
  clear: () => void;
  active: number;
  hideHeader?: boolean;
}) {
  const check = (value: boolean, onChange: (v: boolean) => void, label: string, note?: string, key?: string) => (
    <label className="guide-check-row" key={key}>
      <input type="checkbox" checked={value} onChange={e => onChange(e.target.checked)} />
      <span className="guide-check-box">
        <Check size={12} strokeWidth={3} />
      </span>
      <span>
        <strong>{label}</strong>
        {note && <small>{note}</small>}
      </span>
    </label>
  );

  return (
    <div className="guide-filters">
      {!hideHeader && (
        <div className="guide-filter-heading">
          <div>
            <span>Refine your match</span>
            {active > 0 ? (
              <small className="text-[#C4614A] font-semibold">{active} active filters</small>
            ) : (
              <small>Choose what matters most</small>
            )}
          </div>
          <button type="button" onClick={clear}>Clear all</button>
        </div>
      )}

      {/* 1. Languages */}
      <fieldset style={{ borderTop: hideHeader ? '0' : '1px solid var(--color-border-light)' }}>
        <legend>Languages</legend>
        {languages.map(item => (
          <label className="guide-radio-row" key={item.id}>
            <input
              type="radio"
              name="language"
              checked={lang === item.id}
              onChange={() => setLang(item.id)}
            />
            <span />
            {item.label}
          </label>
        ))}
      </fieldset>

      {/* 2. Availability */}
      <fieldset>
        <legend>Availability</legend>
        <div style={{ minHeight: '40px' }} className="flex items-center relative">
          <input
            type="date"
            className="input w-full text-xs"
            style={{
              padding: '0.5rem 2.25rem 0.5rem 0.75rem',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              background: '#fff',
              color: 'var(--color-text)',
              minHeight: '40px',
              cursor: 'pointer',
            }}
            value={date}
            onChange={e => setDate(e.target.value)}
            aria-label="Available on or before date"
          />
          {date && (
            <button
              type="button"
              onClick={() => setDate('')}
              className="absolute right-3 text-[var(--color-text-light)] hover:text-[var(--color-text)] bg-transparent border-0 p-0"
              style={{ top: '50%', transform: 'translateY(-50%)', minHeight: 'auto' }}
              aria-label="Clear date"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <small className="block mt-1 text-[11px] text-[var(--color-text-light)]">
          Show guides available on or before this date
        </small>
      </fieldset>

      {/* 3. Price */}
      <fieldset>
        <legend>Price per hour</legend>
        <div className="guide-price">
          <span>Up to</span>
          <strong>${maxPrice}</strong>
        </div>
        <input
          className="guide-range"
          type="range"
          min="14"
          max="40"
          value={maxPrice}
          onChange={e => setMaxPrice(Number(e.target.value))}
          aria-label="Maximum hourly price"
        />
      </fieldset>

      {/* 4. Guide preference */}
      <fieldset>
        <legend>Guide preference</legend>
        {genders.map(item => (
          <label className="guide-radio-row" key={item.id}>
            <input
              type="radio"
              name="gender"
              checked={gender === item.id}
              onChange={() => setGender(item.id)}
            />
            <span />
            {item.label}
          </label>
        ))}
      </fieldset>

      {/* 5. Guiding style */}
      <fieldset>
        <legend>Guiding style</legend>
        {styleOptions.map(style =>
          check(
            styles.includes(style),
            () => setStyles(styles.includes(style) ? styles.filter(s => s !== style) : [...styles, style]),
            personalityLabel(style),
            undefined,
            style
          )
        )}
      </fieldset>

      {/* 6. Accessibility */}
      <fieldset>
        <legend>Accessibility</legend>
        {check(accessible, setAccessible, 'Accessibility-aware guides', 'Experience adapting pace and routes')}
      </fieldset>

      {/* 7. Booking options */}
      <fieldset>
        <legend>Booking options</legend>
        {check(verified, setVerified, 'Reviewed profiles only', 'Identity and profile reviewed')}
        {check(instant, setInstant, 'Instant confirmation', 'Book without waiting')}
      </fieldset>
    </div>
  );
}

function GuidesContent() {
  const params = useSearchParams();
  const router = useRouter();
  const lang = oneOf(params.get('lang'), languages.map(item => item.id));
  const category = oneOf(params.get('category'), categories.map(item => item.id));
  const gender = oneOf(params.get('gender'), genders.map(item => item.id));
  const parsedPrice = Number(params.get('maxPrice'));
  const maxPrice = Number.isFinite(parsedPrice) && parsedPrice >= 14 && parsedPrice <= 40 ? parsedPrice : 40;
  const verified = params.get('verified') !== 'false';
  const accessible = params.get('accessibility') === 'true';
  const instant = params.get('instant') === 'true';
  const date = params.get('date') || '';
  const styles = (params.get('styles') || '').split(',').filter(style => styleOptions.includes(style));
  const sort = oneOf(params.get('sort'), sortOptions, 'match');

  const [drawer, setDrawer] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [hoveredGuideId, setHoveredGuideId] = useState<string | null>(null);
  const [moreOpen, setMoreOpen] = useState(false);

  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  // Keep selected category visible by scrolling it in
  useEffect(() => {
    if (!categoryScrollRef.current) return;
    const activeBtn = categoryScrollRef.current.querySelector('[aria-pressed="true"]');
    if (activeBtn) {
      activeBtn.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [category]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    const escHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMoreOpen(false);
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('keydown', escHandler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('keydown', escHandler);
    };
  }, []);

  const update = (changes: Record<string, string | number | boolean | string[]>) => {
    const next = new URLSearchParams(params.toString());
    next.set('tab', 'experiences');
    Object.entries(changes).forEach(([key, value]) => {
      const serialized = Array.isArray(value) ? value.join(',') : String(value);
      const isDefault =
        serialized === 'all' ||
        serialized === '40' ||
        serialized === 'false' ||
        serialized === '' ||
        (key === 'sort' && serialized === 'match') ||
        (key === 'verified' && serialized === 'true');
      if (isDefault) next.delete(key);
      else next.set(key, serialized);
    });
    router.replace(`/guides?${next.toString()}`, { scroll: false });
  };

  const clear = () => router.replace('/guides?tab=experiences', { scroll: false });

  const active = [
    lang !== 'all',
    category !== 'all',
    gender !== 'all',
    maxPrice !== 40,
    date !== '',
    !verified,
    accessible,
    instant,
    ...styles.map(() => true),
  ].filter(Boolean).length;

  useEffect(() => {
    if (!drawer) return;
    const trigger = triggerRef.current;
    closeRef.current?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawer(false);
      if (e.key === 'Tab' && drawerRef.current) {
        const focusable = [
          ...drawerRef.current.querySelectorAll<HTMLElement>(
            'button, input, select, a[href]'
          ),
        ].filter(el => !el.hasAttribute('disabled'));
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', key);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', key);
      trigger?.focus();
    };
  }, [drawer]);

  const results = useMemo(() => {
    const list = GUIDES.filter(
      g =>
        (lang === 'all' || g.languages.some(l => l.code === lang)) &&
        (category === 'all' || g.experienceCategories.includes(category as ExperienceCategory)) &&
        (gender === 'all' || g.gender === (gender as GuideGender)) &&
        g.pricing.perHour <= maxPrice &&
        (date === '' || new Date(g.nextAvailable) <= new Date(date + 'T23:59:59')) &&
        (!verified || g.verificationStatus === 'verified') &&
        (!accessible || g.accessibilityExperience) &&
        (!instant || g.instantConfirmation) &&
        (!styles.length || g.personalityTags.some(s => styles.includes(s)))
    );
    return list.sort((a, b) =>
      sort === 'rating'
        ? b.rating - a.rating
        : sort === 'price'
        ? a.pricing.perHour - b.pricing.perHour
        : (b.matchLabel === 'excellent' ? 2 : b.matchLabel === 'great' ? 1 : 0) -
          (a.matchLabel === 'excellent' ? 2 : a.matchLabel === 'great' ? 1 : 0)
    );
  }, [lang, category, gender, maxPrice, date, verified, accessible, instant, styles, sort]);

  const filterProps = {
    lang,
    setLang: (value: string) => update({ lang: value }),
    date,
    setDate: (value: string) => update({ date: value }),
    gender,
    setGender: (value: string) => update({ gender: value }),
    maxPrice,
    setMaxPrice: (value: number) => update({ maxPrice: value }),
    verified,
    setVerified: (value: boolean) => update({ verified: value }),
    accessible,
    setAccessible: (value: boolean) => update({ accessibility: value }),
    instant,
    setInstant: (value: boolean) => update({ instant: value }),
    styles,
    setStyles: (value: string[]) => update({ styles: value }),
    clear,
    active,
  };

  const chooseCategory = (id: string) => update({ category: id });

  // Request summary text (Batch B) with dynamic elements and safe fallback
  const requestSummaryText = useMemo(() => {
    const tokens: string[] = [];
    
    // 1. Language preference
    if (lang !== 'all') {
      const label = languages.find(l => l.id === lang)?.label;
      if (label) tokens.push(label);
    } else {
      tokens.push('English'); // default / fallback language
    }

    // 2. Pace / Style (represented as "Flexible pace" in user trip request)
    tokens.push('Flexible pace');

    // 3. Category preference
    if (category !== 'all') {
      const label = categories.find(c => c.id === category)?.label;
      if (label) tokens.push(label);
    } else {
      tokens.push('Street food'); // default / fallback interest
    }

    // 4. District preference
    tokens.push('District 1 and nearby');

    return tokens.join(' · ');
  }, [lang, category]);

  // Dynamically constructed filters summary line
  const activeFiltersSummaryText = useMemo(() => {
    const tokens: string[] = [];
    if (lang !== 'all') {
      const label = languages.find(l => l.id === lang)?.label;
      if (label) tokens.push(label);
    }
    if (category !== 'all') {
      const label = categories.find(c => c.id === category)?.label;
      if (label) tokens.push(label);
    }
    if (date !== '') {
      const formattedDate = new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      tokens.push(`Available by ${formattedDate}`);
    }
    if (maxPrice < 40) {
      tokens.push(`Under $${maxPrice}/hr`);
    }
    if (verified) tokens.push('Reviewed Profiles');
    if (accessible) tokens.push('Accessibility-Aware');
    if (instant) tokens.push('Instant Confirmation');
    styles.forEach(s => {
      tokens.push(personalityLabel(s));
    });
    return tokens.length > 0 ? tokens.join(' · ') : 'Reviewed local profiles';
  }, [lang, category, date, maxPrice, verified, accessible, instant, styles]);

  const hasError = params.get('error') === 'true';

  if (hasError) {
    return (
      <div className="guides-page">
        <Navbar />
        <main className="guide-container guide-main flex items-center justify-center min-h-[60vh]">
          <div className="guide-empty text-center py-16">
            <SearchX size={38} className="mx-auto mb-4 text-[var(--color-accent)]" />
            <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold mb-2">Something went wrong while matching guides.</h2>
            <p className="text-sm text-[var(--color-text-muted)] max-w-md mx-auto mb-6">We encountered an error loading the matches. Please try reloading the page or contacting our support team.</p>
            <div className="flex gap-3 justify-center">
              <button type="button" className="btn btn-accent" onClick={() => router.replace('/guides')}>
                Try Again
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="guides-page">
      <Navbar />

      {/* Experience Category Bar */}
      <nav className="guide-category-nav" aria-label="Experience categories">
        <div className="guide-container guide-category-scroll" ref={categoryScrollRef}>
          {/* Desktop Category Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {categories.slice(0, 6).map(item => {
              const Icon = item.icon;
              return (
                <button
                  type="button"
                  key={item.id}
                  aria-pressed={category === item.id}
                  onClick={() => chooseCategory(item.id)}
                >
                  <Icon size={16} />
                  {item.label}
                </button>
              );
            })}
            <div className="relative" ref={moreRef}>
              <button
                type="button"
                aria-pressed={categories.slice(6).some(c => c.id === category)}
                onClick={() => setMoreOpen(!moreOpen)}
              >
                {categories.slice(6).some(c => c.id === category) ? (
                  <span>{categories.find(c => c.id === category)?.label}</span>
                ) : (
                  <span>More</span>
                )}
                <ChevronDown size={14} className={moreOpen ? 'rotate-180 transition-transform' : 'transition-transform'} />
              </button>
              {moreOpen && (
                <div className="category-popover" role="menu">
                  {categories.slice(6).map(item => {
                    const Icon = item.icon;
                    return (
                      <button
                        type="button"
                        key={item.id}
                        role="menuitem"
                        aria-current={category === item.id ? 'true' : undefined}
                        onClick={() => {
                          chooseCategory(item.id);
                          setMoreOpen(false);
                        }}
                      >
                        <Icon size={15} />
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Category Navigation */}
          {categories.map(item => {
            const Icon = item.icon;
            return (
              <button
                type="button"
                key={item.id}
                className="md:hidden"
                aria-pressed={category === item.id}
                onClick={() => chooseCategory(item.id)}
              >
                <Icon size={16} />
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>

      <main className="guide-container guide-main">
        {/* Restructured Page Heading */}
        <header className="guide-results-header">
          <div className="guide-header-text">
            <span className="guide-eyebrow">Local guides in Ho Chi Minh City</span>
            <h1>{results.length} guides match your trip</h1>
            <p className="guide-summary">{requestSummaryText}</p>
          </div>
          <div className="guide-header-actions">
            <Link href="/match" className="guide-edit-link">Edit trip request</Link>
          </div>
        </header>

        {/* Unified Toolbar */}
        <div className="guide-toolbar">
          <div className="guide-toolbar-left">
            <strong>{results.length} {results.length === 1 ? 'guide' : 'guides'} available</strong>
            <span>{activeFiltersSummaryText}</span>
          </div>

          <div className="guide-toolbar-right">
            {/* Filter Drawer Trigger Button (hidden on large screen layout) */}
            <button
              ref={triggerRef}
              type="button"
              className="guide-filter-trigger"
              onClick={() => setDrawer(true)}
            >
              <SlidersHorizontal size={14} />
              Filters
              {active > 0 && <b>{active}</b>}
            </button>

            {/* Show Map Toggle Button */}
            <button
              type="button"
              className={`guide-map-toggle ${showMap ? 'active' : ''}`}
              onClick={() => setShowMap(!showMap)}
              aria-pressed={showMap}
            >
              <Map size={14} />
              <span>{showMap ? 'Hide Map' : 'Show Map'}</span>
            </button>

            {/* Styled Sort Dropdown */}
            <div className="flex items-center gap-2">
              <label htmlFor="guide-sort">Sort by</label>
              <div className="guide-select">
                <select
                  id="guide-sort"
                  value={sort}
                  onChange={e => update({ sort: e.target.value })}
                >
                  <option value="match">Best match</option>
                  <option value="rating">Highest rated</option>
                  <option value="price">Price: low to high</option>
                </select>
                <ChevronDown size={14} />
              </div>
            </div>
          </div>
        </div>

        {/* Split Grid & Map Content Layout */}
        <div className="guide-results-layout">
          <aside className="guide-filter-sidebar" aria-label="Guide filters">
            <Filters {...filterProps} />
          </aside>

          <section aria-label="Guide results" className="w-full">
            <div className="flex gap-6 items-start">
              <div className="flex-1 min-w-0">
                {results.length ? (
                  <div
                    className={`guide-grid ${showMap ? 'map-shown' : ''}`}
                  >
                    {results.map(g => (
                      <div
                        key={g.id}
                        onMouseEnter={() => setHoveredGuideId(g.id)}
                        onMouseLeave={() => setHoveredGuideId(null)}
                      >
                        <GuideCard guide={g} showMatch={true} isHovered={hoveredGuideId === g.id} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="guide-empty">
                    <SearchX size={38} />
                    <h2>No guides match every selected preference yet.</h2>
                    <p>Try widening your filters, adjusting your trip request, or letting our team find the perfect guide for you.</p>
                    <div className="flex gap-3 mt-4 flex-wrap justify-center">
                      <button type="button" className="btn btn-accent" onClick={clear}>
                        Clear filters
                      </button>
                      <Link className="btn btn-outline" href="/match">
                        Edit trip request
                      </Link>
                      <Link className="btn btn-ghost" href="/match">
                        Let LocalLink help
                      </Link>
                    </div>
                  </div>
                )}
                <p className="guide-end-note">You’ve reached the end of these matches.</p>
              </div>

              {showMap && results.length > 0 && (
                <div className="hidden lg:block w-[380px] xl:w-[460px] flex-shrink-0">
                  <MockMap
                    guides={results}
                    hoveredGuideId={hoveredGuideId}
                    onHoverGuide={setHoveredGuideId}
                  />
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* End-of-Results Help Banner */}
      <section className="guide-match-help">
        <div className="guide-container">
          <div>
            <ShieldCheck size={28} />
            <div>
              <h2>Still looking for the right local guide?</h2>
              <p>
                Tell us more about your language, schedule, interests, and support needs. We’ll help narrow the match.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link className="btn btn-accent" href="/match">
              Refine my trip
            </Link>
            <a className="btn btn-ghost" href="mailto:hello@locallink.co">
              Contact support
            </a>
          </div>
        </div>
      </section>

      <Footer />

      {/* Mobile/Tablet Filter Drawer Overlay */}
      {drawer && (
        <div className="guide-drawer-layer">
          <button
            className="guide-drawer-backdrop"
            aria-label="Close filters"
            onClick={() => setDrawer(false)}
          />
          <div
            ref={drawerRef}
            className="guide-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="filter-title"
          >
            <div className="guide-drawer-head">
              <div>
                <h2 id="filter-title">Filters</h2>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-[var(--color-text-light)]">{active} active</p>
                  {active > 0 && (
                    <button
                      type="button"
                      onClick={clear}
                      className="text-xs font-semibold text-[var(--color-accent)] hover:underline bg-transparent border-0 p-0 cursor-pointer"
                    >
                      Clear all
                    </button>
                  )}
                </div>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setDrawer(false)}
                aria-label="Close filters"
              >
                <X />
              </button>
            </div>
            <div className="guide-drawer-body">
              <Filters {...filterProps} hideHeader={true} />
            </div>
            <div className="guide-drawer-foot">
              <button
                type="button"
                className="btn btn-accent"
                onClick={() => setDrawer(false)}
              >
                Apply Filters (Show {results.length} {results.length === 1 ? 'guide' : 'guides'})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function GuidesPage() {
  return (
    <Suspense
      fallback={
        <div className="guide-loading" aria-label="Loading guides">
          Loading local guides…
        </div>
      }
    >
      <GuidesContent />
    </Suspense>
  );
}

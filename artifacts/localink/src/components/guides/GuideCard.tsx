// ============================================================
// LocaLink — GuideCard Component
// The primary card used across search results, featured sections,
// and dashboard views to display a guide's profile snapshot.
// ============================================================

import { useState } from 'react';
import { Link } from 'wouter';
import {
  Shield,
  Heart,
  MapPin,
  Clock,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { cn, personalityLabel, formatCurrency } from '@/lib/utils';
import type { Guide, AvailabilityStatus } from '@/types';
import StarRating from '@/components/ui/StarRating';

// ─── Props ────────────────────────────────────────────────────────────────────

interface GuideCardProps {
  guide: Guide;
  variant?: 'default' | 'compact' | 'featured';
  showMatch?: boolean;
  onFavorite?: (id: string) => void;
  isHovered?: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function AvailabilityBadge({ status }: { status: AvailabilityStatus }) {
  const map: Record<AvailabilityStatus, { label: string; cls: string; dot: string }> = {
    available:   { label: 'Available',   cls: 'badge badge-available',   dot: 'bg-[#22C55E]' },
    limited:     { label: 'Limited',     cls: 'badge badge-limited',     dot: 'bg-[#F59E0B]' },
    unavailable: { label: 'Unavailable', cls: 'badge badge-unavailable', dot: 'bg-[#9CA3AF]' },
  };
  const { label, cls, dot } = map[status];
  return (
    <span className={cls}>
      <span className={cn('w-1.5 h-1.5 rounded-full inline-block flex-shrink-0', dot)} />
      {label}
    </span>
  );
}

function MatchBadge({ label }: { label: 'excellent' | 'great' | 'good' }) {
  const map = {
    excellent: { text: 'Excellent match', cls: 'badge match-excellent' },
    great:     { text: 'Great match',     cls: 'badge match-great' },
    good:      { text: 'Good match',      cls: 'badge match-good' },
  };
  const { text, cls } = map[label];
  return <span className={cls}>{text}</span>;
}

function formatNextAvailable(iso: string): string {
  const target = new Date(iso);
  const now    = new Date();

  const startOfToday    = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfTomorrow = new Date(startOfToday);
  startOfTomorrow.setDate(startOfToday.getDate() + 1);
  const startOfDayAfter = new Date(startOfTomorrow);
  startOfDayAfter.setDate(startOfTomorrow.getDate() + 1);

  const timeStr = target.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: target.getMinutes() !== 0 ? '2-digit' : undefined,
    hour12: true,
  });

  if (target < now) return 'Now';
  if (target < startOfTomorrow) return `Today ${timeStr}`;
  if (target < startOfDayAfter) return `Tomorrow ${timeStr}`;

  const dayStr = target.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  return `${dayStr} ${timeStr}`;
}

// ─── Language pills ───────────────────────────────────────────────────────────

function LanguagePills({ guide }: { guide: Guide }) {
  const codes = guide.languages.map((l) => l.code.toUpperCase());
  return (
    <span className="flex flex-wrap gap-1">
      {codes.map((code, i) => (
        <span
          key={code}
          className="text-xs font-medium text-[var(--color-text-muted)] leading-none"
        >
          {code}
          {i < codes.length - 1 && (
            <span className="ml-1 text-[var(--color-border)]">·</span>
          )}
        </span>
      ))}
    </span>
  );
}

// ─── Portrait image block ──────────────────────────────────────────────────────



function GuidePortrait({
  guide,
  isFavorited,
  onToggleFavorite,
  showMatch,
}: {
  guide: Guide;
  isFavorited: boolean;
  onToggleFavorite: () => void;
  showMatch?: boolean;
}) {
  const [imgSrc, setImgSrc] = useState(guide.avatar);
  const [prevAvatar, setPrevAvatar] = useState(guide.avatar);

  if (guide.avatar !== prevAvatar) {
    setPrevAvatar(guide.avatar);
    setImgSrc(guide.avatar);
  }

  return (
    <div className="relative overflow-hidden flex-shrink-0 aspect-[4/5]">
      {/* Portrait */}
      <img
        src={imgSrc}
        alt={`${guide.displayName} — local guide in ${guide.city}`}
        className="img-portrait w-full"
        loading="lazy"
        style={{ objectPosition: 'center top' }}
        onError={() => {
          setImgSrc(`data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500"><rect width="100%" height="100%" fill="%23F5F0EA"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="bold" fill="%231C3A2E">${encodeURIComponent(guide.displayName)}</text></svg>`);
        }}
      />

      {/* Gradient scrim for badge legibility */}
      <div
        className="absolute inset-x-0 top-0 h-20 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 100%)',
        }}
      />

      {/* Verified badge — top-right */}
      {guide.verificationStatus === 'verified' && (
        <div className="absolute top-2.5 right-2.5">
          <span className="badge badge-verified shadow-sm">
            <Shield size={10} strokeWidth={2.5} />
            Reviewed
          </span>
        </div>
      )}

      {/* Favorite button — top-left */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggleFavorite();
        }}
        aria-label={isFavorited ? `Remove ${guide.displayName} from saved guides` : `Save ${guide.displayName} to saved guides`}
        className={cn(
          'guide-favorite-btn absolute top-2.5 left-2.5 w-8 h-8 rounded-full flex items-center justify-center',
          'transition-all duration-150 shadow-sm',
          isFavorited
            ? 'bg-white text-red-500'
            : 'bg-white/80 text-[var(--color-text-muted)] hover:bg-white hover:text-red-400',
        )}
      >
        <Heart
          size={15}
          strokeWidth={2}
          fill={isFavorited ? 'currentColor' : 'none'}
        />
      </button>

      {/* Badges — bottom-left */}
      <div className="absolute bottom-2.5 left-2.5 flex flex-col gap-1.5 z-10 items-start">
        <AvailabilityBadge status={guide.availabilityStatus} />
        {showMatch && guide.matchLabel && (
          <MatchBadge label={guide.matchLabel} />
        )}
      </div>

      {/* Instant confirmation badge — bottom-right */}
      {guide.instantConfirmation && (
        <div className="absolute bottom-2.5 right-2.5 z-10">
          <span className="badge" style={{ background: 'rgba(28,58,46,0.9)', color: '#fff' }}>
            <Zap size={10} fill="currentColor" strokeWidth={0} />
            Instant
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Card body ────────────────────────────────────────────────────────────────

function GuideCardBody({
  guide,
  compact,
}: {
  guide: Guide;
  compact?: boolean;
}) {
  return (
    <div className={cn('flex flex-col flex-grow', compact ? 'p-3 gap-2' : 'p-4 gap-3')}>

      {/* Name + Reviewed Status row */}
      <div>
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <h4
            className="font-semibold leading-tight text-[var(--color-text)] truncate text-base"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {guide.displayName}
          </h4>
          {guide.verificationStatus === 'verified' && (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-[#1C6B3A] bg-[#E8F5EE] px-1.5 py-0.5 rounded border border-[#B8DFC8] leading-none">
              <Shield size={10} strokeWidth={2.5} className="fill-current" />
              Reviewed
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 mt-1.5 text-xs text-[var(--color-text-muted)]">
          <MapPin size={11} strokeWidth={2} className="flex-shrink-0 text-[var(--color-accent)]" />
          <span className="truncate">{guide.city} · {guide.district}</span>
        </div>
      </div>

      {/* Languages */}
      <LanguagePills guide={guide} />

      {/* Short intro — hidden on compact */}
      {!compact && (
        <p
          className="text-xs text-[var(--color-text-muted)] leading-relaxed line-clamp-2"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '36px',
          }}
        >
          {guide.shortIntro}
        </p>
      )}

      {/* Personality tags — up to 2 + N */}
      {!compact && guide.personalityTags.length > 0 && (
        <div className="flex flex-wrap gap-1 items-center">
          {guide.personalityTags.slice(0, 2).map((tag) => (
            <span key={tag} className="tag" style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem' }}>
              {personalityLabel(tag)}
            </span>
          ))}
          {guide.personalityTags.length > 2 && (
            <span className="text-[10px] font-semibold text-[var(--color-text-muted)] bg-[var(--color-surface)] border border-[var(--color-border-light)] px-1.5 py-0.5 rounded leading-none">
              +{guide.personalityTags.length - 2}
            </span>
          )}
        </div>
      )}

      {/* Divider */}
      <hr className="divider mt-auto" />

      {/* Pinned Bottom Layout */}
      <div className="flex flex-col gap-2 pt-1">
        {/* Rating row */}
        <StarRating
          rating={guide.rating}
          size="sm"
          showNumber
          reviewCount={guide.reviewCount}
        />

        {/* Price */}
        <div className="flex items-baseline gap-1">
          <span className="text-xs text-[var(--color-text-light)]">Starting from</span>
          <span className="text-sm font-bold text-[var(--color-primary)]">
            {formatCurrency(guide.pricing.perHour, guide.pricing.currency)}/hr
          </span>
        </div>

        {/* Next available */}
        <div className="flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
          <Clock size={11} strokeWidth={2} className="flex-shrink-0" />
          <span>
            Next available:{' '}
            <span className="font-semibold text-[var(--color-text)]">
              {formatNextAvailable(guide.nextAvailable)}
            </span>
          </span>
        </div>

        {/* Action buttons */}
        <div className="pt-2">
          <Link
            href={`/guides/${guide.id}`}
            className="btn btn-outline btn-sm w-full text-center justify-center"
          >
            View Profile
            <ChevronRight size={14} strokeWidth={2} />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function GuideCard({
  guide,
  variant = 'default',
  showMatch = false,
  onFavorite,
  isHovered = false,
}: GuideCardProps) {
  const [isFavorited, setIsFavorited] = useState(guide.isFavorited ?? false);

  const handleToggleFavorite = () => {
    setIsFavorited((prev) => !prev);
    onFavorite?.(guide.id);
  };

  // ── Featured variant: horizontal layout ────────────────────────────────────
  if (variant === 'featured') {
    return (
      <article className="card flex flex-row animate-fade-in" style={{ minHeight: 240 }}>
        {/* Portrait — fixed width on desktop */}
        <div className="w-40 sm:w-48 flex-shrink-0">
          <GuidePortrait
            guide={guide}
            isFavorited={isFavorited}
            onToggleFavorite={handleToggleFavorite}
          />
        </div>

        {/* Body fills remaining space */}
        <div className="flex flex-col flex-1 p-5 gap-3 min-w-0">
          {/* Name + location */}
          <div>
            <div className="flex items-start justify-between gap-2">
              <h4
                className="font-semibold text-lg leading-tight text-[var(--color-text)]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {guide.displayName}
              </h4>
              {showMatch && guide.matchLabel && (
                <MatchBadge label={guide.matchLabel} />
              )}
            </div>
            <div className="flex items-center gap-1 mt-0.5 text-xs text-[var(--color-text-muted)]">
              <MapPin size={11} strokeWidth={2} className="flex-shrink-0 text-[var(--color-accent)]" />
              <span>{guide.city} · {guide.district}</span>
            </div>
          </div>

          {/* Languages */}
          <LanguagePills guide={guide} />

          {/* Short intro */}
          <p
            className="text-sm text-[var(--color-text-muted)] leading-relaxed flex-1"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {guide.shortIntro}
          </p>

          {/* Personality tags */}
          {guide.personalityTags.length > 0 && (
            <div className="flex flex-wrap gap-1 items-center">
              {guide.personalityTags.slice(0, 2).map((tag) => (
                <span key={tag} className="tag" style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem' }}>
                  {personalityLabel(tag)}
                </span>
              ))}
              {guide.personalityTags.length > 2 && (
                <span className="text-[10px] font-semibold text-[var(--color-text-muted)] bg-[var(--color-surface)] border border-[var(--color-border-light)] px-1.5 py-0.5 rounded leading-none">
                  +{guide.personalityTags.length - 2}
                </span>
              )}
            </div>
          )}

          <hr className="divider" />

          {/* Footer row: rating + price + CTA */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex flex-col gap-0.5">
              <StarRating
                rating={guide.rating}
                size="sm"
                showNumber
                reviewCount={guide.reviewCount}
              />
              <span className="text-xs text-[var(--color-text-muted)] flex items-center gap-1">
                <Clock size={10} strokeWidth={2} />
                {formatNextAvailable(guide.nextAvailable)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-[var(--color-primary)]">
                {formatCurrency(guide.pricing.perHour, guide.pricing.currency)}/hr
              </span>
              <Link href={`/guides/${guide.id}`} className="btn btn-primary btn-sm">
                View Profile
              </Link>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // ── Compact variant ────────────────────────────────────────────────────────
  if (variant === 'compact') {
    return (
      <article className="card flex flex-row gap-0 animate-fade-in overflow-hidden">
        {/* Small portrait */}
        <div className="w-20 flex-shrink-0 relative">
          <img
            src={guide.avatar}
            alt={guide.displayName}
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center top', minHeight: 96 }}
            loading="lazy"
          />
          {guide.verificationStatus === 'verified' && (
            <div className="absolute top-1 right-1">
              <Shield size={12} className="text-[#1C6B3A] drop-shadow" />
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 min-w-0 p-3 gap-1.5">
          <div className="flex items-start justify-between gap-1">
            <h4
              className="font-semibold text-sm leading-tight text-[var(--color-text)] truncate"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {guide.displayName}
            </h4>
            <AvailabilityBadge status={guide.availabilityStatus} />
          </div>

          <div className="flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
            <MapPin size={10} strokeWidth={2} className="flex-shrink-0 text-[var(--color-accent)]" />
            <span className="truncate">{guide.city} · {guide.district}</span>
          </div>

          <LanguagePills guide={guide} />

          <div className="flex items-center justify-between gap-2 mt-auto pt-1">
            <StarRating rating={guide.rating} size="sm" showNumber reviewCount={guide.reviewCount} />
            <Link href={`/guides/${guide.id}`} className="btn btn-outline btn-sm py-1 px-3 text-xs">
              View
            </Link>
          </div>
        </div>
      </article>
    );
  }

  // ── Default variant: vertical portrait card ────────────────────────────────
  return (
    <article className={cn("card flex flex-col animate-fade-in", isHovered && "hovered")}>
      <GuidePortrait
        guide={guide}
        isFavorited={isFavorited}
        onToggleFavorite={handleToggleFavorite}
        showMatch={showMatch}
      />
      <GuideCardBody
        guide={guide}
        compact={false}
      />
    </article>
  );
}

// ============================================================
// LocaLink — StarRating UI Component
// ============================================================

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  size?: 'sm' | 'md';
  showNumber?: boolean;
  reviewCount?: number;
}

export default function StarRating({
  rating,
  size = 'sm',
  showNumber = true,
  reviewCount,
}: StarRatingProps) {
  const starSize = size === 'sm' ? 12 : 15;
  const totalStars = 5;

  const stars = Array.from({ length: totalStars }, (_, i) => {
    const filled = rating >= i + 1;
    const half = !filled && rating >= i + 0.5;
    return { filled, half };
  });

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1',
        size === 'sm' ? 'text-xs' : 'text-sm',
      )}
      aria-label={`Rating: ${rating} out of 5${reviewCount !== undefined ? `, ${reviewCount} reviews` : ''}`}
    >
      {/* Star icons */}
      <span className="stars">
        {stars.map(({ filled, half }, i) => (
          <span key={i} className="relative inline-flex" style={{ width: starSize, height: starSize }}>
            {/* Base empty star */}
            <Star
              size={starSize}
              className="text-[#DDD8D0]"
              strokeWidth={1.5}
              fill="none"
              aria-hidden="true"
            />
            {/* Filled or half overlay */}
            {(filled || half) && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: half ? '50%' : '100%' }}
              >
                <Star
                  size={starSize}
                  className="text-[#E8A020]"
                  strokeWidth={1.5}
                  fill="#E8A020"
                  aria-hidden="true"
                />
              </span>
            )}
          </span>
        ))}
      </span>

      {/* Numeric rating */}
      {showNumber && (
        <span
          className={cn(
            'font-semibold tabular-nums',
            'text-[var(--color-text)]',
          )}
        >
          {rating.toFixed(2)}
        </span>
      )}

      {/* Review count */}
      {reviewCount !== undefined && (
        <span className="text-[var(--color-text-muted)]">
          · {reviewCount.toLocaleString()} review{reviewCount !== 1 ? 's' : ''}
        </span>
      )}
    </span>
  );
}

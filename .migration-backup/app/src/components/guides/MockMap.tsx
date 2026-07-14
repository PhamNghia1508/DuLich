'use client';

import { useState } from 'react';
import { MapPin, Star } from 'lucide-react';
import type { Guide } from '@/types';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

interface MockMapProps {
  guides: Guide[];
  hoveredGuideId: string | null;
  onHoverGuide: (id: string | null) => void;
}

// Map marker positions (percentage values on a 0-100 grid matching HCMC districts layout)
const MARKER_POSITIONS: Record<string, { x: number; y: number }> = {
  'guide-001': { x: 50, y: 38 }, // Linh N. - District 1
  'guide-002': { x: 42, y: 32 }, // Minh T. - District 3
  'guide-003': { x: 32, y: 48 }, // Yuki P. - District 5
  'guide-004': { x: 54, y: 42 }, // Huy L. - District 1
  'guide-005': { x: 48, y: 34 }, // Bảo V. - District 1
  'guide-006': { x: 45, y: 28 }, // Thu N. - District 3
  'guide-007': { x: 26, y: 62 }, // Duc P. - District 8
  'guide-008': { x: 80, y: 82 }, // Khoa D. - Can Gio
};

export default function MockMap({ guides, hoveredGuideId, onHoverGuide }: MockMapProps) {
  const [activeTooltipId, setActiveTooltipId] = useState<string | null>(null);

  return (
    <div className="relative w-full h-[580px] rounded-2xl border border-[var(--color-border-light)] bg-[#FAFAF5] overflow-hidden shadow-sm sticky top-[calc(var(--sticky-content-offset)+24px)] select-none">
      {/* Editorial Grid Map Background */}
      <svg className="absolute inset-0 w-full h-full text-[#EFEAE0]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Saigon River SVG Path - styled elegantly in sand/sage tone */}
        <path
          d="M-50,150 Q80,180 180,240 T420,290 T600,480 T750,560 T900,680"
          fill="none"
          stroke="#DCE5DF"
          strokeWidth="32"
          strokeLinecap="round"
          opacity="0.85"
        />
        <path
          d="M-50,150 Q80,180 180,240 T420,290 T600,480 T750,560 T900,680"
          fill="none"
          stroke="#C5D9CE"
          strokeWidth="10"
          strokeLinecap="round"
          opacity="0.6"
        />

        {/* District Labels */}
        <text x="50%" y="28%" textAnchor="middle" fill="#B5A48C" fontSize="12" fontWeight="700" letterSpacing="0.1em" opacity="0.6">DISTRICT 3</text>
        <text x="58%" y="46%" textAnchor="middle" fill="#B5A48C" fontSize="12" fontWeight="700" letterSpacing="0.1em" opacity="0.6">DISTRICT 1</text>
        <text x="25%" y="44%" textAnchor="middle" fill="#B5A48C" fontSize="12" fontWeight="700" letterSpacing="0.1em" opacity="0.6">CHOLON (D5)</text>
        <text x="20%" y="68%" textAnchor="middle" fill="#B5A48C" fontSize="12" fontWeight="700" letterSpacing="0.1em" opacity="0.6">DISTRICT 8</text>
        <text x="75%" y="76%" textAnchor="middle" fill="#B5A48C" fontSize="12" fontWeight="700" letterSpacing="0.1em" opacity="0.6">CAN GIO</text>

        {/* Compass Rose */}
        <g transform="translate(60, 500) scale(0.65)" stroke="#B5A48C" strokeWidth="1.5" fill="none" opacity="0.5">
          <circle cx="0" cy="0" r="30" strokeDasharray="3 3" />
          <line x1="-40" y1="0" x2="40" y2="0" />
          <line x1="0" y1="-40" x2="0" y2="40" />
          <polygon points="0,-35 4,-8 0,0 -4,-8" fill="#B5A48C" />
          <polygon points="0,35 4,8 0,0 -4,8" fill="#B5A48C" />
          <polygon points="35,0 8,4 0,0 8,-4" fill="#B5A48C" />
          <polygon points="-35,0 -8,4 0,0 -8,-4" fill="#B5A48C" />
          <text x="-4" y="-42" fill="#B5A48C" fontSize="12" fontWeight="bold" stroke="none">N</text>
        </g>
      </svg>

      {/* Interactive Map Controls */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        <span className="bg-white/95 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider text-[var(--color-primary)] uppercase border border-[var(--color-border-light)] shadow-sm pointer-events-auto">
          Ho Chi Minh City Map
        </span>
      </div>

      {/* Guide Markers */}
      {guides.map((guide) => {
        const pos = MARKER_POSITIONS[guide.id] || { x: 50, y: 50 };
        const isHovered = hoveredGuideId === guide.id;
        const isTooltipActive = activeTooltipId === guide.id || isHovered;

        return (
          <div
            key={guide.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out"
            style={{ left: `${pos.x}%`, top: `${pos.y}%`, zIndex: isTooltipActive ? 30 : 10 }}
          >
            {/* Pulsing Wave on Hover */}
            {isHovered && (
              <span className="absolute inset-0 w-8 h-8 -left-2 -top-2 rounded-full bg-[var(--color-accent)]/20 animate-ping pointer-events-none" />
            )}

            {/* Map Pin Marker */}
            <button
              type="button"
              className={`w-8 h-8 rounded-full flex items-center justify-center border shadow-md transition-all duration-200 ${
                isHovered
                  ? 'bg-[var(--color-accent)] text-white border-[var(--color-accent)] scale-110'
                  : 'bg-white text-[var(--color-primary)] border-[var(--color-border)] hover:bg-[var(--color-surface)] hover:scale-105'
              }`}
              onMouseEnter={() => {
                onHoverGuide(guide.id);
                setActiveTooltipId(guide.id);
              }}
              onMouseLeave={() => {
                onHoverGuide(null);
                setActiveTooltipId(null);
              }}
              aria-label={`Guide ${guide.displayName}`}
            >
              <MapPin size={16} strokeWidth={isHovered ? 2.5 : 2} fill={isHovered ? 'white' : 'none'} />
            </button>

            {/* High-Fidelity Tooltip Popup */}
            {isTooltipActive && (
              <div className="absolute left-1/2 bottom-[calc(100%+8px)] -translate-x-1/2 w-48 bg-white rounded-xl border border-[var(--color-border-light)] p-2.5 shadow-lg animate-scale-in text-left pointer-events-auto">
                <div className="flex gap-2">
                  <img
                    src={guide.avatar}
                    alt={guide.displayName}
                    className="w-10 h-12 object-cover rounded-md flex-shrink-0"
                    onError={(e) => {
                      e.currentTarget.src = '/images/guides/linh.webp';
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <h5 className="font-semibold text-xs text-[var(--color-text)] truncate">{guide.displayName}</h5>
                    <p className="text-[10px] text-[var(--color-text-muted)] truncate">{guide.district}</p>
                    <div className="flex items-center gap-0.5 mt-1 text-[10px] font-medium text-[#77581a]">
                      <Star size={9} fill="#d79034" className="text-[#d79034]" />
                      <span>{guide.rating} ({guide.reviewCount})</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-[var(--color-border-light)]">
                  <span className="text-[10px] font-semibold text-[var(--color-primary)]">
                    {formatCurrency(guide.pricing.perHour, guide.pricing.currency)}/hr
                  </span>
                  <Link
                    href={`/guides/${guide.id}`}
                    className="text-[9px] font-bold text-[var(--color-accent)] hover:underline"
                  >
                    View Profile
                  </Link>
                </div>
                {/* Tooltip arrow */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-r border-b border-[var(--color-border-light)] rotate-45" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { Star, MessageSquare, ArrowUpDown, ChevronDown, CheckCircle2 } from 'lucide-react';
import type { Review } from '@/types';
import StarRating from '@/components/ui/StarRating';

interface GuideReviewsProps {
  reviews: Review[];
  overallRating: number;
  reviewCount: number;
}

export default function GuideReviews({ reviews, overallRating, reviewCount }: GuideReviewsProps) {
  const [sortBy, setSortBy] = useState<'recent' | 'highest'>('recent');
  const [visibleCount, setVisibleCount] = useState(3);

  // Categories ratings for the rating breakdown
  const breakdowns = [
    { label: 'Communication', score: '5.0' },
    { label: 'Local knowledge', score: '4.9' },
    { label: 'Pacing & comfort', score: '4.9' },
    { label: 'Value for money', score: '4.9' },
  ];

  // Sort logic
  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === 'highest') {
      return b.rating - a.rating;
    }
    // Default: Sort by date descending
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const displayedReviews = sortedReviews.slice(0, visibleCount);

  return (
    <section className="bg-white border border-[#E8E4DC] rounded-3xl p-6 sm:p-8 space-y-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F5F0EA] pb-5">
        <div className="space-y-1">
          <h3 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[#1C3A2E]">
            Traveler reviews
          </h3>
          <p className="text-xs sm:text-sm text-[#5A5A5A]">
            Genuine feedback shared by travelers after completing their walks.
          </p>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-[#FAFAF7] border border-[#E8E4DC] px-3 py-1.5 rounded-xl text-xs font-semibold">
          <ArrowUpDown size={14} className="text-[#8A8A8A]" />
          <span className="text-[#5A5A5A]">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'recent' | 'highest')}
            className="bg-transparent border-0 font-bold text-[#1A1A1A] focus:outline-none cursor-pointer"
          >
            <option value="recent">Most recent</option>
            <option value="highest">Highest rating</option>
          </select>
        </div>
      </div>

      {/* Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-[#FAFAF7] border border-[#E8E4DC] p-6 rounded-2xl">
        {/* Left side: Large number */}
        <div className="md:col-span-4 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-[#E8E4DC] pb-4 md:pb-0 md:pr-6">
          <span className="text-5xl font-bold text-[#1C3A2E] leading-none">{overallRating}</span>
          <div className="mt-2.5">
            <StarRating rating={overallRating} size="md" />
          </div>
          <span className="text-xs text-[#8A8A8A] font-bold uppercase tracking-wider mt-2">
            Based on {reviewCount} reviews
          </span>
        </div>

        {/* Right side: Categories progress */}
        <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4 pl-0 md:pl-2">
          {breakdowns.map((b, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-[#5A5A5A]">{b.label}</span>
                <span className="text-[#1A1A1A] font-bold">{b.score}</span>
              </div>
              <div className="h-1.5 w-full bg-[#EDE8E0] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#1C3A2E] rounded-full" 
                  style={{ width: `${parseFloat(b.score) * 20}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="divide-y divide-[#F5F0EA]">
        {displayedReviews.map((rev) => (
          <div key={rev.id} className="py-6 first:pt-0 last:pb-0 space-y-4">
            
            {/* Header info */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full overflow-hidden border border-[#E8E4DC] bg-[#EDE8E0]">
                  <img
                    src={rev.travelerAvatar}
                    alt={rev.travelerName}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div>
                  <h4 className="font-sans text-sm font-bold text-[#1A1A1A]">{rev.travelerName}</h4>
                  <span className="text-[11px] text-[#8A8A8A] font-semibold">
                    {rev.travelerCountry} • {rev.date}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1 shrink-0">
                <StarRating rating={rev.rating} size="sm" />
                {rev.verified && (
                  <span className="text-[9px] font-bold text-[#1C6B3A] bg-[#E8F5EE] border border-[#B8DFC8] px-2 py-0.5 rounded-md flex items-center gap-1">
                    <CheckCircle2 size={10} />
                    <span>Experience verified</span>
                  </span>
                )}
              </div>
            </div>

            {/* Review Text */}
            <p className="text-sm md:text-base text-[#5A5A5A] leading-relaxed">
              {rev.text}
            </p>

            {/* Review tag */}
            <div className="text-[10px] font-semibold text-[#8A8A8A] uppercase tracking-wider flex items-center gap-2">
              <span>Experience:</span>
              <span className="text-[#1C3A2E] font-bold bg-[#EAF0EC] px-2 py-0.5 rounded">
                {rev.experienceType}
              </span>
            </div>
            
            {/* Safe platform disclosure */}
            <p className="text-[10px] text-[#8A8A8A]">
              * Review linked to a completed LocalLink experience.
            </p>
          </div>
        ))}
      </div>

      {/* Show more action */}
      {visibleCount < sortedReviews.length && (
        <div className="pt-4 text-center">
          <button
            onClick={() => setVisibleCount(visibleCount + 3)}
            className="btn btn-outline text-xs py-2.5 px-6 font-semibold rounded-xl hover:bg-[#FAFAF7] transition-all inline-flex items-center gap-1.5"
          >
            <span>Show more reviews</span>
            <ChevronDown size={14} />
          </button>
        </div>
      )}
    </section>
  );
}

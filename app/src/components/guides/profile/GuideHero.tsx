'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CalendarCheck, Heart, MapPin, MessageSquare, ShieldCheck, Star } from 'lucide-react';
import type { Guide } from '@/types';
import SafeImage from '@/components/ui/SafeImage';

interface GuideHeroProps {
  guide: Guide;
  onCheckAvailability: () => void;
}

export default function GuideHero({ guide, onCheckAvailability }: GuideHeroProps) {
  const [isSaved, setIsSaved] = useState(guide.isFavorited || false);

  return (
    <section className="overflow-hidden rounded-3xl border border-[#E8E4DC] bg-white shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-12">
        <div className="relative md:col-span-5">
          <div className="relative aspect-[4/5] min-h-[360px] overflow-hidden bg-[#EDE8E0] md:h-full md:min-h-[420px]">
            <SafeImage
              src={guide.avatar}
              alt={`${guide.firstName} ${guide.lastName}, local guide in ${guide.city}`}
              loading="eager"
              className="h-full w-full"
              imageClassName="h-full w-full object-cover object-[50%_38%]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/0 to-black/0" />

            <button
              type="button"
              onClick={() => setIsSaved(!isSaved)}
              className="absolute left-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/90 text-[#C4614A] shadow-md transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1C3A2E]"
              aria-label={isSaved ? 'Remove from saved guides' : 'Save guide to favorites'}
            >
              <Heart size={20} className={isSaved ? 'fill-[#C4614A]' : ''} />
            </button>

            <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-[#1C3A2E] px-3 py-2 text-xs font-bold text-white shadow-md">
              <ShieldCheck size={14} className="text-[#F2B39F]" />
              Profile reviewed
            </div>
          </div>
        </div>

        <div className="md:col-span-7">
          <div className="flex h-full flex-col gap-6 p-6 sm:p-8 md:p-10">
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-bold uppercase tracking-[0.12em] text-[#8A8A8A]">
                <span className="text-[#C4614A]">Local partner</span>
                <span className="flex items-center gap-1 normal-case tracking-normal text-[#1A1A1A]">
                  <MapPin size={14} className="text-[#C4614A]" />
                  {guide.city} ({guide.district})
                </span>
              </div>

              <div className="space-y-3">
                <h1 className="font-[family-name:var(--font-playfair)] text-4xl font-bold leading-[1.02] text-[#1C3A2E] sm:text-5xl">
                  {guide.firstName} {guide.lastName}
                </h1>
                <p className="max-w-[540px] text-lg font-medium italic leading-8 text-[#3F4A44]">
                  &ldquo;{guide.shortIntro}&rdquo;
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-[#5A5A5A]">
                <span className="flex items-center gap-1.5 font-bold text-[#1A1A1A]">
                  <Star size={17} className="fill-amber-500 text-amber-500" />
                  {guide.rating}
                  <span className="font-semibold text-[#8A8A8A]">({guide.reviewCount} reviews)</span>
                </span>
                <span>
                  <strong className="text-[#1A1A1A]">{guide.completedExperiences}</strong> completed bookings
                </span>
                <span className="flex items-center gap-1.5 font-semibold text-[#1C6B3A]">
                  <CalendarCheck size={16} />
                  {guide.availabilityStatus === 'available' ? 'Available this week' : 'Limited this week'}
                </span>
              </div>
            </div>

            <div className="hidden flex-col gap-3 border-t border-[#F5F0EA] pt-5 sm:flex sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={onCheckAvailability}
                className="btn btn-accent min-h-11 rounded-xl px-6 py-3 text-sm font-bold shadow-md transition active:scale-95"
              >
                Check availability
              </button>
              <Link
                href={`/dashboard?chat=${guide.id}`}
                className="btn btn-outline min-h-11 rounded-xl px-5 py-3 text-sm font-semibold transition active:scale-95"
                aria-label={`Send a message to ${guide.firstName}`}
              >
                <MessageSquare size={18} />
                Message {guide.firstName}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

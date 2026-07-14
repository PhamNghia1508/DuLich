import React from 'react';
import { Link } from 'wouter';
import { Star, MapPin, ArrowRight } from 'lucide-react';
import type { Guide } from '@/types';
import { GUIDES } from '@/data/mockData';
import { formatCurrency, categoryLabel } from '@/lib/utils';

interface SimilarGuidesProps {
  currentGuide: Guide;
}

export default function SimilarGuides({ currentGuide }: SimilarGuidesProps) {
  // Query for 3 guides in HCMC other than currentGuide
  const similar = GUIDES.filter((g) => g.id !== currentGuide.id && g.city === currentGuide.city)
    .slice(0, 3);

  return (
    <section className="space-y-6">
      <div className="flex items-baseline justify-between border-b border-[#E8E4DC] pb-4">
        <h3 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[#1C3A2E]">
          More guides you may like
        </h3>
        <Link 
          href="/guides" 
          className="text-xs font-bold text-[#C4614A] hover:text-[#D4745F] flex items-center gap-1 transition-colors"
        >
          <span>See all local guides</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {similar.map((guide) => (
          <Link
            key={guide.id}
            href={`/guides/${guide.id}`}
            className="bg-white border border-[#E8E4DC] rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300 flex flex-col group"
          >
            {/* Small portrait cover */}
            <div className="relative h-40 w-full overflow-hidden bg-[#EDE8E0]">
              <img
                src={guide.avatar}
                alt={`${guide.firstName} ${guide.lastName}`}
                className="w-full h-full object-cover object-top group-hover:scale-103 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
              
              {/* Price badge */}
              <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-bold text-[#1C3A2E] shadow-sm">
                {formatCurrency(guide.pricing.perHour)}/hr
              </div>
            </div>

            {/* Guide Info */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-[family-name:var(--font-playfair)] text-base font-bold text-[#1C3A2E] group-hover:text-[#C4614A] transition-colors">
                    {guide.firstName} {guide.lastName.charAt(0)}.
                  </h4>
                  <div className="flex items-center gap-0.5 text-xs font-bold text-[#1A1A1A]">
                    <Star size={12} className="fill-amber-500 text-amber-500" />
                    <span>{guide.rating}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-semibold text-[#8A8A8A]">
                  <MapPin size={11} className="text-[#C4614A]" />
                  <span>{guide.district}</span>
                </div>
              </div>

              {/* Specialty chips */}
              <div className="flex flex-wrap gap-1 pt-1">
                {guide.experienceCategories.slice(0, 2).map((cat) => (
                  <span
                    key={cat}
                    className="bg-[#FAFAF7] border border-[#E8E4DC] text-[9px] font-bold text-[#5A5A5A] px-2 py-0.5 rounded-md"
                  >
                    {categoryLabel(cat)}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

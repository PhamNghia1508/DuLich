'use client';

import React from 'react';
import { Globe, Heart, Award } from 'lucide-react';
import type { Guide } from '@/types';
import { proficiencyLabel, personalityLabel, categoryLabel } from '@/lib/utils';

interface GuideLanguagesProps {
  guide: Guide;
}

export default function GuideLanguages({ guide }: GuideLanguagesProps) {
  return (
    <section className="bg-white border border-[#E8E4DC] rounded-3xl p-6 sm:p-8 space-y-8 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Languages block */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[#1C3A2E] border-b border-[#F5F0EA] pb-3">
            <Globe size={18} className="text-[#C4614A]" />
            <h3 className="font-[family-name:var(--font-playfair)] text-lg font-bold">Languages</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {guide.languages.map((l) => (
              <span
                key={l.code}
                className="inline-flex items-center justify-between gap-2 bg-[#FAFAF7] border border-[#E8E4DC] px-3.5 py-2 rounded-xl text-sm font-semibold text-[#1A1A1A]"
              >
                <span>{l.name}</span>
                <span className="text-[10px] font-bold text-[#C4614A] bg-[#FAF0ED] px-2 py-0.5 rounded-full capitalize">
                  {proficiencyLabel(l.proficiency)}
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* Guiding Style block */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[#1C3A2E] border-b border-[#F5F0EA] pb-3">
            <Heart size={18} className="text-[#C4614A]" />
            <h3 className="font-[family-name:var(--font-playfair)] text-lg font-bold">Guiding style</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {guide.personalityTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center bg-[#FAFAF7] border border-[#E8E4DC] px-3.5 py-2 rounded-xl text-sm font-semibold text-[#1C3A2E]"
              >
                {personalityLabel(tag)}
              </span>
            ))}
          </div>
        </div>

        {/* Specialties block */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[#1C3A2E] border-b border-[#F5F0EA] pb-3">
            <Award size={18} className="text-[#C4614A]" />
            <h3 className="font-[family-name:var(--font-playfair)] text-lg font-bold">Specialties</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {guide.specialties ? (
              guide.specialties.map((spec) => (
                <span
                  key={spec}
                  className="inline-flex items-center bg-[#EAF0EC] border border-[#C5D1CA] px-3.5 py-2 rounded-xl text-sm font-bold text-[#1C3A2E]"
                >
                  {spec}
                </span>
              ))
            ) : (
              guide.experienceCategories.map((cat) => (
                <span
                  key={cat}
                  className="inline-flex items-center bg-[#EAF0EC] border border-[#C5D1CA] px-3.5 py-2 rounded-xl text-sm font-bold text-[#1C3A2E]"
                >
                  {categoryLabel(cat)}
                </span>
              ))
            )}
          </div>
        </div>

      </div>
    </section>
  );
}

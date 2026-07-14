
import React from 'react';
import { Award, Compass, Footprints, Globe, Heart, MessageSquareCode, Users } from 'lucide-react';
import type { Guide } from '@/types';
import { categoryLabel, personalityLabel, proficiencyLabel } from '@/lib/utils';

interface GuideAtAGlanceProps {
  guide: Guide;
}

export default function GuideAtAGlance({ guide }: GuideAtAGlanceProps) {
  const guideSpecialties = guide.specialties.length > 0
    ? guide.specialties
    : guide.experienceCategories.map(categoryLabel);

  const facts = [
    {
      icon: <Users size={17} />,
      label: 'Best for',
      value: '1-6 travelers',
    },
    {
      icon: <Footprints size={17} />,
      label: 'Pace',
      value: guide.id === 'guide-001' ? 'Moderate, food-crawl friendly' : 'Flexible to match yours',
    },
    {
      icon: <MessageSquareCode size={17} />,
      label: 'Replies in',
      value: `~${guide.responseTimeMinutes} minutes`,
    },
    {
      icon: <Compass size={17} />,
      label: 'Areas',
      value: `${guide.district}, District 3, District 5`,
    },
  ];

  return (
    <section className="border-y border-[#E8E4DC] bg-white/55 py-7">
      <div className="mb-6 flex flex-col gap-2 border-b border-[#F5F0EA] pb-5">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#C4614A]">At a glance</p>
        <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[#1C3A2E]">
          How Linh guides
        </h2>
      </div>

      <div className="grid gap-7 px-1 lg:grid-cols-[0.95fr_1.05fr]">
        <dl className="grid gap-4 sm:grid-cols-2">
          {facts.map((fact) => (
            <div key={fact.label} className="flex gap-3">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F5F0EA] text-[#C4614A]">
                {fact.icon}
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-[0.1em] text-[#8A8A8A]">{fact.label}</dt>
                <dd className="mt-1 text-sm font-semibold leading-5 text-[#1A1A1A]">{fact.value}</dd>
              </div>
            </div>
          ))}
        </dl>

        <div className="space-y-5">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-[#1C3A2E]">
              <Globe size={17} className="text-[#C4614A]" />
              Languages
            </div>
            <div className="flex flex-wrap gap-2">
              {guide.languages.map((language) => (
                <span
                  key={language.code}
                  className="inline-flex items-center gap-2 rounded-full border border-[#E8E4DC] bg-[#FAFAF7] px-3 py-1.5 text-sm font-semibold text-[#1A1A1A]"
                >
                  {language.name}
                  <span className="text-xs font-bold text-[#C4614A]">{proficiencyLabel(language.proficiency)}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-[#1C3A2E]">
              <Heart size={17} className="text-[#C4614A]" />
              Guiding style
            </div>
            <div className="flex flex-wrap gap-2">
              {guide.personalityTags.map((tag) => (
                <span key={tag} className="rounded-full bg-[#EAF0EC] px-3 py-1.5 text-sm font-semibold text-[#1C3A2E]">
                  {personalityLabel(tag)}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-[#1C3A2E]">
              <Award size={17} className="text-[#C4614A]" />
              Specialties
            </div>
            <div className="flex flex-wrap gap-2">
              {guideSpecialties.map((specialty) => (
                <span key={specialty} className="rounded-full bg-[#FAF0ED] px-3 py-1.5 text-sm font-bold text-[#A94D35]">
                  {specialty}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

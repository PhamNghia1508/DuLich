'use client';

import React from 'react';
import { User, Users, Footprints, Flame, MessageSquareCode, Compass } from 'lucide-react';
import type { Guide } from '@/types';

interface GuideQuickFactsProps {
  guide: Guide;
}

export default function GuideQuickFacts({ guide }: GuideQuickFactsProps) {
  // Derive details specifically suited to Linh or standard guides
  const facts = [
    {
      icon: <User size={18} className="text-[#C4614A]" />,
      label: 'Years guiding',
      value: guide.id === 'guide-001' ? '5 years' : '3+ years',
    },
    {
      icon: <Users size={18} className="text-[#C4614A]" />,
      label: 'Typical group size',
      value: '1–6 travelers',
    },
    {
      icon: <Footprints size={18} className="text-[#C4614A]" />,
      label: 'Walking pace',
      value: guide.id === 'guide-001' ? 'Moderate, food-crawl friendly' : 'Flexible to match yours',
    },
    {
      icon: <Flame size={18} className="text-[#C4614A]" />,
      label: 'Accessibility experience',
      value: guide.accessibilityExperience ? 'Full mobility support' : 'Standard walking tours',
    },
    {
      icon: <MessageSquareCode size={18} className="text-[#C4614A]" />,
      label: 'Average response time',
      value: `~${guide.responseTimeMinutes} minutes`,
    },
    {
      icon: <Compass size={18} className="text-[#C4614A]" />,
      label: 'Areas covered',
      value: `${guide.district}, District 3, District 5`,
    },
  ];

  return (
    <div className="bg-[#F5F0EA] border border-[#E8E4DC] rounded-3xl p-6 sm:p-8 space-y-6">
      <h3 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#1C3A2E] border-b border-[#E8E4DC] pb-3">
        Quick facts
      </h3>
      <dl className="space-y-4">
        {facts.map((fact, index) => (
          <div key={index} className="flex items-start gap-3 text-sm">
            <div className="mt-0.5 shrink-0 bg-white/60 p-1.5 rounded-lg border border-white/20">
              {fact.icon}
            </div>
            <div>
              <dt className="text-xs text-[#8A8A8A] font-semibold uppercase tracking-wider">{fact.label}</dt>
              <dd className="text-base text-[#1A1A1A] font-semibold mt-0.5">{fact.value}</dd>
            </div>
          </div>
        ))}
      </dl>
    </div>
  );
}

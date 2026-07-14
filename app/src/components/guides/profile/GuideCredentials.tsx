'use client';

import React from 'react';
import { Award, ShieldAlert, BadgeCheck, FileCheck, CheckCircle2 } from 'lucide-react';
import type { Guide } from '@/types';

interface GuideCredentialsProps {
  guide: Guide;
}

export default function GuideCredentials({ guide }: GuideCredentialsProps) {
  const trustPoints = [
    {
      icon: <BadgeCheck size={18} className="text-[#1D6C3D]" />,
      title: 'Profile manually reviewed',
      desc: 'The profile content and details are reviewed by the LocalLink community team.',
    },
    {
      icon: <FileCheck size={18} className="text-[#1D6C3D]" />,
      title: 'Language assessment',
      desc: 'Guide displays conversational and written proficiency in declared languages.',
    },
    {
      icon: <CheckCircle2 size={18} className="text-[#1D6C3D]" />,
      title: 'Experience-linked reviews',
      desc: 'All ratings and review commentary are linked to bookings finished on this platform.',
    },
  ];

  return (
    <section className="bg-white border border-[#E8E4DC] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
      <div className="space-y-1">
        <h3 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#1C3A2E]">
          Credentials and profile review
        </h3>
        <p className="text-xs text-[#5A5A5A]">
          Details submitted by {guide.firstName} to help you plan your journey with confidence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Left Side: Disclosures */}
        <div className="space-y-4">
          {trustPoints.map((point, index) => (
            <div key={index} className="flex gap-3 text-xs sm:text-sm">
              <div className="mt-0.5 shrink-0 bg-[#EAF0EC] p-1.5 rounded-lg text-[#1C3A2E]">
                {point.icon}
              </div>
              <div className="space-y-0.5">
                <span className="font-bold text-[#1A1A1A] block">{point.title}</span>
                <p className="text-[#5A5A5A] text-xs leading-relaxed">{point.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Right Side: Provided Credentials Chips */}
        <div className="space-y-4 bg-[#FAFAF7] border border-[#E8E4DC] p-5 rounded-2xl">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#1A1A1A]">
            <Award size={16} className="text-[#C4614A]" />
            <span>Submitted Credentials</span>
          </div>
          
          <div className="flex flex-wrap gap-2 pt-1">
            {guide.credentials.map((cred, idx) => (
              <span
                key={idx}
                className="bg-white border border-[#E8E4DC] text-[11px] font-bold text-[#1C3A2E] py-1.5 px-3 rounded-lg shadow-sm"
              >
                {cred}
              </span>
            ))}
          </div>

          <div className="border-t border-[#E8E4DC] pt-3 mt-3 flex gap-2 text-[11px] text-[#5A5A5A] leading-relaxed">
            <ShieldAlert size={16} className="text-[#C4614A] shrink-0 mt-0.5" />
            <p>
              LocalLink reviews profile information and displays relevant credentials supplied by the guide. Travelers should review all booking details before confirming.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

import React from 'react';
import { Link } from 'wouter';
import { MessageSquare, Calendar } from 'lucide-react';
import type { Guide } from '@/types';

interface GuideFinalCTAProps {
  guide: Guide;
  onCheckAvailability?: () => void;
}

export default function GuideFinalCTA({ guide, onCheckAvailability }: GuideFinalCTAProps) {
  return (
    <section className="bg-[#1C3A2E] border border-[#3E5D4F] rounded-3xl p-8 sm:p-12 text-center text-[#FAFAF7] shadow-xl relative overflow-hidden">
      {/* Decorative background element for travel editorial look */}
      <div className="absolute -top-12 -left-12 w-40 h-40 rounded-full bg-[#2A5243]/20 blur-2xl pointer-events-none"></div>
      <div className="absolute -bottom-12 -right-12 w-40 h-40 rounded-full bg-[#C4614A]/10 blur-2xl pointer-events-none"></div>
      
      <div className="max-w-xl mx-auto space-y-6 relative z-10">
        <span className="text-xs font-bold text-[#C5D1CA] uppercase tracking-wider block">Your Saigon Journey Starts Here</span>
        
        <h3 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-bold leading-tight">
          Ready to explore Saigon with {guide.firstName}?
        </h3>
        
        <p className="text-sm sm:text-base text-[#AEBFB5] leading-relaxed">
          Choose a date, share your interests, and shape the experience together. Linh is available to tailor tours to your speed, food allergies, and curiosity.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href={`/book/${guide.id}`}
            onClick={(e) => {
              if (onCheckAvailability) {
                e.preventDefault();
                onCheckAvailability();
              }
            }}
            className="btn btn-accent w-full sm:w-auto px-8 py-3.5 font-bold rounded-xl shadow-md hover:shadow-lg active:scale-95 transition-all text-sm inline-flex items-center justify-center gap-2"
          >
            <Calendar size={16} />
            <span>Check availability</span>
          </Link>
          
          <Link
            href={`/dashboard?chat=${guide.id}`}
            className="w-full sm:w-auto px-6 py-3.5 font-bold rounded-xl border border-[#AEBFB5] hover:bg-[#2A5243] active:scale-95 transition-all text-xs inline-flex items-center justify-center gap-2"
          >
            <MessageSquare size={16} />
            <span>Message {guide.firstName}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

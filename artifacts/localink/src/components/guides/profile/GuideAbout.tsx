
import React from 'react';
import type { Guide } from '@/types';

interface GuideAboutProps {
  guide: Guide;
}

export default function GuideAbout({ guide }: GuideAboutProps) {
  // Use custom content for Linh to make it extremely premium, with fallbacks for others
  const isLinh = guide.id === 'guide-001';

  const storyContent = guide.bio;

  const localKnowledge = isLinh
    ? "Knowing a city means knowing its rhythms. I map Saigon by its morning steam and night aromas. I know which soup stalls boil their broth for 18 hours, which family carts have survived three generations in the same hidden alleyway, and where to find the absolute freshest coconut coffee at dawn."
    : `I specialize in uncovering the lesser-known historical layers, local daily routines, and architectural anomalies in ${guide.city} that travelers typically overlook.`;

  const philosophy = isLinh
    ? "Guiding is not about memorizing dates or reciting tour scripts; it's about sharing a living connection. I believe the best way to understand Saigon is through your taste buds and through conversational stories. Every tour is an unhurried walk with a local friend."
    : "I design my experiences around genuine local interactions, comfortable pacing, and direct cultural exchange. I believe travel is at its best when it feels like a casual day out with a local.";

  return (
    <section className="space-y-6">
      <div className="max-w-[680px] space-y-3">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#C4614A]">About</p>
        <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-bold leading-tight text-[#1C3A2E]">
          About {guide.firstName}
        </h2>
        <p className="text-sm leading-6 text-[#66736D]">
          A clearer sense of the person behind the itinerary, from street-food instincts to how the day will feel.
        </p>
      </div>

      <div className="max-w-[680px] space-y-7 text-base leading-8 text-[#3F4A44]">
        <div className="space-y-2">
          <h3 className="font-sans text-xs font-bold uppercase tracking-[0.14em] text-[#8A8A8A]">My story</h3>
          <p>{storyContent}</p>
        </div>

        <div className="space-y-2">
          <h3 className="font-sans text-xs font-bold uppercase tracking-[0.14em] text-[#8A8A8A]">Local knowledge</h3>
          <p>{localKnowledge}</p>
        </div>

        <div className="space-y-2">
          <h3 className="font-sans text-xs font-bold uppercase tracking-[0.14em] text-[#8A8A8A]">Guiding philosophy</h3>
          <p>{philosophy}</p>
        </div>
      </div>
    </section>
  );
}

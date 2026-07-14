import { Link } from 'wouter';
import { CheckCircle2, Clock, Users } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import type { SampleItinerary } from '@/types';
import SafeImage from '@/components/ui/SafeImage';

interface GuideExperienceCardProps {
  itinerary: SampleItinerary;
  guideId: string;
}

export default function GuideExperienceCard({ itinerary, guideId }: GuideExperienceCardProps) {
  const isDawn = itinerary.title.toLowerCase().includes('dawn');
  const image = isDawn ? '/images/local-guide-hero.webp' : '/images/local-guide-hero-v2.webp';
  const description = isDawn
    ? 'Start before the heat with a pho stall, market lanes, banh mi, and coffee stops shaped around Linh’s morning food map.'
    : 'Follow small alleys and late-day snack stops where local routines, desserts, and southern comfort dishes tell the story.';
  const audience = isDawn ? ['Food lovers', 'Early risers', 'First-timers'] : ['Curious eaters', 'Couples', 'Night walkers'];
  const highlights = itinerary.highlights.slice(0, 4);

  return (
    <article className="group flex h-full min-h-[566px] flex-col overflow-hidden rounded-2xl border border-[#E8E4DC] bg-white shadow-sm transition-shadow hover:shadow-md sm:min-h-0">
      <div className="relative order-2 aspect-[4/3] overflow-hidden bg-[#EDE8E0]">
        <SafeImage
          src={image}
          alt={`${itinerary.title} in Ho Chi Minh City`}
          className="h-full w-full"
          imageClassName="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>

      <div className="order-1 px-5 pt-5">
        <span className="inline-flex min-h-8 items-center gap-1.5 rounded-full bg-[#EAF0EC] px-3 text-xs font-bold uppercase tracking-[0.1em] text-[#1C3A2E]">
          <Clock size={13} />
          {itinerary.duration}
        </span>
      </div>

      <div className="order-3 flex flex-1 flex-col p-5">
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-[family-name:var(--font-playfair)] text-2xl font-bold leading-tight text-[#1C3A2E]">
              {itinerary.title}
            </h3>
            <p className="text-sm leading-6 text-[#5A5A5A]">{description}</p>
          </div>

          <ul className="grid gap-2">
            {highlights.map((highlight) => (
              <li key={highlight} className="flex gap-2 text-sm leading-5 text-[#3F4A44]">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#C4614A]" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-2">
            {audience.map((item) => (
              <span key={item} className="inline-flex items-center gap-1 rounded-full bg-[#FAFAF7] px-3 py-1.5 text-xs font-semibold text-[#5A5A5A]">
                <Users size={12} />
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between gap-4 pt-6">
          <div>
            <span className="block text-xs font-bold uppercase tracking-[0.1em] text-[#8A8A8A]">Total price</span>
            <div className="mt-1 flex items-baseline text-[#1C3A2E]">
              <span className="text-2xl font-bold">{formatCurrency(itinerary.price)}</span>
              <span className="text-sm font-semibold text-[#5A5A5A]">/ group</span>
            </div>
          </div>

          <Link
            href={`/book/${guideId}?itin=${itinerary.id}`}
            className="btn btn-accent min-h-11 rounded-xl px-4 py-3 text-sm font-bold shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1C3A2E]"
          >
            Request experience
          </Link>
        </div>
      </div>
    </article>
  );
}

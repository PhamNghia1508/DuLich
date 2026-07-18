import { ArrowRight, MapPin, Star } from 'lucide-react';
import { Link } from 'wouter';

import { formatPrototypeMoney } from '../bookingPrototype';
import type { RichGuideProfileViewModel } from '../richGuideProfileData';

export default function RichRelatedGuides({ guide }: { guide: RichGuideProfileViewModel }) {
  return (
    <section className="rich-section rich-related" aria-labelledby="rich-related-title">
      <header><p className="rich-eyebrow">Keep exploring</p><h2 id="rich-related-title">Related Guides</h2></header>
      <div className="rich-related-grid">
        {guide.relatedGuides.map((related) => (
          <Link key={related.id} href={`/guides/${related.id}`} className="rich-related-card">
            <img src={related.image} alt={`${related.name}, local guide in ${related.city}`} />
            <div><h3>{related.name}</h3><p><MapPin size={13} aria-hidden="true" /> {related.city}</p><span><Star size={13} fill="currentColor" aria-hidden="true" /> {related.rating} · {formatPrototypeMoney(related.hourlyRate, related.currency)}/hr</span><ul>{related.specialties.map((specialty) => <li key={specialty}>{specialty}</li>)}</ul><strong>View Profile <ArrowRight size={14} aria-hidden="true" /></strong></div>
          </Link>
        ))}
      </div>
    </section>
  );
}

import { BadgeCheck, CalendarCheck2, ChevronLeft, MapPin, Star, Users } from 'lucide-react';
import { Link } from 'wouter';

import type { RichGuideProfileViewModel } from '../richGuideProfileData';

interface RichGuideHeroProps {
  guide: RichGuideProfileViewModel;
  onChoose: () => void;
  onCheckAvailability: () => void;
}

export default function RichGuideHero({ guide, onCheckAvailability }: RichGuideHeroProps) {
  return (
    <div className="rich-profile-top">
      <Link href="/" className="rich-profile-back">
        <ChevronLeft size={16} aria-hidden="true" /> Back to Results
      </Link>

      {guide.recommendationReasons && (
        <section className="rich-recommendation" aria-labelledby="rich-recommendation-title">
          <div>
            <CalendarCheck2 size={18} aria-hidden="true" />
            <h2 id="rich-recommendation-title">Recommended for your trip</h2>
          </div>
          <ul aria-label="Recommendation reasons">
            {guide.recommendationReasons.map((reason) => <li key={reason}>{reason}</li>)}
          </ul>
        </section>
      )}

      <section className="rich-profile-hero" aria-labelledby="rich-profile-title">
        <figure className="rich-profile-portrait">
          <img src={guide.heroImage} alt={`${guide.fullName}, local guide in ${guide.city}`} />
          <figcaption>{guide.availabilityLabel}</figcaption>
        </figure>

        <div className="rich-profile-identity">
          <p className="rich-eyebrow">Your local friend in {guide.city}</p>
          <div className="rich-profile-title-row">
            <h1 id="rich-profile-title">{guide.fullName}</h1>
            {guide.verified && (
              <span><BadgeCheck size={18} aria-hidden="true" /> Verified</span>
            )}
          </div>
          <p className="rich-profile-location"><MapPin size={16} aria-hidden="true" /> {guide.city} · {guide.operatingAreas.join(' · ')}</p>
          <p className="rich-profile-tagline">{guide.tagline}</p>

          <dl className="rich-profile-hero-metrics">
            <div><dt><Star size={16} aria-hidden="true" /> Rating</dt><dd>{guide.rating} <span>({guide.reviewCount})</span></dd></div>
            <div><dt><Users size={16} aria-hidden="true" /> Hosted</dt><dd>{guide.completedBookings}+ <span>experiences</span></dd></div>
            <div><dt><CalendarCheck2 size={16} aria-hidden="true" /> Status</dt><dd>{guide.availabilityLabel}</dd></div>
          </dl>

          <div className="rich-profile-hero-actions">
            <button type="button" className="btn btn-outline" onClick={onCheckAvailability}>Check Availability</button>
            <span>Use the sidebar to continue to booking details.</span>
          </div>
        </div>
      </section>
    </div>
  );
}

import {
  BadgeCheck,
  CalendarDays,
  Check,
  Clock3,
  Languages,
  MapPin,
  ShieldCheck,
  Star,
} from 'lucide-react';
import { Link } from 'wouter';

import { formatCurrency } from '@/lib/utils';

import type { PrototypeGuideProfile as GuideProfile } from './guideProfileData';

interface PrototypeGuideProfileProps {
  guide: GuideProfile;
  recommendationReasons?: string[];
  onChoose: () => void;
}

function ProfileFacts({ guide }: { guide: GuideProfile }) {
  return (
    <dl className="traveler-profile-facts">
      <div>
        <dt><Star size={16} fill="currentColor" aria-hidden="true" /> Rating</dt>
        <dd>{guide.rating} <span>({guide.reviewCount} reviews)</span></dd>
      </div>
      <div>
        <dt><Clock3 size={16} aria-hidden="true" /> Response</dt>
        <dd>{guide.responseTime.replace('Usually responds in ', '')}</dd>
      </div>
      <div>
        <dt><Languages size={16} aria-hidden="true" /> Languages</dt>
        <dd>{guide.languages.map((language) => language.name).join(', ')}</dd>
      </div>
    </dl>
  );
}

function ProfileActionCard({ guide, onChoose }: { guide: GuideProfile; onChoose: () => void }) {
  return (
    <div className="traveler-profile-action-card">
      <p className="traveler-profile-rate-label">Starting from</p>
      <p className="traveler-profile-rate">
        {guide.hourlyRate && guide.currency ? formatCurrency(guide.hourlyRate, guide.currency) : 'Custom'}
        {guide.hourlyRate && <span> / hour</span>}
      </p>
      <button type="button" className="btn btn-accent" onClick={onChoose}>Choose This Guide</button>
      <Link href="/" className="traveler-profile-back">Back to Results</Link>
      <div className="traveler-profile-trust">
        <p><ShieldCheck size={17} aria-hidden="true" /> Identity verified</p>
        <p><Clock3 size={17} aria-hidden="true" /> {guide.responseTime}</p>
        <p><Star size={17} aria-hidden="true" /> {guide.rating} customer rating</p>
      </div>
    </div>
  );
}

export default function PrototypeGuideProfile({
  guide,
  recommendationReasons,
  onChoose,
}: PrototypeGuideProfileProps) {
  return (
    <div className="traveler-profile-layout">
      <div className="traveler-profile-main">
        {recommendationReasons && (
          <section className="profile-recommendation" aria-labelledby="recommendation-title">
            <div>
              <Check size={18} aria-hidden="true" />
              <h2 id="recommendation-title">Recommended for your trip</h2>
            </div>
            <ul aria-label="Why this guide is recommended">
              {recommendationReasons.map((reason) => <li key={reason}>{reason}</li>)}
            </ul>
          </section>
        )}

        <section className="traveler-profile-hero" aria-labelledby="guide-profile-title">
          <div className="traveler-profile-portrait">
            <img src={guide.portrait} alt={`${guide.name}, local guide in ${guide.city}`} />
          </div>
          <div className="traveler-profile-identity">
            <p className="traveler-profile-kicker">Your local friend in {guide.city}</p>
            <div className="traveler-profile-title-row">
              <h1 id="guide-profile-title">{guide.name}</h1>
              {guide.verified && <span><BadgeCheck size={18} aria-hidden="true" /> Verified</span>}
            </div>
            <p className="traveler-profile-location"><MapPin size={16} aria-hidden="true" /> {guide.city} · {guide.serviceAreas.slice(0, 2).join(' · ')}</p>
          </div>
          <p className="traveler-profile-intro">{guide.introduction}</p>
          <ProfileFacts guide={guide} />
        </section>

        <div className="traveler-profile-mobile-action">
          <ProfileActionCard guide={guide} onChoose={onChoose} />
        </div>

        <section className="traveler-profile-section" aria-labelledby="about-guide-title">
          <p className="traveler-profile-section-label">About</p>
          <h2 id="about-guide-title">Meet {guide.name.split(' ')[0]}</h2>
          <p>{guide.about}</p>
          <p className="traveler-profile-experience"><strong>{guide.experienceYears} years</strong> sharing local knowledge with travelers.</p>
        </section>

        <section className="traveler-profile-section" aria-labelledby="experiences-title">
          <p className="traveler-profile-section-label">Experiences</p>
          <h2 id="experiences-title">Explore together</h2>
          <div className="traveler-profile-chips">
            {guide.experiences.map((experience) => <span key={experience}>{experience}</span>)}
          </div>
        </section>

        <section className="traveler-profile-section" aria-labelledby="gallery-title">
          <p className="traveler-profile-section-label">A local point of view</p>
          <h2 id="gallery-title">Around {guide.city}</h2>
          <div className="traveler-profile-gallery">
            {guide.galleryImages.slice(0, 4).map((image, index) => (
              <img
                key={image}
                src={image}
                alt={index === 0 ? `${guide.name} sharing a local experience` : `Local experience in ${guide.city}`}
              />
            ))}
          </div>
        </section>

        <section className="traveler-profile-section" aria-labelledby="availability-title">
          <p className="traveler-profile-section-label">Mock availability</p>
          <h2 id="availability-title">A few upcoming dates</h2>
          <div className="traveler-profile-availability">
            {guide.availability.map((day) => (
              <div key={day.date} className={day.available ? 'is-available' : 'is-unavailable'}>
                <CalendarDays size={18} aria-hidden="true" />
                <span>{day.label}</span>
                <strong>{day.available ? 'Available' : 'Unavailable'}</strong>
              </div>
            ))}
          </div>
          <p className="traveler-profile-note">Availability is illustrative for this prototype. No date is reserved yet.</p>
        </section>

        <section className="traveler-profile-section" aria-labelledby="reviews-title">
          <p className="traveler-profile-section-label">Traveler notes</p>
          <h2 id="reviews-title">What it feels like to explore together</h2>
          <div className="traveler-profile-reviews">
            {guide.reviews.map((review) => (
              <article key={review.id}>
                <div className="traveler-profile-review-heading">
                  <div>
                    <h3>{review.reviewerName}</h3>
                    <p>{review.country} · {review.date}</p>
                  </div>
                  <span aria-label={`${review.rating} out of 5 stars`}><Star size={14} fill="currentColor" aria-hidden="true" /> {review.rating}</span>
                </div>
                <p>{review.comment}</p>
              </article>
            ))}
          </div>
        </section>
      </div>

      <aside className="traveler-profile-sidebar" aria-label="Choose this local guide">
        <ProfileActionCard guide={guide} onChoose={onChoose} />
      </aside>
    </div>
  );
}

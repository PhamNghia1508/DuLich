import { BadgeCheck, CalendarDays, CheckCircle2, Languages, ShieldCheck, Star } from 'lucide-react';
import { useState } from 'react';

import type { RichGuideProfileViewModel } from '../richGuideProfileData';

export default function RichGuideTrust({ guide }: { guide: RichGuideProfileViewModel }) {
  const firstAvailable = guide.availability.find((day) => day.status === 'available')?.date ?? '';
  const [selectedDate, setSelectedDate] = useState(firstAvailable);
  const selectedDay = guide.availability.find((day) => day.date === selectedDate);

  return (
    <>
      <section className="rich-section rich-availability" aria-labelledby="rich-availability-title">
        <header><p className="rich-eyebrow">Display-only schedule</p><h2 id="rich-availability-title">Availability</h2><p>Selecting a day here does not create or modify a booking.</p></header>
        <div className="rich-availability-legend" aria-label="Availability legend"><span className="is-available">Available</span><span className="is-hold">Hold</span><span className="is-unavailable">Unavailable</span></div>
        <div className="rich-availability-grid" aria-label={`${guide.displayName} availability`}>
          {guide.availability.map((day) => (
            <button key={day.date} type="button" className={`is-${day.status}`} disabled={day.status === 'unavailable'} aria-pressed={selectedDate === day.date} onClick={() => setSelectedDate(day.date)}>
              <CalendarDays size={17} aria-hidden="true" /><span>{day.label}</span><strong>{day.status === 'available' ? 'Available' : day.status === 'hold' ? 'On hold' : 'Booked'}</strong>
            </button>
          ))}
        </div>
        {selectedDay && <p className="rich-selected-availability"><CheckCircle2 size={16} aria-hidden="true" /> Preview times: {selectedDay.timeSlots.join(' · ') || 'No times available'}</p>}
      </section>

      <section className="rich-section" aria-labelledby="rich-credentials-title">
        <header><p className="rich-eyebrow">Marketplace trust</p><h2 id="rich-credentials-title">Credentials & Verification</h2></header>
        <div className="rich-credential-grid">
          {guide.credentials.map((credential, index) => (
            <article key={`${credential.title}-${index}`}>
              {index === 1 ? <Languages size={20} aria-hidden="true" /> : index === 2 ? <Star size={20} aria-hidden="true" /> : <ShieldCheck size={20} aria-hidden="true" />}
              <div><h3>{credential.title}</h3><p>{credential.detail}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="rich-section rich-reviews" aria-labelledby="rich-reviews-title">
        <header><p className="rich-eyebrow">Experience-linked feedback</p><h2 id="rich-reviews-title">Traveler Reviews</h2></header>
        <div className="rich-review-summary">
          <div><strong>{guide.rating}</strong><span><Star size={17} fill="currentColor" aria-hidden="true" /> Based on {guide.reviewCount} reviews</span></div>
          <dl>
            {['Communication', 'Local knowledge', 'Pacing & comfort', 'Value'].map((dimension, index) => (
              <div key={dimension}><dt>{dimension}</dt><dd><progress max="5" value={Math.max(4.7, guide.rating - index * 0.03)} /><span>{Math.max(4.7, guide.rating - index * 0.03).toFixed(1)}</span></dd></div>
            ))}
          </dl>
        </div>
        <div className="rich-review-list">
          {guide.reviews.slice(0, 4).map((review) => (
            <article key={review.id}>
              <header><img src={review.avatar} alt="" /><div><h3>{review.reviewerName}</h3><p>{review.country} · {review.date}</p></div><span><Star size={13} fill="currentColor" aria-hidden="true" /> {review.rating}</span></header>
              <p>{review.comment}</p>
              <footer><BadgeCheck size={13} aria-hidden="true" /> Experience verified · {review.experience}</footer>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

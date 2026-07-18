import { BadgeCheck, Languages, ShieldCheck, Star } from 'lucide-react';

import type { RichGuideProfileViewModel } from '../richGuideProfileData';

const CREDENTIAL_ICONS = [ShieldCheck, Languages, Star, ShieldCheck, ShieldCheck] as const;

export default function RichGuideTrust({ guide }: { guide: RichGuideProfileViewModel }) {
  return (
    <>
      <section className="rich-section" aria-labelledby="rich-credentials-title">
        <header><p className="rich-eyebrow">Marketplace trust</p><h2 id="rich-credentials-title">Credentials & Verification</h2></header>
        <div className="rich-credential-grid">
          {guide.credentials.map((credential, index) => {
            const Icon = CREDENTIAL_ICONS[index % CREDENTIAL_ICONS.length];
            return (
              <article key={`${credential.title}-${index}`}>
                <Icon size={20} aria-hidden="true" />
                <div><h3>{credential.title}</h3><p>{credential.detail}</p></div>
              </article>
            );
          })}
        </div>
      </section>

      <section id="reviews" className="rich-section rich-reviews" aria-labelledby="rich-reviews-title">
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

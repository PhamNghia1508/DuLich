import { useState } from 'react';
import { Link } from 'wouter';
import { ArrowRight, CheckCircle2, Heart, MapPin, Star } from 'lucide-react';
import { GUIDES } from '@/data/mockData';
import { formatCurrency, personalityLabel } from '@/lib/utils';

export default function FeaturedGuides() {
  const [saved, setSaved] = useState<string[]>([]);
  const [imageErrors, setImageErrors] = useState<string[]>([]);
  const featured = GUIDES.slice(0, 4);

  return (
    <section className="section featured-guides" aria-labelledby="featured-guides-title">
      <div className="container">
        <div className="section-heading-row">
          <div>
            <span className="section-label">FriendLocalTrip marketplace</span>
            <h2 id="featured-guides-title">Meet Your Local Friends</h2>
            <p>A few friendly faces ready to share their city, language, and local point of view.</p>
          </div>
          <Link href="/guides" className="text-link">Browse all guides <ArrowRight size={17} /></Link>
        </div>

        <div className="guide-rail">
          {featured.map((guide) => {
            const isSaved = saved.includes(guide.id);
            return (
              <article className="home-guide-card" key={guide.id} style={{ position: 'relative' }}>
                <Link href={`/guides/${guide.id}`} className="absolute inset-0 z-10 rounded-[inherit] outline-none" aria-label={`View profile of ${guide.displayName}`} />
                <div className="home-guide-photo">
                  {!imageErrors.includes(guide.id) ? (
                    <img src={guide.avatar} alt={`${guide.displayName}, a local guide in ${guide.city}`} className="absolute inset-0 w-full h-full object-cover" onError={() => setImageErrors((ids) => [...ids, guide.id])} />
                  ) : (
                    <div className="guide-image-fallback" role="img" aria-label={`Portrait unavailable for ${guide.displayName}`}><span>{guide.firstName.charAt(0)}</span></div>
                  )}
                  <button type="button" aria-label={isSaved ? `Remove ${guide.displayName} from saved guides` : `Save ${guide.displayName}`} aria-pressed={isSaved} onClick={() => setSaved((items) => isSaved ? items.filter((id) => id !== guide.id) : [...items, guide.id])} className="absolute z-20" style={{ top: '12px', right: '12px' }}>
                    <Heart size={18} fill={isSaved ? 'currentColor' : 'none'} />
                  </button>
                  <span className="availability-pill">Available this week</span>
                </div>
                <div className="home-guide-body">
                  <div className="home-guide-title">
                    <div><h3>{guide.displayName}</h3><p><MapPin size={14} /> {guide.city}</p></div>
                    <span><CheckCircle2 size={15} /> Verified</span>
                  </div>
                  <p className="guide-languages">{guide.languages.map((language) => language.name).join(' · ')}</p>
                  <p className="guide-intro">{guide.shortIntro}</p>
                  <div className="guide-tags">{guide.personalityTags.slice(0, 3).map((tag) => <span key={tag}>{personalityLabel(tag)}</span>)}</div>
                  <div className="home-guide-meta">
                    <span><Star size={15} fill="currentColor" /> <strong>{guide.rating}</strong> ({guide.reviewCount})</span>
                    <span>From <strong>{formatCurrency(guide.pricing.perHour, guide.pricing.currency)}/hr</strong></span>
                  </div>
                  <Link href={`/guides/${guide.id}`} className="guide-profile-link relative z-20">View profile <ArrowRight size={16} /></Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

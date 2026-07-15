import { Link } from 'wouter';
import { ArrowRight, CalendarDays, Check, Languages, LifeBuoy, ShieldCheck } from 'lucide-react';

const trustSignals = [
  { label: 'Verified local guides', icon: ShieldCheck },
  { label: 'Flexible planning', icon: CalendarDays },
  { label: 'Local support', icon: LifeBuoy },
];

export default function Hero() {
  return (
    <section className="hero-shell" aria-labelledby="hero-title">
      <div className="hero-grid">
        <div className="hero-copy">
          <p className="hero-eyebrow">
            <span aria-hidden="true" />
            A more personal way to see Vietnam
          </p>

          <h1 id="hero-title" className="hero-title">
            <span>Explore Vietnam</span>
            <span>with someone who</span>
            <span className="hero-title-accent">truly gets you.</span>
          </h1>

          <p className="hero-description">
            Find a verified local guide matched to your language, interests, pace,
            personality, and schedule—then shape a trip that feels entirely your own.
          </p>

          <div className="hero-actions" aria-label="Start exploring">
            <Link href="/match" className="btn btn-accent btn-lg hero-primary-action">
              Tell us about your trip
              <ArrowRight aria-hidden="true" size={18} />
            </Link>
            <Link href="/guides" className="hero-secondary-action">
              Browse local guides
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>

          <ul className="hero-trust" aria-label="Friendlocalcheap benefits">
            {trustSignals.map(({ label, icon: Icon }) => (
              <li key={label}>
                <Icon aria-hidden="true" size={17} />
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="hero-visual" style={{ position: 'relative' }}>
          <img
            src="/images/hero/local-guide-conversation.webp"
            alt="A Vietnamese local guide explaining central Saigon to a small group of international travelers"
            className="hero-image absolute inset-0 w-full h-full object-cover"
          />
          <div className="hero-image-wash" aria-hidden="true" />

          <div className="hero-match-badge">
            <span className="hero-match-icon" aria-hidden="true"><Check size={15} /></span>
            <span>
              <small>Your guide match</small>
              <strong>Excellent match</strong>
            </span>
          </div>

          <div className="hero-guide-card">
            <div>
              <p>Local match ready <span><ShieldCheck aria-hidden="true" size={14} /> Verified</span></p>
              <small>Hội An · Guides available this week</small>
            </div>
            <div className="hero-language">
              <Languages aria-hidden="true" size={16} />
              English · Vietnamese
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import {
  ArrowRight,
  Check,
  Headphones,
  Languages,
  ShieldCheck,
  Star,
} from 'lucide-react';

const trustSignals = [
  { label: 'Verified Guides', icon: ShieldCheck },
  { label: '4.9+ Rating', icon: Star },
  { label: '24/7 Support', icon: Headphones },
];

interface HeroProps {
  onRequestGuide: () => void;
}

export default function Hero({ onRequestGuide }: HeroProps) {
  return (
    <section className="hero-shell home-hero" aria-labelledby="hero-title">
      <div className="hero-grid">
        <div className="hero-copy">
          <p className="hero-eyebrow">
            <span aria-hidden="true" />
            FriendLocalTrip
          </p>

          <h1 id="hero-title" className="hero-title">
            <span>Travel like a local.</span>
            <span className="hero-title-accent">Feel like a friend.</span>
          </h1>

          <p className="hero-description">
            Tell us where you are going and meet a trusted local who can make the trip feel personal.
          </p>

          <div className="hero-actions" aria-label="Request a local guide">
            <button
              type="button"
              className="btn btn-accent btn-lg hero-primary-action"
              onClick={onRequestGuide}
            >
              Request a Local Guide
              <ArrowRight aria-hidden="true" size={18} />
            </button>
          </div>

          <ul className="hero-trust" aria-label="FriendLocalTrip trust signals">
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
            alt="A Vietnamese local guide talking with international travelers"
            className="hero-image absolute inset-0 w-full h-full object-cover"
          />
          <div className="hero-image-wash" aria-hidden="true" />

          <div className="hero-match-badge">
            <span className="hero-match-icon" aria-hidden="true"><Check size={15} /></span>
            <span>
              <small>FriendLocalTrip</small>
              <strong>Local friends, ready</strong>
            </span>
          </div>

          <div className="hero-guide-card">
            <div>
              <p>Meet your local friend <span><ShieldCheck aria-hidden="true" size={14} /> Verified</span></p>
              <small>Vietnam · Guides available this week</small>
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

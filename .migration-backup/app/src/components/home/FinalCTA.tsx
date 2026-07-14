import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function FinalCTA() {
  return (
    <section className="final-cta-section" aria-labelledby="final-cta-title">
      <div className="container final-cta-inner">
        <span className="section-label">Your trip, your rhythm</span>
        <h2 id="final-cta-title">Your Vietnam experience should feel personal.</h2>
        <p>Tell us how you travel, what you enjoy, and what support you need. We’ll help you find a local guide who fits.</p>
        <div><Link href="/match" className="btn btn-accent btn-lg">Start your guide match <ArrowRight size={17} /></Link><Link href="/guides" className="final-cta-secondary">Browse local guides</Link></div>
      </div>
    </section>
  );
}

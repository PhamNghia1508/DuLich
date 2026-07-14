import { Link } from 'wouter';
import { CalendarDays, ClipboardList, Compass, UserRoundCheck } from 'lucide-react';

const benefits = [
  { icon: CalendarDays, title: 'Set your own availability', text: 'Choose the dates and times that work for you.' },
  { icon: Compass, title: 'Offer experiences you care about', text: 'Build walks and conversations around your local knowledge.' },
  { icon: UserRoundCheck, title: 'Build a trusted local profile', text: 'Show travelers your languages, interests, and experience.' },
  { icon: ClipboardList, title: 'Manage requests in one place', text: 'Review trip details and keep track of booking status.' },
];

export default function BecomeGuide() {
  return (
    <section className="section dark-surface become-guide-section" aria-labelledby="become-guide-title">
      <div className="container become-guide-layout">
        <div>
          <span className="section-label">Become a local guide</span>
          <h2 id="become-guide-title">Know Vietnam by heart? Share it with the world.</h2>
          <p>Help travelers understand the place you call home. Create thoughtful experiences around your knowledge, interests, and community.</p>
          <div className="become-guide-benefits">
            {benefits.map(({ icon: Icon, title, text }) => <div key={title}><Icon aria-hidden="true" size={20} /><div><h3>{title}</h3><p>{text}</p></div></div>)}
          </div>
          <Link href="/guide-dashboard" className="btn btn-accent btn-lg">Apply to become a guide</Link>
        </div>
        <div className="become-guide-image">
          <img src="/images/local-guide-hero.webp" alt="A neighborhood pho shop in Hanoi, Vietnam" className="absolute inset-0 w-full h-full object-cover" />
          <div><span>A local point of view</span><p>Share the places, people, and everyday stories that make your city feel like home.</p></div>
        </div>
      </div>
    </section>
  );
}

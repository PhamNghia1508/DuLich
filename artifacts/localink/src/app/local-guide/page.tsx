import { CalendarDays, DollarSign, Globe2, LayoutDashboard, ShieldCheck } from 'lucide-react';
import { Link } from 'wouter';

import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import SupportChat from '@/components/home/SupportChat';

import './local-guide.css';

const benefits = [
  { icon: CalendarDays, title: 'Flexible availability', text: 'Choose when you guide.' },
  { icon: DollarSign, title: 'Set your own rate', text: 'Price your local expertise.' },
  { icon: Globe2, title: 'Meet travelers', text: 'Share authentic experiences.' },
  { icon: ShieldCheck, title: 'Guide with confidence', text: 'Manage everything in one place.' },
];

export default function LocalGuideHubPage() {
  return (
    <div className="lg-page">
      <Navbar variant="home" />
      <main className="lg-hub">
        <section className="lg-hub-hero">
          <div className="lg-hub-copy">
            <p className="lg-eyebrow">For Local Guides</p>
            <h1>Share your city. Create meaningful local experiences.</h1>
            <p className="lg-lead">Build a guide profile, choose your availability, and connect with travelers who want to see your city through local eyes.</p>
            <div className="lg-hub-actions">
              <Link href="/local-guide/register" className="lg-btn-primary">Apply to Become a Guide</Link>
              <Link href="/local-guide/dashboard" className="lg-btn-secondary">
                <LayoutDashboard size={17} /> Explore Demo Dashboard
              </Link>
            </div>
          </div>
          <div className="lg-hub-visual">
            <img src="/images/hero/local-guide-conversation.webp" alt="A local guide sharing the city with travelers" />
            <div className="lg-hub-visual-note"><ShieldCheck size={18} /><span>Prototype guide workspace</span></div>
          </div>
        </section>

        <section className="lg-benefits" aria-label="Guide benefits">
          {benefits.map(({ icon: Icon, title, text }) => (
            <article className="lg-benefit-card" key={title}>
              <Icon size={21} />
              <div><h2>{title}</h2><p>{text}</p></div>
            </article>
          ))}
        </section>

        <section className="lg-steps">
          <div><p className="lg-eyebrow">Three simple steps</p><h2>From local knowledge to a guide profile</h2></div>
          <ol className="lg-steps-list">
            <li><span>1</span><div><h3>Create your profile</h3><p>Introduce yourself and the experiences you know best.</p></div></li>
            <li><span>2</span><div><h3>Complete demo verification</h3><p>Preview the trust and profile-review flow.</p></div></li>
            <li><span>3</span><div><h3>Manage your guide work</h3><p>Explore requests, availability, earnings, and messages.</p></div></li>
          </ol>
        </section>
      </main>
      <Footer variant="home" />
      <SupportChat />
    </div>
  );
}

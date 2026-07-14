import Link from 'next/link';
import { ArrowRight, MessageCircle, Route, SlidersHorizontal, UsersRound } from 'lucide-react';

const steps = [
  { icon: SlidersHorizontal, title: 'Tell us about your trip', text: 'Share your dates, interests, pace, language, and support needs.' },
  { icon: UsersRound, title: 'Meet guides matched to your style', text: 'Compare a short list of local guides who fit how you like to travel.' },
  { icon: MessageCircle, title: 'Chat and shape the experience', text: 'Ask questions and build a flexible plan together before you meet.' },
  { icon: Route, title: 'Explore with confidence', text: 'Enjoy Vietnam with local context and support close at hand.' },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section matching-section dark-surface" aria-labelledby="matching-title">
      <div className="container matching-layout">
        <div className="matching-intro">
          <span className="section-label">How matching works</span>
          <h2 id="matching-title">From travel idea to local connection</h2>
          <p>A few thoughtful details help us surface guides who fit your pace, personality, and plans.</p>
          <Link href="/match" className="btn btn-accent btn-lg">Start your guide match <ArrowRight size={17} /></Link>
        </div>
        <ol className="matching-timeline">
          {steps.map(({ icon: Icon, title, text }, index) => (
            <li key={title}>
              <span className="step-number">{String(index + 1).padStart(2, '0')}</span>
              <div className="step-icon"><Icon aria-hidden="true" size={21} /></div>
              <div><h3>{title}</h3><p>{text}</p></div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

import { Languages, LifeBuoy, MessageCircleMore, UserRoundCheck } from 'lucide-react';

const trustItems = [
  { icon: UserRoundCheck, title: 'Profiles reviewed by people', text: 'Every guide profile is checked before it appears.' },
  { icon: Languages, title: 'Multiple language options', text: 'Find a guide you can speak with comfortably.' },
  { icon: MessageCircleMore, title: 'Experience-based reviews', text: 'Feedback is tied to completed experiences.' },
  { icon: LifeBuoy, title: 'Support when you need it', text: 'Local help before and during your time together.' },
];

export default function TrustMetrics() {
  return (
    <section className="trust-band" aria-label="Why travelers choose Friendlocalcheap">
      <div className="container trust-band-grid">
        {trustItems.map(({ icon: Icon, title, text }) => (
          <div className="trust-band-item" key={title}>
            <Icon aria-hidden="true" size={21} />
            <div><strong>{title}</strong><span>{text}</span></div>
          </div>
        ))}
      </div>
    </section>
  );
}

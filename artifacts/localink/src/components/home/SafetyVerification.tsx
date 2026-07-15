import { BadgeCheck, Check, Languages, MessageSquareText, UserRoundCheck } from 'lucide-react';

const reviewSteps = [
  { icon: UserRoundCheck, title: 'Identity reviewed', text: 'Identity information is checked before a profile is published.' },
  { icon: BadgeCheck, title: 'Profile manually reviewed', text: 'Experience, local knowledge, and profile details receive a human review.' },
  { icon: Languages, title: 'Language proficiency assessed', text: 'Declared language skills are discussed in a conversational review.' },
  { icon: MessageSquareText, title: 'Feedback tied to experiences', text: 'Traveler reviews are limited to completed Friendlocalcheap experiences.' },
];

export default function SafetyVerification() {
  return (
    <section id="safety" className="section verification-section" aria-labelledby="verification-title">
      <div className="container verification-layout">
        <div>
          <span className="section-label">Trust, made visible</span>
          <h2 id="verification-title">Know who you are exploring with</h2>
          <p>Trust comes from clear information and thoughtful review—not sweeping promises. We show what has been assessed so you can choose with confidence.</p>
          <div className="verification-steps">
            {reviewSteps.map(({ icon: Icon, title, text }) => <div key={title}><Icon aria-hidden="true" size={20} /><div><h3>{title}</h3><p>{text}</p></div></div>)}
          </div>
        </div>
        <aside className="verification-profile" aria-label="Example reviewed guide profile">
          <div className="verification-profile-head">
            <img src="/images/guides/linh.webp" width={72} height={72} style={{ width: 72, height: 72 }} alt="Linh, a reviewed Friendlocalcheap guide" />
            <div><span>Reviewed guide profile</span><h3>Linh N.</h3><p>Ho Chi Minh City · English & Vietnamese</p></div>
          </div>
          <div className="verification-status"><Check size={16} /><span><strong>Identity reviewed</strong><small>Profile information checked</small></span></div>
          <div className="verification-status"><Check size={16} /><span><strong>Language reviewed</strong><small>English proficiency assessed</small></span></div>
          <div className="verification-status"><Check size={16} /><span><strong>Credentials displayed when provided</strong><small>Travelers can see relevant qualifications</small></span></div>
          <div className="verification-status"><Check size={16} /><span><strong>Traveler feedback</strong><small>214 reviews from completed experiences</small></span></div>
          <p className="verification-support">Friendlocalcheap support is available before and during your experience.</p>
        </aside>
      </div>
    </section>
  );
}

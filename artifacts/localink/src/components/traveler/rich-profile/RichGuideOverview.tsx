import { Clock3, Compass, Languages, Sparkles, Users } from 'lucide-react';

import type { RichGuideProfileViewModel } from '../richGuideProfileData';

export default function RichGuideOverview({ guide }: { guide: RichGuideProfileViewModel }) {
  return (
    <>
      <section id="overview" className="rich-section rich-glance" aria-labelledby="rich-glance-title">
        <header><p className="rich-eyebrow">How {guide.displayName} guides</p><h2 id="rich-glance-title">At a glance</h2></header>
        <dl className="rich-glance-grid">
          <div><dt><Users size={18} aria-hidden="true" /> Best group size</dt><dd>{guide.bestGroupSize}</dd></div>
          <div><dt><Clock3 size={18} aria-hidden="true" /> Pace</dt><dd>{guide.pace}</dd></div>
          <div><dt><Clock3 size={18} aria-hidden="true" /> Response</dt><dd>{guide.responseTime.replace('Usually responds in ', '')}</dd></div>
          <div><dt><Compass size={18} aria-hidden="true" /> Areas</dt><dd>{guide.operatingAreas.join(', ')}</dd></div>
          <div><dt><Languages size={18} aria-hidden="true" /> Languages</dt><dd>{guide.languages.join(', ')}</dd></div>
          <div><dt><Sparkles size={18} aria-hidden="true" /> Guide style</dt><dd>{guide.guideStyles.slice(0, 2).join(' · ')}</dd></div>
        </dl>
        <div className="rich-specialty-row" aria-label="Guide specialties">
          {guide.specialties.map((specialty) => <span key={specialty}>{specialty}</span>)}
        </div>
      </section>

      <section className="rich-section rich-about" aria-labelledby="rich-about-title">
        <header><p className="rich-eyebrow">Meet your guide</p><h2 id="rich-about-title">About {guide.displayName}</h2></header>
        <div className="rich-about-grid">
          <article><span>01</span><h3>My Story</h3><p>{guide.story}</p></article>
          <article><span>02</span><h3>Local Knowledge</h3><p>{guide.localKnowledge}</p></article>
          <article><span>03</span><h3>Guiding Philosophy</h3><p>{guide.guidingPhilosophy}</p></article>
        </div>
      </section>

      <section id="experiences" className="rich-section" aria-labelledby="rich-experiences-title">
        <header><p className="rich-eyebrow">Designed by {guide.displayName}</p><h2 id="rich-experiences-title">Signature Experiences</h2><p>Flexible starting points for a private day shaped around your interests.</p></header>
        <div className="rich-experience-grid">
          {guide.experiences.map((experience) => (
            <article key={experience.id} className="rich-experience-card">
              <img src={experience.image} alt={`${experience.name} in ${guide.city}`} />
              <div>
                <p>{experience.duration}</p>
                <h3>{experience.name}</h3>
                <span>{experience.description}</span>
                <ul>{experience.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

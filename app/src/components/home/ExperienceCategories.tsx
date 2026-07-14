import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const experiences = [
  { id: 'street-food', title: 'Street Food', text: 'Follow the aromas to family kitchens and late-night stalls.', image: '/images/local-guide-hero.webp', featured: true },
  { id: 'history-culture', title: 'History & Culture', text: 'Understand the stories behind the places.', image: '/images/local-guide-hero-v2.webp' },
  { id: 'hidden-neighborhoods', title: 'Hidden Neighborhoods', text: 'See daily life beyond the main sights.', image: '/images/experiences/hidden-hoi-an.webp' },
  { id: 'photography', title: 'Photography', text: 'Capture the morning light and color of Hội An.', image: '/images/experiences/photography-vietnam.webp' },
  { id: 'family-friendly', title: 'Family-Friendly', text: 'Flexible adventures for curious families.', image: '/images/experiences/family-vietnam.webp' },
  { id: 'accessible-travel', title: 'Accessible Travel', text: 'Routes shaped around comfort, mobility, and access.', image: '/images/experiences/accessible-path.webp' },
];

export default function ExperienceCategories() {
  return (
    <section className="section experience-section" aria-labelledby="experiences-title">
      <div className="container">
        <div className="section-heading-row">
          <div><span className="section-label">Find your way in</span><h2 id="experiences-title">What would make Vietnam yours?</h2><p>Start with what draws you in. A local guide can take it somewhere unexpected.</p></div>
          <Link href="/guides?tab=experiences" className="text-link">View all experiences <ArrowRight size={17} /></Link>
        </div>
        <div className="experience-grid experience-grid-six">
          {experiences.map((item) => (
            <Link key={item.id} href={`/guides?category=${item.id}`} className={item.featured ? 'experience-card experience-card-featured' : 'experience-card'}>
              <Image src={item.image} alt="" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 420px" />
              <span className="experience-scrim" aria-hidden="true" />
              <span className="experience-copy"><strong>{item.title}</strong><small>{item.text}</small><span>Explore <ArrowRight size={15} /></span></span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

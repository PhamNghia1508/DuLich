import { Quote, Star } from 'lucide-react';

const stories = [
  { quote: 'Minh helped us notice details we would have walked past—the courtyard proportions, old shop signs, and how families adapt historic homes for life today.', name: 'Thomas Müller', meta: 'Germany · Architecture walk with Minh' },
  { quote: 'Linh listened to what our family needed and kept the pace easy. Our children still talk about making rice paper and choosing fruit at the morning market.', name: 'Emma Larsson', meta: 'Sweden · Family food experience with Linh' },
  { quote: 'I wanted photographs with context, not just pretty viewpoints. Huy knew when the streets would be quiet and explained the stories behind every frame.', name: 'Akiko Yamamoto', meta: 'Japan · Morning photography with Huy' },
];

function Stars() {
  return <span className="story-stars" aria-label="5 out of 5 stars">{[0,1,2,3,4].map((i) => <Star key={i} size={15} fill="currentColor" />)}</span>;
}

export default function Testimonials() {
  return (
    <section className="section stories-section" aria-labelledby="stories-title">
      <div className="container">
        <div className="stories-heading"><span className="section-label">Traveler stories</span><h2 id="stories-title">The moments people take home</h2></div>
        <div className="stories-layout">
          <article className="featured-story">
            <Quote aria-hidden="true" size={28} />
            <blockquote>“Linh showed us how to read Saigon—the morning rituals, alley kitchens, and quiet temples. By lunch, it felt less like a tour and more like visiting a friend.”</blockquote>
            <div><strong>Sarah & David Miller</strong><span>Toronto, Canada · Street food with Linh</span><Stars /></div>
          </article>
          <div className="supporting-stories">
            {stories.map((story) => <article key={story.name}><p>“{story.quote}”</p><div><strong>{story.name}</strong><span>{story.meta}</span><Stars /></div></article>)}
          </div>
        </div>
      </div>
    </section>
  );
}

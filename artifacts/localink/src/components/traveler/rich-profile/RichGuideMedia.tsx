import { ImageIcon, Play, Video } from 'lucide-react';
import { useState } from 'react';

import type { RichGuideProfileViewModel } from '../richGuideProfileData';

export default function RichGuideMedia({ guide }: { guide: RichGuideProfileViewModel }) {
  const [showVideoNote, setShowVideoNote] = useState(false);

  return (
    <>
      <section id="gallery" className="rich-section" aria-labelledby="rich-gallery-title">
        <header><p className="rich-eyebrow">A local point of view</p><h2 id="rich-gallery-title">Photo Gallery</h2></header>
        <div className="rich-gallery">
          {guide.galleryImages.slice(0, 5).map((image, index) => (
            <figure key={`${image}-${index}`}>
              <img src={image} alt={`${guide.displayName} in ${guide.city}, preview ${index + 1}`} />
              {index === 0 && <figcaption><ImageIcon size={15} aria-hidden="true" /> Moments with {guide.displayName}</figcaption>}
            </figure>
          ))}
        </div>
      </section>

      <section id="video" className="rich-section rich-video" aria-labelledby="rich-video-title">
        <header><p className="rich-eyebrow">Hear their story</p><h2 id="rich-video-title">Introduction Video</h2></header>
        <button type="button" className="rich-video-preview" onClick={() => setShowVideoNote((value) => !value)} aria-expanded={showVideoNote} aria-controls="rich-video-note">
          <img src={guide.videoThumbnail} alt={`Video introduction preview for ${guide.displayName}`} />
          <span className="rich-video-wash" aria-hidden="true" />
          <span className="rich-video-play"><Play size={26} fill="currentColor" aria-hidden="true" /></span>
          <span className="rich-video-duration"><Video size={14} aria-hidden="true" /> 1:24 prototype preview</span>
        </button>
        {showVideoNote && <p id="rich-video-note" className="rich-video-note">Video playback is not active in this prototype. This preview helps travelers understand where an introduction clip will appear.</p>}
      </section>
    </>
  );
}

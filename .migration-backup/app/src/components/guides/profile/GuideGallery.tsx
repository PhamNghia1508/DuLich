'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Images, Maximize2, X } from 'lucide-react';
import SafeImage from '@/components/ui/SafeImage';
import type { Guide } from '@/types';

export default function GuideGallery({ guide }: { guide: Guide }) {
  const images = useMemo(() => guide.gallery.filter((src) => typeof src === 'string' && src.trim()).slice(0, 5), [guide.gallery]);
  const [active, setActive] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const openGallery = (index: number, trigger: HTMLButtonElement) => {
    triggerRef.current = trigger;
    setActive(index);
  };

  const closeGallery = () => {
    setActive(null);
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  };

  useEffect(() => {
    if (active === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeGallery();
      if (event.key === 'ArrowRight') setActive((value) => value === null ? null : (value + 1) % images.length);
      if (event.key === 'ArrowLeft') setActive((value) => value === null ? null : (value - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', key);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener('keydown', key); };
  }, [active, images.length]);

  if (!images.length) return null;

  return (
    <section className="profile-section" aria-labelledby="gallery-title">
      <div className="profile-section-heading">
        <div><h2 id="gallery-title">Photo gallery</h2><p>A glimpse into food tours, local markets, and hidden corners with {guide.firstName}.</p></div>
        <button type="button" className="profile-text-action" onClick={(event) => openGallery(0, event.currentTarget)}><Images size={17} />View all {images.length} photos</button>
      </div>
      <div className="profile-gallery">
        {images.map((src, index) => (
          <button type="button" key={`${src}-${index}`} className={index === 0 ? 'profile-gallery-main' : ''} onClick={(event) => openGallery(index, event.currentTarget)} aria-label={`Open photo ${index + 1} of ${images.length}`}>
            <SafeImage src={src} alt={`${guide.firstName}'s Ho Chi Minh City food guide context, photo ${index + 1}`} className="h-full w-full" imageClassName="h-full w-full object-cover" />
            {index === 0 && <span className="profile-gallery-zoom" aria-hidden="true"><Maximize2 size={18} />View photos</span>}
          </button>
        ))}
      </div>
      {active !== null && (
        <div className="profile-lightbox" role="dialog" aria-modal="true" aria-label={`${guide.firstName}'s photo gallery`} onMouseDown={(event) => { if (event.target === event.currentTarget) closeGallery(); }}>
          <button ref={closeRef} type="button" className="profile-lightbox-close" onClick={closeGallery} aria-label="Close photo gallery"><X /></button>
          {images.length > 1 && <button type="button" className="profile-lightbox-prev" onClick={() => setActive((active - 1 + images.length) % images.length)} aria-label="Previous photo"><ChevronLeft /></button>}
          <SafeImage src={images[active]} alt={`${guide.firstName}'s experience, photo ${active + 1}`} className="profile-lightbox-media" imageClassName="h-full w-full object-contain" />
          {images.length > 1 && <button type="button" className="profile-lightbox-next" onClick={() => setActive((active + 1) % images.length)} aria-label="Next photo"><ChevronRight /></button>}
          <p>{active + 1} of {images.length}</p>
        </div>
      )}
    </section>
  );
}

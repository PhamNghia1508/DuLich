import { useEffect, useRef, useState } from 'react';

export interface ProfileSection {
  id: string;
  label: string;
}

export const PROFILE_SECTIONS: ProfileSection[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'experiences', label: 'Experiences' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'video', label: 'Video' },
  { id: 'availability', label: 'Availability' },
  { id: 'reviews', label: 'Reviews' },
];

export default function RichProfileNav() {
  const [activeId, setActiveId] = useState(PROFILE_SECTIONS[0].id);
  const navRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    const elements = PROFILE_SECTIONS
      .map((section) => document.getElementById(section.id))
      .filter(Boolean) as HTMLElement[];

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-120px 0px -60% 0px', threshold: 0 },
    );

    for (const element of elements) observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!navRef.current) return;
    const activeButton = navRef.current.querySelector<HTMLElement>('[aria-current="true"]');
    if (activeButton) {
      activeButton.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
    }
  }, [activeId]);

  const handleClick = (id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({
      behavior: prefersReducedMotion.current ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  return (
    <nav ref={navRef} className="rich-profile-nav" aria-label="Profile sections">
      {PROFILE_SECTIONS.map((section) => (
        <button
          key={section.id}
          type="button"
          className="rich-profile-nav-item"
          aria-current={activeId === section.id ? 'true' : undefined}
          onClick={() => handleClick(section.id)}
        >
          {section.label}
        </button>
      ))}
    </nav>
  );
}

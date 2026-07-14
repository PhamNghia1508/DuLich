'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Compass, Globe2, Menu, X } from 'lucide-react';
import { UI_LANGUAGES } from '@/data/mockData';

const navLinks = [
  { name: 'Find a Guide', href: '/guides' },
  { name: 'Experiences', href: '/guides?tab=experiences' },
  { name: 'How It Works', href: '/#how-it-works' },
  { name: 'Become a Guide', href: '/guide-dashboard' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('EN');
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const languageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        setLanguageOpen(false);
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const isActive = (href: string) => href.startsWith('/guides')
    ? pathname.startsWith('/guides')
    : pathname === href;

  return (
    <header className={`site-header ${scrolled ? 'site-header-scrolled' : ''}`}>
      <div className="site-nav">
        <Link href="/" className="brand" aria-label="LocalLink home">
          <span className="brand-mark" aria-hidden="true"><Compass size={20} /></span>
          <span>Local<span>Link</span></span>
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} aria-current={isActive(link.href) ? 'page' : undefined}>
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="desktop-actions">
          <div className="language-menu" ref={languageRef}>
            <button
              type="button"
              className="language-trigger"
              aria-label="Choose language"
              aria-haspopup="menu"
              aria-expanded={languageOpen}
              onClick={() => setLanguageOpen((open) => !open)}
            >
              <Globe2 aria-hidden="true" size={17} />
              {selectedLanguage}
              <ChevronDown aria-hidden="true" size={14} className={languageOpen ? 'rotate-180' : ''} />
            </button>
            {languageOpen && (
              <div className="language-popover" role="menu">
                {UI_LANGUAGES.map((language) => (
                  <button
                    type="button"
                    role="menuitemradio"
                    aria-checked={selectedLanguage === language.code.toUpperCase()}
                    key={language.code}
                    onClick={() => {
                      setSelectedLanguage(language.code.toUpperCase());
                      setLanguageOpen(false);
                    }}
                  >
                    {language.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <Link href="/dashboard" className="sign-in-link">Sign in</Link>
          <Link href="/match" className="btn btn-accent nav-cta">Tell us about your trip</Link>
        </div>

        <button
          type="button"
          className="mobile-menu-trigger"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X aria-hidden="true" size={23} /> : <Menu aria-hidden="true" size={23} />}
        </button>
      </div>

      {menuOpen && <button className="mobile-nav-backdrop" aria-label="Close navigation menu" onClick={() => setMenuOpen(false)} />}
      <aside id="mobile-navigation" className={`mobile-nav ${menuOpen ? 'mobile-nav-open' : ''}`} aria-hidden={!menuOpen}>
        <nav aria-label="Mobile navigation">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} onClick={() => setMenuOpen(false)}>{link.name}</Link>
          ))}
        </nav>
        <div className="mobile-language">
          <p>Language</p>
          <div>
            {UI_LANGUAGES.map((language) => (
              <button
                type="button"
                key={language.code}
                aria-pressed={selectedLanguage === language.code.toUpperCase()}
                onClick={() => setSelectedLanguage(language.code.toUpperCase())}
              >
                {language.code.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <div className="mobile-nav-actions">
          <Link href="/dashboard" onClick={() => setMenuOpen(false)}>Sign in</Link>
          <Link href="/match" className="btn btn-accent" onClick={() => setMenuOpen(false)}>Tell us about your trip</Link>
        </div>
      </aside>
    </header>
  );
}

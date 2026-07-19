import { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { ArrowRight, Compass, Menu, X } from 'lucide-react';

import { PUBLIC_NAV_LINKS } from './brandPresentation';

interface NavbarProps {
  variant?: 'default' | 'home';
}

function BrandLink() {
  return (
    <Link href="/" className="brand" aria-label="FriendLocalTrip home">
      <span className="brand-mark" aria-hidden="true"><Compass size={20} /></span>
      <span>FriendLocal<span>Trip</span></span>
    </Link>
  );
}

function HomeNavbar() {
  const [pathname] = useLocation();
  const homeLinks = [
    { label: 'For Travelers', href: '/' },
    { label: 'Local Guide', href: '/local-guide' },
  ];

  return (
    <header className="site-header home-site-header">
      <div className="site-nav home-site-nav">
        <BrandLink />
        <nav className="home-nav-tabs" aria-label="FriendLocalTrip audiences">
          {homeLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? 'page' : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

function DefaultNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [pathname] = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
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

  const isActive = (href: string) => href === '/guides'
    ? pathname.startsWith('/guides')
    : pathname === href;

  return (
    <div className="sticky top-0 z-50">
      <header className={`site-header ${scrolled ? 'site-header-scrolled' : ''}`}>
        <div className="site-nav">
          <BrandLink />

          <nav className="desktop-nav" aria-label="Primary navigation">
            {PUBLIC_NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} aria-current={isActive(link.href) ? 'page' : undefined}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="desktop-actions">
            <Link href="/?openRequest=1" className="btn btn-accent nav-cta">Request a Local Guide</Link>
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
      </header>

      {menuOpen && <button className="mobile-nav-backdrop" aria-label="Close navigation menu" onClick={() => setMenuOpen(false)} />}
      <aside id="mobile-navigation" className={`mobile-nav ${menuOpen ? 'mobile-nav-open' : ''}`} aria-hidden={!menuOpen}>
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--color-border-light)]">
          <span className="font-bold text-xs uppercase tracking-wider text-[var(--color-text-light)]">Navigation</span>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-surface)] border-0 text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <ArrowRight size={16} />
          </button>
        </div>
        <nav aria-label="Mobile navigation">
          {PUBLIC_NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>{link.label}</Link>
          ))}
        </nav>
        <div className="mobile-nav-actions">
          <Link href="/?openRequest=1" className="btn btn-accent" onClick={() => setMenuOpen(false)}>Request a Local Guide</Link>
        </div>
      </aside>
    </div>
  );
}

export default function Navbar({ variant = 'default' }: NavbarProps) {
  return variant === 'home' ? <HomeNavbar /> : <DefaultNavbar />;
}

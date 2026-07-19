import { useEffect, useState } from 'react';
import { Compass } from 'lucide-react';
import { Link, useLocation } from 'wouter';

import ExploreDemoMenu from '@/components/navigation/ExploreDemoMenu';
import MobilePublicMenu from '@/components/navigation/MobilePublicMenu';
import { PUBLIC_NAV_ITEMS, publicSectionForPath } from '@/components/navigation/prototypeNavigation';

import '@/components/navigation/public-navigation.css';

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

export default function Navbar(_props: NavbarProps) {
  const [pathname] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const currentSection = publicSectionForPath(pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="public-header-shell">
      <header className={`site-header public-site-header ${scrolled ? 'site-header-scrolled' : ''}`}>
        <div className="site-nav public-site-nav">
          <BrandLink />

          <nav className="desktop-nav public-desktop-nav" aria-label="Primary navigation">
            {PUBLIC_NAV_ITEMS.map((item) => (
              <Link key={item.href} href={item.href} aria-current={currentSection === item.section ? 'page' : undefined}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="desktop-actions public-desktop-actions">
            <ExploreDemoMenu />
            <Link href="/signin" className="sign-in-link" aria-current={currentSection === 'signin' ? 'page' : undefined}>Sign in</Link>
            <Link href="/?openRequest=1" className="btn btn-accent nav-cta">Request a Local Guide</Link>
          </div>

          <MobilePublicMenu pathname={pathname} />
        </div>
      </header>
    </div>
  );
}

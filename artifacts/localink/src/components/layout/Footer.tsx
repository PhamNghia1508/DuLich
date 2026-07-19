import { Link } from 'wouter';
import { Compass, Mail, MapPin, Shield, Star } from 'lucide-react';

import { PUBLIC_FOOTER_LINKS } from './brandPresentation';
import { DEMO_FOOTER_ITEMS, prototypeNavigationEnabled } from '@/components/navigation/prototypeNavigation';

interface FooterProps {
  variant?: 'default' | 'home';
}

function HomeFooter() {
  return (
    <footer className="home-footer">
      <div className="container home-footer-inner">
        <Link href="/" className="home-footer-brand" aria-label="FriendLocalTrip home">
          <Compass size={18} aria-hidden="true" />
          FriendLocalTrip
        </Link>
        <a href="mailto:support@friendlocaltrip.com">support@friendlocaltrip.com</a>
        {prototypeNavigationEnabled && <Link href="/demo">Explore Demo Workspaces</Link>}
        <small>© {new Date().getFullYear()} FriendLocalTrip</small>
      </div>
    </footer>
  );
}

function DefaultFooter() {
  return (
    <footer className="site-footer dark-surface">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand-col">
            <Link href="/" className="flex items-center gap-2" aria-label="FriendLocalTrip home">
              <div className="bg-[#C4614A] text-white p-1.5 rounded-md flex items-center justify-center">
                <Compass size={20} aria-hidden="true" />
              </div>
              <span className="font-[family-name:var(--font-playfair)] text-xl font-bold tracking-tight text-white">
                FriendLocalTrip
              </span>
            </Link>
            <p>Meet trusted local guides and explore Vietnam with a friend who knows the city.</p>
            <div className="footer-badges" aria-label="FriendLocalTrip trust highlights">
              <span><Shield size={14} aria-hidden="true" /> Verified Guides</span>
              <span><Star size={14} aria-hidden="true" /> 4.9+ Rated</span>
            </div>
          </div>

          <div className="footer-col">
            <h2 className="footer-heading">Explore</h2>
            <nav className="footer-links" aria-label="Footer navigation">
              {PUBLIC_FOOTER_LINKS.map((link) => (
                <Link key={link.href} href={link.href}>{link.label}</Link>
              ))}
            </nav>
          </div>

          <div className="footer-col">
            <h2 className="footer-heading">Contact</h2>
            <div className="footer-contact">
              <div><Mail size={14} aria-hidden="true" /><a href="mailto:support@friendlocaltrip.com">support@friendlocaltrip.com</a></div>
              <div><MapPin size={14} aria-hidden="true" /><span>Ho Chi Minh City, Vietnam</span></div>
            </div>
          </div>
          {prototypeNavigationEnabled && (
            <div className="footer-col">
              <h2 className="footer-heading">Explore Demo Workspaces</h2>
              <nav className="footer-links" aria-label="Demo workspace navigation">
                {DEMO_FOOTER_ITEMS.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}
              </nav>
            </div>
          )}
        </div>

        <hr className="footer-divider" />
        <div className="footer-copyright">© {new Date().getFullYear()} FriendLocalTrip. Frontend prototype.</div>
      </div>
    </footer>
  );
}

export default function Footer({ variant = 'default' }: FooterProps) {
  return variant === 'home' ? <HomeFooter /> : <DefaultFooter />;
}

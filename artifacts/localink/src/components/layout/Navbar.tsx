import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { ChevronDown, Compass, Globe2, Menu, X, LogOut, User, ArrowRight } from 'lucide-react';
import { UI_LANGUAGES } from '@/data/mockData';
import { useAuth } from '@/hooks/useAuth';

const navLinks = [
  { name: 'Find a Guide', href: '/guides' },
  { name: 'Experiences', href: '/guides?tab=experiences' },
  { name: 'How It Works', href: '/#how-it-works' },
  { name: 'Become a Guide', href: '/guide-dashboard' },
];

interface NavbarProps {
  variant?: 'default' | 'home';
}

function HomeNavbar() {
  const [pathname] = useLocation();
  const homeLinks = [
    { label: 'For Travelers', href: '/' },
    { label: 'Local Guide', href: '/guide-dashboard' },
  ];

  return (
    <header className="site-header home-site-header">
      <div className="site-nav home-site-nav">
        <Link href="/" className="brand" aria-label="FriendLocalTrip home">
          <span className="brand-mark" aria-hidden="true"><Compass size={20} /></span>
          <span>FriendLocal<span>Trip</span></span>
        </Link>
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
  const [languageOpen, setLanguageOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('EN');
  const [scrolled, setScrolled] = useState(false);
  const [pathname] = useLocation();
  const languageRef = useRef<HTMLDivElement>(null);

  const { user, isAuthenticated, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        setLanguageOpen(false);
        setProfileOpen(false);
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageRef.current && !languageRef.current.contains(event.target as Node)) {
        setLanguageOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (href: string) => href.startsWith('/guides')
    ? pathname.startsWith('/guides')
    : pathname === href;

  return (
    <div className="sticky top-0 z-50">
      <header className={`site-header ${scrolled ? 'site-header-scrolled' : ''}`}>
        <div className="site-nav">
          <Link href="/" className="brand" aria-label="Friendlocalcheap home">
            <span className="brand-mark" aria-hidden="true"><Compass size={20} /></span>
            <span>Friendlocal<span>cheap</span></span>
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
            {isAuthenticated && user ? (
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  className="flex items-center gap-2 cursor-pointer focus:outline-none border-0 bg-transparent p-0"
                  onClick={() => setProfileOpen(!profileOpen)}
                >
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-8 h-8 rounded-full border border-[var(--color-border)] object-cover"
                  />
                  <span className="text-sm font-semibold text-[var(--color-text)] max-w-[100px] truncate hidden md:inline">
                    {user.name}
                  </span>
                  <ChevronDown size={14} className={`text-[var(--color-text-muted)] transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                </button>
                {profileOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-[var(--color-border-light)] rounded-xl shadow-lg py-1.5 z-50">
                    <div className="px-4 py-2 border-b border-[var(--color-border-light)]">
                      <p className="text-xs font-semibold text-[var(--color-text)] truncate">{user.name}</p>
                      <p className="text-[10px] text-[var(--color-text-light)] truncate">{user.email}</p>
                    </div>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-primary)]"
                      onClick={() => setProfileOpen(false)}
                    >
                      <User size={14} />
                      Dashboard
                    </Link>
                    <button
                      type="button"
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 text-left border-0 cursor-pointer"
                      onClick={() => {
                        logout();
                        setProfileOpen(false);
                      }}
                    >
                      <LogOut size={14} />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/signin" className="sign-in-link">Sign in</Link>
            )}
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
      </header>

      {menuOpen && <button className="mobile-nav-backdrop" aria-label="Close navigation menu" onClick={() => setMenuOpen(false)} />}
      <aside id="mobile-navigation" className={`mobile-nav ${menuOpen ? 'mobile-nav-open' : ''}`} aria-hidden={!menuOpen}>
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--color-border-light)]">
          <span className="font-bold text-xs uppercase tracking-wider text-[var(--color-text-light)]">Navigation</span>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--color-surface)] border-0 text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <ArrowRight size={16} />
          </button>
        </div>
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
          {isAuthenticated && user ? (
            <div className="space-y-2.5 mb-4">
              <div className="flex items-center gap-3 px-1 py-3 border-b border-[var(--color-border-light)]">
                <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full border border-[var(--color-border)] object-cover" />
                <div>
                  <p className="text-sm font-bold text-[var(--color-text)]">{user.name}</p>
                  <p className="text-xs text-[var(--color-text-light)]">{user.email}</p>
                </div>
              </div>
              <Link href="/dashboard" className="block text-sm font-semibold text-[var(--color-text)] py-2" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <button
                type="button"
                className="w-full text-left py-2 border-0 bg-transparent text-sm font-semibold text-red-600 cursor-pointer"
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link href="/signin" onClick={() => setMenuOpen(false)}>Sign in</Link>
          )}
          <Link href="/match" className="btn btn-accent" onClick={() => setMenuOpen(false)}>Tell us about your trip</Link>
        </div>
      </aside>
    </div>
  );
}

export default function Navbar({ variant = 'default' }: NavbarProps) {
  return variant === 'home' ? <HomeNavbar /> : <DefaultNavbar />;
}

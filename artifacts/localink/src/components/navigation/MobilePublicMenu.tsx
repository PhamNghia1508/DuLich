import { Menu } from 'lucide-react';
import { Link } from 'wouter';

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  EXPLORE_DEMO_ITEMS,
  PUBLIC_NAV_ITEMS,
  prototypeNavigationEnabled,
  publicSectionForPath,
} from './prototypeNavigation';

export default function MobilePublicMenu({ pathname }: { pathname: string }) {
  const currentSection = publicSectionForPath(pathname);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button type="button" className="public-mobile-trigger" aria-label="Open navigation menu">
          <Menu size={22} aria-hidden="true" />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="public-mobile-sheet">
        <SheetHeader className="public-mobile-header">
          <SheetTitle>FriendLocalTrip</SheetTitle>
          <SheetDescription>Explore every customer-review journey.</SheetDescription>
        </SheetHeader>

        <div className="public-mobile-groups">
          <nav aria-label="Explore FriendLocalTrip">
            <h2>Explore</h2>
            {PUBLIC_NAV_ITEMS.map((item) => (
              <SheetClose asChild key={item.href}>
                <Link href={item.href} aria-current={currentSection === item.section ? 'page' : undefined}>{item.label}</Link>
              </SheetClose>
            ))}
          </nav>

          <nav aria-label="Traveler account prototype">
            <h2>Account</h2>
            <SheetClose asChild><Link href="/signin" aria-current={currentSection === 'signin' ? 'page' : undefined}>Sign in</Link></SheetClose>
            <SheetClose asChild><Link href="/signup" aria-current={currentSection === 'signup' ? 'page' : undefined}>Create account</Link></SheetClose>
          </nav>

          {prototypeNavigationEnabled && (
            <nav aria-label="Demo workspaces">
              <h2>Demo Workspaces</h2>
              {EXPLORE_DEMO_ITEMS.slice(1).map((item) => (
                <SheetClose asChild key={item.href}>
                  <Link href={item.href}>
                    <span>{item.label}</span>{item.badge && <em>{item.badge}</em>}
                  </Link>
                </SheetClose>
              ))}
              <SheetClose asChild><Link href="/demo" aria-current={currentSection === 'demo' ? 'page' : undefined}>View All Demo Workspaces</Link></SheetClose>
            </nav>
          )}
        </div>

        <SheetClose asChild>
          <Link href="/?openRequest=1" className="btn btn-accent public-mobile-cta">Request a Local Guide</Link>
        </SheetClose>
      </SheetContent>
    </Sheet>
  );
}

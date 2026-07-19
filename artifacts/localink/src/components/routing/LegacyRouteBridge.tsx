import { ArrowRight, Compass } from 'lucide-react';
import { Link, Redirect, useParams } from 'wouter';

import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import {
  LEGACY_DIRECT_DESTINATIONS,
  LEGACY_RECOVERY_OPTIONS,
  legacyBookDestination,
  type LegacyRecoveryKind,
} from './legacyRouteData';

import './legacy-route.css';

const RECOVERY_COPY: Record<LegacyRecoveryKind, { eyebrow: string; title: string; description: string }> = {
  dashboard: {
    eyebrow: 'Choose a workspace',
    title: 'Where would you like to continue?',
    description: 'FriendLocalTrip uses a focused workspace for each role in this frontend prototype.',
  },
  signin: {
    eyebrow: 'Frontend-only prototype',
    title: 'Sign-in is not required in this prototype.',
    description: 'Choose a role below to continue. No credentials or account data are needed.',
  },
  signup: {
    eyebrow: 'Choose your path',
    title: 'Account creation is outside this frontend prototype.',
    description: 'You can still review the complete Traveler, Local Guide, and Partner demo journeys.',
  },
};

export function LegacyBookRedirect() {
  const { guideId = '' } = useParams<{ guideId: string }>();
  return <Redirect to={legacyBookDestination(guideId)} replace />;
}

export function LegacyGuideDashboardRedirect() {
  return <Redirect to={LEGACY_DIRECT_DESTINATIONS.guideDashboard} replace />;
}

export function LegacyMatchRedirect() {
  return <Redirect to={LEGACY_DIRECT_DESTINATIONS.match} replace />;
}

export function LegacyRecoveryPage({ kind }: { kind: LegacyRecoveryKind }) {
  const copy = RECOVERY_COPY[kind];
  const options = LEGACY_RECOVERY_OPTIONS[kind];

  return (
    <div className="legacy-recovery-page">
      <Navbar variant="home" />
      <main className="legacy-recovery-main">
        <section className="legacy-recovery-card" aria-labelledby={`legacy-${kind}-title`}>
          <div className="legacy-recovery-mark" aria-hidden="true"><Compass size={25} /></div>
          <p className="legacy-recovery-eyebrow">{copy.eyebrow}</p>
          <h1 id={`legacy-${kind}-title`}>{copy.title}</h1>
          <p className="legacy-recovery-description">{copy.description}</p>
          <nav className="legacy-recovery-options" aria-label="Available FriendLocalTrip destinations">
            {options.map((option) => (
              <Link key={option.href} href={option.href}>
                <span><strong>{option.label}</strong><small>{option.description}</small></span>
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
            ))}
          </nav>
        </section>
      </main>
      <Footer variant="home" />
    </div>
  );
}

export function LegacyDashboardRecovery() {
  return <LegacyRecoveryPage kind="dashboard" />;
}

export function LegacySigninRecovery() {
  return <LegacyRecoveryPage kind="signin" />;
}

export function LegacySignupRecovery() {
  return <LegacyRecoveryPage kind="signup" />;
}

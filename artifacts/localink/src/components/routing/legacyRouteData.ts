export interface LegacyRecoveryOption {
  label: string;
  href: string;
  description: string;
}

export type LegacyRecoveryKind = 'dashboard' | 'signin' | 'signup';

export const LEGACY_DIRECT_DESTINATIONS = {
  guideDashboard: '/local-guide/dashboard',
  match: '/?openRequest=1',
} as const;

export const LEGACY_RECOVERY_OPTIONS: Record<LegacyRecoveryKind, readonly LegacyRecoveryOption[]> = {
  dashboard: [
    { label: 'Traveler Bookings', href: '/bookings', description: 'Review your demo bookings and messages.' },
    { label: 'Local Guide Dashboard', href: '/local-guide/dashboard', description: 'Open the seeded guide workspace.' },
    { label: 'Partner Dashboard — Demo', href: '/partner/dashboard', description: 'Review referral and commission examples.' },
    { label: 'Admin Demo', href: '/admin/dashboard', description: 'Open the prototype operations workspace.' },
    { label: 'View All Demo Workspaces', href: '/demo', description: 'Compare every customer-review journey in one place.' },
  ],
  signin: [
    { label: 'For Travelers', href: '/', description: 'Request a guide without creating an account.' },
    { label: 'Local Guide workspace', href: '/local-guide', description: 'Explore registration and the guide dashboard.' },
    { label: 'Partner Demo', href: '/partner', description: 'Preview the partner referral workspace.' },
    { label: 'Admin Demo', href: '/admin', description: 'Preview the administration workspace.' },
  ],
  signup: [
    { label: 'Request a Local Guide', href: '/', description: 'Start the Traveler request flow.' },
    { label: 'Apply to Become a Guide', href: '/local-guide/register', description: 'Complete the frontend-only guide application.' },
    { label: 'Explore Partner Demo', href: '/partner', description: 'See the referral experience for partners.' },
  ],
};

export function legacyBookDestination(guideId: string): string {
  return `/booking-handoff/${encodeURIComponent(guideId)}`;
}

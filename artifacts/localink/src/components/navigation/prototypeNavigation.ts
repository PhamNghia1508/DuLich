export type PublicSection = 'guides' | 'traveler' | 'local-guide' | 'signin' | 'signup' | 'demo';
export type DemoWorkspace = 'traveler' | 'local-guide' | 'partner' | 'admin';

export interface NavigationItem {
  label: string;
  href: string;
  description?: string;
  badge?: 'Demo';
}

export interface DemoWorkspaceCard {
  role: 'Traveler' | 'Local Guide' | 'Partner' | 'Admin';
  description: string;
  badge?: 'Demo';
  actions: readonly NavigationItem[];
}

export const prototypeNavigationEnabled = true;

export const PUBLIC_NAV_ITEMS = [
  { label: 'Browse Guides', href: '/guides', section: 'guides' },
  { label: 'For Travelers', href: '/', section: 'traveler' },
  { label: 'Local Guide', href: '/local-guide', section: 'local-guide' },
] as const;

export const EXPLORE_DEMO_ITEMS: readonly NavigationItem[] = [
  { label: 'Traveler Experience', description: 'Request, match, book and review.', href: '/' },
  { label: 'Local Guide Workspace', description: 'Registration and guide dashboard.', href: '/local-guide/dashboard' },
  { label: 'Partner Dashboard', description: 'Referrals and commission tracking.', href: '/partner/dashboard', badge: 'Demo' },
  { label: 'Admin Dashboard', description: 'Platform operations workspace.', href: '/admin/dashboard', badge: 'Demo' },
];

export const WORKSPACE_SWITCHER_ITEMS: readonly (NavigationItem & { workspace?: DemoWorkspace })[] = [
  { label: 'Traveler Site', href: '/', workspace: 'traveler' },
  { label: 'Local Guide Workspace', href: '/local-guide/dashboard', workspace: 'local-guide' },
  { label: 'Partner Workspace', href: '/partner/dashboard', workspace: 'partner', badge: 'Demo' },
  { label: 'Admin Workspace', href: '/admin/dashboard', workspace: 'admin', badge: 'Demo' },
  { label: 'All Demo Workspaces', href: '/demo' },
];

export const DEMO_FOOTER_ITEMS: readonly NavigationItem[] = [
  { label: 'Local Guide', href: '/local-guide' },
  { label: 'Partner Demo', href: '/partner', badge: 'Demo' },
  { label: 'Admin Demo', href: '/admin', badge: 'Demo' },
  { label: 'All Workspaces', href: '/demo' },
];

export const DEMO_WORKSPACE_CARDS: readonly DemoWorkspaceCard[] = [
  {
    role: 'Traveler',
    description: 'Request a guide, review matches, book an experience, chat and leave a review.',
    actions: [
      { label: 'Start Traveler Journey', href: '/' },
      { label: 'View Demo Bookings', href: '/bookings' },
    ],
  },
  {
    role: 'Local Guide',
    description: 'Apply as a guide and manage bookings, availability, earnings and messages.',
    actions: [
      { label: 'Guide Registration', href: '/local-guide/register' },
      { label: 'Open Guide Dashboard', href: '/local-guide/dashboard' },
    ],
  },
  {
    role: 'Partner',
    description: 'Review referral tools, referred bookings, commissions and reports.',
    badge: 'Demo',
    actions: [{ label: 'Open Partner Dashboard', href: '/partner/dashboard' }],
  },
  {
    role: 'Admin',
    description: 'Review platform operations, guide applications, bookings and finance.',
    badge: 'Demo',
    actions: [{ label: 'Open Admin Dashboard', href: '/admin/dashboard' }],
  },
];

export function workspaceForPath(pathname: string): DemoWorkspace {
  if (pathname.startsWith('/local-guide')) return 'local-guide';
  if (pathname.startsWith('/partner')) return 'partner';
  if (pathname.startsWith('/admin')) return 'admin';
  return 'traveler';
}

export function publicSectionForPath(pathname: string): PublicSection {
  if (pathname.startsWith('/guides')) return 'guides';
  if (pathname.startsWith('/local-guide')) return 'local-guide';
  if (pathname === '/signin') return 'signin';
  if (pathname === '/signup') return 'signup';
  if (pathname === '/demo') return 'demo';
  return 'traveler';
}

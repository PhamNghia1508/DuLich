export const BRAND_NAME = 'FriendLocalTrip';

export const DEFAULT_DOCUMENT_TITLE = `${BRAND_NAME} — Meet a trusted local guide`;

export const PUBLIC_NAV_LINKS = [
  { label: 'Browse Guides', href: '/guides' },
  { label: 'For Travelers', href: '/' },
  { label: 'Local Guide', href: '/local-guide' },
] as const;

export const PUBLIC_FOOTER_LINKS = [
  { label: 'Traveler Home', href: '/' },
  { label: 'Browse Guides', href: '/guides' },
  { label: 'My Bookings', href: '/bookings' },
  { label: 'Local Guide', href: '/local-guide' },
] as const;

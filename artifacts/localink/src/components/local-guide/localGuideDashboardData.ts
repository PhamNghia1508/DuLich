import type { PrototypeGuideWeeklyAvailability, PrototypeGuideWeekday } from './localGuideRegistrationData.ts';
export type { PrototypeGuideWeeklyAvailability };

export interface PrototypeGuideBooking {
  bookingId: string;
  guideId: string;
  travelerName: string;
  travelerCountry: string;
  date: string;
  startTime: string;
  durationHours: number;
  groupSize: number;
  experience: string;
  meetingPoint: string;
  total: number;
  platformFee: number;
  netPayout: number;
  currency: string;
  status: 'request' | 'confirmed' | 'completed' | 'cancelled';
  travelerNotes: string;
}

export interface PrototypeGuideTransaction {
  id: string;
  bookingId: string;
  travelerName: string;
  date: string;
  gross: number;
  platformFee: number;
  net: number;
  currency: string;
  status: 'pending' | 'available' | 'paid-demo';
}

export interface PrototypeGuideReviewReceived {
  id: string;
  bookingId: string;
  travelerName: string;
  travelerCountry: string;
  date: string;
  rating: number;
  comment: string;
  experience: string;
}

export interface PrototypeGuideConversation {
  bookingId: string;
  travelerName: string;
  travelerCountry: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: boolean;
}

export interface GuideDashboardProfile {
  guideId: string;
  displayName: string;
  fullName: string;
  portrait: string;
  city: string;
  operatingAreas: string[];
  languages: string[];
  experienceTypes: string[];
  specialties: string[];
  hourlyRate: number;
  currency: string;
  rating: number;
  reviewCount: number;
  responseTime: string;
  verified: boolean;
  tagline: string;
  bio: string;
  experienceYears: number;
  completedExperiences: number;
  memberSince: string;
}

const DEMO_GUIDE_ID = 'guide-001';

export const DEMO_GUIDE_PROFILE: GuideDashboardProfile = {
  guideId: DEMO_GUIDE_ID,
  displayName: 'Linh N.',
  fullName: 'Linh Nguyen',
  portrait: '/images/guides/linh.webp',
  city: 'Ho Chi Minh City',
  operatingAreas: ['District 1', 'District 3', 'Cholon'],
  languages: ['Vietnamese', 'English'],
  experienceTypes: ['Food & Culture', 'Shopping', 'Local Life'],
  specialties: ['Street food expert', 'Cultural storyteller', 'Night market specialist'],
  hourlyRate: 18,
  currency: 'USD',
  rating: 4.97,
  reviewCount: 214,
  responseTime: 'Usually responds in 12 min',
  verified: true,
  tagline: 'Street food expert and Saigon native',
  bio: 'I know every hidden banh mi cart and dawn pho spot in the city. Let me show you the real Saigon.',
  experienceYears: 8,
  completedExperiences: 231,
  memberSince: '2024-03',
};

function computeFee(gross: number): number {
  return Math.round(gross * 0.1 * 100) / 100;
}

function computeNet(gross: number): number {
  return Math.round((gross - computeFee(gross)) * 100) / 100;
}

export const SEEDED_GUIDE_BOOKINGS: readonly PrototypeGuideBooking[] = [
  {
    bookingId: 'GBK-001',
    guideId: DEMO_GUIDE_ID,
    travelerName: 'Sarah M.',
    travelerCountry: 'Canada',
    date: '2026-07-28',
    startTime: '09:00',
    durationHours: 4,
    groupSize: 2,
    experience: 'Food & Culture',
    meetingPoint: 'Ben Thanh Market entrance',
    total: 72,
    platformFee: computeFee(72),
    netPayout: computeNet(72),
    currency: 'USD',
    status: 'request',
    travelerNotes: 'We want to focus on coffee culture and street food in District 3.',
  },
  {
    bookingId: 'GBK-002',
    guideId: DEMO_GUIDE_ID,
    travelerName: 'Marco P.',
    travelerCountry: 'Italy',
    date: '2026-07-30',
    startTime: '14:00',
    durationHours: 3,
    groupSize: 1,
    experience: 'Shopping',
    meetingPoint: 'Saigon Central Post Office',
    total: 54,
    platformFee: computeFee(54),
    netPayout: computeNet(54),
    currency: 'USD',
    status: 'request',
    travelerNotes: 'Looking for local artisan shops and markets. Budget-friendly options preferred.',
  },
  {
    bookingId: 'GBK-003',
    guideId: DEMO_GUIDE_ID,
    travelerName: 'Alex J.',
    travelerCountry: 'USA',
    date: '2026-07-20',
    startTime: '07:00',
    durationHours: 4,
    groupSize: 2,
    experience: 'Food & Culture',
    meetingPoint: 'Ben Thanh Gate 1',
    total: 72,
    platformFee: computeFee(72),
    netPayout: computeNet(72),
    currency: 'USD',
    status: 'confirmed',
    travelerNotes: 'Early morning street food tour. We love spicy food!',
  },
  {
    bookingId: 'GBK-004',
    guideId: DEMO_GUIDE_ID,
    travelerName: 'Yuki T.',
    travelerCountry: 'Japan',
    date: '2026-07-22',
    startTime: '10:00',
    durationHours: 3,
    groupSize: 3,
    experience: 'Local Life',
    meetingPoint: 'District 3 Coffee House',
    total: 54,
    platformFee: computeFee(54),
    netPayout: computeNet(54),
    currency: 'USD',
    status: 'confirmed',
    travelerNotes: 'Want to see daily life in local neighborhoods.',
  },
  {
    bookingId: 'GBK-005',
    guideId: DEMO_GUIDE_ID,
    travelerName: 'Emma L.',
    travelerCountry: 'Sweden',
    date: '2026-07-10',
    startTime: '09:00',
    durationHours: 4,
    groupSize: 2,
    experience: 'Food & Culture',
    meetingPoint: 'Pham Ngu Lao area',
    total: 72,
    platformFee: computeFee(72),
    netPayout: computeNet(72),
    currency: 'USD',
    status: 'completed',
    travelerNotes: '',
  },
  {
    bookingId: 'GBK-006',
    guideId: DEMO_GUIDE_ID,
    travelerName: 'Daniel R.',
    travelerCountry: 'Singapore',
    date: '2026-07-05',
    startTime: '14:00',
    durationHours: 3,
    groupSize: 1,
    experience: 'Shopping',
    meetingPoint: 'Cho Lon market',
    total: 54,
    platformFee: computeFee(54),
    netPayout: computeNet(54),
    currency: 'USD',
    status: 'completed',
    travelerNotes: '',
  },
  {
    bookingId: 'GBK-007',
    guideId: DEMO_GUIDE_ID,
    travelerName: 'Chen W.',
    travelerCountry: 'Taiwan',
    date: '2026-07-08',
    startTime: '10:00',
    durationHours: 3,
    groupSize: 2,
    experience: 'Local Life',
    meetingPoint: 'Independence Palace gate',
    total: 54,
    platformFee: computeFee(54),
    netPayout: computeNet(54),
    currency: 'USD',
    status: 'cancelled',
    travelerNotes: 'Plans changed — family emergency.',
  },
];

export const SEEDED_GUIDE_TRANSACTIONS: readonly PrototypeGuideTransaction[] = [
  {
    id: 'txn-001',
    bookingId: 'GBK-005',
    travelerName: 'Emma L.',
    date: '2026-07-10',
    gross: 72,
    platformFee: computeFee(72),
    net: computeNet(72),
    currency: 'USD',
    status: 'available',
  },
  {
    id: 'txn-002',
    bookingId: 'GBK-006',
    travelerName: 'Daniel R.',
    date: '2026-07-05',
    gross: 54,
    platformFee: computeFee(54),
    net: computeNet(54),
    currency: 'USD',
    status: 'paid-demo',
  },
  {
    id: 'txn-003',
    bookingId: 'GBK-003',
    travelerName: 'Alex J.',
    date: '2026-07-20',
    gross: 72,
    platformFee: computeFee(72),
    net: computeNet(72),
    currency: 'USD',
    status: 'pending',
  },
  {
    id: 'txn-004',
    bookingId: 'GBK-004',
    travelerName: 'Yuki T.',
    date: '2026-07-22',
    gross: 54,
    platformFee: computeFee(54),
    net: computeNet(54),
    currency: 'USD',
    status: 'pending',
  },
];

export const SEEDED_GUIDE_REVIEWS: readonly PrototypeGuideReviewReceived[] = [
  {
    id: 'grev-001',
    bookingId: 'GBK-005',
    travelerName: 'Emma L.',
    travelerCountry: 'Sweden',
    date: '2026-07-11',
    rating: 5,
    comment: 'A warm, flexible local experience with thoughtful recommendations we would never have found on our own.',
    experience: 'Food & Culture',
  },
  {
    id: 'grev-002',
    bookingId: 'GBK-006',
    travelerName: 'Daniel R.',
    travelerCountry: 'Singapore',
    date: '2026-07-06',
    rating: 5,
    comment: 'Clear communication, an easy pace and just the right balance of local stories and spontaneous stops.',
    experience: 'Shopping',
  },
  {
    id: 'grev-003',
    bookingId: 'prev-001',
    travelerName: 'Hannah K.',
    travelerCountry: 'Germany',
    date: '2026-06-20',
    rating: 5,
    comment: 'Linh made us feel like friends exploring together. The food was incredible and every stop was a surprise.',
    experience: 'Food & Culture',
  },
  {
    id: 'grev-004',
    bookingId: 'prev-002',
    travelerName: 'James T.',
    travelerCountry: 'Australia',
    date: '2026-06-12',
    rating: 4,
    comment: 'Solid local knowledge and great conversation. Would have loved a bit more time at each spot.',
    experience: 'Local Life',
  },
];

export const SEEDED_GUIDE_CONVERSATIONS: readonly PrototypeGuideConversation[] = [
  {
    bookingId: 'GBK-003',
    travelerName: 'Alex J.',
    travelerCountry: 'USA',
    lastMessage: 'Looking forward to the tour! See you at Gate 1.',
    lastMessageTime: '2026-07-19T14:30:00Z',
    unread: false,
  },
  {
    bookingId: 'GBK-004',
    travelerName: 'Yuki T.',
    travelerCountry: 'Japan',
    lastMessage: 'Can we start 30 minutes later? Our hotel checkout is at 10.',
    lastMessageTime: '2026-07-21T09:15:00Z',
    unread: true,
  },
  {
    bookingId: 'GBK-005',
    travelerName: 'Emma L.',
    travelerCountry: 'Sweden',
    lastMessage: 'Thank you for an amazing experience!',
    lastMessageTime: '2026-07-10T18:00:00Z',
    unread: false,
  },
];

export function filterGuideBookings(
  bookings: readonly PrototypeGuideBooking[],
  status: PrototypeGuideBooking['status'] | 'all',
): PrototypeGuideBooking[] {
  if (status === 'all') return [...bookings];
  return bookings.filter((b) => b.status === status);
}

export function acceptGuideBooking(
  bookings: readonly PrototypeGuideBooking[],
  bookingId: string,
): PrototypeGuideBooking[] {
  return bookings.map((b) =>
    b.bookingId === bookingId && b.status === 'request'
      ? { ...b, status: 'confirmed' as const }
      : { ...b },
  );
}

export function declineGuideBooking(
  bookings: readonly PrototypeGuideBooking[],
  bookingId: string,
): PrototypeGuideBooking[] {
  return bookings.map((b) =>
    b.bookingId === bookingId && b.status === 'request'
      ? { ...b, status: 'cancelled' as const }
      : { ...b },
  );
}

export function updateWeeklySchedule(
  availability: PrototypeGuideWeeklyAvailability,
  dayIndex: number,
  updates: Partial<PrototypeGuideWeekday>,
): PrototypeGuideWeeklyAvailability {
  return {
    ...availability,
    schedule: availability.schedule.map((d, i) =>
      i === dayIndex ? { ...d, ...updates } : { ...d },
    ),
  };
}

export function createDefaultGuideAvailability(): PrototypeGuideWeeklyAvailability {
  return {
    schedule: [
      { day: 'Monday', available: true, startTime: '07:00', endTime: '17:00' },
      { day: 'Tuesday', available: true, startTime: '07:00', endTime: '17:00' },
      { day: 'Wednesday', available: true, startTime: '08:00', endTime: '16:00' },
      { day: 'Thursday', available: true, startTime: '07:00', endTime: '17:00' },
      { day: 'Friday', available: true, startTime: '07:00', endTime: '18:00' },
      { day: 'Saturday', available: true, startTime: '08:00', endTime: '20:00' },
      { day: 'Sunday', available: false, startTime: '09:00', endTime: '15:00' },
    ],
    minBookingHours: 2,
    maxBookingsPerDay: 3,
    advanceNoticeDays: 1,
    maxGroupSize: 6,
    meetingAreas: ['District 1', 'District 3', 'Cholon'],
  };
}

export interface GuideDashboardOverview {
  upcomingCount: number;
  completedCount: number;
  pendingRequestCount: number;
  totalEarned: number;
  pendingEarnings: number;
  availableBalance: number;
  averageRating: number;
  reviewCount: number;
  responseTime: string;
  profileCompleteness: number;
}

export function computeDashboardOverview(
  bookings: readonly PrototypeGuideBooking[],
  transactions: readonly PrototypeGuideTransaction[],
  reviews: readonly PrototypeGuideReviewReceived[],
  profile: GuideDashboardProfile,
): GuideDashboardOverview {
  const upcomingCount = bookings.filter((b) => b.status === 'confirmed').length;
  const completedCount = bookings.filter((b) => b.status === 'completed').length;
  const pendingRequestCount = bookings.filter((b) => b.status === 'request').length;

  const totalEarned = transactions.reduce((sum, t) => sum + t.net, 0);
  const pendingEarnings = transactions
    .filter((t) => t.status === 'pending')
    .reduce((sum, t) => sum + t.net, 0);
  const availableBalance = transactions
    .filter((t) => t.status === 'available')
    .reduce((sum, t) => sum + t.net, 0);

  const averageRating = reviews.length > 0
    ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 100) / 100
    : 0;

  return {
    upcomingCount,
    completedCount,
    pendingRequestCount,
    totalEarned: Math.round(totalEarned * 100) / 100,
    pendingEarnings: Math.round(pendingEarnings * 100) / 100,
    availableBalance: Math.round(availableBalance * 100) / 100,
    averageRating,
    reviewCount: reviews.length,
    responseTime: profile.responseTime,
    profileCompleteness: 92,
  };
}

export function guideBookingStatusLabel(status: PrototypeGuideBooking['status']): string {
  switch (status) {
    case 'request': return 'Pending Request';
    case 'confirmed': return 'Confirmed';
    case 'completed': return 'Completed';
    case 'cancelled': return 'Cancelled';
  }
}

export function guideBookingStatusColor(status: PrototypeGuideBooking['status']): string {
  switch (status) {
    case 'request': return '#d97706';
    case 'confirmed': return '#2563eb';
    case 'completed': return '#16a34a';
    case 'cancelled': return '#9ca3af';
  }
}

export function transactionStatusLabel(status: PrototypeGuideTransaction['status']): string {
  switch (status) {
    case 'pending': return 'Pending';
    case 'available': return 'Available';
    case 'paid-demo': return 'Paid — Demo';
  }
}

export function formatGuideMoney(value: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);
}

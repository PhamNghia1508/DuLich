import type {
  GuideDashboardOverview,
  PrototypeGuideTransaction,
} from './localGuideDashboardData.ts';
import type { PrototypeGuideApplication } from './localGuideRegistrationData.ts';

export type GuideDashboardTab =
  | 'overview'
  | 'bookings'
  | 'availability'
  | 'earnings'
  | 'messages'
  | 'reviews'
  | 'profile';

export const GUIDE_DASHBOARD_NAV_ITEMS: readonly {
  id: GuideDashboardTab;
  label: string;
}[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'bookings', label: 'Bookings' },
  { id: 'availability', label: 'Availability' },
  { id: 'earnings', label: 'Earnings' },
  { id: 'messages', label: 'Messages' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'profile', label: 'Profile' },
];

export interface DashboardMetricCard {
  id: 'pending-requests' | 'upcoming-bookings' | 'available-earnings' | 'average-rating';
  label: string;
  value: number;
  format: 'count' | 'currency' | 'rating';
}

export function createDashboardMetricCards(overview: GuideDashboardOverview): DashboardMetricCard[] {
  return [
    {
      id: 'pending-requests',
      label: 'Pending requests',
      value: overview.pendingRequestCount,
      format: 'count',
    },
    {
      id: 'upcoming-bookings',
      label: 'Upcoming bookings',
      value: overview.upcomingCount,
      format: 'count',
    },
    {
      id: 'available-earnings',
      label: 'Estimated available earnings',
      value: overview.availableBalance,
      format: 'currency',
    },
    {
      id: 'average-rating',
      label: 'Average rating',
      value: overview.averageRating,
      format: 'rating',
    },
  ];
}

export interface RegistrationReviewGroup {
  title: 'Public Profile' | 'Services' | 'Pricing' | 'Availability' | 'Verification';
  items: { label: string; value: string }[];
}

function showList(values: readonly string[]): string {
  return values.length > 0 ? values.join(', ') : 'Not provided';
}

export function createRegistrationReviewGroups(
  draft: PrototypeGuideApplication,
): RegistrationReviewGroup[] {
  const activeDays = draft.weeklyAvailability.schedule
    .filter((day) => day.available)
    .map((day) => day.day);

  return [
    {
      title: 'Public Profile',
      items: [
        { label: 'Display name', value: draft.displayName || 'Not provided' },
        { label: 'Location', value: draft.city || 'Not provided' },
        { label: 'Languages', value: showList(draft.languages) },
        { label: 'Tagline', value: draft.tagline || 'Not provided' },
      ],
    },
    {
      title: 'Services',
      items: [
        { label: 'Experience types', value: showList(draft.experienceTypes) },
        { label: 'Specialties', value: showList(draft.specialties) },
        { label: 'Guide styles', value: showList(draft.guideStyles) },
        { label: 'Operating areas', value: showList(draft.operatingAreas) },
      ],
    },
    {
      title: 'Pricing',
      items: [
        { label: 'Hourly rate', value: draft.hourlyRate > 0 ? `$${draft.hourlyRate} USD` : 'Not provided' },
        { label: 'Maximum group size', value: draft.maxGroupSize > 0 ? `${draft.maxGroupSize} travelers` : 'Not provided' },
      ],
    },
    {
      title: 'Availability',
      items: [
        { label: 'Available days', value: showList(activeDays) },
        { label: 'Advance notice', value: `${draft.weeklyAvailability.advanceNoticeDays} days` },
        { label: 'Minimum booking', value: `${draft.weeklyAvailability.minBookingHours} hours` },
      ],
    },
    {
      title: 'Verification',
      items: [
        { label: 'Identity document', value: draft.verification.identityDocument === 'uploaded' ? 'Uploaded for demo' : 'Not started' },
        { label: 'Language assessment', value: draft.verification.languageAssessment === 'completed-demo' ? 'Completed for demo' : 'Not started' },
        { label: 'Terms', value: draft.verification.termsAccepted ? 'Accepted' : 'Not accepted' },
      ],
    },
  ];
}

export interface GuideTransactionCard {
  id: string;
  bookingId: string;
  travelerName: string;
  date: string;
  gross: number;
  platformFee: number;
  net: number;
  currency: string;
  status: PrototypeGuideTransaction['status'];
}

export function normalizeGuideTransactionsForCards(
  transactions: readonly PrototypeGuideTransaction[],
): GuideTransactionCard[] {
  return transactions.map((transaction) => ({ ...transaction }));
}

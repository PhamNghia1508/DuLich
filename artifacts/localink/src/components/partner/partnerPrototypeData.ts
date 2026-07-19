export const PARTNER_COMMISSION_RATE = 0.05;

export interface DemoPartner {
  id: string;
  name: string;
  type: string;
  city: string;
  contactDisplayName: string;
  publicReferralLabel: string;
  referralCode: string;
  commissionRate: number;
  verificationStatus: 'verified-demo';
}

export interface PartnerCampaign {
  id: string;
  name: string;
  visits: number;
  requests: number;
  bookings: number;
}

export type PartnerBookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type PartnerCommissionStatus = 'pending' | 'available' | 'paid-demo' | 'reversed';

export interface PartnerReferredBooking {
  id: string;
  travelerName: string;
  guideName: string;
  date: string;
  experience: string;
  total: number;
  currency: string;
  referralSource: string;
  status: PartnerBookingStatus;
  commissionStatus: PartnerCommissionStatus;
  eligible: boolean;
}

export interface PartnerCommissionTransaction {
  id: string;
  bookingId: string;
  amount: number;
  status: PartnerCommissionStatus;
}

export interface PartnerMonthlyReport {
  month: string;
  requests: number;
  confirmed: number;
  completed: number;
  commission: number;
}

export const DEMO_PARTNER: DemoPartner = {
  id: 'partner-saigon-riverside',
  name: 'Saigon Riverside Hotel — Demo',
  type: 'Hotel',
  city: 'Ho Chi Minh City',
  contactDisplayName: 'Mai Tran',
  publicReferralLabel: 'Saigon Riverside Local Experiences',
  referralCode: 'saigon-riverside-demo',
  commissionRate: PARTNER_COMMISSION_RATE,
  verificationStatus: 'verified-demo',
};

export const PARTNER_CAMPAIGNS: readonly PartnerCampaign[] = [
  { id: 'front-desk', name: 'Front Desk QR', visits: 286, requests: 31, bookings: 14 },
  { id: 'guest-room', name: 'Guest Room Card', visits: 174, requests: 18, bookings: 8 },
  { id: 'instagram', name: 'Instagram Bio', visits: 122, requests: 12, bookings: 5 },
  { id: 'concierge', name: 'Concierge Link', visits: 96, requests: 9, bookings: 4 },
];

export const PARTNER_REFERRED_BOOKINGS: readonly PartnerReferredBooking[] = [
  { id: 'FLT-REF-008', travelerName: 'Sofia R.', guideName: 'Linh N.', date: '2026-08-08', experience: 'Food & Culture', total: 94.5, currency: 'USD', referralSource: 'Front Desk QR', status: 'pending', commissionStatus: 'pending', eligible: true },
  { id: 'FLT-REF-007', travelerName: 'Noah K.', guideName: 'Minh T.', date: '2026-08-03', experience: 'History', total: 78.75, currency: 'USD', referralSource: 'Guest Room Card', status: 'pending', commissionStatus: 'pending', eligible: true },
  { id: 'FLT-REF-006', travelerName: 'Aya M.', guideName: 'Thu P.', date: '2026-07-30', experience: 'Local Life', total: 105, currency: 'USD', referralSource: 'Concierge Link', status: 'confirmed', commissionStatus: 'pending', eligible: true },
  { id: 'FLT-REF-005', travelerName: 'Lucas B.', guideName: 'Linh N.', date: '2026-07-27', experience: 'Food & Culture', total: 126, currency: 'USD', referralSource: 'Front Desk QR', status: 'confirmed', commissionStatus: 'pending', eligible: true },
  { id: 'FLT-REF-004', travelerName: 'Emma J.', guideName: 'Bao D.', date: '2026-07-16', experience: 'Shopping', total: 84, currency: 'USD', referralSource: 'Front Desk QR', status: 'completed', commissionStatus: 'available', eligible: true },
  { id: 'FLT-REF-003', travelerName: 'Owen T.', guideName: 'Linh N.', date: '2026-07-11', experience: 'Food & Culture', total: 115.5, currency: 'USD', referralSource: 'Guest Room Card', status: 'completed', commissionStatus: 'available', eligible: true },
  { id: 'FLT-REF-002', travelerName: 'Mia S.', guideName: 'Minh T.', date: '2026-06-24', experience: 'History', total: 73.5, currency: 'USD', referralSource: 'Instagram Bio', status: 'completed', commissionStatus: 'paid-demo', eligible: true },
  { id: 'FLT-REF-001', travelerName: 'Ethan W.', guideName: 'Thu P.', date: '2026-06-18', experience: 'Nightlife', total: 89.25, currency: 'USD', referralSource: 'Front Desk QR', status: 'cancelled', commissionStatus: 'reversed', eligible: false },
];

export const PARTNER_MONTHLY_REPORTS: readonly PartnerMonthlyReport[] = [
  { month: 'March', requests: 14, confirmed: 8, completed: 6, commission: 23.1 },
  { month: 'April', requests: 18, confirmed: 11, completed: 8, commission: 31.5 },
  { month: 'May', requests: 22, confirmed: 14, completed: 11, commission: 43.58 },
  { month: 'June', requests: 27, confirmed: 17, completed: 13, commission: 51.45 },
  { month: 'July', requests: 31, confirmed: 20, completed: 16, commission: 64.05 },
];

function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function calculatePartnerCommission(
  booking: Pick<PartnerReferredBooking, 'total' | 'status' | 'eligible'>,
): number {
  if (!booking.eligible || booking.status !== 'completed') return 0;
  return roundMoney(booking.total * PARTNER_COMMISSION_RATE);
}

export function filterPartnerBookings(
  bookings: readonly PartnerReferredBooking[],
  status: 'all' | PartnerBookingStatus,
): PartnerReferredBooking[] {
  return bookings.filter((booking) => status === 'all' || booking.status === status).map((booking) => ({ ...booking }));
}

export function deduplicateReferredBookings(
  bookings: readonly PartnerReferredBooking[],
): PartnerReferredBooking[] {
  const seen = new Set<string>();
  return bookings.reduce<PartnerReferredBooking[]>((result, booking) => {
    if (seen.has(booking.id)) return result;
    seen.add(booking.id);
    result.push({ ...booking });
    return result;
  }, []);
}

export function summarizePartnerCommissions(
  transactions: readonly PartnerCommissionTransaction[],
) {
  const totalFor = (status: PartnerCommissionStatus) => roundMoney(
    transactions.filter((transaction) => transaction.status === status).reduce((total, transaction) => total + transaction.amount, 0),
  );
  const pending = totalFor('pending');
  const available = totalFor('available');
  const paidDemo = totalFor('paid-demo');
  return { pending, available, paidDemo, lifetime: roundMoney(pending + available + paidDemo) };
}

export function createPartnerReportSummary(
  bookings: readonly PartnerReferredBooking[],
  campaigns: readonly PartnerCampaign[],
) {
  const completed = bookings.filter((booking) => booking.status === 'completed');
  const best = [...campaigns].sort((first, second) => second.bookings - first.bookings || first.name.localeCompare(second.name))[0];
  const categoryCounts = completed.reduce<Record<string, number>>((counts, booking) => ({ ...counts, [booking.experience]: (counts[booking.experience] ?? 0) + 1 }), {});
  const popularExperience = Object.entries(categoryCounts).sort((first, second) => second[1] - first[1] || first[0].localeCompare(second[0]))[0]?.[0] ?? 'No completed bookings';
  return {
    referredRequests: bookings.length,
    confirmedBookings: bookings.filter((booking) => booking.status === 'confirmed').length,
    completedBookings: completed.length,
    conversionRate: bookings.length ? roundMoney((completed.length / bookings.length) * 100) : 0,
    commissionEarned: roundMoney(completed.reduce((total, booking) => total + calculatePartnerCommission(booking), 0)),
    bestSource: best?.name ?? 'No campaign',
    popularExperience,
  };
}

export function normalizeReferralUrl(value: string): string {
  const code = value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return `friendlocaltrip.com/r/${code}`;
}

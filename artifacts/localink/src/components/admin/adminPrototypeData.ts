import type { RequestGuideDraft } from '../home/requestGuideValidation.ts';
import { matchGuides } from '../home/guideMatching.ts';
import { MOCK_GUIDES } from '../home/mockGuideData.ts';

export interface AdminTraveler {
  id: string; displayName: string; country: string; joinedDate: string; bookingCount: number;
  lastBooking: string; status: 'active' | 'new' | 'flagged-demo'; reportCount: number;
}

export type GuideApplicationStatus = 'pending' | 'approved' | 'needs-changes' | 'rejected';
export interface AdminGuideApplication {
  id: string; applicantName: string; city: string; languages: string[]; experienceYears: number;
  hourlyRate: number; completeness: number; verificationChecks: string[]; submittedDate: string;
  status: GuideApplicationStatus; adminNotes: string[]; experienceTypes: string[]; availableDays: string[];
}

export interface AdminPartner {
  id: string; name: string; type: string; city: string; referralCode: string; referredBookings: number;
  commissionRate: number; verificationStatus: 'pending' | 'verified-demo' | 'needs-changes';
  accountStatus: 'active' | 'suspended-demo';
}

export type AdminRequestStatus = 'submitted' | 'matching' | 'matched' | 'guide-selected' | 'expired' | 'cancelled';
export interface AdminRequest extends RequestGuideDraft {
  id: string; travelerName: string; matchCount: number; status: AdminRequestStatus; createdDate: string;
}

export type AdminPaymentStatus = 'successful-demo' | 'pending-demo' | 'failed-demo' | 'refunded-demo';
export interface AdminBooking {
  id: string; travelerName: string; guideName: string; partnerSource?: string; date: string;
  subtotal: number; travelerServiceFee: number; total: number; guidePlatformFee: number;
  status: 'confirmed' | 'completed' | 'cancelled'; paymentStatus: AdminPaymentStatus;
  reviewStatus: 'not-submitted' | 'submitted' | 'flagged-demo'; flagged: boolean; currency: 'USD';
}

export interface AdminReport {
  id: string; reporterRole: 'Traveler' | 'Guide' | 'Admin' | 'Partner'; relatedEntity: string;
  category: string; createdDate: string; priority: 'low' | 'medium' | 'high';
  status: 'open' | 'investigating' | 'resolved-demo'; adminNotes: string[];
}

export interface AdminSettings {
  travelerServiceFeePercent: number; guidePlatformFeePercent: number; partnerCommissionPercent: number;
  cancellationCopy: string; supportContact: string; matchingWeightPreview: string;
}

export const ADMIN_TRAVELERS: readonly AdminTraveler[] = [
  { id: 'traveler-001', displayName: 'Alex T.', country: 'USA', joinedDate: '2026-02-11', bookingCount: 6, lastBooking: '2026-07-20', status: 'active', reportCount: 0 },
  { id: 'traveler-002', displayName: 'Sarah M.', country: 'Canada', joinedDate: '2026-05-03', bookingCount: 2, lastBooking: '2026-07-28', status: 'active', reportCount: 0 },
  { id: 'traveler-003', displayName: 'Yuki T.', country: 'Japan', joinedDate: '2026-07-02', bookingCount: 1, lastBooking: '2026-07-22', status: 'new', reportCount: 0 },
  { id: 'traveler-004', displayName: 'Marco P.', country: 'Italy', joinedDate: '2026-06-14', bookingCount: 3, lastBooking: '2026-07-30', status: 'active', reportCount: 1 },
  { id: 'traveler-005', displayName: 'Chen W.', country: 'Taiwan', joinedDate: '2026-03-19', bookingCount: 4, lastBooking: '2026-07-08', status: 'flagged-demo', reportCount: 2 },
];

export const ADMIN_GUIDE_APPLICATIONS: readonly AdminGuideApplication[] = [
  { id: 'guide-app-001', applicantName: 'An Nguyen', city: 'Ho Chi Minh City', languages: ['Vietnamese', 'English'], experienceYears: 4, hourlyRate: 17, completeness: 88, verificationChecks: ['Profile photo selected', 'Identity status — demo pending', 'Terms accepted'], submittedDate: '2026-07-18', status: 'pending', adminNotes: [], experienceTypes: ['Food & Culture', 'Local Life'], availableDays: ['Monday', 'Tuesday', 'Friday', 'Saturday'] },
  { id: 'guide-app-002', applicantName: 'Hoa Le', city: 'Hanoi', languages: ['Vietnamese', 'French', 'English'], experienceYears: 6, hourlyRate: 20, completeness: 94, verificationChecks: ['Profile photo selected', 'Language assessment — demo complete', 'Terms accepted'], submittedDate: '2026-07-17', status: 'pending', adminNotes: [], experienceTypes: ['History', 'Architecture'], availableDays: ['Wednesday', 'Thursday', 'Sunday'] },
  { id: 'guide-app-003', applicantName: 'Khanh Pham', city: 'Da Nang', languages: ['Vietnamese', 'English'], experienceYears: 2, hourlyRate: 15, completeness: 72, verificationChecks: ['Profile photo selected', 'Terms accepted'], submittedDate: '2026-07-12', status: 'needs-changes', adminNotes: ['Add clearer availability and gallery details.'], experienceTypes: ['Nature', 'Photography'], availableDays: ['Saturday', 'Sunday'] },
  { id: 'guide-app-004', applicantName: 'Vy Tran', city: 'Hoi An', languages: ['Vietnamese', 'English', 'Japanese'], experienceYears: 5, hourlyRate: 19, completeness: 97, verificationChecks: ['Profile photo selected', 'Language assessment — demo complete', 'Terms accepted'], submittedDate: '2026-07-08', status: 'approved', adminNotes: ['Approved for demo presentation.'], experienceTypes: ['Food & Culture', 'History'], availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Friday'] },
];

export const ADMIN_PARTNERS: readonly AdminPartner[] = [
  { id: 'partner-saigon-riverside', name: 'Saigon Riverside Hotel — Demo', type: 'Hotel', city: 'Ho Chi Minh City', referralCode: 'saigon-riverside-demo', referredBookings: 31, commissionRate: .05, verificationStatus: 'verified-demo', accountStatus: 'active' },
  { id: 'partner-002', name: 'Lotus Lane Homestay', type: 'Homestay', city: 'Hoi An', referralCode: 'lotus-lane-demo', referredBookings: 18, commissionRate: .05, verificationStatus: 'verified-demo', accountStatus: 'active' },
  { id: 'partner-003', name: 'Morning Pho Studio', type: 'Creator', city: 'Hanoi', referralCode: 'morning-pho-demo', referredBookings: 9, commissionRate: .05, verificationStatus: 'pending', accountStatus: 'active' },
  { id: 'partner-004', name: 'Mekong Table', type: 'Restaurant', city: 'Ho Chi Minh City', referralCode: 'mekong-table-demo', referredBookings: 5, commissionRate: .05, verificationStatus: 'needs-changes', accountStatus: 'active' },
];

export const ADMIN_REQUESTS: readonly AdminRequest[] = [
  { id: 'REQ-2026-0719-01', travelerName: 'Sarah M.', destination: 'Ho Chi Minh City', languages: ['en'], groupSize: 2, startDate: '2026-07-28', endDate: '2026-07-30', experiencePreferences: ['Food & Culture', 'Local Life'], additionalInformation: 'Coffee culture and local markets.', matchCount: 5, status: 'matched', createdDate: '2026-07-19' },
  { id: 'REQ-2026-0719-02', travelerName: 'Marco P.', destination: 'District 1', languages: ['en'], groupSize: 1, startDate: '2026-07-30', endDate: '2026-07-30', experiencePreferences: ['Shopping'], additionalInformation: '', matchCount: 0, status: 'submitted', createdDate: '2026-07-19' },
  { id: 'REQ-2026-0718-03', travelerName: 'Yuki T.', destination: 'Ho Chi Minh City', languages: ['ja', 'en'], groupSize: 3, startDate: '2026-07-22', endDate: '2026-07-24', experiencePreferences: ['Local Life'], additionalInformation: '', matchCount: 3, status: 'guide-selected', createdDate: '2026-07-18' },
  { id: 'REQ-2026-0717-04', travelerName: 'Emma L.', destination: 'Hanoi', languages: ['en'], groupSize: 2, startDate: '2026-08-02', endDate: '2026-08-04', experiencePreferences: ['History'], additionalInformation: '', matchCount: 0, status: 'matching', createdDate: '2026-07-17' },
  { id: 'REQ-2026-0709-05', travelerName: 'Daniel R.', destination: 'Da Nang', languages: ['en'], groupSize: 1, startDate: '2026-07-12', endDate: '2026-07-13', experiencePreferences: ['Nature'], additionalInformation: '', matchCount: 2, status: 'expired', createdDate: '2026-07-09' },
  { id: 'REQ-2026-0708-06', travelerName: 'Chen W.', destination: 'Hoi An', languages: ['zh', 'en'], groupSize: 2, startDate: '2026-07-10', endDate: '2026-07-10', experiencePreferences: ['Food & Culture'], additionalInformation: '', matchCount: 1, status: 'cancelled', createdDate: '2026-07-08' },
];

export const ADMIN_BOOKINGS: readonly AdminBooking[] = [
  { id: 'FLT-GUIDE001-20260720', travelerName: 'Alex T.', guideName: 'Linh N.', partnerSource: 'Saigon Riverside Hotel', date: '2026-07-20', subtotal: 72, travelerServiceFee: 3.6, total: 75.6, guidePlatformFee: 7.2, status: 'confirmed', paymentStatus: 'successful-demo', reviewStatus: 'not-submitted', flagged: false, currency: 'USD' },
  { id: 'FLT-GUIDE004-20260722', travelerName: 'Yuki T.', guideName: 'Thu P.', date: '2026-07-22', subtotal: 54, travelerServiceFee: 2.7, total: 56.7, guidePlatformFee: 5.4, status: 'confirmed', paymentStatus: 'pending-demo', reviewStatus: 'not-submitted', flagged: false, currency: 'USD' },
  { id: 'FLT-GUIDE001-20260615', travelerName: 'Emma J.', guideName: 'Linh N.', partnerSource: 'Saigon Riverside Hotel', date: '2026-06-15', subtotal: 90, travelerServiceFee: 4.5, total: 94.5, guidePlatformFee: 9, status: 'completed', paymentStatus: 'successful-demo', reviewStatus: 'submitted', flagged: false, currency: 'USD' },
  { id: 'FLT-GUIDE003-20260622', travelerName: 'Owen T.', guideName: 'Bao D.', partnerSource: 'Saigon Riverside Hotel', date: '2026-06-22', subtotal: 110, travelerServiceFee: 5.5, total: 115.5, guidePlatformFee: 11, status: 'completed', paymentStatus: 'successful-demo', reviewStatus: 'submitted', flagged: false, currency: 'USD' },
  { id: 'FLT-GUIDE005-20260701', travelerName: 'Mia S.', guideName: 'Minh T.', date: '2026-07-01', subtotal: 70, travelerServiceFee: 3.5, total: 73.5, guidePlatformFee: 7, status: 'completed', paymentStatus: 'successful-demo', reviewStatus: 'flagged-demo', flagged: true, currency: 'USD' },
  { id: 'FLT-GUIDE002-20260710', travelerName: 'Chen W.', guideName: 'Yuki P.', partnerSource: 'Saigon Riverside Hotel', date: '2026-07-10', subtotal: 85, travelerServiceFee: 4.25, total: 89.25, guidePlatformFee: 8.5, status: 'cancelled', paymentStatus: 'refunded-demo', reviewStatus: 'not-submitted', flagged: false, currency: 'USD' },
  { id: 'FLT-GUIDE006-20260804', travelerName: 'Noah K.', guideName: 'Huy V.', date: '2026-08-04', subtotal: 96, travelerServiceFee: 4.8, total: 100.8, guidePlatformFee: 9.6, status: 'confirmed', paymentStatus: 'failed-demo', reviewStatus: 'not-submitted', flagged: true, currency: 'USD' },
];

export const ADMIN_REPORTS: readonly AdminReport[] = [
  { id: 'report-001', reporterRole: 'Traveler', relatedEntity: 'FLT-GUIDE001-20260720', category: 'Guide communication issue', createdDate: '2026-07-19', priority: 'high', status: 'open', adminNotes: [] },
  { id: 'report-002', reporterRole: 'Guide', relatedEntity: 'traveler-005', category: 'Traveler no-show', createdDate: '2026-07-17', priority: 'medium', status: 'investigating', adminNotes: ['Reviewing demo booking timeline.'] },
  { id: 'report-003', reporterRole: 'Admin', relatedEntity: 'FLT-GUIDE005-20260701', category: 'Possible duplicate review', createdDate: '2026-07-15', priority: 'medium', status: 'open', adminNotes: [] },
  { id: 'report-004', reporterRole: 'Partner', relatedEntity: 'partner-saigon-riverside', category: 'Commission dispute — Demo', createdDate: '2026-07-10', priority: 'low', status: 'resolved-demo', adminNotes: ['Resolved for prototype presentation.'] },
];

export const DEFAULT_ADMIN_SETTINGS: Readonly<AdminSettings> = {
  travelerServiceFeePercent: 5,
  guidePlatformFeePercent: 10,
  partnerCommissionPercent: 5,
  cancellationCopy: 'Prototype cancellation terms are shown before booking confirmation.',
  supportContact: 'support@friendlocaltrip.com',
  matchingWeightPreview: 'Destination 35 · Languages 30 · Preferences 25 · Quality 10',
};

export function updateAdminGuideApplication(
  source: readonly AdminGuideApplication[], id: string, status: GuideApplicationStatus, note = '',
): { applications: AdminGuideApplication[]; error?: string } {
  if (status === 'needs-changes' && !note.trim()) {
    return { applications: source.map((application) => ({ ...application, adminNotes: [...application.adminNotes] })), error: 'Add a short Admin note before requesting changes.' };
  }
  return { applications: source.map((application) => application.id === id ? { ...application, status, adminNotes: note.trim() ? [...application.adminNotes, note.trim()] : [...application.adminNotes] } : { ...application, adminNotes: [...application.adminNotes] }) };
}

export function updateAdminPartnerStatus(source: readonly AdminPartner[], id: string, update: Partial<Pick<AdminPartner, 'verificationStatus' | 'accountStatus'>>): AdminPartner[] {
  return source.map((partner) => partner.id === id ? { ...partner, ...update } : { ...partner });
}

export function filterAdminRequests(source: readonly AdminRequest[], filter: 'all' | 'needs-matching' | 'matched' | 'closed'): AdminRequest[] {
  const accepted: Record<typeof filter, AdminRequestStatus[]> = { all: ['submitted', 'matching', 'matched', 'guide-selected', 'expired', 'cancelled'], 'needs-matching': ['submitted', 'matching'], matched: ['matched', 'guide-selected'], closed: ['expired', 'cancelled'] };
  return source.filter((request) => accepted[filter].includes(request.status)).map((request) => ({ ...request, languages: [...request.languages], experiencePreferences: [...request.experiencePreferences] }));
}

export function filterAdminBookings(source: readonly AdminBooking[], filter: 'all' | 'upcoming' | 'completed' | 'cancelled' | 'flagged-demo'): AdminBooking[] {
  return source.filter((booking) => filter === 'all' || (filter === 'upcoming' ? booking.status === 'confirmed' : filter === 'flagged-demo' ? booking.flagged : booking.status === filter)).map((booking) => ({ ...booking }));
}

export function updateAdminReportStatus(source: readonly AdminReport[], id: string, status: AdminReport['status'], note = ''): AdminReport[] {
  return source.map((report) => report.id === id ? { ...report, status, adminNotes: note.trim() ? [...report.adminNotes, note.trim()] : [...report.adminNotes] } : { ...report, adminNotes: [...report.adminNotes] });
}

export function findAdminEntity<T extends { id: string }>(source: readonly T[], id: string): T | undefined {
  return source.find((entity) => entity.id === id);
}

export function resetAdminSettings(): AdminSettings {
  return { ...DEFAULT_ADMIN_SETTINGS };
}

export function createAdminRequestMatchPreview(request: AdminRequest) {
  return matchGuides(request, MOCK_GUIDES).map((result) => ({ guideId: result.guide.id, score: result.matchScore, reasons: [...result.matchReasons] }));
}

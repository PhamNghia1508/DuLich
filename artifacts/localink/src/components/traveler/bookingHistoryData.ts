import { MOCK_GUIDES } from '../home/mockGuideData.ts';
import {
  calculatePrototypePrice,
  formatPrototypeMoney,
  prototypePaymentLabel,
} from './bookingPrototype.ts';
import type {
  PrototypeBooking,
  PrototypeDurationHours,
  PrototypePaymentMethod,
  PrototypePriceBreakdown,
} from './bookingPrototype.ts';

export type PrototypeBookingStatus =
  | 'confirmed'
  | 'completed'
  | 'cancelled';

export interface PrototypeHistoryBooking {
  id: string;
  guideId: string;
  guideName: string;
  guidePortrait: string;
  guideCity: string;
  bookingDate: string;
  startTime: string;
  durationHours: PrototypeDurationHours;
  meetingPoint: string;
  experiencePreference: string;
  groupSize: number;
  price: PrototypePriceBreakdown;
  paymentMethod: PrototypePaymentMethod;
  status: PrototypeBookingStatus;
  contactName: string;
  contactEmail: string;
}

interface SeedSpec {
  guideId: string;
  date: string;
  time: string;
  duration: PrototypeDurationHours;
  meetingPoint: string;
  experience: string;
  groupSize: number;
  payment: PrototypePaymentMethod;
  status: PrototypeBookingStatus;
}

const SEED_SPECS: SeedSpec[] = [
  {
    guideId: 'guide-001',
    date: '2026-06-15',
    time: '09:00',
    duration: 4,
    meetingPoint: 'Ben Thanh Market entrance',
    experience: 'Food & Culture',
    groupSize: 2,
    payment: 'card-demo',
    status: 'completed',
  },
  {
    guideId: 'guide-003',
    date: '2026-06-22',
    time: '14:00',
    duration: 3,
    meetingPoint: 'Saigon Central Post Office',
    experience: 'History',
    groupSize: 1,
    payment: 'paypal-demo',
    status: 'completed',
  },
  {
    guideId: 'guide-005',
    date: '2026-07-01',
    time: '08:00',
    duration: 6,
    meetingPoint: 'Cu Chi Tunnels ticket booth',
    experience: 'History',
    groupSize: 3,
    payment: 'card-demo',
    status: 'completed',
  },
  {
    guideId: 'guide-002',
    date: '2026-07-10',
    time: '10:00',
    duration: 3,
    meetingPoint: 'Independence Palace gate',
    experience: 'History',
    groupSize: 2,
    payment: 'pay-later-demo',
    status: 'cancelled',
  },
  {
    guideId: 'guide-004',
    date: '2026-07-25',
    time: '18:00',
    duration: 4,
    meetingPoint: 'Bui Vien Walking Street',
    experience: 'Nightlife',
    groupSize: 4,
    payment: 'card-demo',
    status: 'confirmed',
  },
  {
    guideId: 'prototype-guide-010',
    date: '2026-08-02',
    time: '09:30',
    duration: 4,
    meetingPoint: 'Hoan Kiem Lake north gate',
    experience: 'Food & Culture',
    groupSize: 2,
    payment: 'paypal-demo',
    status: 'confirmed',
  },
];

function buildBookingId(guideId: string, date: string): string {
  const guideToken = guideId.replace(/[^a-z0-9]/gi, '').toUpperCase();
  const dateToken = date.replace(/[^0-9]/g, '');
  return `FLT-${guideToken}-${dateToken}`;
}

function buildHistoryBooking(spec: SeedSpec): PrototypeHistoryBooking | undefined {
  const guide = MOCK_GUIDES.find((g) => g.id === spec.guideId);
  if (!guide) return undefined;

  const price = calculatePrototypePrice(
    guide.hourlyRate ?? 0,
    spec.duration,
    guide.currency ?? 'USD',
  );

  return {
    id: buildBookingId(spec.guideId, spec.date),
    guideId: guide.id,
    guideName: guide.name,
    guidePortrait: guide.image,
    guideCity: guide.city,
    bookingDate: spec.date,
    startTime: spec.time,
    durationHours: spec.duration,
    meetingPoint: spec.meetingPoint,
    experiencePreference: spec.experience,
    groupSize: spec.groupSize,
    price,
    paymentMethod: spec.payment,
    status: spec.status,
    contactName: 'Alex T.',
    contactEmail: 'alex.traveler@demo.localink',
  };
}

export const SEEDED_BOOKING_HISTORY: readonly PrototypeHistoryBooking[] =
  SEED_SPECS.map(buildHistoryBooking).filter(
    (b): b is PrototypeHistoryBooking => b !== undefined,
  );

export function mergePrototypeBookingHistory(
  seeded: readonly PrototypeHistoryBooking[],
  live: PrototypeBooking | null,
): PrototypeHistoryBooking[] {
  const merged = [...seeded];

  if (live) {
    const exists = merged.some((b) => b.id === live.id);
    if (!exists) {
      const guide = MOCK_GUIDES.find((g) => g.id === live.guideId);
      if (guide) {
        merged.push({
          id: live.id,
          guideId: live.guideId,
          guideName: guide.name,
          guidePortrait: guide.image,
          guideCity: guide.city,
          bookingDate: live.bookingDate,
          startTime: live.startTime,
          durationHours: live.durationHours,
          meetingPoint: live.meetingPoint,
          experiencePreference: live.experiencePreference,
          groupSize: live.groupSize,
          price: { ...live.price },
          paymentMethod: live.paymentMethod,
          status: 'confirmed',
          contactName: live.contactName,
          contactEmail: live.contactEmail,
        });
      }
    }
  }

  merged.sort((a, b) => (b.bookingDate > a.bookingDate ? 1 : -1));
  return merged;
}

export function findBookingById(
  history: readonly PrototypeHistoryBooking[],
  bookingId: string,
): PrototypeHistoryBooking | undefined {
  return history.find((b) => b.id === bookingId);
}

export function canOpenPrototypeChat(status: PrototypeBookingStatus): boolean {
  return status === 'confirmed' || status === 'completed';
}

export function canSubmitPrototypeReview(status: PrototypeBookingStatus): boolean {
  return status === 'completed';
}

export function bookingStatusLabel(status: PrototypeBookingStatus): string {
  if (status === 'confirmed') return 'Confirmed';
  if (status === 'completed') return 'Completed';
  return 'Cancelled';
}

export function bookingStatusColor(status: PrototypeBookingStatus): string {
  if (status === 'confirmed') return 'var(--color-accent, #2563eb)';
  if (status === 'completed') return 'var(--color-success, #16a34a)';
  return 'var(--color-muted, #9ca3af)';
}

export function formatBookingDate(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export { formatPrototypeMoney, prototypePaymentLabel };

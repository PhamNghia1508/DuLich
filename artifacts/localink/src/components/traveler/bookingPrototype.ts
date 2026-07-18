import type { RequestGuideDraft } from '../home/requestGuideValidation.ts';
import type { PrototypeGuideProfile } from './guideProfileData.ts';

export const PROTOTYPE_DURATION_OPTIONS = [2, 3, 4, 6, 8] as const;

export type PrototypeDurationHours = typeof PROTOTYPE_DURATION_OPTIONS[number];
export type PrototypePaymentMethod = 'card-demo' | 'paypal-demo' | 'pay-later-demo';

export interface PrototypePriceBreakdown {
  hourlyRate: number;
  durationHours: number;
  subtotal: number;
  serviceFee: number;
  total: number;
  currency: string;
}

export interface PrototypeBookingDraft {
  guideId: string;
  bookingDate: string;
  startTime: string;
  durationHours: PrototypeDurationHours;
  meetingPoint: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  experiencePreference: string;
  notes: string;
  groupSize: number;
  price: PrototypePriceBreakdown;
}

export interface PrototypeBooking extends PrototypeBookingDraft {
  id: string;
  requestDraft?: RequestGuideDraft;
  paymentMethod: PrototypePaymentMethod;
  status: 'confirmed';
}

export type PrototypeBookingErrors = Partial<Record<
  | 'bookingDate'
  | 'startTime'
  | 'durationHours'
  | 'meetingPoint'
  | 'contactName'
  | 'contactEmail'
  | 'experiencePreference'
  | 'groupSize',
  string
>>;

export type PrototypePaymentErrors = Partial<Record<
  'paymentMethod' | 'acknowledgment',
  string
>>;

function roundCurrency(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function formatPrototypeMoney(value: number, currency: string) {
  const hasCents = Number.isFinite(value) && Math.abs(value % 1) > Number.EPSILON;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(value) ? value : 0);
}

function isSupportedDuration(value: number): value is PrototypeDurationHours {
  return PROTOTYPE_DURATION_OPTIONS.some((duration) => duration === value);
}

export function calculatePrototypePrice(
  hourlyRate: number,
  durationHours: number,
  currency: string,
): PrototypePriceBreakdown {
  if (
    !Number.isFinite(hourlyRate) || hourlyRate <= 0 ||
    !Number.isFinite(durationHours) || !isSupportedDuration(durationHours)
  ) {
    return {
      hourlyRate: 0,
      durationHours: 0,
      subtotal: 0,
      serviceFee: 0,
      total: 0,
      currency,
    };
  }

  const subtotal = roundCurrency(hourlyRate * durationHours);
  const serviceFee = roundCurrency(subtotal * 0.05);

  return {
    hourlyRate,
    durationHours,
    subtotal,
    serviceFee,
    total: roundCurrency(subtotal + serviceFee),
    currency,
  };
}

export function isBookingDateWithinRequest(
  bookingDate: string,
  request: RequestGuideDraft | null,
) {
  if (!bookingDate) return false;
  if (!request) return true;
  return bookingDate >= request.startDate && bookingDate <= request.endDate;
}

export function isGuideAvailableOnDate(
  guide: PrototypeGuideProfile,
  bookingDate: string,
) {
  if (!bookingDate) return false;
  return guide.availability.find((day) => day.date === bookingDate)?.available ?? true;
}

function firstSupportedRequestExperience(
  guide: PrototypeGuideProfile,
  request: RequestGuideDraft | null,
) {
  return request?.experiencePreferences.find((preference) =>
    guide.experiences.includes(preference),
  ) ?? guide.experiences[0] ?? '';
}

export function createInitialBookingDraft(
  guide: PrototypeGuideProfile | undefined,
  request: RequestGuideDraft | null,
): PrototypeBookingDraft | undefined {
  if (!guide) return undefined;
  const durationHours: PrototypeDurationHours = 3;

  return {
    guideId: guide.id,
    bookingDate: request?.startDate ?? '',
    startTime: '09:00',
    durationHours,
    meetingPoint: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    experiencePreference: firstSupportedRequestExperience(guide, request),
    notes: request?.additionalInformation ?? '',
    groupSize: request?.groupSize ?? 1,
    price: calculatePrototypePrice(guide.hourlyRate ?? 0, durationHours, guide.currency ?? 'USD'),
  };
}

export function normalizePrototypeBookingDraft(
  draft: PrototypeBookingDraft,
  guide: PrototypeGuideProfile,
): PrototypeBookingDraft {
  return {
    ...draft,
    guideId: guide.id,
    bookingDate: draft.bookingDate.trim(),
    startTime: draft.startTime.trim(),
    meetingPoint: draft.meetingPoint.trim(),
    contactName: draft.contactName.trim(),
    contactEmail: draft.contactEmail.trim(),
    contactPhone: draft.contactPhone.trim(),
    experiencePreference: draft.experiencePreference.trim(),
    notes: draft.notes.trim(),
    price: calculatePrototypePrice(
      guide.hourlyRate ?? 0,
      draft.durationHours,
      guide.currency ?? 'USD',
    ),
  };
}

export function validatePrototypeBookingDraft(
  draft: PrototypeBookingDraft,
  guide: PrototypeGuideProfile,
  request: RequestGuideDraft | null,
): PrototypeBookingErrors {
  const errors: PrototypeBookingErrors = {};

  if (!draft.bookingDate) {
    errors.bookingDate = 'Choose a booking date.';
  } else if (!isBookingDateWithinRequest(draft.bookingDate, request)) {
    errors.bookingDate = 'Choose a date within your requested trip dates.';
  } else if (!isGuideAvailableOnDate(guide, draft.bookingDate)) {
    errors.bookingDate = `${guide.name} is unavailable on this date.`;
  }
  if (!draft.startTime) errors.startTime = 'Choose a start time.';
  if (!isSupportedDuration(draft.durationHours)) errors.durationHours = 'Choose a supported duration.';
  if (!draft.meetingPoint.trim()) errors.meetingPoint = 'Enter a meeting point or hotel.';
  if (!draft.contactName.trim()) errors.contactName = 'Enter a contact name.';
  if (!/^\S+@\S+\.\S+$/.test(draft.contactEmail.trim())) {
    errors.contactEmail = 'Enter a valid contact email.';
  }
  if (!guide.experiences.includes(draft.experiencePreference)) {
    errors.experiencePreference = 'Choose one supported experience.';
  }
  if (!Number.isFinite(draft.groupSize) || draft.groupSize <= 0) {
    errors.groupSize = 'Group size must be greater than 0.';
  }

  return errors;
}

export function validatePrototypePayment(
  paymentMethod: PrototypePaymentMethod | null,
  acknowledgment: boolean,
): PrototypePaymentErrors {
  return {
    ...(!paymentMethod ? { paymentMethod: 'Choose a demo payment method.' } : {}),
    ...(!acknowledgment ? {
      acknowledgment: 'Confirm that you understand no real payment is processed.',
    } : {}),
  };
}

function cloneRequest(request: RequestGuideDraft): RequestGuideDraft {
  return {
    ...request,
    languages: [...request.languages],
    experiencePreferences: [...request.experiencePreferences],
  };
}

export function createPrototypeBooking(
  draft: PrototypeBookingDraft,
  paymentMethod: PrototypePaymentMethod,
  request: RequestGuideDraft | null,
): PrototypeBooking {
  const guideToken = draft.guideId.replace(/[^a-z0-9]/gi, '').toUpperCase();
  const dateToken = draft.bookingDate.replace(/[^0-9]/g, '');

  return {
    ...draft,
    price: { ...draft.price },
    id: `FLT-${guideToken}-${dateToken}`,
    ...(request ? { requestDraft: cloneRequest(request) } : {}),
    paymentMethod,
    status: 'confirmed',
  };
}

export function prototypePaymentLabel(method: PrototypePaymentMethod) {
  if (method === 'card-demo') return 'Card — Demo';
  if (method === 'paypal-demo') return 'PayPal — Demo';
  return 'Pay at meeting — Prototype';
}

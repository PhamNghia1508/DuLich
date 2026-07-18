import assert from 'node:assert/strict';
import test from 'node:test';

import type { RequestGuideDraft } from '../home/requestGuideValidation.ts';
import { getPrototypeGuideProfile } from './guideProfileData.ts';
import {
  calculatePrototypePrice,
  createInitialBookingDraft,
  createPrototypeBooking,
  formatPrototypeMoney,
  isBookingDateWithinRequest,
  isGuideAvailableOnDate,
  normalizePrototypeBookingDraft,
  validatePrototypeBookingDraft,
  validatePrototypePayment,
} from './bookingPrototype.ts';

const guide = getPrototypeGuideProfile('guide-001')!;
const request: RequestGuideDraft = {
  destination: 'Ho Chi Minh City',
  languages: ['en'],
  groupSize: 2,
  startDate: '2026-08-10',
  endDate: '2026-08-12',
  experiencePreferences: ['Food & Culture', 'Local Life'],
  additionalInformation: 'A relaxed pace, please.',
};

test('calculates deterministic prices for every supported duration', () => {
  for (const duration of [2, 3, 4, 6, 8] as const) {
    const price = calculatePrototypePrice(18, duration, 'USD');
    assert.equal(price.subtotal, 18 * duration);
    assert.equal(price.serviceFee, 18 * duration * 0.05);
    assert.equal(price.total, Math.round(18 * duration * 1.05 * 100) / 100);
    assert.equal(price.currency, 'USD');
  }
});

test('invalid numeric pricing inputs never produce NaN or negative totals', () => {
  for (const [rate, duration] of [[Number.NaN, 3], [-10, 3], [18, Number.NaN], [18, -2], [18, 5]]) {
    const price = calculatePrototypePrice(rate, duration, 'USD');
    assert.deepEqual(price, {
      hourlyRate: 0,
      durationHours: 0,
      subtotal: 0,
      serviceFee: 0,
      total: 0,
      currency: 'USD',
    });
  }
});

test('formats fractional prototype prices without hiding cents', () => {
  assert.equal(formatPrototypeMoney(18, 'USD'), '$18');
  assert.equal(formatPrototypeMoney(2.7, 'USD'), '$2.70');
  assert.equal(formatPrototypeMoney(56.7, 'USD'), '$56.70');
});

test('checks booking dates inclusively against the request range', () => {
  assert.equal(isBookingDateWithinRequest('2026-08-10', request), true);
  assert.equal(isBookingDateWithinRequest('2026-08-12', request), true);
  assert.equal(isBookingDateWithinRequest('2026-08-09', request), false);
  assert.equal(isBookingDateWithinRequest('2026-08-13', request), false);
  assert.equal(isBookingDateWithinRequest('2026-08-20', null), true);
});

test('detects deterministic unavailable guide dates', () => {
  const unavailable = guide.availability.find((day) => !day.available)!;
  const available = guide.availability.find((day) => day.available)!;

  assert.equal(isGuideAvailableOnDate(guide, unavailable.date), false);
  assert.equal(isGuideAvailableOnDate(guide, available.date), true);
  assert.equal(isGuideAvailableOnDate(guide, '2026-09-01'), true);
});

test('normalizes a request-prefilled booking draft and recalculates price', () => {
  const initial = createInitialBookingDraft(guide, request);
  assert.ok(initial);
  assert.equal(initial.bookingDate, request.startDate);
  assert.equal(initial.groupSize, 2);
  assert.equal(initial.experiencePreference, 'Food & Culture');

  const normalized = normalizePrototypeBookingDraft({
    ...initial,
    meetingPoint: '  Hotel lobby  ',
    contactName: '  Alex Morgan ',
    contactEmail: ' ALEX@EXAMPLE.COM ',
    durationHours: 4,
    price: { ...initial.price, total: 9999 },
  }, guide);

  assert.equal(normalized.meetingPoint, 'Hotel lobby');
  assert.equal(normalized.contactName, 'Alex Morgan');
  assert.equal(normalized.contactEmail, 'ALEX@EXAMPLE.COM');
  assert.equal(normalized.price.total, 75.6);
  assert.equal(createInitialBookingDraft(undefined, request), undefined);
});

test('validates required booking fields, request range, and guide availability', () => {
  const initial = createInitialBookingDraft(guide, request)!;
  const unavailableDate = guide.availability.find((day) => !day.available)!.date;
  const invalid = {
    ...initial,
    bookingDate: unavailableDate,
    startTime: '',
    meetingPoint: '',
    contactName: '',
    contactEmail: 'not-an-email',
    experiencePreference: '',
  };

  const errors = validatePrototypeBookingDraft(invalid, guide, request);
  assert.ok(errors.bookingDate);
  assert.ok(errors.startTime);
  assert.ok(errors.meetingPoint);
  assert.ok(errors.contactName);
  assert.ok(errors.contactEmail);
  assert.ok(errors.experiencePreference);
});

test('payment validation requires a method and prototype acknowledgment', () => {
  assert.deepEqual(validatePrototypePayment(null, false), {
    paymentMethod: 'Choose a demo payment method.',
    acknowledgment: 'Confirm that you understand no real payment is processed.',
  });
  assert.deepEqual(validatePrototypePayment('card-demo', false), {
    acknowledgment: 'Confirm that you understand no real payment is processed.',
  });
  assert.deepEqual(validatePrototypePayment('paypal-demo', true), {});
});

test('creates an immutable confirmed booking with a deterministic reference', () => {
  const draft = normalizePrototypeBookingDraft({
    ...createInitialBookingDraft(guide, request)!,
    startTime: '09:30',
    meetingPoint: 'Hotel lobby',
    contactName: 'Alex Morgan',
    contactEmail: 'alex@example.com',
  }, guide);
  const snapshot = structuredClone(draft);

  const booking = createPrototypeBooking(draft, 'card-demo', request);

  assert.equal(booking.id, 'FLT-GUIDE001-20260810');
  assert.equal(booking.status, 'confirmed');
  assert.equal(booking.paymentMethod, 'card-demo');
  assert.deepEqual(draft, snapshot);
  assert.notEqual(booking.requestDraft, request);
});

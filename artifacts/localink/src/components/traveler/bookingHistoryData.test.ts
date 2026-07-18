import assert from 'node:assert/strict';
import test from 'node:test';

import {
  SEEDED_BOOKING_HISTORY,
  mergePrototypeBookingHistory,
  findBookingById,
  canOpenPrototypeChat,
  canSubmitPrototypeReview,
  bookingStatusLabel,
  formatBookingDate,
} from './bookingHistoryData.ts';
import type { PrototypeBooking } from './bookingPrototype.ts';
import {
  getSeededMessages,
  createChatMessage,
  createAutoReply,
  quickActionText,
  formatChatTime,
  QUICK_ACTIONS,
} from './chatPrototypeData.ts';
import {
  validatePrototypeReview,
  hasReviewErrors,
  createPrototypeReview,
} from './reviewPrototypeData.ts';

test('seeded booking history contains exactly 6 bookings', () => {
  assert.equal(SEEDED_BOOKING_HISTORY.length, 6);
});

test('seeded bookings have deterministic IDs matching FLT-{GUIDE}-{DATE} pattern', () => {
  for (const booking of SEEDED_BOOKING_HISTORY) {
    assert.match(booking.id, /^FLT-[A-Z0-9]+-\d+$/);
  }
});

test('seeded bookings include completed, confirmed, and cancelled statuses', () => {
  const statuses = new Set(SEEDED_BOOKING_HISTORY.map((b) => b.status));
  assert.ok(statuses.has('completed'));
  assert.ok(statuses.has('confirmed'));
  assert.ok(statuses.has('cancelled'));
});

test('seeded bookings are sorted by date descending after merge', () => {
  const merged = mergePrototypeBookingHistory(SEEDED_BOOKING_HISTORY, null);
  for (let i = 1; i < merged.length; i++) {
    assert.ok(merged[i - 1].bookingDate >= merged[i].bookingDate);
  }
});

test('merging with a live confirmed booking adds it to the history', () => {
  const liveBooking: PrototypeBooking = {
    id: 'FLT-GUIDE007-20260810',
    guideId: 'guide-007',
    bookingDate: '2026-08-10',
    startTime: '10:00',
    durationHours: 3,
    meetingPoint: 'Test point',
    contactName: 'Test',
    contactEmail: 'test@demo.localink',
    contactPhone: '',
    experiencePreference: 'History',
    notes: '',
    groupSize: 1,
    price: { hourlyRate: 18, durationHours: 3, subtotal: 54, serviceFee: 2.70, total: 56.70, currency: 'USD' },
    paymentMethod: 'card-demo',
    status: 'confirmed',
  };

  const merged = mergePrototypeBookingHistory(SEEDED_BOOKING_HISTORY, liveBooking);
  assert.equal(merged.length, SEEDED_BOOKING_HISTORY.length + 1);
  assert.ok(merged.some((b) => b.id === 'FLT-GUIDE007-20260810'));
});

test('merging with a duplicate live booking does not add it twice', () => {
  const existingId = SEEDED_BOOKING_HISTORY[0].id;
  const duplicate: PrototypeBooking = {
    id: existingId,
    guideId: SEEDED_BOOKING_HISTORY[0].guideId,
    bookingDate: SEEDED_BOOKING_HISTORY[0].bookingDate,
    startTime: SEEDED_BOOKING_HISTORY[0].startTime,
    durationHours: SEEDED_BOOKING_HISTORY[0].durationHours,
    meetingPoint: SEEDED_BOOKING_HISTORY[0].meetingPoint,
    contactName: 'Alex T.',
    contactEmail: 'alex@demo.localink',
    contactPhone: '',
    experiencePreference: SEEDED_BOOKING_HISTORY[0].experiencePreference,
    notes: '',
    groupSize: SEEDED_BOOKING_HISTORY[0].groupSize,
    price: { ...SEEDED_BOOKING_HISTORY[0].price },
    paymentMethod: SEEDED_BOOKING_HISTORY[0].paymentMethod,
    status: 'confirmed',
  };

  const merged = mergePrototypeBookingHistory(SEEDED_BOOKING_HISTORY, duplicate);
  assert.equal(merged.length, SEEDED_BOOKING_HISTORY.length);
});

test('findBookingById returns the correct booking or undefined', () => {
  const first = SEEDED_BOOKING_HISTORY[0];
  assert.equal(findBookingById(SEEDED_BOOKING_HISTORY, first.id)?.id, first.id);
  assert.equal(findBookingById(SEEDED_BOOKING_HISTORY, 'nonexistent'), undefined);
});

test('canOpenPrototypeChat returns true for confirmed and completed, false for cancelled', () => {
  assert.equal(canOpenPrototypeChat('confirmed'), true);
  assert.equal(canOpenPrototypeChat('completed'), true);
  assert.equal(canOpenPrototypeChat('cancelled'), false);
});

test('canSubmitPrototypeReview returns true only for completed bookings', () => {
  assert.equal(canSubmitPrototypeReview('completed'), true);
  assert.equal(canSubmitPrototypeReview('confirmed'), false);
  assert.equal(canSubmitPrototypeReview('cancelled'), false);
});

test('bookingStatusLabel returns human-readable labels', () => {
  assert.equal(bookingStatusLabel('confirmed'), 'Confirmed');
  assert.equal(bookingStatusLabel('completed'), 'Completed');
  assert.equal(bookingStatusLabel('cancelled'), 'Cancelled');
});

test('formatBookingDate produces a readable date string', () => {
  const formatted = formatBookingDate('2026-07-25');
  assert.ok(formatted.includes('Jul'));
  assert.ok(formatted.includes('25'));
  assert.ok(formatted.includes('2026'));
});

test('seeded chat messages exist for completed bookings with guide-001', () => {
  const booking = SEEDED_BOOKING_HISTORY.find((b) => b.guideId === 'guide-001');
  assert.ok(booking);
  const messages = getSeededMessages(booking.id, booking.bookingDate);
  assert.ok(messages.length > 0);
  assert.ok(messages.every((m) => m.bookingId === booking.id));
});

test('seeded chat messages have deterministic IDs', () => {
  const booking = SEEDED_BOOKING_HISTORY.find((b) => b.guideId === 'guide-001')!;
  const first = getSeededMessages(booking.id, booking.bookingDate);
  const second = getSeededMessages(booking.id, booking.bookingDate);
  assert.deepEqual(first, second);
});

test('createChatMessage generates unique IDs', () => {
  const msg1 = createChatMessage('test-booking', 'traveler', 'Hello');
  const msg2 = createChatMessage('test-booking', 'traveler', 'Hello again');
  assert.notEqual(msg1.id, msg2.id);
  assert.equal(msg1.sender, 'traveler');
  assert.equal(msg1.text, 'Hello');
});

test('createAutoReply generates a guide-sender message', () => {
  const reply = createAutoReply('test-booking', 'Linh', 'Tell me about the meeting point');
  assert.equal(reply.sender, 'guide');
  assert.ok(reply.text.length > 0);
});

test('all quick actions produce non-empty template text', () => {
  for (const action of QUICK_ACTIONS) {
    const text = quickActionText(action.key);
    assert.ok(text.length > 10, `empty text for ${action.key}`);
  }
});

test('formatChatTime produces a readable time string', () => {
  const formatted = formatChatTime('2026-07-25T14:30:00.000Z');
  assert.ok(formatted.length > 0);
});

test('validatePrototypeReview rejects missing rating and short comment', () => {
  const errors = validatePrototypeReview({ rating: 0, comment: '' });
  assert.ok(errors.rating);
  assert.ok(errors.comment);
  assert.equal(hasReviewErrors(errors), true);
});

test('validatePrototypeReview rejects comment shorter than 10 characters', () => {
  const errors = validatePrototypeReview({ rating: 4, comment: 'Good' });
  assert.ok(errors.comment);
  assert.equal(errors.rating, undefined);
});

test('validatePrototypeReview accepts valid rating and comment', () => {
  const errors = validatePrototypeReview({ rating: 5, comment: 'Fantastic local experience!' });
  assert.equal(hasReviewErrors(errors), false);
});

test('createPrototypeReview produces a complete review object', () => {
  const review = createPrototypeReview('booking-1', 'guide-001', {
    rating: 5,
    comment: 'An unforgettable local walking tour.',
  });
  assert.equal(review.bookingId, 'booking-1');
  assert.equal(review.guideId, 'guide-001');
  assert.equal(review.rating, 5);
  assert.ok(review.id.startsWith('review-'));
  assert.ok(review.submittedAt.length > 0);
});

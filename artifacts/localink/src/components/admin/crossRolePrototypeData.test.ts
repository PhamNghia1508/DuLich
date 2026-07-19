import assert from 'node:assert/strict';
import test from 'node:test';

import { MOCK_GUIDES } from '../home/mockGuideData.ts';
import { DEMO_GUIDE_PROFILE } from '../local-guide/localGuideDashboardData.ts';
import { SEEDED_BOOKING_HISTORY } from '../traveler/bookingHistoryData.ts';
import { ADMIN_BOOKINGS } from './adminPrototypeData.ts';

test('shared Linh profile fields remain consistent across Traveler and Local Guide', () => {
  const travelerGuide = MOCK_GUIDES.find((guide) => guide.id === DEMO_GUIDE_PROFILE.guideId);
  assert.ok(travelerGuide);
  assert.equal(DEMO_GUIDE_PROFILE.displayName, travelerGuide.name);
  assert.equal(DEMO_GUIDE_PROFILE.city, travelerGuide.city);
  assert.equal(DEMO_GUIDE_PROFILE.hourlyRate, travelerGuide.hourlyRate);
  assert.equal(DEMO_GUIDE_PROFILE.currency, travelerGuide.currency);
  assert.equal(DEMO_GUIDE_PROFILE.rating, travelerGuide.rating);
  assert.equal(DEMO_GUIDE_PROFILE.reviewCount, travelerGuide.reviewCount);
});

test('bookings with the same ID present the same core record in Traveler and Admin', () => {
  const shared = ADMIN_BOOKINGS
    .map((adminBooking) => ({
      adminBooking,
      travelerBooking: SEEDED_BOOKING_HISTORY.find((booking) => booking.id === adminBooking.id),
    }))
    .filter((entry) => entry.travelerBooking !== undefined);

  assert.ok(shared.length > 0);
  for (const { adminBooking, travelerBooking } of shared) {
    assert.ok(travelerBooking);
    assert.deepEqual(
      {
        travelerName: adminBooking.travelerName,
        guideName: adminBooking.guideName,
        date: adminBooking.date,
        subtotal: adminBooking.subtotal,
        travelerServiceFee: adminBooking.travelerServiceFee,
        total: adminBooking.total,
        status: adminBooking.status,
        currency: adminBooking.currency,
      },
      {
        travelerName: travelerBooking.contactName,
        guideName: travelerBooking.guideName,
        date: travelerBooking.bookingDate,
        subtotal: travelerBooking.price.subtotal,
        travelerServiceFee: travelerBooking.price.serviceFee,
        total: travelerBooking.price.total,
        status: travelerBooking.status,
        currency: travelerBooking.price.currency,
      },
      adminBooking.id,
    );
  }
});

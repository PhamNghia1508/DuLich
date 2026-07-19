import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  DEMO_PARTNER,
  PARTNER_CAMPAIGNS,
  PARTNER_REFERRED_BOOKINGS,
  calculatePartnerCommission,
  createPartnerReportSummary,
  deduplicateReferredBookings,
  filterPartnerBookings,
  normalizeReferralUrl,
  summarizePartnerCommissions,
} from './partnerPrototypeData.ts';

describe('Partner deterministic prototype data', () => {
  it('keeps the seeded partner and referral campaigns stable', () => {
    assert.equal(DEMO_PARTNER.id, 'partner-saigon-riverside');
    assert.equal(DEMO_PARTNER.referralCode, 'saigon-riverside-demo');
    assert.deepEqual(PARTNER_CAMPAIGNS.map((campaign) => campaign.id), [
      'front-desk', 'guest-room', 'instagram', 'concierge',
    ]);
  });

  it('filters referred bookings without mutating the source', () => {
    const before = structuredClone(PARTNER_REFERRED_BOOKINGS);
    const completed = filterPartnerBookings(PARTNER_REFERRED_BOOKINGS, 'completed');
    assert.equal(completed.length, 3);
    assert.ok(completed.every((booking) => booking.status === 'completed'));
    assert.deepEqual(PARTNER_REFERRED_BOOKINGS, before);
  });

  it('calculates exactly five percent for an eligible completed booking', () => {
    assert.equal(calculatePartnerCommission({ total: 100, status: 'completed', eligible: true }), 5);
  });

  it('creates no eligible commission for pending, confirmed, or cancelled bookings', () => {
    assert.equal(calculatePartnerCommission({ total: 100, status: 'pending', eligible: true }), 0);
    assert.equal(calculatePartnerCommission({ total: 100, status: 'confirmed', eligible: true }), 0);
    assert.equal(calculatePartnerCommission({ total: 100, status: 'cancelled', eligible: true }), 0);
  });

  it('creates no commission when a completed booking is ineligible', () => {
    assert.equal(calculatePartnerCommission({ total: 100, status: 'completed', eligible: false }), 0);
  });

  it('summarizes commissions without mutating the transactions', () => {
    const transactions = PARTNER_REFERRED_BOOKINGS.map((booking) => ({
      id: `COM-${booking.id}`,
      bookingId: booking.id,
      amount: calculatePartnerCommission(booking),
      status: booking.commissionStatus,
    }));
    const before = structuredClone(transactions);
    const summary = summarizePartnerCommissions(transactions);
    assert.ok(summary.available > 0);
    assert.ok(summary.lifetime >= summary.available);
    assert.deepEqual(transactions, before);
  });

  it('deduplicates booking records by stable booking id', () => {
    const duplicate = { ...PARTNER_REFERRED_BOOKINGS[0] };
    const result = deduplicateReferredBookings([...PARTNER_REFERRED_BOOKINGS, duplicate]);
    assert.equal(result.length, PARTNER_REFERRED_BOOKINGS.length);
    assert.notEqual(result[0], PARTNER_REFERRED_BOOKINGS[0]);
  });

  it('calculates deterministic report totals', () => {
    const report = createPartnerReportSummary(PARTNER_REFERRED_BOOKINGS, PARTNER_CAMPAIGNS);
    assert.equal(report.referredRequests, 8);
    assert.equal(report.completedBookings, 3);
    assert.equal(report.bestSource, 'Front Desk QR');
  });

  it('normalizes referral codes and demo URLs stably', () => {
    assert.equal(normalizeReferralUrl(' Saigon Riverside Demo '), 'friendlocaltrip.com/r/saigon-riverside-demo');
    assert.equal(normalizeReferralUrl('saigon---riverside-demo'), 'friendlocaltrip.com/r/saigon-riverside-demo');
  });

  it('uses the approved five percent commission rate', () => {
    assert.equal(DEMO_PARTNER.commissionRate, 0.05);
  });
});

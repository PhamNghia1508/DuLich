import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  ADMIN_BOOKINGS,
  ADMIN_GUIDE_APPLICATIONS,
  ADMIN_PARTNERS,
  ADMIN_REPORTS,
  ADMIN_REQUESTS,
  ADMIN_TRAVELERS,
  DEFAULT_ADMIN_SETTINGS,
  createAdminRequestMatchPreview,
  filterAdminBookings,
  filterAdminRequests,
  findAdminEntity,
  resetAdminSettings,
  updateAdminGuideApplication,
  updateAdminPartnerStatus,
  updateAdminReportStatus,
} from './adminPrototypeData.ts';
import { calculateAdminFinancialSummary } from './adminFinancialData.ts';

describe('Admin deterministic prototype data', () => {
  it('keeps seeded identifiers stable', () => {
    assert.deepEqual(ADMIN_TRAVELERS.map((traveler) => traveler.id), ['traveler-001', 'traveler-002', 'traveler-003', 'traveler-004', 'traveler-005']);
    assert.equal(ADMIN_GUIDE_APPLICATIONS[0].id, 'guide-app-001');
    assert.equal(ADMIN_PARTNERS[0].id, 'partner-saigon-riverside');
  });

  it('updates guide application status immutably', () => {
    const before = structuredClone(ADMIN_GUIDE_APPLICATIONS);
    const result = updateAdminGuideApplication(ADMIN_GUIDE_APPLICATIONS, 'guide-app-001', 'approved', 'Profile reviewed.');
    assert.equal(result.error, undefined);
    assert.equal(result.applications[0].status, 'approved');
    assert.deepEqual(ADMIN_GUIDE_APPLICATIONS, before);
  });

  it('requires an admin note when requesting changes', () => {
    const result = updateAdminGuideApplication(ADMIN_GUIDE_APPLICATIONS, 'guide-app-001', 'needs-changes', '   ');
    assert.equal(result.error, 'Add a short Admin note before requesting changes.');
    assert.equal(result.applications[0].status, ADMIN_GUIDE_APPLICATIONS[0].status);
  });

  it('keeps rejected applications recoverable in local state', () => {
    const rejected = updateAdminGuideApplication(ADMIN_GUIDE_APPLICATIONS, 'guide-app-001', 'rejected', 'Incomplete demo verification.');
    const recovered = updateAdminGuideApplication(rejected.applications, 'guide-app-001', 'needs-changes', 'Please update the verification checklist.');
    assert.equal(recovered.applications[0].status, 'needs-changes');
  });

  it('updates partner verification or account status immutably', () => {
    const before = structuredClone(ADMIN_PARTNERS);
    const result = updateAdminPartnerStatus(ADMIN_PARTNERS, 'partner-saigon-riverside', { accountStatus: 'suspended-demo' });
    assert.equal(result[0].accountStatus, 'suspended-demo');
    assert.deepEqual(ADMIN_PARTNERS, before);
  });

  it('filters requests into deterministic operational groups', () => {
    assert.ok(filterAdminRequests(ADMIN_REQUESTS, 'needs-matching').every((request) => ['submitted', 'matching'].includes(request.status)));
    assert.ok(filterAdminRequests(ADMIN_REQUESTS, 'closed').every((request) => ['expired', 'cancelled'].includes(request.status)));
  });

  it('keeps existing matching deterministic for Admin preview', () => {
    const first = createAdminRequestMatchPreview(ADMIN_REQUESTS[0]);
    const second = createAdminRequestMatchPreview(ADMIN_REQUESTS[0]);
    assert.deepEqual(first, second);
  });

  it('filters bookings without mutating source records', () => {
    const before = structuredClone(ADMIN_BOOKINGS);
    assert.ok(filterAdminBookings(ADMIN_BOOKINGS, 'completed').every((booking) => booking.status === 'completed'));
    assert.deepEqual(ADMIN_BOOKINGS, before);
  });

  it('updates report status immutably', () => {
    const result = updateAdminReportStatus(ADMIN_REPORTS, 'report-001', 'investigating', 'Reviewing booking messages.');
    assert.equal(result[0].status, 'investigating');
    assert.equal(ADMIN_REPORTS[0].status, 'open');
  });

  it('returns undefined for unknown entity lookups', () => {
    assert.equal(findAdminEntity(ADMIN_TRAVELERS, 'unknown'), undefined);
  });

  it('resets settings to a fresh deterministic copy', () => {
    const first = resetAdminSettings();
    first.supportContact = 'changed@example.com';
    const second = resetAdminSettings();
    assert.deepEqual(second, DEFAULT_ADMIN_SETTINGS);
    assert.notEqual(second, DEFAULT_ADMIN_SETTINGS);
  });
});

describe('Admin financial presentation', () => {
  it('keeps every financial component separate', () => {
    const summary = calculateAdminFinancialSummary(ADMIN_BOOKINGS);
    assert.ok(summary.grossBookingValue > 0);
    assert.ok(summary.travelerServiceFees > 0);
    assert.ok(summary.guidePlatformFees > 0);
    assert.ok(summary.partnerCommissionExpense > 0);
  });

  it('calculates platform revenue without adding gross booking value', () => {
    const summary = calculateAdminFinancialSummary(ADMIN_BOOKINGS);
    assert.equal(
      summary.prototypePlatformRevenue,
      Math.round((summary.travelerServiceFees + summary.guidePlatformFees - summary.partnerCommissionExpense) * 100) / 100,
    );
  });

  it('does not count partner commission on cancelled bookings', () => {
    const cancelledOnly = ADMIN_BOOKINGS.filter((booking) => booking.status === 'cancelled');
    assert.equal(calculateAdminFinancialSummary(cancelledOnly).partnerCommissionExpense, 0);
  });

  it('counts demo payment statuses deterministically', () => {
    const summary = calculateAdminFinancialSummary(ADMIN_BOOKINGS);
    assert.ok(summary.successfulPaymentCount > 0);
    assert.ok(summary.failedPaymentCount > 0);
  });
});

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  createDefaultRegistrationDraft,
  createDefaultWeeklyAvailability,
  createDefaultVerification,
  validateStep1,
  validateStep2,
  validateStep3,
  validateStep4,
  validateRegistrationStep,
  hasErrors,
  calculateGuideProfileCompleteness,
  normalizeApplication,
  REGISTRATION_STEPS,
  GUIDE_CITY_OPTIONS,
  GUIDE_AREA_OPTIONS,
  GUIDE_LANGUAGE_OPTIONS,
} from './localGuideRegistrationData.ts';

import {
  SEEDED_GUIDE_BOOKINGS,
  SEEDED_GUIDE_TRANSACTIONS,
  SEEDED_GUIDE_REVIEWS,
  SEEDED_GUIDE_CONVERSATIONS,
  DEMO_GUIDE_PROFILE,
  filterGuideBookings,
  acceptGuideBooking,
  declineGuideBooking,
  updateWeeklySchedule,
  createDefaultGuideAvailability,
  computeDashboardOverview,
  guideBookingStatusLabel,
  guideBookingStatusColor,
  transactionStatusLabel,
  formatGuideMoney,
} from './localGuideDashboardData.ts';

import {
  GUIDE_DASHBOARD_NAV_ITEMS,
  createDashboardMetricCards,
  createRegistrationReviewGroups,
  normalizeGuideTransactionsForCards,
  shouldShowSubmittedApplication,
} from './localGuidePresentation.ts';

describe('Registration data defaults', () => {
  it('createDefaultRegistrationDraft returns valid structure', () => {
    const draft = createDefaultRegistrationDraft();
    assert.equal(draft.status, 'draft');
    assert.equal(draft.fullName, '');
    assert.equal(draft.weeklyAvailability.schedule.length, 7);
  });

  it('createDefaultWeeklyAvailability has 7 days with Mon-Fri available', () => {
    const avail = createDefaultWeeklyAvailability();
    assert.equal(avail.schedule.length, 7);
    assert.equal(avail.schedule[0].available, true);
    assert.equal(avail.schedule[5].available, false);
  });

  it('createDefaultVerification starts all at not-started/false', () => {
    const v = createDefaultVerification();
    assert.equal(v.identityDocument, 'not-started');
    assert.equal(v.termsAccepted, false);
    assert.equal(v.payoutSetup, 'not-started');
  });
});

describe('Registration validation', () => {
  it('validateStep1 catches empty required fields', () => {
    const draft = createDefaultRegistrationDraft();
    const errors = validateStep1(draft);
    assert.ok(errors.fullName);
    assert.ok(errors.email);
    assert.ok(errors.city);
    assert.ok(errors.languages);
  });

  it('validateStep1 passes with valid data', () => {
    const draft = createDefaultRegistrationDraft();
    draft.fullName = 'Test User';
    draft.displayName = 'Test U.';
    draft.email = 'test@example.com';
    draft.city = 'Ho Chi Minh City';
    draft.operatingAreas = ['District 1'];
    draft.languages = ['English'];
    draft.experienceYears = 2;
    const errors = validateStep1(draft);
    assert.equal(hasErrors(errors), false);
  });

  it('validateStep2 catches missing profile photo and tagline', () => {
    const draft = createDefaultRegistrationDraft();
    const errors = validateStep2(draft);
    assert.ok(errors.selectedProfileImage);
    assert.ok(errors.tagline);
    assert.ok(errors.bio);
    assert.ok(errors.specialties);
  });

  it('validateStep3 catches no available days', () => {
    const draft = createDefaultRegistrationDraft();
    draft.weeklyAvailability.schedule = draft.weeklyAvailability.schedule.map((d) => ({ ...d, available: false }));
    const errors = validateStep3(draft);
    assert.ok(errors.availability);
  });

  it('validateStep3 catches end time before start time', () => {
    const draft = createDefaultRegistrationDraft();
    draft.weeklyAvailability.schedule[0] = { ...draft.weeklyAvailability.schedule[0], startTime: '17:00', endTime: '08:00' };
    const errors = validateStep3(draft);
    assert.ok(errors['time_Monday']);
  });

  it('validateStep4 requires terms accepted', () => {
    const draft = createDefaultRegistrationDraft();
    const errors = validateStep4(draft);
    assert.ok(errors.termsAccepted);
  });

  it('validateRegistrationStep dispatches to correct validator', () => {
    const draft = createDefaultRegistrationDraft();
    const e1 = validateRegistrationStep(1, draft);
    assert.ok(e1.fullName);
    const e4 = validateRegistrationStep(4, draft);
    assert.ok(e4.termsAccepted);
  });

  it('hasErrors returns false for empty object', () => {
    assert.equal(hasErrors({}), false);
  });
});

describe('Profile completeness', () => {
  it('empty draft has 0% or very low completeness', () => {
    const draft = createDefaultRegistrationDraft();
    const result = calculateGuideProfileCompleteness(draft);
    assert.ok(result.percentage < 20);
    assert.ok(result.missing.length > 10);
  });

  it('full draft achieves 100%', () => {
    const draft = createDefaultRegistrationDraft();
    draft.fullName = 'A';
    draft.displayName = 'B';
    draft.email = 'a@b.c';
    draft.city = 'Hanoi';
    draft.operatingAreas = ['Old Quarter'];
    draft.languages = ['English'];
    draft.selectedProfileImage = '/images/guides/linh.webp';
    draft.tagline = 'hi';
    draft.bio = 'hello';
    draft.specialties = ['Street food expert'];
    draft.guideStyles = ['Relaxed & flexible'];
    draft.experienceTypes = ['Food & Culture'];
    draft.hourlyRate = 10;
    draft.maxGroupSize = 4;
    draft.verification.termsAccepted = true;
    const result = calculateGuideProfileCompleteness(draft);
    assert.equal(result.percentage, 100);
    assert.equal(result.missing.length, 0);
  });
});

describe('normalizeApplication', () => {
  it('trims fields and sets status to submitted', () => {
    const draft = createDefaultRegistrationDraft();
    draft.displayName = '  Linh N.  ';
    draft.fullName = ' Linh Nguyen ';
    draft.email = ' x@y.z ';
    const result = normalizeApplication(draft);
    assert.equal(result.status, 'submitted');
    assert.equal(result.displayName, 'Linh N.');
    assert.equal(result.fullName, 'Linh Nguyen');
    assert.ok(result.id.startsWith('app-'));
  });
});

describe('Registration steps metadata', () => {
  it('REGISTRATION_STEPS has 4 entries', () => {
    assert.equal(REGISTRATION_STEPS.length, 4);
    assert.equal(REGISTRATION_STEPS[0].label, 'Basic Info');
  });
});

describe('Application submitted direct-route recovery', () => {
  it('only shows submission success when a submitted application exists', () => {
    assert.equal(shouldShowSubmittedApplication(null), false);

    const submitted = createDefaultRegistrationDraft();
    submitted.status = 'submitted';
    assert.equal(shouldShowSubmittedApplication(submitted), true);
  });
});

describe('Static data integrity', () => {
  it('GUIDE_CITY_OPTIONS has at least 5 cities', () => {
    assert.ok(GUIDE_CITY_OPTIONS.length >= 5);
  });

  it('GUIDE_AREA_OPTIONS has entries for each city', () => {
    for (const city of GUIDE_CITY_OPTIONS) {
      assert.ok(GUIDE_AREA_OPTIONS[city].length > 0, `No areas for ${city}`);
    }
  });

  it('GUIDE_LANGUAGE_OPTIONS has at least 5 languages', () => {
    assert.ok(GUIDE_LANGUAGE_OPTIONS.length >= 5);
  });
});

describe('Dashboard seeded data', () => {
  it('SEEDED_GUIDE_BOOKINGS has 7 entries with expected statuses', () => {
    assert.equal(SEEDED_GUIDE_BOOKINGS.length, 7);
    const requests = SEEDED_GUIDE_BOOKINGS.filter((b) => b.status === 'request');
    assert.equal(requests.length, 2);
  });

  it('SEEDED_GUIDE_TRANSACTIONS has 4 entries with 10% fee', () => {
    assert.equal(SEEDED_GUIDE_TRANSACTIONS.length, 4);
    for (const t of SEEDED_GUIDE_TRANSACTIONS) {
      const expectedFee = Math.round(t.gross * 0.1 * 100) / 100;
      assert.equal(t.platformFee, expectedFee);
    }
  });

  it('SEEDED_GUIDE_REVIEWS has 4 reviews', () => {
    assert.equal(SEEDED_GUIDE_REVIEWS.length, 4);
  });

  it('SEEDED_GUIDE_CONVERSATIONS has 1 unread', () => {
    const unread = SEEDED_GUIDE_CONVERSATIONS.filter((c) => c.unread);
    assert.equal(unread.length, 1);
  });

  it('DEMO_GUIDE_PROFILE matches guide-001', () => {
    assert.equal(DEMO_GUIDE_PROFILE.guideId, 'guide-001');
    assert.equal(DEMO_GUIDE_PROFILE.displayName, 'Linh N.');
  });
});

describe('Dashboard booking operations', () => {
  it('filterGuideBookings returns all when filter is all', () => {
    const result = filterGuideBookings(SEEDED_GUIDE_BOOKINGS, 'all');
    assert.equal(result.length, 7);
  });

  it('acceptGuideBooking changes request to confirmed immutably', () => {
    const result = acceptGuideBooking(SEEDED_GUIDE_BOOKINGS, 'GBK-001');
    const updated = result.find((b) => b.bookingId === 'GBK-001');
    assert.equal(updated?.status, 'confirmed');
    assert.equal(SEEDED_GUIDE_BOOKINGS[0].status, 'request');
  });

  it('declineGuideBooking changes request to cancelled', () => {
    const result = declineGuideBooking(SEEDED_GUIDE_BOOKINGS, 'GBK-002');
    const updated = result.find((b) => b.bookingId === 'GBK-002');
    assert.equal(updated?.status, 'cancelled');
  });

  it('acceptGuideBooking does nothing for non-request bookings', () => {
    const result = acceptGuideBooking(SEEDED_GUIDE_BOOKINGS, 'GBK-003');
    const b = result.find((b) => b.bookingId === 'GBK-003');
    assert.equal(b?.status, 'confirmed');
  });
});

describe('Dashboard availability operations', () => {
  it('updateWeeklySchedule updates specific day immutably', () => {
    const avail = createDefaultGuideAvailability();
    const updated = updateWeeklySchedule(avail, 0, { available: false });
    assert.equal(updated.schedule[0].available, false);
    assert.equal(avail.schedule[0].available, true);
  });
});

describe('Dashboard overview computation', () => {
  it('computeDashboardOverview returns correct counts', () => {
    const overview = computeDashboardOverview(SEEDED_GUIDE_BOOKINGS, SEEDED_GUIDE_TRANSACTIONS, SEEDED_GUIDE_REVIEWS, DEMO_GUIDE_PROFILE);
    assert.equal(overview.pendingRequestCount, 2);
    assert.equal(overview.upcomingCount, 2);
    assert.equal(overview.completedCount, 2);
    assert.equal(overview.reviewCount, 4);
    assert.ok(overview.totalEarned > 0);
  });
});

describe('Dashboard helpers', () => {
  it('guideBookingStatusLabel returns correct labels', () => {
    assert.equal(guideBookingStatusLabel('request'), 'Pending Request');
    assert.equal(guideBookingStatusLabel('confirmed'), 'Confirmed');
  });

  it('guideBookingStatusColor returns color strings', () => {
    assert.ok(guideBookingStatusColor('request').startsWith('#'));
    assert.ok(guideBookingStatusColor('completed').startsWith('#'));
  });

  it('transactionStatusLabel handles all statuses', () => {
    assert.equal(transactionStatusLabel('pending'), 'Pending');
    assert.equal(transactionStatusLabel('paid-demo'), 'Paid — Demo');
  });

  it('formatGuideMoney formats currency correctly', () => {
    const result = formatGuideMoney(72, 'USD');
    assert.ok(result.includes('72'));
    assert.ok(result.includes('$'));
  });
});

describe('Local Guide presentation contracts', () => {
  it('keeps the dashboard navigation in the approved order', () => {
    assert.deepEqual(
      GUIDE_DASHBOARD_NAV_ITEMS.map((item) => item.id),
      ['overview', 'bookings', 'availability', 'earnings', 'messages', 'reviews', 'profile'],
    );
  });

  it('prioritizes the four decision-ready overview metrics', () => {
    const overview = computeDashboardOverview(
      SEEDED_GUIDE_BOOKINGS,
      SEEDED_GUIDE_TRANSACTIONS,
      SEEDED_GUIDE_REVIEWS,
      DEMO_GUIDE_PROFILE,
    );
    const cards = createDashboardMetricCards(overview);

    assert.deepEqual(cards.map((card) => card.label), [
      'Pending requests',
      'Upcoming bookings',
      'Estimated available earnings',
      'Average rating',
    ]);
    assert.equal(cards[0].value, overview.pendingRequestCount);
    assert.equal(cards[2].value, overview.availableBalance);
  });

  it('groups registration review data without mutating the draft', () => {
    const draft = createDefaultRegistrationDraft();
    draft.displayName = 'Linh N.';
    draft.city = 'Ho Chi Minh City';
    draft.languages = ['English', 'Vietnamese'];
    const before = structuredClone(draft);
    const groups = createRegistrationReviewGroups(draft);

    assert.deepEqual(groups.map((group) => group.title), [
      'Public Profile',
      'Services',
      'Pricing',
      'Availability',
      'Verification',
    ]);
    assert.equal(groups[0].items.find((item) => item.label === 'Display name')?.value, 'Linh N.');
    assert.deepEqual(draft, before);
  });

  it('normalizes transactions for responsive cards without changing fee data', () => {
    const source = structuredClone(SEEDED_GUIDE_TRANSACTIONS);
    const cards = normalizeGuideTransactionsForCards(source);

    assert.equal(cards.length, source.length);
    assert.equal(cards[0].bookingId, source[0].bookingId);
    assert.equal(cards[0].platformFee, source[0].platformFee);
    assert.equal(cards[0].net, source[0].net);
    assert.deepEqual(source, SEEDED_GUIDE_TRANSACTIONS);
  });
});

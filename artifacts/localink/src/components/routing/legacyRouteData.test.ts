import assert from 'node:assert/strict';
import test from 'node:test';

import {
  LEGACY_DIRECT_DESTINATIONS,
  LEGACY_RECOVERY_OPTIONS,
  legacyBookDestination,
} from './legacyRouteData.ts';

test('legacy booking URLs preserve and safely encode the guide id', () => {
  assert.equal(legacyBookDestination('guide-001'), '/booking-handoff/guide-001');
  assert.equal(
    legacyBookDestination('guide/with spaces?'),
    '/booking-handoff/guide%2Fwith%20spaces%3F',
  );
});

test('unambiguous legacy URLs map to approved current flows', () => {
  assert.deepEqual(LEGACY_DIRECT_DESTINATIONS, {
    guideDashboard: '/local-guide/dashboard',
    match: '/?openRequest=1',
  });
});

test('ambiguous dashboard recovery offers every approved workspace', () => {
  assert.deepEqual(
    LEGACY_RECOVERY_OPTIONS.dashboard.map(({ label, href }) => ({ label, href })),
    [
      { label: 'Traveler Bookings', href: '/bookings' },
      { label: 'Local Guide Dashboard', href: '/local-guide/dashboard' },
      { label: 'Partner Dashboard — Demo', href: '/partner/dashboard' },
      { label: 'Admin Demo', href: '/admin/dashboard' },
    ],
  );
});

test('sign-in recovery does not expose authentication actions', () => {
  assert.deepEqual(
    LEGACY_RECOVERY_OPTIONS.signin.map(({ label, href }) => ({ label, href })),
    [
      { label: 'For Travelers', href: '/' },
      { label: 'Local Guide workspace', href: '/local-guide' },
      { label: 'Partner Demo', href: '/partner' },
      { label: 'Admin Demo', href: '/admin' },
    ],
  );
});

test('signup recovery offers customer-safe account type choices', () => {
  assert.deepEqual(
    LEGACY_RECOVERY_OPTIONS.signup.map(({ label, href }) => ({ label, href })),
    [
      { label: 'Request a Local Guide', href: '/' },
      { label: 'Apply to Become a Guide', href: '/local-guide/register' },
      { label: 'Explore Partner Demo', href: '/partner' },
    ],
  );
});

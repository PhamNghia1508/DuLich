import assert from 'node:assert/strict';
import test from 'node:test';

import {
  DEMO_FOOTER_ITEMS,
  DEMO_WORKSPACE_CARDS,
  EXPLORE_DEMO_ITEMS,
  PUBLIC_NAV_ITEMS,
  WORKSPACE_SWITCHER_ITEMS,
  prototypeNavigationEnabled,
  publicSectionForPath,
  workspaceForPath,
} from './prototypeNavigation.ts';

test('public navigation items are deterministic', () => {
  assert.equal(prototypeNavigationEnabled, true);
  assert.deepEqual(PUBLIC_NAV_ITEMS.map(({ label, href }) => ({ label, href })), [
    { label: 'Browse Guides', href: '/guides' },
    { label: 'For Travelers', href: '/' },
    { label: 'Local Guide', href: '/local-guide' },
  ]);
  assert.equal(publicSectionForPath('/guides/guide-001'), 'guides');
  assert.equal(publicSectionForPath('/local-guide/register'), 'local-guide');
  assert.equal(publicSectionForPath('/signin'), 'signin');
});

test('Explore Demo routes and labels match approved workspaces', () => {
  assert.deepEqual(EXPLORE_DEMO_ITEMS.map(({ href }) => href), [
    '/', '/local-guide/dashboard', '/partner/dashboard', '/admin/dashboard',
  ]);
  assert.equal(EXPLORE_DEMO_ITEMS.find(({ href }) => href === '/partner/dashboard')?.badge, 'Demo');
  assert.equal(EXPLORE_DEMO_ITEMS.find(({ href }) => href === '/admin/dashboard')?.badge, 'Demo');
});

test('workspace switcher routes and current workspace detection are deterministic', () => {
  assert.deepEqual(WORKSPACE_SWITCHER_ITEMS.map(({ href }) => href), [
    '/', '/local-guide/dashboard', '/partner/dashboard', '/admin/dashboard', '/demo',
  ]);
  assert.equal(workspaceForPath('/admin/dashboard'), 'admin');
  assert.equal(workspaceForPath('/partner/dashboard'), 'partner');
  assert.equal(workspaceForPath('/local-guide/dashboard'), 'local-guide');
  assert.equal(workspaceForPath('/bookings'), 'traveler');
});

test('Demo route cards and footer destinations are customer-facing and stable', () => {
  assert.deepEqual(DEMO_WORKSPACE_CARDS.map(({ role }) => role), ['Traveler', 'Local Guide', 'Partner', 'Admin']);
  assert.deepEqual(DEMO_FOOTER_ITEMS.map(({ href }) => href), [
    '/local-guide', '/partner', '/admin', '/demo',
  ]);
  assert.equal(DEMO_WORKSPACE_CARDS.find(({ role }) => role === 'Partner')?.badge, 'Demo');
  assert.equal(DEMO_WORKSPACE_CARDS.find(({ role }) => role === 'Admin')?.badge, 'Demo');
});

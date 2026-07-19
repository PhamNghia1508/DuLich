import assert from 'node:assert/strict';
import test from 'node:test';

import {
  BRAND_NAME,
  DEFAULT_DOCUMENT_TITLE,
  PUBLIC_FOOTER_LINKS,
  PUBLIC_NAV_LINKS,
} from './brandPresentation';

test('uses FriendLocalTrip as the only public brand name', () => {
  assert.equal(BRAND_NAME, 'FriendLocalTrip');
  assert.match(DEFAULT_DOCUMENT_TITLE, /^FriendLocalTrip/);
});

test('public navigation only points at current approved flows', () => {
  assert.deepEqual(PUBLIC_NAV_LINKS.map(({ label, href }) => ({ label, href })), [
    { label: 'Browse Guides', href: '/guides' },
    { label: 'For Travelers', href: '/' },
    { label: 'Local Guide', href: '/local-guide' },
  ]);

  const destinations = [...PUBLIC_NAV_LINKS, ...PUBLIC_FOOTER_LINKS].map(({ href }) => href);
  assert.equal(destinations.some((href) => ['/match', '/signin', '/signup', '/guide-dashboard'].includes(href)), false);
});

import assert from 'node:assert/strict';
import test from 'node:test';

import { MOCK_GUIDES } from '../home/mockGuideData.ts';
import {
  createProfileBookingHandoff,
  createRichGuideProfileViewModel,
} from './richGuideProfileData.ts';

test('creates a complete rich profile view model for all 11 mock guide ids', () => {
  assert.equal(MOCK_GUIDES.length, 11);

  for (const guide of MOCK_GUIDES) {
    const profile = createRichGuideProfileViewModel(guide.id);

    assert.ok(profile, `missing rich profile for ${guide.id}`);
    assert.equal(profile.id, guide.id);
    assert.ok(profile.fullName.length > 0);
    assert.ok(profile.tagline.length > 0);
    assert.ok(profile.galleryImages.length >= 4);
    assert.ok(profile.galleryImages.every((image) => image.startsWith('/images/')));
    assert.ok(profile.experiences.length >= 2);
    assert.ok(profile.credentials.length >= 3);
    assert.ok(profile.reviews.length >= 2);
    assert.ok(profile.availability.length >= 6);
  }
});

test('returns a safe not-found result for an unknown guide id', () => {
  assert.equal(createRichGuideProfileViewModel('unknown-guide'), undefined);
  assert.equal(createProfileBookingHandoff('unknown-guide'), undefined);
});

test('guide-specific fallback content is deterministic', () => {
  const first = createRichGuideProfileViewModel('prototype-guide-010');
  const second = createRichGuideProfileViewModel('prototype-guide-010');

  assert.deepEqual(first, second);
  assert.ok(first);
  assert.equal(first.city, 'Hanoi');
  assert.ok(first.experiences.every((experience) => experience.id.startsWith('prototype-guide-010')));
});

test('availability mapping exposes available, hold, and unavailable states', () => {
  for (const guide of MOCK_GUIDES) {
    const statuses = createRichGuideProfileViewModel(guide.id)?.availability.map((day) => day.status);

    assert.ok(statuses?.includes('available'), `${guide.id} has no available day`);
    assert.ok(statuses?.includes('hold'), `${guide.id} has no hold day`);
    assert.ok(statuses?.includes('unavailable'), `${guide.id} has no unavailable day`);
  }
});

test('maps at most two recommendation reasons only for the current guide', () => {
  const recommendation = {
    guideId: 'guide-001',
    matchReasons: ['Speaks English', 'Matches Food & Culture', 'Highly Rated'],
  };

  assert.deepEqual(
    createRichGuideProfileViewModel('guide-001', recommendation)?.recommendationReasons,
    ['Speaks English', 'Matches Food & Culture'],
  );
  assert.equal(
    createRichGuideProfileViewModel('guide-002', recommendation)?.recommendationReasons,
    undefined,
  );
});

test('does not mutate current mock guide or recommendation data', () => {
  const guideSnapshot = structuredClone(MOCK_GUIDES);
  const recommendation = {
    guideId: 'guide-001',
    matchReasons: ['Speaks English', 'Matches Local Life'],
  };
  const recommendationSnapshot = structuredClone(recommendation);

  createRichGuideProfileViewModel('guide-001', recommendation);

  assert.deepEqual(MOCK_GUIDES, guideSnapshot);
  assert.deepEqual(recommendation, recommendationSnapshot);
});

test('related guides exclude the currently viewed guide', () => {
  const profile = createRichGuideProfileViewModel('guide-001');

  assert.ok(profile);
  assert.ok(profile.relatedGuides.length > 0);
  assert.ok(profile.relatedGuides.every((guide) => guide.id !== profile.id));
});

test('continue-to-booking handoff preserves the selected guide id', () => {
  assert.deepEqual(createProfileBookingHandoff('guide-007'), {
    selectedGuideId: 'guide-007',
    href: '/booking-handoff/guide-007',
  });
});

test('direct profile access works without recommendation context', () => {
  const profile = createRichGuideProfileViewModel('prototype-guide-011');

  assert.ok(profile);
  assert.equal(profile.recommendationReasons, undefined);
});

import assert from 'node:assert/strict';
import test from 'node:test';

import type { RequestGuideDraft } from '../home/requestGuideValidation.ts';
import {
  createBookingHandoffData,
  getGuideRecommendation,
  getPrototypeGuideProfile,
} from './guideProfileData.ts';

const request: RequestGuideDraft = {
  destination: 'Ho Chi Minh City',
  languages: ['en'],
  groupSize: 2,
  startDate: '2026-08-10',
  endDate: '2026-08-12',
  experiencePreferences: ['Food & Culture', 'Local Life'],
  additionalInformation: 'We prefer a relaxed pace.',
};

test('normalizes an existing guide into a reusable local profile', () => {
  const profile = getPrototypeGuideProfile('guide-001');

  assert.ok(profile);
  assert.equal(profile.id, 'guide-001');
  assert.equal(profile.name, 'Linh N.');
  assert.ok(profile.about.length > profile.introduction.length);
  assert.ok(profile.experiences.includes('Food & Culture'));
  assert.ok(profile.languages.some((language) => language.code === 'en'));
  assert.ok(profile.galleryImages.length >= 3);
  assert.ok(profile.galleryImages.every((image) => image.startsWith('/images/')));
  assert.ok(profile.availability.some((day) => day.available));
  assert.ok(profile.availability.some((day) => !day.available));
  assert.ok(profile.reviews.length >= 2 && profile.reviews.length <= 4);
});

test('creates a deterministic profile for a prototype-only result', () => {
  const profile = getPrototypeGuideProfile('prototype-guide-009');

  assert.ok(profile);
  assert.equal(profile.name, 'Mai Z.');
  assert.equal(profile.city, 'Da Nang');
  assert.deepEqual(profile.experiences, ['Shopping', 'Nature', 'Local Life']);
  assert.ok(profile.galleryImages.every((image) => image.startsWith('/images/')));
});

test('returns undefined for an unknown guide id', () => {
  assert.equal(getPrototypeGuideProfile('unknown-guide'), undefined);
});

test('only returns recommendation reasons for the guide opened from results', () => {
  const recommendation = {
    guideId: 'guide-001',
    matchReasons: ['Speaks English', 'Matches Food & Culture', 'Highly rated'],
  };

  assert.deepEqual(getGuideRecommendation(recommendation, 'guide-001'), [
    'Speaks English',
    'Matches Food & Culture',
  ]);
  assert.equal(getGuideRecommendation(recommendation, 'guide-002'), undefined);
  assert.equal(getGuideRecommendation(null, 'guide-001'), undefined);
});

test('creates handoff data without changing the submitted request', () => {
  const handoff = createBookingHandoffData('guide-001', request);

  assert.ok(handoff);
  assert.equal(handoff.guide.id, 'guide-001');
  assert.deepEqual(handoff.request, request);
  assert.equal(createBookingHandoffData('unknown-guide', request), undefined);
});

test('supports direct handoff access without request context', () => {
  const handoff = createBookingHandoffData('guide-001', null);

  assert.ok(handoff);
  assert.equal(handoff.request, null);
});

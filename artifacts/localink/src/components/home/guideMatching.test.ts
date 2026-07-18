import assert from 'node:assert/strict';
import test from 'node:test';

import type { RequestGuideDraft } from './requestGuideValidation.ts';
import {
  matchGuides,
  type MockGuide,
} from './guideMatching.ts';

const REQUEST: RequestGuideDraft = {
  destination: 'Ho Chi Minh City',
  languages: ['en'],
  groupSize: 2,
  startDate: '2026-08-20',
  endDate: '2026-08-21',
  experiencePreferences: ['Food & Culture'],
  additionalInformation: '',
};

function guide(overrides: Partial<MockGuide> = {}): MockGuide {
  return {
    id: 'guide-test',
    name: 'Alex Local',
    image: '/images/guides/linh.webp',
    city: 'Ho Chi Minh City',
    serviceAreas: ['District 1'],
    languages: ['en'],
    experiencePreferences: ['Food & Culture'],
    hourlyRate: 20,
    currency: 'USD',
    rating: 4.8,
    reviewCount: 20,
    responseTime: 'Usually responds in 20 min',
    responseTimeMinutes: 20,
    verified: true,
    active: true,
    ...overrides,
  };
}

test('returns only active and verified guides', () => {
  const guides = [
    guide({ id: 'eligible' }),
    guide({ id: 'inactive', active: false }),
    guide({ id: 'unverified', verified: false }),
  ];

  assert.deepEqual(matchGuides(REQUEST, guides).map(({ guide: item }) => item.id), [
    'eligible',
  ]);
});

test('requires at least one language overlap', () => {
  const guides = [
    guide({ id: 'english', languages: ['en', 'vi'] }),
    guide({ id: 'french', languages: ['fr', 'vi'] }),
  ];

  assert.deepEqual(matchGuides(REQUEST, guides).map(({ guide: item }) => item.id), [
    'english',
  ]);
});

test('matches destination case-insensitively and ignores surrounding whitespace', () => {
  const result = matchGuides(
    { ...REQUEST, destination: '  ho chi minh city  ' },
    [guide()],
  );

  assert.ok(result[0].matchReasons.includes('Based in Ho Chi Minh City'));
});

test('handles partial service-area matching', () => {
  const result = matchGuides(
    { ...REQUEST, destination: 'Hoi An Ancient Town' },
    [guide({ city: 'Da Nang', serviceAreas: ['Hoi An'] })],
  );

  assert.ok(result[0].matchReasons.includes('Covers Hoi An'));
});

test('excludes a guide unavailable during the request dates', () => {
  const guides = [
    guide({
      id: 'unavailable',
      unavailableDateRanges: [{ startDate: '2026-08-21', endDate: '2026-08-24' }],
    }),
    guide({
      id: 'available',
      unavailableDateRanges: [{ startDate: '2026-08-22', endDate: '2026-08-24' }],
    }),
  ];

  assert.deepEqual(matchGuides(REQUEST, guides).map(({ guide: item }) => item.id), [
    'available',
  ]);
});

test('rewards matching experience preferences', () => {
  const results = matchGuides(REQUEST, [
    guide({ id: 'history', name: 'History Guide', experiencePreferences: ['History'] }),
    guide({ id: 'food', name: 'Food Guide' }),
  ]);

  assert.equal(results[0].guide.id, 'food');
  assert.ok(results[0].matchScore > results[1].matchScore);
  assert.ok(results[0].matchReasons.includes('Matches Food & Culture'));
});

test('sorts results by score descending', () => {
  const results = matchGuides(REQUEST, [
    guide({ id: 'lower', city: 'Hanoi', serviceAreas: [], experiencePreferences: [] }),
    guide({ id: 'higher' }),
  ]);

  assert.deepEqual(results.map(({ guide: item }) => item.id), ['higher', 'lower']);
  assert.ok(results[0].matchScore > results[1].matchScore);
});

test('uses rating then name as deterministic tie-breakers', () => {
  const ratingResults = matchGuides(REQUEST, [
    guide({ id: 'low-rating', name: 'A Guide', rating: 4.7 }),
    guide({ id: 'high-rating', name: 'Z Guide', rating: 4.9 }),
  ]);
  const nameResults = matchGuides(REQUEST, [
    guide({ id: 'z-name', name: 'Zara Guide' }),
    guide({ id: 'a-name', name: 'Ari Guide' }),
  ]);

  assert.equal(ratingResults[0].guide.id, 'high-rating');
  assert.deepEqual(nameResults.map(({ guide: item }) => item.id), ['a-name', 'z-name']);
});

test('returns an empty list when no guide is eligible', () => {
  assert.deepEqual(
    matchGuides(REQUEST, [guide({ languages: ['fr'], active: false })]),
    [],
  );
});

test('does not mutate the request or source guide array', () => {
  const request = structuredClone(REQUEST);
  const guides = [guide({ id: 'b', name: 'B Guide' }), guide({ id: 'a', name: 'A Guide' })];
  const requestSnapshot = structuredClone(request);
  const guidesSnapshot = structuredClone(guides);

  matchGuides(request, guides);

  assert.deepEqual(request, requestSnapshot);
  assert.deepEqual(guides, guidesSnapshot);
});

import assert from 'node:assert/strict';
import test from 'node:test';

import {
  EMPTY_REQUEST_GUIDE_DRAFT,
  validateRequestGuideDraft,
  type RequestGuideDraft,
} from './requestGuideValidation.ts';

test('requires destination, language, and travel dates', () => {
  assert.deepEqual(validateRequestGuideDraft(EMPTY_REQUEST_GUIDE_DRAFT), {
    destination: 'Enter a destination or area.',
    languages: 'Select at least one language.',
    startDate: 'Select a start date.',
    endDate: 'Select an end date.',
  });
});

test('requires a group size greater than zero', () => {
  const draft: RequestGuideDraft = {
    ...EMPTY_REQUEST_GUIDE_DRAFT,
    groupSize: 0,
  };

  assert.equal(
    validateRequestGuideDraft(draft).groupSize,
    'Group size must be greater than 0.',
  );
});

test('rejects an end date before the start date', () => {
  const draft: RequestGuideDraft = {
    ...EMPTY_REQUEST_GUIDE_DRAFT,
    destination: 'Ho Chi Minh City',
    languages: ['en'],
    groupSize: 2,
    startDate: '2026-08-20',
    endDate: '2026-08-18',
  };

  assert.deepEqual(validateRequestGuideDraft(draft), {
    endDate: 'End date cannot be before start date.',
  });
});

test('accepts a complete request draft with same-day travel', () => {
  const draft: RequestGuideDraft = {
    destination: 'Da Nang',
    languages: ['en', 'vi'],
    groupSize: 3,
    startDate: '2026-09-10',
    endDate: '2026-09-10',
    experiencePreferences: ['Food & Culture', 'Local Life'],
    additionalInformation: 'A relaxed walking pace, please.',
  };

  assert.deepEqual(validateRequestGuideDraft(draft), {});
});

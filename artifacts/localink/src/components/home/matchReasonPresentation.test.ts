import assert from 'node:assert/strict';
import test from 'node:test';

import { selectVisibleMatchReasons } from './matchReasonPresentation.ts';

test('uses different valid reason pairs while alternatives remain', () => {
  const sharedReasons = [
    'Based in Ho Chi Minh City',
    'Matches Food & Culture',
    'Speaks English',
    'Available for your dates',
    'Highly rated',
  ];

  const selected = selectVisibleMatchReasons([
    sharedReasons,
    sharedReasons,
    sharedReasons,
    sharedReasons,
  ]);

  assert.equal(new Set(selected.map((pair) => pair.join('|'))).size, 4);
  assert.ok(selected.every((pair) => pair.length <= 2));
  assert.ok(selected.flat().every((reason) => sharedReasons.includes(reason)));
});

test('handles one or no available reasons without inventing presentation copy', () => {
  assert.deepEqual(selectVisibleMatchReasons([['Speaks English'], []]), [
    ['Speaks English'],
    [],
  ]);
});

test('does not mutate the source reason arrays', () => {
  const reasons = [
    ['Matches Local Life', 'Speaks English', 'Highly rated'],
    ['Based in Hanoi', 'Available for your dates'],
  ];
  const snapshot = structuredClone(reasons);

  selectVisibleMatchReasons(reasons);

  assert.deepEqual(reasons, snapshot);
});

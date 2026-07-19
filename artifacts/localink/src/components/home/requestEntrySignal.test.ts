import assert from 'node:assert/strict';
import test from 'node:test';

import { consumePrototypeSignals, shouldOpenRequestFromSearch } from './requestEntrySignal.ts';

test('opens the request dialog only for the explicit legacy entry signal', () => {
  assert.equal(shouldOpenRequestFromSearch('?openRequest=1'), true);
  assert.equal(shouldOpenRequestFromSearch('openRequest=1'), true);
  assert.equal(shouldOpenRequestFromSearch('?ref=hotel&openRequest=1'), true);
});

test('ignores unrelated or malformed request entry values', () => {
  assert.equal(shouldOpenRequestFromSearch(''), false);
  assert.equal(shouldOpenRequestFromSearch('?openRequest=0'), false);
  assert.equal(shouldOpenRequestFromSearch('?openRequest=true'), false);
  assert.equal(shouldOpenRequestFromSearch('?openRequest='), false);
});

test('consumes one-time signals while preserving unrelated query parameters', () => {
  const result = consumePrototypeSignals(
    '?ref=hotel&openRequest=1&demoAccountCreated=1',
    ['openRequest', 'demoAccountCreated'],
  );

  assert.deepEqual([...result.present], ['openRequest', 'demoAccountCreated']);
  assert.equal(result.remainingSearch, '?ref=hotel');
});

test('removes malformed owned signals without consuming them', () => {
  const result = consumePrototypeSignals('?openRequest=true&campaign=summer', ['openRequest']);
  assert.deepEqual([...result.present], []);
  assert.equal(result.remainingSearch, '?campaign=summer');
});

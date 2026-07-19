import assert from 'node:assert/strict';
import test from 'node:test';

import { shouldOpenRequestFromSearch } from './requestEntrySignal.ts';

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

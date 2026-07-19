import assert from 'node:assert/strict';
import test from 'node:test';

import {
  SIGN_IN_DESTINATION,
  SIGN_UP_DESTINATION,
  validateDemoSignIn,
  validateDemoSignup,
  type DemoSignupDraft,
} from './travelerAuthPrototype.ts';

const VALID_SIGNUP: DemoSignupDraft = {
  displayName: 'Alex Traveler',
  email: 'alex@example.com',
  country: 'Vietnam',
  password: 'demo-pass-123',
  confirmPassword: 'demo-pass-123',
  termsAccepted: true,
};

test('sign-in validation requires a structured email and password', () => {
  assert.deepEqual(validateDemoSignIn({ email: '', password: '' }), {
    email: 'Enter your email address.',
    password: 'Enter your password.',
  });
  assert.equal(validateDemoSignIn({ email: 'wrong', password: 'password' }).email, 'Enter a valid email address.');
  assert.deepEqual(validateDemoSignIn({ email: 'alex@example.com', password: 'password' }), {});
});

test('sign-up validation covers every prototype requirement', () => {
  assert.deepEqual(validateDemoSignup({
    displayName: ' ', email: 'wrong', country: '', password: 'short', confirmPassword: 'other', termsAccepted: false,
  }), {
    displayName: 'Enter your display name.',
    email: 'Enter a valid email address.',
    country: 'Select your country or region.',
    password: 'Use at least 8 characters.',
    confirmPassword: 'Passwords must match.',
    termsAccepted: 'Accept the prototype terms to continue.',
  });
  assert.deepEqual(validateDemoSignup(VALID_SIGNUP), {});
});

test('password confirmation mismatch is reported without returning credentials', () => {
  const errors = validateDemoSignup({ ...VALID_SIGNUP, confirmPassword: 'different' });
  assert.equal(errors.confirmPassword, 'Passwords must match.');
  assert.equal(JSON.stringify(errors).includes(VALID_SIGNUP.password), false);
});

test('auth destinations contain only fixed one-time signals', () => {
  assert.equal(SIGN_IN_DESTINATION, '/bookings?demoSignedIn=1');
  assert.equal(SIGN_UP_DESTINATION, '/?openRequest=1&demoAccountCreated=1');
});

export interface DemoSignInDraft {
  email: string;
  password: string;
}

export interface DemoSignupDraft {
  displayName: string;
  email: string;
  country: string;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
}

export type DemoSignInErrors = Partial<Record<keyof DemoSignInDraft, string>>;
export type DemoSignupErrors = Partial<Record<keyof DemoSignupDraft, string>>;

export const SIGN_IN_DESTINATION = '/bookings?demoSignedIn=1';
export const SIGN_UP_DESTINATION = '/?openRequest=1&demoAccountCreated=1';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateDemoSignIn(draft: DemoSignInDraft): DemoSignInErrors {
  const errors: DemoSignInErrors = {};
  if (!draft.email.trim()) errors.email = 'Enter your email address.';
  else if (!EMAIL_PATTERN.test(draft.email.trim())) errors.email = 'Enter a valid email address.';
  if (!draft.password) errors.password = 'Enter your password.';
  return errors;
}

export function validateDemoSignup(draft: DemoSignupDraft): DemoSignupErrors {
  const errors: DemoSignupErrors = {};
  if (!draft.displayName.trim()) errors.displayName = 'Enter your display name.';
  if (!draft.email.trim()) errors.email = 'Enter your email address.';
  else if (!EMAIL_PATTERN.test(draft.email.trim())) errors.email = 'Enter a valid email address.';
  if (!draft.country) errors.country = 'Select your country or region.';
  if (draft.password.length < 8) errors.password = 'Use at least 8 characters.';
  if (draft.confirmPassword !== draft.password) errors.confirmPassword = 'Passwords must match.';
  if (!draft.termsAccepted) errors.termsAccepted = 'Accept the prototype terms to continue.';
  return errors;
}

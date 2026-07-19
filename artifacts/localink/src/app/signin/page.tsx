import { useRef, useState } from 'react';
import { ArrowRight, LockKeyhole, Mail } from 'lucide-react';
import { Link, useLocation } from 'wouter';

import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { SIGN_IN_DESTINATION, validateDemoSignIn, type DemoSignInDraft } from '@/components/auth/travelerAuthPrototype';

import '../auth-prototype.css';

const EMPTY_DRAFT: DemoSignInDraft = { email: '', password: '' };

export default function SignInPage() {
  const [, navigate] = useLocation();
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [errors, setErrors] = useState<ReturnType<typeof validateDemoSignIn>>({});
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const update = (field: keyof DemoSignInDraft) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setDraft((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors = validateDemoSignIn(draft);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      (nextErrors.email ? emailRef : passwordRef).current?.focus();
      return;
    }
    setDraft(EMPTY_DRAFT);
    navigate(SIGN_IN_DESTINATION);
  };

  return (
    <div className="traveler-auth-page">
      <Navbar />
      <main className="traveler-auth-main">
        <section className="traveler-auth-card" aria-labelledby="traveler-signin-title">
          <div className="traveler-auth-icon" aria-hidden="true"><LockKeyhole size={22} /></div>
          <p className="traveler-auth-eyebrow">Traveler prototype</p>
          <h1 id="traveler-signin-title">Welcome back</h1>
          <p className="traveler-auth-intro">Use any valid-looking details to review the Traveler journey. Credentials are never stored.</p>
          <form onSubmit={submit} noValidate>
            <div className="traveler-auth-field">
              <label htmlFor="demo-signin-email">Email address</label>
              <div><Mail size={16} aria-hidden="true" /><input ref={emailRef} id="demo-signin-email" type="email" autoComplete="email" value={draft.email} onChange={update('email')} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'demo-signin-email-error' : undefined} placeholder="traveler@example.com" /></div>
              {errors.email && <small id="demo-signin-email-error">{errors.email}</small>}
            </div>
            <div className="traveler-auth-field">
              <label htmlFor="demo-signin-password">Password</label>
              <div><LockKeyhole size={16} aria-hidden="true" /><input ref={passwordRef} id="demo-signin-password" type="password" autoComplete="current-password" value={draft.password} onChange={update('password')} aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? 'demo-signin-password-error' : undefined} placeholder="Enter a demo password" /></div>
              {errors.password && <small id="demo-signin-password-error">{errors.password}</small>}
            </div>
            <button type="submit" className="traveler-auth-submit">Continue to My Bookings <ArrowRight size={17} aria-hidden="true" /></button>
          </form>
          <p className="traveler-auth-switch">New to FriendLocalTrip? <Link href="/signup">Create a demo account</Link></p>
          <p className="traveler-auth-notice">Frontend-only prototype · No authentication or persistence</p>
        </section>
      </main>
      <Footer variant="home" />
    </div>
  );
}

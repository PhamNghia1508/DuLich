import { useRef, useState } from 'react';
import { ArrowRight, Globe2, LockKeyhole, Mail, UserRound } from 'lucide-react';
import { Link, useLocation } from 'wouter';

import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { SIGN_UP_DESTINATION, validateDemoSignup, type DemoSignupDraft } from '@/components/auth/travelerAuthPrototype';

import '../auth-prototype.css';

const EMPTY_DRAFT: DemoSignupDraft = { displayName: '', email: '', country: '', password: '', confirmPassword: '', termsAccepted: false };
const FOCUS_ORDER: (keyof DemoSignupDraft)[] = ['displayName', 'email', 'country', 'password', 'confirmPassword', 'termsAccepted'];

export default function SignUpPage() {
  const [, navigate] = useLocation();
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [errors, setErrors] = useState<ReturnType<typeof validateDemoSignup>>({});
  const formRef = useRef<HTMLFormElement>(null);

  const setField = <K extends keyof DemoSignupDraft>(field: K, value: DemoSignupDraft[K]) => {
    setDraft((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors = validateDemoSignup(draft);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      const first = FOCUS_ORDER.find((key) => nextErrors[key]);
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setDraft(EMPTY_DRAFT);
    navigate(SIGN_UP_DESTINATION);
  };

  return (
    <div className="traveler-auth-page">
      <Navbar />
      <main className="traveler-auth-main traveler-auth-main--signup">
        <section className="traveler-auth-card" aria-labelledby="traveler-signup-title">
          <div className="traveler-auth-icon" aria-hidden="true"><UserRound size={22} /></div>
          <p className="traveler-auth-eyebrow">Traveler prototype</p>
          <h1 id="traveler-signup-title">Create your demo account</h1>
          <p className="traveler-auth-intro">Preview account creation before telling us about your trip. Nothing is saved.</p>
          <form ref={formRef} onSubmit={submit} noValidate>
            <div className="traveler-auth-field">
              <label htmlFor="demo-signup-name">Display name</label><div><UserRound size={16} /><input name="displayName" id="demo-signup-name" value={draft.displayName} onChange={(e) => setField('displayName', e.target.value)} aria-invalid={Boolean(errors.displayName)} placeholder="Alex Morgan" /></div>{errors.displayName && <small>{errors.displayName}</small>}
            </div>
            <div className="traveler-auth-grid">
              <div className="traveler-auth-field"><label htmlFor="demo-signup-email">Email address</label><div><Mail size={16} /><input name="email" id="demo-signup-email" type="email" value={draft.email} onChange={(e) => setField('email', e.target.value)} aria-invalid={Boolean(errors.email)} placeholder="alex@example.com" /></div>{errors.email && <small>{errors.email}</small>}</div>
              <div className="traveler-auth-field"><label htmlFor="demo-signup-country">Country or region</label><div><Globe2 size={16} /><select name="country" id="demo-signup-country" value={draft.country} onChange={(e) => setField('country', e.target.value)} aria-invalid={Boolean(errors.country)}><option value="">Select one</option><option>Australia</option><option>France</option><option>Japan</option><option>Singapore</option><option>United Kingdom</option><option>United States</option><option>Vietnam</option></select></div>{errors.country && <small>{errors.country}</small>}</div>
            </div>
            <div className="traveler-auth-grid">
              <div className="traveler-auth-field"><label htmlFor="demo-signup-password">Password</label><div><LockKeyhole size={16} /><input name="password" id="demo-signup-password" type="password" value={draft.password} onChange={(e) => setField('password', e.target.value)} aria-invalid={Boolean(errors.password)} placeholder="At least 8 characters" /></div>{errors.password && <small>{errors.password}</small>}</div>
              <div className="traveler-auth-field"><label htmlFor="demo-signup-confirm">Confirm password</label><div><LockKeyhole size={16} /><input name="confirmPassword" id="demo-signup-confirm" type="password" value={draft.confirmPassword} onChange={(e) => setField('confirmPassword', e.target.value)} aria-invalid={Boolean(errors.confirmPassword)} placeholder="Repeat password" /></div>{errors.confirmPassword && <small>{errors.confirmPassword}</small>}</div>
            </div>
            <label className="traveler-auth-terms"><input name="termsAccepted" type="checkbox" checked={draft.termsAccepted} onChange={(e) => setField('termsAccepted', e.target.checked)} /><span>I understand this is a frontend-only customer review prototype.</span></label>
            {errors.termsAccepted && <small className="traveler-auth-terms-error">{errors.termsAccepted}</small>}
            <button type="submit" className="traveler-auth-submit">Create Demo Account <ArrowRight size={17} /></button>
          </form>
          <p className="traveler-auth-switch">Already reviewed this flow? <Link href="/signin">Sign in</Link></p>
          <p className="traveler-auth-notice">Credentials are cleared before navigation and never persisted</p>
        </section>
      </main>
      <Footer variant="home" />
    </div>
  );
}

import { useState } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, ArrowRight, Check, User } from 'lucide-react';

import Navbar from '@/components/layout/Navbar';
import SupportChat from '@/components/home/SupportChat';
import { useLocalGuidePrototype } from '@/components/local-guide/LocalGuidePrototypeContext';
import {
  type PrototypeGuideApplication,
  type RegistrationStep,
  type RegistrationErrors,
  REGISTRATION_STEPS,
  GUIDE_CITY_OPTIONS,
  GUIDE_AREA_OPTIONS,
  GUIDE_LANGUAGE_OPTIONS,
  GUIDE_EXPERIENCE_OPTIONS,
  GUIDE_SPECIALTY_OPTIONS,
  GUIDE_STYLE_OPTIONS,
  GUIDE_PROFILE_IMAGE_OPTIONS,
  GUIDE_GALLERY_IMAGE_OPTIONS,
  createDefaultRegistrationDraft,
  validateRegistrationStep,
  hasErrors,
  normalizeApplication,
  calculateGuideProfileCompleteness,
} from '@/components/local-guide/localGuideRegistrationData';
import { createRegistrationReviewGroups } from '@/components/local-guide/localGuidePresentation';

import '../local-guide.css';

export default function LocalGuideRegisterPage() {
  const [, navigate] = useLocation();
  const { submitApplication, submittedApplication } = useLocalGuidePrototype();
  const [step, setStep] = useState<RegistrationStep>(1);
  const [draft, setDraft] = useState<PrototypeGuideApplication>(() => submittedApplication ?? createDefaultRegistrationDraft());
  const [errors, setErrors] = useState<RegistrationErrors>({});

  const completeness = calculateGuideProfileCompleteness(draft);

  function updateDraft(updates: Partial<PrototypeGuideApplication>) {
    setDraft((prev) => ({ ...prev, ...updates }));
    setErrors({});
  }

  function toggleArrayField(field: keyof PrototypeGuideApplication, value: string) {
    const arr = draft[field] as string[];
    const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
    updateDraft({ [field]: next });
  }

  function handleNext() {
    const stepErrors = validateRegistrationStep(step, draft);
    if (hasErrors(stepErrors)) {
      setErrors(stepErrors);
      return;
    }
    if (step < 4) setStep((step + 1) as RegistrationStep);
  }

  function handleBack() {
    if (step > 1) setStep((step - 1) as RegistrationStep);
  }

  function handleSubmit() {
    const stepErrors = validateRegistrationStep(4, draft);
    if (hasErrors(stepErrors)) {
      setErrors(stepErrors);
      return;
    }
    const normalized = normalizeApplication(draft);
    submitApplication(normalized);
    navigate('/local-guide/application-submitted');
  }

  return (
    <div className="lg-page">
      <Navbar variant="home" />
      <main className="lg-reg-shell">
        <header className="lg-reg-header">
          <p className="lg-eyebrow">Guide application</p>
          <h1>Create your Local Guide profile</h1>
          <p>Complete four focused steps. Your progress stays only in this prototype session.</p>
        </header>
        <div className="lg-reg-mobile-progress">
          <div><strong>Step {step} of 4</strong><span>{REGISTRATION_STEPS[step - 1].label}</span></div>
          <div className="lg-reg-mobile-track"><span style={{ width: `${step * 25}%` }} /></div>
        </div>
        <div className="lg-reg-layout">
        <div className="lg-reg-form">
          <ol className="lg-reg-progress" aria-label="Application progress">
            {REGISTRATION_STEPS.map((s) => (
              <li
                key={s.step}
                aria-current={step === s.step ? 'step' : undefined}
                className={`lg-reg-progress-step ${step === s.step ? 'lg-reg-progress-step--active' : ''} ${step > s.step ? 'lg-reg-progress-step--done' : ''}`}
              >
                <span className="lg-reg-progress-num">{step > s.step ? <Check size={12} /> : s.step}</span>
                <span className="lg-reg-progress-label">{s.label}</span>
              </li>
            ))}
          </ol>

          <details className="lg-reg-mobile-preview">
            <summary>Preview your guide profile · {completeness.percentage}% complete</summary>
            <ProfilePreview draft={draft} />
          </details>

          {step === 1 && <Step1 draft={draft} errors={errors} updateDraft={updateDraft} toggleArrayField={toggleArrayField} />}
          {step === 2 && <Step2 draft={draft} errors={errors} updateDraft={updateDraft} toggleArrayField={toggleArrayField} />}
          {step === 3 && <Step3 draft={draft} errors={errors} setDraft={setDraft} />}
          {step === 4 && <Step4 draft={draft} errors={errors} setDraft={setDraft} />}

          <div className="lg-reg-actions">
            {step > 1 && (
              <button className="lg-btn-secondary" onClick={handleBack} type="button">
                <ArrowLeft size={14} /> Back
              </button>
            )}
            {step < 4 ? (
              <button className="btn btn-accent" onClick={handleNext} type="button">
                Continue <ArrowRight size={14} />
              </button>
            ) : (
              <button className="btn btn-accent" onClick={handleSubmit} type="button">
                Submit Guide Application <Check size={14} />
              </button>
            )}
          </div>
        </div>

        <aside className="lg-reg-preview"><ProfilePreview draft={draft} /></aside>
        </div>
      </main>
      <SupportChat />
    </div>
  );
}

function ProfilePreview({ draft }: { draft: PrototypeGuideApplication }) {
  const completeness = calculateGuideProfileCompleteness(draft);
  return (
    <div className="lg-reg-preview-inner">
      <p className="lg-preview-kicker">Traveler preview</p>
      <div className="lg-preview-avatar-wrap">
        {draft.selectedProfileImage ? <img src={draft.selectedProfileImage} alt="Profile preview" /> : <User size={36} />}
      </div>
      <h3>{draft.displayName || 'Your Name'}</h3>
      <p className="lg-preview-tagline">{draft.tagline || 'Your short guide tagline will appear here.'}</p>
      <p className="lg-preview-city">{draft.city || 'Select a city'}</p>
      <div className="lg-preview-completeness">
        <div className="lg-completeness-bar"><div className="lg-completeness-fill" style={{ width: `${completeness.percentage}%` }} /></div>
        <span>{completeness.percentage}% complete</span>
      </div>
      {completeness.missing.length > 0 && <p className="lg-preview-next">Next: {completeness.missing.slice(0, 2).join(' · ')}</p>}
    </div>
  );
}

interface StepProps {
  draft: PrototypeGuideApplication;
  errors: RegistrationErrors;
  updateDraft: (u: Partial<PrototypeGuideApplication>) => void;
  toggleArrayField: (f: keyof PrototypeGuideApplication, v: string) => void;
}

function Step1({ draft, errors, updateDraft, toggleArrayField }: StepProps) {
  const areas = draft.city ? GUIDE_AREA_OPTIONS[draft.city] ?? [] : [];
  return (
    <div className="lg-register-step">
      <div className="lg-step-heading"><span>01</span><div><h2>Basic Information</h2><p>Start with the details travelers use to recognize and contact you.</p></div></div>
      <div className="lg-form-grid">
        <label className="lg-field">
          <span>Full Name *</span>
          <input value={draft.fullName} onChange={(e) => updateDraft({ fullName: e.target.value })} />
          {errors.fullName && <span className="lg-field-error">{errors.fullName}</span>}
        </label>
        <label className="lg-field">
          <span>Display Name *</span>
          <input value={draft.displayName} onChange={(e) => updateDraft({ displayName: e.target.value })} placeholder="e.g. Linh N." />
          {errors.displayName && <span className="lg-field-error">{errors.displayName}</span>}
        </label>
        <label className="lg-field">
          <span>Email *</span>
          <input type="email" value={draft.email} onChange={(e) => updateDraft({ email: e.target.value })} />
          {errors.email && <span className="lg-field-error">{errors.email}</span>}
        </label>
        <label className="lg-field">
          <span>Phone</span>
          <input value={draft.phone} onChange={(e) => updateDraft({ phone: e.target.value })} />
        </label>
        <label className="lg-field">
          <span>City *</span>
          <select value={draft.city} onChange={(e) => updateDraft({ city: e.target.value, operatingAreas: [] })}>
            <option value="">Select city</option>
            {GUIDE_CITY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.city && <span className="lg-field-error">{errors.city}</span>}
        </label>
        <label className="lg-field">
          <span>Years of Experience</span>
          <input type="number" min={0} value={draft.experienceYears} onChange={(e) => updateDraft({ experienceYears: Number(e.target.value) })} />
          {errors.experienceYears && <span className="lg-field-error">{errors.experienceYears}</span>}
        </label>
      </div>

      <fieldset className="lg-chip-group">
        <legend>Operating Areas * {errors.operatingAreas && <span className="lg-field-error">{errors.operatingAreas}</span>}</legend>
        <div className="lg-chips">
          {areas.map((a) => (
            <button
              key={a}
              type="button"
              className={`lg-chip ${draft.operatingAreas.includes(a) ? 'lg-chip--selected' : ''}`}
              onClick={() => toggleArrayField('operatingAreas', a)}
            >{a}</button>
          ))}
          {areas.length === 0 && <p className="lg-chip-hint">Select a city first</p>}
        </div>
      </fieldset>

      <fieldset className="lg-chip-group">
        <legend>Languages * {errors.languages && <span className="lg-field-error">{errors.languages}</span>}</legend>
        <div className="lg-chips">
          {GUIDE_LANGUAGE_OPTIONS.map((l) => (
            <button
              key={l.code}
              type="button"
              className={`lg-chip ${draft.languages.includes(l.name) ? 'lg-chip--selected' : ''}`}
              onClick={() => toggleArrayField('languages', l.name)}
            >{l.name}</button>
          ))}
        </div>
      </fieldset>
    </div>
  );
}

function Step2({ draft, errors, updateDraft, toggleArrayField }: StepProps) {
  return (
    <div className="lg-register-step">
      <div className="lg-step-heading"><span>02</span><div><h2>Build Your Profile</h2><p>Show your personality, expertise, and the experiences you can offer.</p></div></div>

      <fieldset className="lg-image-picker">
        <legend>Profile Photo * {errors.selectedProfileImage && <span className="lg-field-error">{errors.selectedProfileImage}</span>}</legend>
        <div className="lg-image-grid">
          {GUIDE_PROFILE_IMAGE_OPTIONS.map((src) => (
            <button
              key={src}
              type="button"
              className={`lg-image-option ${draft.selectedProfileImage === src ? 'lg-image-option--selected' : ''}`}
              onClick={() => updateDraft({ selectedProfileImage: src })}
            >
              <img src={src} alt="Profile option" />
            </button>
          ))}
        </div>
      </fieldset>

      <label className="lg-field">
        <span>Tagline * <small>(short intro for your card)</small></span>
        <input value={draft.tagline} onChange={(e) => updateDraft({ tagline: e.target.value })} maxLength={80} placeholder="e.g. Street food expert and Saigon native" />
        {errors.tagline && <span className="lg-field-error">{errors.tagline}</span>}
      </label>

      <label className="lg-field">
        <span>About Me *</span>
        <textarea rows={4} value={draft.bio} onChange={(e) => updateDraft({ bio: e.target.value })} placeholder="Tell travelers what makes your tours special..." />
        {errors.bio && <span className="lg-field-error">{errors.bio}</span>}
      </label>

      <label className="lg-field">
        <span>Guiding Philosophy</span>
        <textarea rows={2} value={draft.guidingPhilosophy} onChange={(e) => updateDraft({ guidingPhilosophy: e.target.value })} placeholder="What's your approach to guiding travelers?" />
      </label>

      <div className="lg-form-grid">
        <label className="lg-field">
          <span>Hourly Rate (USD) *</span>
          <input type="number" min={1} value={draft.hourlyRate || ''} onChange={(e) => updateDraft({ hourlyRate: Number(e.target.value) })} placeholder="e.g. 18" />
          {errors.hourlyRate && <span className="lg-field-error">{errors.hourlyRate}</span>}
        </label>
        <label className="lg-field">
          <span>Max Group Size *</span>
          <input type="number" min={1} value={draft.maxGroupSize || ''} onChange={(e) => updateDraft({ maxGroupSize: Number(e.target.value) })} placeholder="e.g. 6" />
          {errors.maxGroupSize && <span className="lg-field-error">{errors.maxGroupSize}</span>}
        </label>
      </div>

      <fieldset className="lg-chip-group">
        <legend>Specialties * {errors.specialties && <span className="lg-field-error">{errors.specialties}</span>}</legend>
        <div className="lg-chips">
          {GUIDE_SPECIALTY_OPTIONS.map((s) => (
            <button key={s} type="button" className={`lg-chip ${draft.specialties.includes(s) ? 'lg-chip--selected' : ''}`} onClick={() => toggleArrayField('specialties', s)}>{s}</button>
          ))}
        </div>
      </fieldset>

      <fieldset className="lg-chip-group">
        <legend>Guide Styles * {errors.guideStyles && <span className="lg-field-error">{errors.guideStyles}</span>}</legend>
        <div className="lg-chips">
          {GUIDE_STYLE_OPTIONS.map((s) => (
            <button key={s} type="button" className={`lg-chip ${draft.guideStyles.includes(s) ? 'lg-chip--selected' : ''}`} onClick={() => toggleArrayField('guideStyles', s)}>{s}</button>
          ))}
        </div>
      </fieldset>

      <fieldset className="lg-chip-group">
        <legend>Experience Types * {errors.experienceTypes && <span className="lg-field-error">{errors.experienceTypes}</span>}</legend>
        <div className="lg-chips">
          {GUIDE_EXPERIENCE_OPTIONS.map((s) => (
            <button key={s} type="button" className={`lg-chip ${draft.experienceTypes.includes(s) ? 'lg-chip--selected' : ''}`} onClick={() => toggleArrayField('experienceTypes', s)}>{s}</button>
          ))}
        </div>
      </fieldset>

      <fieldset className="lg-image-picker">
        <legend>Gallery Images (optional)</legend>
        <div className="lg-image-grid lg-gallery-grid">
          {GUIDE_GALLERY_IMAGE_OPTIONS.map((src) => (
            <button
              key={src}
              type="button"
              className={`lg-image-option ${draft.selectedGalleryImages.includes(src) ? 'lg-image-option--selected' : ''}`}
              onClick={() => {
                const imgs = draft.selectedGalleryImages.includes(src)
                  ? draft.selectedGalleryImages.filter((i) => i !== src)
                  : [...draft.selectedGalleryImages, src];
                updateDraft({ selectedGalleryImages: imgs });
              }}
            >
              <img src={src} alt="Gallery option" />
            </button>
          ))}
        </div>
      </fieldset>
    </div>
  );
}

interface Step3Props {
  draft: PrototypeGuideApplication;
  errors: RegistrationErrors;
  setDraft: React.Dispatch<React.SetStateAction<PrototypeGuideApplication>>;
}

function Step3({ draft, errors, setDraft }: Step3Props) {
  function updateDay(index: number, field: string, value: string | boolean) {
    setDraft((prev) => ({
      ...prev,
      weeklyAvailability: {
        ...prev.weeklyAvailability,
        schedule: prev.weeklyAvailability.schedule.map((d, i) =>
          i === index ? { ...d, [field]: value } : d,
        ),
      },
    }));
  }

  return (
    <div className="lg-register-step">
      <div className="lg-step-heading"><span>03</span><div><h2>Set Your Availability</h2><p>Choose a weekly pattern travelers can understand at a glance.</p></div></div>
      {errors.availability && <p className="lg-field-error">{errors.availability}</p>}

      <div className="lg-schedule-editor">
        {draft.weeklyAvailability.schedule.map((day, i) => (
          <div key={day.day} className={`lg-schedule-row ${day.available ? '' : 'disabled'}`}>
            <label className="lg-schedule-toggle">
              <input type="checkbox" checked={day.available} onChange={(e) => updateDay(i, 'available', e.target.checked)} />
              <span>{day.day}</span>
            </label>
            {day.available && (
              <div className="lg-schedule-times">
                <input type="time" value={day.startTime} onChange={(e) => updateDay(i, 'startTime', e.target.value)} />
                <span>to</span>
                <input type="time" value={day.endTime} onChange={(e) => updateDay(i, 'endTime', e.target.value)} />
                {errors[`time_${day.day}`] && <span className="lg-field-error">{errors[`time_${day.day}`]}</span>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

interface Step4Props {
  draft: PrototypeGuideApplication;
  errors: RegistrationErrors;
  setDraft: React.Dispatch<React.SetStateAction<PrototypeGuideApplication>>;
}

function Step4({ draft, errors, setDraft }: Step4Props) {
  function toggleVerification(field: keyof typeof draft.verification, value: boolean | string) {
    setDraft((prev) => ({
      ...prev,
      verification: { ...prev.verification, [field]: value },
    }));
  }

  return (
    <div className="lg-register-step">
      <div className="lg-step-heading"><span>04</span><div><h2>Review & Submit</h2><p>Check how your application is organized before submitting the demo.</p></div></div>

      <div className="lg-review-groups">
        {createRegistrationReviewGroups(draft).map((group) => (
          <section className="lg-review-group" key={group.title}>
            <h3>{group.title}</h3>
            <dl>{group.items.map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl>
          </section>
        ))}
      </div>

      <fieldset className="lg-verification-checklist">
        <legend>Verification (prototype — demo only)</legend>
        <label className="lg-check-item">
          <input
            type="checkbox"
            checked={draft.verification.identityDocument === 'verified-demo'}
            onChange={(e) => toggleVerification('identityDocument', e.target.checked ? 'verified-demo' : 'not-started')}
          />
          <span>Identity document (demo verification)</span>
        </label>
        <label className="lg-check-item">
          <input
            type="checkbox"
            checked={draft.verification.profilePhotoMatch}
            onChange={(e) => toggleVerification('profilePhotoMatch', e.target.checked)}
          />
          <span>Profile photo match</span>
        </label>
        <label className="lg-check-item">
          <input
            type="checkbox"
            checked={draft.verification.languageAssessment === 'completed-demo'}
            onChange={(e) => toggleVerification('languageAssessment', e.target.checked ? 'completed-demo' : 'not-started')}
          />
          <span>Language assessment (demo)</span>
        </label>
        <label className="lg-check-item">
          <input
            type="checkbox"
            checked={draft.verification.videoSubmitted}
            onChange={(e) => toggleVerification('videoSubmitted', e.target.checked)}
          />
          <span>Video intro submitted</span>
        </label>
        <label className="lg-check-item">
          <input
            type="checkbox"
            checked={draft.verification.payoutSetup === 'completed-demo'}
            onChange={(e) => toggleVerification('payoutSetup', e.target.checked ? 'completed-demo' : 'not-started')}
          />
          <span>Payout setup (demo)</span>
        </label>
        <label className="lg-check-item">
          <input
            type="checkbox"
            checked={draft.verification.termsAccepted}
            onChange={(e) => toggleVerification('termsAccepted', e.target.checked)}
          />
          <span>Accept Terms & Conditions *</span>
        </label>
        {errors.termsAccepted && <span className="lg-field-error">{errors.termsAccepted}</span>}
      </fieldset>
    </div>
  );
}

import { useState } from 'react';

import type { RequestGuideDraft } from '../home/requestGuideValidation';
import type { PrototypeGuideProfile } from './guideProfileData';
import {
  calculatePrototypePrice,
  normalizePrototypeBookingDraft,
  PROTOTYPE_DURATION_OPTIONS,
  validatePrototypeBookingDraft,
} from './bookingPrototype';

import type {
  PrototypeBookingDraft,
  PrototypeBookingErrors,
  PrototypeDurationHours,
} from './bookingPrototype';

interface BookingDetailsFormProps {
  guide: PrototypeGuideProfile;
  request: RequestGuideDraft | null;
  draft: PrototypeBookingDraft;
  onDraftChange: (draft: PrototypeBookingDraft) => void;
  onSubmit: (draft: PrototypeBookingDraft) => void;
}

function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? <p id={id} className="prototype-field-error" role="alert">{message}</p> : null;
}

export default function BookingDetailsForm({
  guide,
  request,
  draft,
  onDraftChange,
  onSubmit,
}: BookingDetailsFormProps) {
  const [errors, setErrors] = useState<PrototypeBookingErrors>({});

  const update = <Key extends keyof PrototypeBookingDraft>(
    key: Key,
    value: PrototypeBookingDraft[Key],
  ) => {
    onDraftChange({ ...draft, [key]: value });
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const updateDuration = (durationHours: PrototypeDurationHours) => {
    onDraftChange({
      ...draft,
      durationHours,
      price: calculatePrototypePrice(
        guide.hourlyRate ?? 0,
        durationHours,
        guide.currency ?? 'USD',
      ),
    });
    setErrors((current) => ({ ...current, durationHours: undefined }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized = normalizePrototypeBookingDraft(draft, guide);
    const nextErrors = validatePrototypeBookingDraft(normalized, guide, request);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) onSubmit(normalized);
  };

  return (
    <form id="prototype-booking-form" className="prototype-booking-form" onSubmit={handleSubmit} noValidate>
      <section className="prototype-form-section" aria-labelledby="schedule-title">
        <div className="prototype-section-heading">
          <span>1</span>
          <div><h2 id="schedule-title">Date and time</h2><p>Choose a time that works for your group.</p></div>
        </div>
        <div className="prototype-form-grid">
          <div className="prototype-field">
            <label htmlFor="prototype-booking-date">Booking Date <span aria-hidden="true">*</span></label>
            <input
              id="prototype-booking-date"
              type="date"
              value={draft.bookingDate}
              min={request?.startDate}
              max={request?.endDate}
              aria-invalid={Boolean(errors.bookingDate)}
              aria-describedby={errors.bookingDate ? 'prototype-booking-date-error' : undefined}
              onChange={(event) => update('bookingDate', event.target.value)}
            />
            <FieldError id="prototype-booking-date-error" message={errors.bookingDate} />
          </div>
          <div className="prototype-field">
            <label htmlFor="prototype-start-time">Start Time <span aria-hidden="true">*</span></label>
            <input
              id="prototype-start-time"
              type="time"
              value={draft.startTime}
              aria-invalid={Boolean(errors.startTime)}
              aria-describedby={errors.startTime ? 'prototype-start-time-error' : undefined}
              onChange={(event) => update('startTime', event.target.value)}
            />
            <FieldError id="prototype-start-time-error" message={errors.startTime} />
          </div>
          <div className="prototype-field prototype-field-wide">
            <label htmlFor="prototype-duration">Duration <span aria-hidden="true">*</span></label>
            <select
              id="prototype-duration"
              value={draft.durationHours}
              aria-invalid={Boolean(errors.durationHours)}
              onChange={(event) => updateDuration(Number(event.target.value) as PrototypeDurationHours)}
            >
              {PROTOTYPE_DURATION_OPTIONS.map((duration) => (
                <option key={duration} value={duration}>{duration === 8 ? '8 hours / Full day' : `${duration} hours`}</option>
              ))}
            </select>
            <FieldError id="prototype-duration-error" message={errors.durationHours} />
          </div>
        </div>
      </section>

      <section className="prototype-form-section" aria-labelledby="experience-title">
        <div className="prototype-section-heading">
          <span>2</span>
          <div><h2 id="experience-title">Primary experience</h2><p>Pick one focus supported by {guide.name}.</p></div>
        </div>
        <fieldset className="prototype-choice-group" aria-describedby={errors.experiencePreference ? 'prototype-experience-error' : undefined}>
          <legend className="sr-only">Choose a primary experience</legend>
          {guide.experiences.map((experience) => (
            <label key={experience}>
              <input
                type="radio"
                name="prototype-experience"
                value={experience}
                checked={draft.experiencePreference === experience}
                onChange={() => update('experiencePreference', experience)}
              />
              <span>{experience}</span>
            </label>
          ))}
        </fieldset>
        <FieldError id="prototype-experience-error" message={errors.experiencePreference} />
      </section>

      <section className="prototype-form-section" aria-labelledby="meeting-title">
        <div className="prototype-section-heading">
          <span>3</span>
          <div><h2 id="meeting-title">Meeting and contact</h2><p>Prototype details only—nothing is transmitted.</p></div>
        </div>
        <div className="prototype-form-grid">
          {!request && (
            <div className="prototype-field">
              <label htmlFor="prototype-group-size">Group Size <span aria-hidden="true">*</span></label>
              <input
                id="prototype-group-size"
                type="number"
                min="1"
                value={draft.groupSize}
                aria-invalid={Boolean(errors.groupSize)}
                onChange={(event) => update('groupSize', Number(event.target.value))}
              />
              <FieldError id="prototype-group-size-error" message={errors.groupSize} />
            </div>
          )}
          <div className={`prototype-field ${request ? 'prototype-field-wide' : ''}`}>
            <label htmlFor="prototype-meeting-point">Meeting Point / Hotel <span aria-hidden="true">*</span></label>
            <input
              id="prototype-meeting-point"
              type="text"
              value={draft.meetingPoint}
              placeholder="e.g. Hotel lobby or Ben Thanh Market Gate 1"
              aria-invalid={Boolean(errors.meetingPoint)}
              aria-describedby={errors.meetingPoint ? 'prototype-meeting-point-error' : undefined}
              onChange={(event) => update('meetingPoint', event.target.value)}
            />
            <FieldError id="prototype-meeting-point-error" message={errors.meetingPoint} />
          </div>
          <div className="prototype-field">
            <label htmlFor="prototype-contact-name">Contact Name <span aria-hidden="true">*</span></label>
            <input id="prototype-contact-name" type="text" value={draft.contactName} aria-invalid={Boolean(errors.contactName)} aria-describedby={errors.contactName ? 'prototype-contact-name-error' : undefined} onChange={(event) => update('contactName', event.target.value)} />
            <FieldError id="prototype-contact-name-error" message={errors.contactName} />
          </div>
          <div className="prototype-field">
            <label htmlFor="prototype-contact-email">Contact Email <span aria-hidden="true">*</span></label>
            <input id="prototype-contact-email" type="email" value={draft.contactEmail} placeholder="name@example.com" aria-invalid={Boolean(errors.contactEmail)} aria-describedby={errors.contactEmail ? 'prototype-contact-email-error' : undefined} onChange={(event) => update('contactEmail', event.target.value)} />
            <FieldError id="prototype-contact-email-error" message={errors.contactEmail} />
          </div>
          <div className="prototype-field prototype-field-wide">
            <label htmlFor="prototype-contact-phone">Contact Phone <span>(optional)</span></label>
            <input id="prototype-contact-phone" type="tel" value={draft.contactPhone} placeholder="For this demo only" onChange={(event) => update('contactPhone', event.target.value)} />
          </div>
          <div className="prototype-field prototype-field-wide">
            <label htmlFor="prototype-notes">Notes for the Guide <span>(optional)</span></label>
            <textarea id="prototype-notes" value={draft.notes} placeholder="Pace, accessibility, food preferences or helpful context" onChange={(event) => update('notes', event.target.value)} />
          </div>
        </div>
      </section>

      <button type="submit" className="btn btn-accent prototype-mobile-submit">Continue to Payment</button>
    </form>
  );
}

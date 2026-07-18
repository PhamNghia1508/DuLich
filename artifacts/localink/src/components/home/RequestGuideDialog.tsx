import { useEffect, useState, type FormEvent } from 'react';
import { Languages, MapPin, UsersRound } from 'lucide-react';

import { SUPPORTED_LANGUAGES } from '@/data/mockData';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  EMPTY_REQUEST_GUIDE_DRAFT,
  validateRequestGuideDraft,
  type RequestGuideDraft,
  type RequestGuideErrors,
} from './requestGuideValidation';

const EXPERIENCE_OPTIONS = [
  'Food & Culture',
  'Shopping',
  'History',
  'Nature',
  'Nightlife',
  'Local Life',
  'Surprise Me',
];

interface RequestGuideDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (draft: RequestGuideDraft) => void;
}

export default function RequestGuideDialog({
  open,
  onOpenChange,
  onSubmit,
}: RequestGuideDialogProps) {
  const [draft, setDraft] = useState<RequestGuideDraft>({
    ...EMPTY_REQUEST_GUIDE_DRAFT,
  });
  const [errors, setErrors] = useState<RequestGuideErrors>({});

  useEffect(() => {
    if (!open) {
      setDraft({ ...EMPTY_REQUEST_GUIDE_DRAFT });
      setErrors({});
    }
  }, [open]);

  const clearError = (field: keyof RequestGuideErrors) => {
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const toggleLanguage = (code: string) => {
    setDraft((current) => ({
      ...current,
      languages: current.languages.includes(code)
        ? current.languages.filter((language) => language !== code)
        : [...current.languages, code],
    }));
    clearError('languages');
  };

  const toggleExperience = (experience: string) => {
    setDraft((current) => ({
      ...current,
      experiencePreferences: current.experiencePreferences.includes(experience)
        ? current.experiencePreferences.filter((item) => item !== experience)
        : [...current.experiencePreferences, experience],
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateRequestGuideDraft(draft);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    onSubmit({
      ...draft,
      destination: draft.destination.trim(),
      additionalInformation: draft.additionalInformation.trim(),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="request-guide-dialog">
        <DialogHeader className="request-dialog-header">
          <span className="request-dialog-kicker">Plan with a local</span>
          <DialogTitle>Request a Local Guide</DialogTitle>
          <DialogDescription>
            Share the essentials and we'll use them to find local guides who fit your trip.
          </DialogDescription>
        </DialogHeader>

        <form className="request-form" onSubmit={handleSubmit} noValidate>
          <div className="request-form-grid">
            <div className="request-field">
              <label htmlFor="request-destination">
                Destination / Area <span aria-hidden="true">*</span>
              </label>
              <div className="request-input-wrap">
                <MapPin aria-hidden="true" size={17} />
                <input
                  id="request-destination"
                  value={draft.destination}
                  onChange={(event) => {
                    setDraft((current) => ({ ...current, destination: event.target.value }));
                    clearError('destination');
                  }}
                  placeholder="e.g. Ho Chi Minh City, District 1"
                  aria-invalid={Boolean(errors.destination)}
                  aria-describedby={errors.destination ? 'request-destination-error' : undefined}
                />
              </div>
              {errors.destination && (
                <p id="request-destination-error" className="request-error" role="alert">
                  {errors.destination}
                </p>
              )}
            </div>

            <div className="request-field">
              <label htmlFor="request-group-size">
                Group Size <span aria-hidden="true">*</span>
              </label>
              <div className="request-input-wrap">
                <UsersRound aria-hidden="true" size={17} />
                <input
                  id="request-group-size"
                  type="number"
                  min="1"
                  inputMode="numeric"
                  value={draft.groupSize}
                  onChange={(event) => {
                    setDraft((current) => ({
                      ...current,
                      groupSize: Number(event.target.value),
                    }));
                    clearError('groupSize');
                  }}
                  aria-invalid={Boolean(errors.groupSize)}
                  aria-describedby={errors.groupSize ? 'request-group-size-error' : undefined}
                />
              </div>
              {errors.groupSize && (
                <p id="request-group-size-error" className="request-error" role="alert">
                  {errors.groupSize}
                </p>
              )}
            </div>

            <fieldset className="request-field request-field-wide">
              <legend>
                <Languages aria-hidden="true" size={16} />
                Languages <span aria-hidden="true">*</span>
              </legend>
              <div
                className="request-choice-grid request-language-grid"
                aria-describedby={errors.languages ? 'request-languages-error' : undefined}
              >
                {SUPPORTED_LANGUAGES.map((language) => (
                  <label className="request-choice" key={language.code}>
                    <input
                      type="checkbox"
                      checked={draft.languages.includes(language.code)}
                      onChange={() => toggleLanguage(language.code)}
                    />
                    <span>{language.name}</span>
                  </label>
                ))}
              </div>
              {errors.languages && (
                <p id="request-languages-error" className="request-error" role="alert">
                  {errors.languages}
                </p>
              )}
            </fieldset>

            <div className="request-field">
              <label htmlFor="request-start-date">
                Start Date <span aria-hidden="true">*</span>
              </label>
              <input
                id="request-start-date"
                className="request-input"
                type="date"
                value={draft.startDate}
                onChange={(event) => {
                  setDraft((current) => ({ ...current, startDate: event.target.value }));
                  clearError('startDate');
                  clearError('endDate');
                }}
                aria-invalid={Boolean(errors.startDate)}
                aria-describedby={errors.startDate ? 'request-start-date-error' : undefined}
              />
              {errors.startDate && (
                <p id="request-start-date-error" className="request-error" role="alert">
                  {errors.startDate}
                </p>
              )}
            </div>

            <div className="request-field">
              <label htmlFor="request-end-date">
                End Date <span aria-hidden="true">*</span>
              </label>
              <input
                id="request-end-date"
                className="request-input"
                type="date"
                min={draft.startDate || undefined}
                value={draft.endDate}
                onChange={(event) => {
                  setDraft((current) => ({ ...current, endDate: event.target.value }));
                  clearError('endDate');
                }}
                aria-invalid={Boolean(errors.endDate)}
                aria-describedby={errors.endDate ? 'request-end-date-error' : undefined}
              />
              {errors.endDate && (
                <p id="request-end-date-error" className="request-error" role="alert">
                  {errors.endDate}
                </p>
              )}
            </div>

            <fieldset className="request-field request-field-wide">
              <legend>Experience Preferences</legend>
              <div className="request-choice-grid request-experience-grid">
                {EXPERIENCE_OPTIONS.map((experience) => (
                  <label className="request-choice" key={experience}>
                    <input
                      type="checkbox"
                      checked={draft.experiencePreferences.includes(experience)}
                      onChange={() => toggleExperience(experience)}
                    />
                    <span>{experience}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="request-field request-field-wide">
              <label htmlFor="request-additional-information">Additional Information</label>
              <textarea
                id="request-additional-information"
                value={draft.additionalInformation}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    additionalInformation: event.target.value,
                  }))
                }
                placeholder="Tell us about accessibility needs, interests, or anything that would make the experience more comfortable."
                rows={3}
              />
            </div>
          </div>

          <div className="request-form-footer">
            <button type="submit" className="btn btn-accent btn-lg">
              Find My Local Guide
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

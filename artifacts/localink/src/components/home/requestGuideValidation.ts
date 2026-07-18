export interface RequestGuideDraft {
  destination: string;
  languages: string[];
  groupSize: number;
  startDate: string;
  endDate: string;
  experiencePreferences: string[];
  additionalInformation: string;
}

type RequiredRequestGuideField =
  | 'destination'
  | 'languages'
  | 'groupSize'
  | 'startDate'
  | 'endDate';

export type RequestGuideErrors = Partial<
  Record<RequiredRequestGuideField, string>
>;

export const EMPTY_REQUEST_GUIDE_DRAFT: RequestGuideDraft = {
  destination: '',
  languages: [],
  groupSize: 1,
  startDate: '',
  endDate: '',
  experiencePreferences: [],
  additionalInformation: '',
};

export function validateRequestGuideDraft(
  draft: RequestGuideDraft,
): RequestGuideErrors {
  const errors: RequestGuideErrors = {};

  if (!draft.destination.trim()) {
    errors.destination = 'Enter a destination or area.';
  }

  if (draft.languages.length === 0) {
    errors.languages = 'Select at least one language.';
  }

  if (!Number.isFinite(draft.groupSize) || draft.groupSize <= 0) {
    errors.groupSize = 'Group size must be greater than 0.';
  }

  if (!draft.startDate) {
    errors.startDate = 'Select a start date.';
  }

  if (!draft.endDate) {
    errors.endDate = 'Select an end date.';
  } else if (draft.startDate && draft.endDate < draft.startDate) {
    errors.endDate = 'End date cannot be before start date.';
  }

  return errors;
}

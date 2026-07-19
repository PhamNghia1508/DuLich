export const GUIDE_CITY_OPTIONS = [
  'Ho Chi Minh City',
  'Hanoi',
  'Da Nang',
  'Hoi An',
  'Hue',
  'Nha Trang',
] as const;

export const GUIDE_AREA_OPTIONS: Record<string, string[]> = {
  'Ho Chi Minh City': ['District 1', 'District 3', 'District 5', 'Cholon', 'Bui Vien', 'Cu Chi'],
  'Hanoi': ['Old Quarter', 'West Lake', 'Ninh Binh', 'Ba Dinh'],
  'Da Nang': ['Hoi An', 'My Khe Beach', 'Son Tra', 'Ba Na Hills'],
  'Hoi An': ['Ancient Town', 'Cam Thanh', 'Da Nang', 'My Son'],
  'Hue': ['Imperial City', 'Perfume River', 'Thien Mu'],
  'Nha Trang': ['City Center', 'Vinpearl', 'Long Son'],
};

export const GUIDE_LANGUAGE_OPTIONS = [
  { code: 'en', name: 'English' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'fr', name: 'French' },
  { code: 'es', name: 'Spanish' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'de', name: 'German' },
  { code: 'ru', name: 'Russian' },
] as const;

export const GUIDE_EXPERIENCE_OPTIONS = [
  'Food & Culture',
  'Local Life',
  'History',
  'Shopping',
  'Nature',
  'Nightlife',
  'Architecture',
  'Photography',
] as const;

export const GUIDE_SPECIALTY_OPTIONS = [
  'Street food expert',
  'History enthusiast',
  'Photography guide',
  'Night market specialist',
  'Nature trail leader',
  'Cultural storyteller',
  'Architecture lover',
  'Family-friendly tours',
] as const;

export const GUIDE_STYLE_OPTIONS = [
  'Relaxed & flexible',
  'Structured & educational',
  'Adventurous',
  'Photography-focused',
  'Family-oriented',
  'Off the beaten path',
] as const;

export const GUIDE_PROFILE_IMAGE_OPTIONS = [
  '/images/guides/linh.webp',
  '/images/guides/minh.webp',
  '/images/guides/thu.webp',
  '/images/guides/yuki.webp',
  '/images/guides/bao.webp',
  '/images/guides/huy.webp',
  '/images/guides/kate.webp',
  '/images/guides/ren.webp',
] as const;

export const GUIDE_GALLERY_IMAGE_OPTIONS = [
  '/images/experiences/hidden-hoi-an.webp',
  '/images/experiences/photography-vietnam.webp',
  '/images/experiences/culture.webp',
  '/images/hero/local-guide-conversation.webp',
  '/images/local-guide-hero-v2.webp',
] as const;

export interface PrototypeGuideWeekday {
  day: string;
  available: boolean;
  startTime: string;
  endTime: string;
}

export interface PrototypeGuideWeeklyAvailability {
  schedule: PrototypeGuideWeekday[];
  minBookingHours: number;
  maxBookingsPerDay: number;
  advanceNoticeDays: number;
  maxGroupSize: number;
  meetingAreas: string[];
}

export interface PrototypeGuideVerification {
  identityDocument: 'not-started' | 'uploaded' | 'verified-demo';
  profilePhotoMatch: boolean;
  languageAssessment: 'not-started' | 'completed-demo';
  videoSubmitted: boolean;
  termsAccepted: boolean;
  payoutSetup: 'not-started' | 'completed-demo';
}

export interface PrototypeGuideApplication {
  id: string;
  fullName: string;
  displayName: string;
  email: string;
  phone: string;
  city: string;
  operatingAreas: string[];
  languages: string[];
  experienceYears: number;
  tagline: string;
  bio: string;
  guidingPhilosophy: string;
  specialties: string[];
  guideStyles: string[];
  experienceTypes: string[];
  hourlyRate: number;
  maxGroupSize: number;
  selectedProfileImage: string;
  selectedGalleryImages: string[];
  selectedVideoThumbnail: string;
  weeklyAvailability: PrototypeGuideWeeklyAvailability;
  verification: PrototypeGuideVerification;
  status: 'draft' | 'submitted';
}

export type RegistrationStep = 1 | 2 | 3 | 4;

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function createDefaultWeeklyAvailability(): PrototypeGuideWeeklyAvailability {
  return {
    schedule: WEEKDAYS.map((day, i) => ({
      day,
      available: i < 5,
      startTime: '08:00',
      endTime: '17:00',
    })),
    minBookingHours: 2,
    maxBookingsPerDay: 3,
    advanceNoticeDays: 2,
    maxGroupSize: 6,
    meetingAreas: [],
  };
}

export function createDefaultVerification(): PrototypeGuideVerification {
  return {
    identityDocument: 'not-started',
    profilePhotoMatch: false,
    languageAssessment: 'not-started',
    videoSubmitted: false,
    termsAccepted: false,
    payoutSetup: 'not-started',
  };
}

export function createDefaultRegistrationDraft(): PrototypeGuideApplication {
  return {
    id: '',
    fullName: '',
    displayName: '',
    email: '',
    phone: '',
    city: '',
    operatingAreas: [],
    languages: [],
    experienceYears: 0,
    tagline: '',
    bio: '',
    guidingPhilosophy: '',
    specialties: [],
    guideStyles: [],
    experienceTypes: [],
    hourlyRate: 0,
    maxGroupSize: 0,
    selectedProfileImage: '',
    selectedGalleryImages: [],
    selectedVideoThumbnail: '',
    weeklyAvailability: createDefaultWeeklyAvailability(),
    verification: createDefaultVerification(),
    status: 'draft',
  };
}

export type RegistrationErrors = Partial<Record<string, string>>;

export function validateStep1(draft: PrototypeGuideApplication): RegistrationErrors {
  const errors: RegistrationErrors = {};
  if (!draft.fullName.trim()) errors.fullName = 'Full name is required.';
  if (!draft.displayName.trim()) errors.displayName = 'Display name is required.';
  if (!/^\S+@\S+\.\S+$/.test(draft.email.trim())) errors.email = 'Enter a valid email address.';
  if (!draft.city) errors.city = 'Choose a city.';
  if (draft.operatingAreas.length === 0) errors.operatingAreas = 'Select at least one operating area.';
  if (draft.languages.length === 0) errors.languages = 'Select at least one language.';
  if (!Number.isFinite(draft.experienceYears) || draft.experienceYears < 0) {
    errors.experienceYears = 'Experience years must be zero or more.';
  }
  return errors;
}

export function validateStep2(draft: PrototypeGuideApplication): RegistrationErrors {
  const errors: RegistrationErrors = {};
  if (!draft.selectedProfileImage) errors.selectedProfileImage = 'Select a profile photo.';
  if (!draft.tagline.trim()) errors.tagline = 'Write a short tagline.';
  if (!draft.bio.trim()) errors.bio = 'Write an about section.';
  if (draft.specialties.length === 0) errors.specialties = 'Select at least one specialty.';
  if (draft.guideStyles.length === 0) errors.guideStyles = 'Select at least one guide style.';
  if (draft.experienceTypes.length === 0) errors.experienceTypes = 'Select at least one experience type.';
  if (!Number.isFinite(draft.hourlyRate) || draft.hourlyRate <= 0) {
    errors.hourlyRate = 'Hourly rate must be greater than zero.';
  }
  if (!Number.isFinite(draft.maxGroupSize) || draft.maxGroupSize <= 0) {
    errors.maxGroupSize = 'Maximum group size must be greater than zero.';
  }
  return errors;
}

export function validateStep3(draft: PrototypeGuideApplication): RegistrationErrors {
  const errors: RegistrationErrors = {};
  const { schedule } = draft.weeklyAvailability;
  const hasAvailableDay = schedule.some((d) => d.available);
  if (!hasAvailableDay) errors.availability = 'At least one day must be available.';

  for (const day of schedule) {
    if (day.available && day.endTime <= day.startTime) {
      errors[`time_${day.day}`] = `${day.day}: end time must be after start time.`;
    }
  }

  if (draft.weeklyAvailability.maxGroupSize <= 0) {
    errors.maxGroupSize = 'Maximum group size must be greater than zero.';
  }
  return errors;
}

export function validateStep4(draft: PrototypeGuideApplication): RegistrationErrors {
  const errors: RegistrationErrors = {};
  if (!draft.verification.termsAccepted) errors.termsAccepted = 'You must accept the terms.';
  return errors;
}

export function validateRegistrationStep(step: RegistrationStep, draft: PrototypeGuideApplication): RegistrationErrors {
  switch (step) {
    case 1: return validateStep1(draft);
    case 2: return validateStep2(draft);
    case 3: return validateStep3(draft);
    case 4: return validateStep4(draft);
  }
}

export function hasErrors(errors: RegistrationErrors): boolean {
  return Object.keys(errors).length > 0;
}

interface CompletenessResult {
  percentage: number;
  completed: string[];
  missing: string[];
}

const COMPLETENESS_CHECKS: { label: string; check: (d: PrototypeGuideApplication) => boolean }[] = [
  { label: 'Full name', check: (d) => !!d.fullName.trim() },
  { label: 'Display name', check: (d) => !!d.displayName.trim() },
  { label: 'Email', check: (d) => /^\S+@\S+\.\S+$/.test(d.email.trim()) },
  { label: 'City', check: (d) => !!d.city },
  { label: 'Operating areas', check: (d) => d.operatingAreas.length > 0 },
  { label: 'Languages', check: (d) => d.languages.length > 0 },
  { label: 'Profile photo', check: (d) => !!d.selectedProfileImage },
  { label: 'Tagline', check: (d) => !!d.tagline.trim() },
  { label: 'About me', check: (d) => !!d.bio.trim() },
  { label: 'Specialties', check: (d) => d.specialties.length > 0 },
  { label: 'Guide styles', check: (d) => d.guideStyles.length > 0 },
  { label: 'Experience types', check: (d) => d.experienceTypes.length > 0 },
  { label: 'Hourly rate', check: (d) => d.hourlyRate > 0 },
  { label: 'Max group size', check: (d) => d.maxGroupSize > 0 },
  { label: 'Availability', check: (d) => d.weeklyAvailability.schedule.some((s) => s.available) },
  { label: 'Terms accepted', check: (d) => d.verification.termsAccepted },
];

export function calculateGuideProfileCompleteness(draft: PrototypeGuideApplication): CompletenessResult {
  const completed: string[] = [];
  const missing: string[] = [];

  for (const item of COMPLETENESS_CHECKS) {
    if (item.check(draft)) {
      completed.push(item.label);
    } else {
      missing.push(item.label);
    }
  }

  const percentage = Math.round((completed.length / COMPLETENESS_CHECKS.length) * 100);
  return { percentage, completed, missing };
}

export function normalizeApplication(draft: PrototypeGuideApplication): PrototypeGuideApplication {
  const guideToken = draft.displayName.trim().replace(/\s+/g, '-').toLowerCase().slice(0, 20);
  const dateToken = Date.now().toString(36);
  return {
    ...draft,
    id: `app-${guideToken}-${dateToken}`,
    fullName: draft.fullName.trim(),
    displayName: draft.displayName.trim(),
    email: draft.email.trim(),
    phone: draft.phone.trim(),
    tagline: draft.tagline.trim(),
    bio: draft.bio.trim(),
    guidingPhilosophy: draft.guidingPhilosophy.trim(),
    status: 'submitted',
  };
}

export const REGISTRATION_STEPS: { step: RegistrationStep; label: string }[] = [
  { step: 1, label: 'Basic Info' },
  { step: 2, label: 'Profile' },
  { step: 3, label: 'Availability' },
  { step: 4, label: 'Review' },
];

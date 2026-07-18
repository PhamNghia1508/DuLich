import { GUIDES } from '../../data/mockData.ts';
import { MOCK_GUIDES } from '../home/mockGuideData.ts';
import type { RequestGuideDraft } from '../home/requestGuideValidation.ts';
import {
  calculatePrototypePrice,
  createInitialBookingDraft,
} from './bookingPrototype.ts';
import {
  getGuideRecommendation,
  getPrototypeGuideProfile,
} from './guideProfileData.ts';

import type { PrototypeDurationHours } from './bookingPrototype.ts';
import type { TravelerRecommendation } from './guideProfileData.ts';

export type RichAvailabilityStatus = 'available' | 'hold' | 'booked';

export interface RichGuideExperience {
  id: string;
  name: string;
  duration: string;
  description: string;
  highlights: string[];
  image: string;
}

export interface RichGuideCredential {
  title: string;
  detail: string;
}

export interface RichGuideReview {
  id: string;
  reviewerName: string;
  country: string;
  date: string;
  rating: number;
  comment: string;
  experience: string;
  avatar: string;
}

export interface RichGuideAvailabilitySlot {
  time: string;
  label: string;
  status: RichAvailabilityStatus;
}

export interface RichGuideAvailabilityDay {
  date: string;
  label: string;
  weekday: string;
  dayNumber: string;
  status: RichAvailabilityStatus;
  slots: RichGuideAvailabilitySlot[];
}

export interface RichProfileScheduleSelection {
  date: string;
  time: string;
}

export interface RichProfileBookingDefaults extends RichProfileScheduleSelection {
  durationHours: PrototypeDurationHours;
  groupSize: number;
}

export interface RichRelatedGuide {
  id: string;
  name: string;
  image: string;
  city: string;
  rating: number;
  hourlyRate: number;
  currency: string;
  specialties: string[];
}

export interface RichGuideProfileViewModel {
  id: string;
  displayName: string;
  fullName: string;
  tagline: string;
  heroImage: string;
  galleryImages: string[];
  videoThumbnail: string;
  city: string;
  operatingAreas: string[];
  languages: string[];
  rating: number;
  reviewCount: number;
  completedBookings: number;
  responseTime: string;
  hourlyRate: number;
  currency: string;
  verified: boolean;
  availabilityLabel: string;
  bestGroupSize: string;
  pace: string;
  guideStyles: string[];
  specialties: string[];
  story: string;
  localKnowledge: string;
  guidingPhilosophy: string;
  experiences: RichGuideExperience[];
  credentials: RichGuideCredential[];
  reviews: RichGuideReview[];
  availability: RichGuideAvailabilityDay[];
  relatedGuides: RichRelatedGuide[];
  recommendationReasons?: string[];
}

const PROFILE_ONLY_NAMES: Record<string, string> = {
  'prototype-guide-009': 'Mai Zhang',
  'prototype-guide-010': 'Anya Kuznetsova',
  'prototype-guide-011': 'Sofia Rivera',
};

const EXPERIENCE_IMAGE_POOL = [
  '/images/experiences/culture.webp',
  '/images/experiences/hidden-hoi-an.webp',
  '/images/experiences/architecture.webp',
  '/images/experiences/accessible-path.webp',
  '/images/experiences/nightlife.webp',
  '/images/experiences/neighborhoods.webp',
  '/images/experiences/photography-vietnam.webp',
  '/images/experiences/family-vietnam.webp',
  '/images/experiences/photography.webp',
  '/images/experiences/accessible.webp',
  '/images/experiences/family.webp',
] as const;

const SPECIALTY_IMAGE_MAP: Record<string, string> = {
  'Food & Culture': '/images/experiences/culture.webp',
  Shopping: '/images/experiences/hidden-hoi-an.webp',
  History: '/images/experiences/architecture.webp',
  Nature: '/images/experiences/accessible-path.webp',
  Nightlife: '/images/experiences/nightlife.webp',
  'Local Life': '/images/experiences/neighborhoods.webp',
};

const REVIEW_AVATARS = [
  '/images/guides/thu.webp',
  '/images/guides/yuki.webp',
  '/images/guides/minh.webp',
  '/images/guides/khoa.webp',
] as const;

const PACE_OPTIONS = [
  'Relaxed, with room for spontaneous stops',
  'Moderate and easy to adapt to your group',
  'Lively, conversational and comfort-aware',
] as const;

const STYLE_OPTIONS = [
  ['Warm storyteller', 'Flexible planner', 'Food curious'],
  ['Calm expert', 'Thoughtful listener', 'History minded'],
  ['Energetic local friend', 'Practical navigator', 'Photo friendly'],
] as const;

const PROFILE_DATES = [
  ['2026-08-10', 'Mon, Aug 10', 'Mon', '10'],
  ['2026-08-11', 'Tue, Aug 11', 'Tue', '11'],
  ['2026-08-12', 'Wed, Aug 12', 'Wed', '12'],
  ['2026-08-13', 'Thu, Aug 13', 'Thu', '13'],
  ['2026-08-14', 'Fri, Aug 14', 'Fri', '14'],
  ['2026-08-15', 'Sat, Aug 15', 'Sat', '15'],
  ['2026-08-16', 'Sun, Aug 16', 'Sun', '16'],
] as const;

const PROFILE_TIMES = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
  '15:00', '16:00', '17:00', '18:00', '19:00', '20:00',
] as const;

function stableSeed(value: string) {
  return Array.from(value).reduce((total, character) => total + character.charCodeAt(0), 0);
}

export function experienceImageForGuide(
  guideId: string,
  specialty: string,
  index: number,
  usedImages: Set<string>,
): string {
  const mapped = SPECIALTY_IMAGE_MAP[specialty];
  if (mapped && !usedImages.has(mapped)) {
    usedImages.add(mapped);
    return mapped;
  }

  const seed = stableSeed(guideId);
  const poolSize = EXPERIENCE_IMAGE_POOL.length;
  for (let attempt = 0; attempt < poolSize; attempt++) {
    const candidate = EXPERIENCE_IMAGE_POOL[(seed + index + attempt) % poolSize];
    if (!usedImages.has(candidate)) {
      usedImages.add(candidate);
      return candidate;
    }
  }

  return EXPERIENCE_IMAGE_POOL[(seed + index) % poolSize];
}

function createExperiences(
  guideId: string,
  guideName: string,
  city: string,
  preferences: readonly string[],
) {
  const legacyGuide = GUIDES.find((guide) => guide.id === guideId);
  const usedImages = new Set<string>();
  const legacyExperiences = legacyGuide?.sampleItineraries.slice(0, 3).map((itinerary, index) => ({
      id: `${guideId}-experience-${index + 1}`,
      name: itinerary.title,
      duration: itinerary.duration,
      description: `A flexible ${city} experience shaped by ${guideName}'s local knowledge and your group's pace.`,
      highlights: [...itinerary.highlights].slice(0, 3),
      image: experienceImageForGuide(guideId, preferences[index % preferences.length] ?? '', index, usedImages),
    })) ?? [];

  const fallbackExperiences = preferences.slice(0, 3).map((preference, index) => ({
    id: `${guideId}-experience-${legacyExperiences.length + index + 1}`,
    name: `${city} ${preference}`,
    duration: index === 0 ? '3 hours' : index === 1 ? '4 hours' : 'Half day',
    description: `Explore ${preference.toLowerCase()} through neighborhoods and conversations selected by ${guideName}.`,
    highlights: [
      `A local perspective on ${preference.toLowerCase()}`,
      `Flexible stops around ${city}`,
      'Pacing adapted to your group',
    ],
    image: experienceImageForGuide(guideId, preference, legacyExperiences.length + index, usedImages),
  }));

  return [...legacyExperiences, ...fallbackExperiences]
    .filter((experience, index, collection) => (
      collection.findIndex((candidate) => candidate.name === experience.name) === index
    ))
    .slice(0, 3);
}

function createCredentials(guideId: string, languages: readonly string[]) {
  const legacyCredentials = GUIDES.find((guide) => guide.id === guideId)?.credentials ?? [];
  const credentials: RichGuideCredential[] = [
    {
      title: 'Profile reviewed',
      detail: 'Identity and marketplace profile reviewed for this prototype.',
    },
    {
      title: 'Language assessment',
      detail: `${languages.slice(0, 3).join(', ')} communication listed on the guide profile.`,
    },
    {
      title: 'Experience-linked reviews',
      detail: 'Traveler feedback is connected to completed mock experiences.',
    },
    ...legacyCredentials.slice(0, 2).map((credential) => ({
      title: credential,
      detail: 'Guide-provided credential included in the marketplace review.',
    })),
  ];

  return credentials;
}

function createReviews(
  guideId: string,
  experiences: readonly RichGuideExperience[],
) {
  const profile = getPrototypeGuideProfile(guideId);
  if (!profile) return [];

  return profile.reviews.map((review, index) => ({
    ...review,
    experience: experiences[index % experiences.length]?.name ?? 'Local city experience',
    avatar: REVIEW_AVATARS[(stableSeed(guideId) + index) % REVIEW_AVATARS.length],
  }));
}

function formatProfileTime(time: string) {
  const [hourText, minute] = time.split(':');
  const hour = Number(hourText);
  return `${hour % 12 || 12}:${minute} ${hour >= 12 ? 'PM' : 'AM'}`;
}

function createAvailability(guideId: string): RichGuideAvailabilityDay[] {
  const profile = getPrototypeGuideProfile(guideId);
  if (!profile) return [];
  const seed = stableSeed(guideId);
  const availableDates = profile.availability
    .filter((day) => day.available)
    .map((day) => day.date);
  const holdDate = availableDates[seed % availableDates.length];

  return PROFILE_DATES.map(([date, label, weekday, dayNumber], dayIndex) => {
    const fullyBooked = profile.availability.find((day) => day.date === date)?.available === false;
    const slots = PROFILE_TIMES.map((time, slotIndex): RichGuideAvailabilitySlot => {
      let status: RichAvailabilityStatus = 'available';
      if (fullyBooked || slotIndex === (seed + dayIndex) % PROFILE_TIMES.length) {
        status = 'booked';
      } else if (date === holdDate && slotIndex % 4 === 1) {
        status = 'hold';
      }
      return { time, label: formatProfileTime(time), status };
    });
    const status: RichAvailabilityStatus = slots.every((slot) => slot.status === 'booked')
      ? 'booked'
      : slots.some((slot) => slot.status === 'hold') ? 'hold' : 'available';

    return { date, label, weekday, dayNumber, status, slots };
  });
}

export function isProfileSlotSelectable(day: RichGuideAvailabilityDay, time: string) {
  const slot = day.slots.find((candidate) => candidate.time === time);
  return slot?.status === 'available' || slot?.status === 'hold';
}

export function changeProfileScheduleDate(
  availability: readonly RichGuideAvailabilityDay[],
  date: string,
  currentTime: string,
): RichProfileScheduleSelection {
  const day = availability.find((candidate) => candidate.date === date);
  return {
    date,
    time: day && isProfileSlotSelectable(day, currentTime) ? currentTime : '',
  };
}

export function createProfileBookingDraftDefaults(
  guideId: string,
  request: RequestGuideDraft | null,
  defaults: RichProfileBookingDefaults,
) {
  const guide = getPrototypeGuideProfile(guideId);
  const draft = createInitialBookingDraft(guide, request);
  if (!guide || !draft) return undefined;

  return {
    ...draft,
    bookingDate: defaults.date,
    startTime: defaults.time,
    durationHours: defaults.durationHours,
    groupSize: defaults.groupSize,
    price: calculatePrototypePrice(
      guide.hourlyRate ?? 0,
      defaults.durationHours,
      guide.currency ?? 'USD',
    ),
  };
}

export function deduplicateGallery(
  galleryImages: readonly string[],
  heroImage: string,
): string[] {
  const seen = new Set<string>([heroImage]);
  const deduped: string[] = [];
  for (const image of galleryImages) {
    if (!seen.has(image)) {
      seen.add(image);
      deduped.push(image);
    }
  }
  if (deduped.length < 5) {
    for (const image of galleryImages) {
      if (!deduped.includes(image)) deduped.push(image);
      if (deduped.length >= 5) break;
    }
  }
  return deduped;
}

export function selectVideoThumbnail(
  galleryImages: readonly string[],
  heroImage: string,
  guideId: string,
): string {
  const seed = stableSeed(guideId);
  const candidates = galleryImages.filter((image) => image !== heroImage);
  if (candidates.length > 0) {
    return candidates[seed % candidates.length];
  }
  return galleryImages[1] ?? heroImage;
}

function createRelatedGuides(currentGuideId: string, city: string): RichRelatedGuide[] {
  return [...MOCK_GUIDES]
    .filter((guide) => guide.id !== currentGuideId)
    .sort((left, right) => Number(right.city === city) - Number(left.city === city))
    .slice(0, 3)
    .map((guide) => ({
      id: guide.id,
      name: guide.name,
      image: guide.image,
      city: guide.city,
      rating: guide.rating,
      hourlyRate: guide.hourlyRate ?? 0,
      currency: guide.currency ?? 'USD',
      specialties: [...guide.experiencePreferences].slice(0, 2),
    }));
}

export function createRichGuideProfileViewModel(
  guideId: string,
  recommendation?: TravelerRecommendation | null,
): RichGuideProfileViewModel | undefined {
  const guide = MOCK_GUIDES.find((candidate) => candidate.id === guideId);
  const profile = getPrototypeGuideProfile(guideId);
  if (!guide || !profile) return undefined;

  const legacyGuide = GUIDES.find((candidate) => candidate.id === guideId);
  const seed = stableSeed(guideId);
  const fullName = legacyGuide
    ? `${legacyGuide.firstName} ${legacyGuide.lastName}`
    : PROFILE_ONLY_NAMES[guideId] ?? guide.name;
  const guideStyles = legacyGuide?.personalityTags.length
    ? legacyGuide.personalityTags.map((tag) => tag.replaceAll('-', ' '))
    : [...STYLE_OPTIONS[seed % STYLE_OPTIONS.length]];
  const specialties = legacyGuide?.specialties.length
    ? [...legacyGuide.specialties]
    : [...guide.experiencePreferences];
  const experiences = createExperiences(
    guideId,
    profile.name,
    guide.city,
    guide.experiencePreferences,
  );

  const rawGallery = [...profile.galleryImages];
  const heroImage = profile.portrait;
  const galleryImages = deduplicateGallery(rawGallery, heroImage);

  return {
    id: guide.id,
    displayName: guide.name,
    fullName,
    tagline: profile.introduction,
    heroImage,
    galleryImages,
    videoThumbnail: selectVideoThumbnail(rawGallery, heroImage, guideId),
    city: guide.city,
    operatingAreas: [...guide.serviceAreas],
    languages: profile.languages.map((language) => language.name),
    rating: guide.rating,
    reviewCount: guide.reviewCount ?? profile.reviewCount,
    completedBookings: legacyGuide?.completedExperiences ?? (guide.reviewCount ?? 40) * 3 + (seed % 31),
    responseTime: profile.responseTime,
    hourlyRate: guide.hourlyRate ?? 0,
    currency: guide.currency ?? 'USD',
    verified: guide.verified,
    availabilityLabel: guide.active ? 'Available for new requests' : 'Limited availability',
    bestGroupSize: `${1 + (seed % 2)}–${5 + (seed % 4)} travelers`,
    pace: PACE_OPTIONS[seed % PACE_OPTIONS.length],
    guideStyles,
    specialties,
    story: profile.about,
    localKnowledge: `${fullName} connects ${guide.serviceAreas.join(', ')} through the people, routines and small details that make ${guide.city} feel local.`,
    guidingPhilosophy: `A memorable day should feel personal rather than scripted. ${profile.name} keeps the plan clear, listens to the group and leaves room for genuine discoveries.`,
    experiences,
    credentials: createCredentials(guideId, profile.languages.map((language) => language.name)),
    reviews: createReviews(guideId, experiences),
    availability: createAvailability(guideId),
    relatedGuides: createRelatedGuides(guideId, guide.city),
    recommendationReasons: getGuideRecommendation(recommendation ?? null, guideId),
  };
}

export function createProfileBookingHandoff(guideId: string) {
  if (!getPrototypeGuideProfile(guideId)) return undefined;
  return {
    selectedGuideId: guideId,
    href: `/booking-handoff/${guideId}`,
  };
}

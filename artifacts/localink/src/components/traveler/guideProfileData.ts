import { GUIDES, REVIEWS, SUPPORTED_LANGUAGES } from '../../data/mockData.ts';
import { MOCK_GUIDES } from '../home/mockGuideData.ts';

import type { RequestGuideDraft } from '../home/requestGuideValidation.ts';

export interface TravelerRecommendation {
  guideId: string;
  matchReasons: string[];
}

export interface PrototypeGuideReview {
  id: string;
  reviewerName: string;
  country: string;
  rating: number;
  date: string;
  comment: string;
}

export interface PrototypeAvailabilityDay {
  date: string;
  label: string;
  available: boolean;
}

export interface PrototypeGuideProfile {
  id: string;
  name: string;
  portrait: string;
  city: string;
  serviceAreas: string[];
  languages: Array<{ code: string; name: string }>;
  experiences: string[];
  hourlyRate?: number;
  currency?: string;
  rating: number;
  reviewCount: number;
  responseTime: string;
  verified: boolean;
  introduction: string;
  about: string;
  experienceYears: number;
  galleryImages: string[];
  reviews: PrototypeGuideReview[];
  availability: PrototypeAvailabilityDay[];
}

export interface BookingHandoffData {
  guide: PrototypeGuideProfile;
  request: RequestGuideDraft | null;
}

const LOCAL_GALLERY_FALLBACKS = [
  '/images/hero/local-guide-conversation.webp',
  '/images/local-guide-hero-v2.webp',
  '/images/experiences/hidden-hoi-an.webp',
  '/images/experiences/photography-vietnam.webp',
  '/images/experiences/culture.webp',
] as const;

const PROTOTYPE_PROFILE_COPY: Record<string, { introduction: string; about: string; experienceYears: number }> = {
  'prototype-guide-009': {
    introduction: 'A Da Nang local who connects coastal nature, thoughtful shopping and everyday neighborhood life.',
    about: 'Mai has spent years helping visitors explore Da Nang beyond the resort strip. She enjoys introducing small makers, relaxed beach neighborhoods and the local routines that make the city feel welcoming.',
    experienceYears: 6,
  },
  'prototype-guide-010': {
    introduction: 'A Hanoi storyteller who brings history, food and daily life together at an easy pace.',
    about: 'Anya knows the Old Quarter, West Lake and day trips beyond Hanoi through the stories of the people who live there. Her style is calm, curious and especially helpful for travelers who want context without a formal lecture.',
    experienceYears: 7,
  },
  'prototype-guide-011': {
    introduction: 'A Hoi An local friend for food, artisan shopping and unhurried neighborhood discoveries.',
    about: 'Sofia builds relaxed walks around family kitchens, local workshops and quiet corners of the ancient town. She enjoys helping multilingual groups feel included while keeping every experience flexible.',
    experienceYears: 5,
  },
};

const FALLBACK_REVIEW_COPY = [
  {
    reviewerName: 'Emma L.',
    country: 'Sweden',
    rating: 5,
    date: '2026-06-12',
    comment: 'A warm, flexible local experience with thoughtful recommendations we would never have found on our own.',
  },
  {
    reviewerName: 'Daniel R.',
    country: 'Singapore',
    rating: 5,
    date: '2026-05-24',
    comment: 'Clear communication, an easy pace and just the right balance of local stories and spontaneous stops.',
  },
] as const;

const AVAILABILITY_DATES = [
  ['2026-08-10', 'Mon, Aug 10'],
  ['2026-08-11', 'Tue, Aug 11'],
  ['2026-08-12', 'Wed, Aug 12'],
  ['2026-08-13', 'Thu, Aug 13'],
  ['2026-08-14', 'Fri, Aug 14'],
  ['2026-08-15', 'Sat, Aug 15'],
] as const;

function languageName(code: string) {
  if (code === 'vi') return 'Vietnamese';
  return SUPPORTED_LANGUAGES.find((language) => language.code === code)?.name ?? code.toUpperCase();
}

function localGallery(images: readonly string[], portrait: string) {
  const localImages = images.filter((image) => image.startsWith('/images/'));
  return Array.from(new Set([portrait, ...localImages, ...LOCAL_GALLERY_FALLBACKS])).slice(0, 5);
}

function availabilityFor(guideId: string): PrototypeAvailabilityDay[] {
  const offset = Array.from(guideId).reduce((total, character) => total + character.charCodeAt(0), 0) % 3;
  return AVAILABILITY_DATES.map(([date, label], index) => ({
    date,
    label,
    available: (index + offset) % 3 !== 1,
  }));
}

function reviewsFor(guideId: string): PrototypeGuideReview[] {
  const guideReviews = REVIEWS.filter((review) => review.guideId === guideId).map((review) => ({
    id: review.id,
    reviewerName: review.travelerName,
    country: review.travelerCountry,
    rating: review.rating,
    date: review.date,
    comment: review.text,
  }));
  const fallbackReviews = FALLBACK_REVIEW_COPY.map((review, index) => ({
    id: `${guideId}-review-${index + 1}`,
    ...review,
  }));

  return [...guideReviews, ...fallbackReviews].slice(0, Math.max(2, Math.min(4, guideReviews.length || 2)));
}

function normalizeProfiles(): PrototypeGuideProfile[] {
  return MOCK_GUIDES.map((guide, index) => {
    const richGuide = GUIDES.find((candidate) => candidate.id === guide.id);
    const prototypeCopy = PROTOTYPE_PROFILE_COPY[guide.id];
    const introduction = richGuide?.shortIntro ?? prototypeCopy?.introduction ?? `A trusted local friend based in ${guide.city}.`;

    return {
      id: guide.profileId ?? guide.id,
      name: guide.name,
      portrait: guide.image,
      city: guide.city,
      serviceAreas: guide.serviceAreas,
      languages: guide.languages.map((code) => ({ code, name: languageName(code) })),
      experiences: guide.experiencePreferences,
      hourlyRate: guide.hourlyRate,
      currency: guide.currency,
      rating: guide.rating,
      reviewCount: guide.reviewCount ?? 0,
      responseTime: guide.responseTime ?? 'Usually responds within an hour',
      verified: guide.verified,
      introduction,
      about: richGuide?.bio ?? prototypeCopy?.about ?? introduction,
      experienceYears: prototypeCopy?.experienceYears ?? 5 + (index % 8),
      galleryImages: localGallery(richGuide?.gallery ?? [], guide.image),
      reviews: reviewsFor(guide.id),
      availability: availabilityFor(guide.id),
    };
  });
}

export const PROTOTYPE_GUIDE_PROFILES: readonly PrototypeGuideProfile[] = normalizeProfiles();

export function getPrototypeGuideProfile(id: string) {
  return PROTOTYPE_GUIDE_PROFILES.find((guide) => guide.id === id);
}

export function getGuideRecommendation(
  recommendation: TravelerRecommendation | null,
  guideId: string,
) {
  if (!recommendation || recommendation.guideId !== guideId) return undefined;
  const reasons = recommendation.matchReasons.filter(Boolean).slice(0, 2);
  return reasons.length ? reasons : undefined;
}

export function createBookingHandoffData(
  guideId: string,
  request: RequestGuideDraft | null,
): BookingHandoffData | undefined {
  const guide = getPrototypeGuideProfile(guideId);
  return guide ? { guide, request } : undefined;
}

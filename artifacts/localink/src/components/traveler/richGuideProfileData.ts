import { GUIDES } from '../../data/mockData.ts';
import { MOCK_GUIDES } from '../home/mockGuideData.ts';
import {
  getGuideRecommendation,
  getPrototypeGuideProfile,
} from './guideProfileData.ts';

import type { TravelerRecommendation } from './guideProfileData.ts';

export type RichAvailabilityStatus = 'available' | 'hold' | 'unavailable';

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

export interface RichGuideAvailabilityDay {
  date: string;
  label: string;
  status: RichAvailabilityStatus;
  timeSlots: string[];
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

const EXPERIENCE_IMAGES: Record<string, string> = {
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

function stableSeed(value: string) {
  return Array.from(value).reduce((total, character) => total + character.charCodeAt(0), 0);
}

function experienceImage(name: string, index: number) {
  return EXPERIENCE_IMAGES[name] ?? [
    '/images/experiences/culture.webp',
    '/images/experiences/photography-vietnam.webp',
    '/images/experiences/family-vietnam.webp',
  ][index % 3];
}

function createExperiences(
  guideId: string,
  guideName: string,
  city: string,
  preferences: readonly string[],
) {
  const legacyGuide = GUIDES.find((guide) => guide.id === guideId);
  const legacyExperiences = legacyGuide?.sampleItineraries.slice(0, 3).map((itinerary, index) => ({
      id: `${guideId}-experience-${index + 1}`,
      name: itinerary.title,
      duration: itinerary.duration,
      description: `A flexible ${city} experience shaped by ${guideName}'s local knowledge and your group's pace.`,
      highlights: [...itinerary.highlights].slice(0, 3),
      image: experienceImage(preferences[index % preferences.length] ?? '', index),
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
    image: experienceImage(preference, index),
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

function createAvailability(guideId: string): RichGuideAvailabilityDay[] {
  const profile = getPrototypeGuideProfile(guideId);
  if (!profile) return [];
  const availableIndices = profile.availability
    .map((day, index) => day.available ? index : -1)
    .filter((index) => index >= 0);
  const holdIndex = availableIndices[stableSeed(guideId) % availableIndices.length];

  return profile.availability.map((day, index) => ({
    date: day.date,
    label: day.label,
    status: !day.available ? 'unavailable' : index === holdIndex ? 'hold' : 'available',
    timeSlots: day.available ? ['09:00', '13:30', '17:00'] : [],
  }));
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

  return {
    id: guide.id,
    displayName: guide.name,
    fullName,
    tagline: profile.introduction,
    heroImage: profile.portrait,
    galleryImages: [...profile.galleryImages],
    videoThumbnail: profile.galleryImages[1] ?? profile.portrait,
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

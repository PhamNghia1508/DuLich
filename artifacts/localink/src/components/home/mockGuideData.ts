import { GUIDES } from '@/data/mockData';

import type { MockGuide } from './guideMatching';

const GUIDE_MATCH_DETAILS: Record<
  string,
  Pick<MockGuide, 'serviceAreas' | 'experiencePreferences'> &
    Partial<Pick<MockGuide, 'unavailableDateRanges'>>
> = {
  'guide-001': {
    serviceAreas: ['District 1', 'District 3', 'Cholon'],
    experiencePreferences: ['Food & Culture', 'Shopping', 'Local Life'],
  },
  'guide-002': {
    serviceAreas: ['District 1', 'District 3', 'Cholon'],
    experiencePreferences: ['History', 'Local Life'],
  },
  'guide-003': {
    serviceAreas: ['District 1', 'District 5', 'Cholon'],
    experiencePreferences: ['Food & Culture', 'Shopping', 'History'],
  },
  'guide-004': {
    serviceAreas: ['District 1', 'Bui Vien'],
    experiencePreferences: ['Nightlife', 'Food & Culture', 'Local Life'],
    unavailableDateRanges: [{ startDate: '2026-07-20', endDate: '2026-07-21' }],
  },
  'guide-005': {
    serviceAreas: ['District 1', 'Cu Chi'],
    experiencePreferences: ['History', 'Food & Culture'],
  },
  'guide-006': {
    serviceAreas: ['District 3', 'District 5'],
    experiencePreferences: ['Local Life', 'Shopping', 'Food & Culture'],
  },
  'guide-007': {
    serviceAreas: ['District 1', 'District 5', 'Cu Chi'],
    experiencePreferences: ['History', 'Shopping', 'Local Life'],
  },
  'guide-008': {
    serviceAreas: ['Can Gio', 'Cu Chi'],
    experiencePreferences: ['Nature', 'History', 'Local Life'],
  },
};

const existingGuides: MockGuide[] = GUIDES.map((guide) => {
  const matchDetails = GUIDE_MATCH_DETAILS[guide.id];

  return {
    id: guide.id,
    profileId: guide.id,
    name: guide.displayName,
    image: guide.avatar,
    city: guide.city,
    serviceAreas: matchDetails.serviceAreas,
    languages: guide.languages.map((language) => language.code),
    experiencePreferences: matchDetails.experiencePreferences,
    hourlyRate: guide.pricing.perHour,
    currency: guide.pricing.currency,
    rating: guide.rating,
    reviewCount: guide.reviewCount,
    responseTime: `Usually responds in ${guide.responseTimeMinutes} min`,
    responseTimeMinutes: guide.responseTimeMinutes,
    verified: guide.verificationStatus === 'verified',
    active: guide.availabilityStatus !== 'unavailable',
    unavailableDateRanges: matchDetails.unavailableDateRanges,
  };
});

const prototypeOnlyGuides: MockGuide[] = [
  {
    id: 'prototype-guide-009',
    name: 'Mai Z.',
    image: '/images/guides/thu.webp',
    city: 'Da Nang',
    serviceAreas: ['Hoi An', 'My Khe Beach', 'Son Tra'],
    languages: ['zh', 'en'],
    experiencePreferences: ['Shopping', 'Nature', 'Local Life'],
    hourlyRate: 19,
    currency: 'USD',
    rating: 4.94,
    reviewCount: 87,
    responseTime: 'Usually responds in 16 min',
    responseTimeMinutes: 16,
    verified: true,
    active: true,
  },
  {
    id: 'prototype-guide-010',
    name: 'Anya K.',
    image: '/images/guides/yuki.webp',
    city: 'Hanoi',
    serviceAreas: ['Old Quarter', 'West Lake', 'Ninh Binh'],
    languages: ['ru', 'en'],
    experiencePreferences: ['History', 'Food & Culture', 'Local Life'],
    hourlyRate: 21,
    currency: 'USD',
    rating: 4.92,
    reviewCount: 74,
    responseTime: 'Usually responds in 24 min',
    responseTimeMinutes: 24,
    verified: true,
    active: true,
  },
  {
    id: 'prototype-guide-011',
    name: 'Sofia R.',
    image: '/images/guides/linh.webp',
    city: 'Hoi An',
    serviceAreas: ['Da Nang', 'Ancient Town', 'Cam Thanh'],
    languages: ['es', 'fr', 'en'],
    experiencePreferences: ['Food & Culture', 'Shopping', 'Local Life'],
    hourlyRate: 20,
    currency: 'USD',
    rating: 4.9,
    reviewCount: 69,
    responseTime: 'Usually responds in 28 min',
    responseTimeMinutes: 28,
    verified: true,
    active: true,
  },
];

export const MOCK_GUIDES: readonly MockGuide[] = [
  ...existingGuides,
  ...prototypeOnlyGuides,
];

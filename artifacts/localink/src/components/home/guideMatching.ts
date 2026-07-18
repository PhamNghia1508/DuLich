import type { RequestGuideDraft } from './requestGuideValidation.ts';

export interface MockGuideUnavailableRange {
  startDate: string;
  endDate: string;
}

export interface MockGuide {
  id: string;
  profileId?: string;
  name: string;
  image: string;
  city: string;
  serviceAreas: string[];
  languages: string[];
  experiencePreferences: string[];
  hourlyRate?: number;
  currency?: string;
  rating: number;
  reviewCount?: number;
  responseTime?: string;
  responseTimeMinutes?: number;
  verified: boolean;
  active: boolean;
  unavailableDateRanges?: MockGuideUnavailableRange[];
}

export interface GuideMatchResult {
  guide: MockGuide;
  matchScore: number;
  matchReasons: string[];
}

const LANGUAGE_NAMES: Record<string, string> = {
  de: 'German',
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  ja: 'Japanese',
  ko: 'Korean',
  ru: 'Russian',
  vi: 'Vietnamese',
  zh: 'Chinese',
};

function normalize(value: string) {
  return value.trim().toLocaleLowerCase('en');
}

function isPartialMatch(first: string, second: string) {
  const normalizedFirst = normalize(first);
  const normalizedSecond = normalize(second);

  if (!normalizedFirst || !normalizedSecond) return false;

  return (
    normalizedFirst.includes(normalizedSecond) ||
    normalizedSecond.includes(normalizedFirst)
  );
}

function rangesOverlap(
  requestStart: string,
  requestEnd: string,
  unavailable: MockGuideUnavailableRange,
) {
  if (!requestStart || !requestEnd) return false;

  return requestStart <= unavailable.endDate && requestEnd >= unavailable.startDate;
}

function qualityScore(guide: MockGuide) {
  const ratingPoints = Math.max(0, Math.min(7, (guide.rating - 4) * 7));
  const responsePoints =
    guide.responseTimeMinutes === undefined
      ? 0
      : guide.responseTimeMinutes <= 15
        ? 3
        : guide.responseTimeMinutes <= 30
          ? 2
          : guide.responseTimeMinutes <= 60
            ? 1
            : 0;

  return ratingPoints + responsePoints;
}

export function matchGuides(
  request: RequestGuideDraft,
  guides: readonly MockGuide[],
): GuideMatchResult[] {
  return guides
    .filter((guide) => {
      if (!guide.active || !guide.verified) return false;

      const hasLanguageOverlap = request.languages.some((language) =>
        guide.languages.includes(language),
      );
      if (!hasLanguageOverlap) return false;

      return !guide.unavailableDateRanges?.some((range) =>
        rangesOverlap(request.startDate, request.endDate, range),
      );
    })
    .map((guide) => {
      const cityMatches = isPartialMatch(request.destination, guide.city);
      const matchingServiceArea = guide.serviceAreas.find((area) =>
        isPartialMatch(request.destination, area),
      );
      const languageMatches = request.languages.filter((language) =>
        guide.languages.includes(language),
      );
      const preferenceMatches = request.experiencePreferences.filter((preference) =>
        guide.experiencePreferences.includes(preference),
      );

      const destinationPoints = cityMatches ? 35 : matchingServiceArea ? 30 : 0;
      const languagePoints = Math.min(30, languageMatches.length * 15);
      const preferencePoints = Math.min(25, preferenceMatches.length * 12.5);
      const matchScore = Math.round(
        (destinationPoints + languagePoints + preferencePoints + qualityScore(guide)) * 10,
      ) / 10;

      const matchReasons: string[] = [];
      if (cityMatches) {
        matchReasons.push(`Based in ${guide.city}`);
      } else if (matchingServiceArea) {
        matchReasons.push(`Covers ${matchingServiceArea}`);
      }
      if (preferenceMatches[0]) {
        matchReasons.push(`Matches ${preferenceMatches[0]}`);
      }
      if (languageMatches[0]) {
        matchReasons.push(`Speaks ${LANGUAGE_NAMES[languageMatches[0]] ?? languageMatches[0]}`);
      }
      matchReasons.push('Available for your dates');
      if (guide.rating >= 4.9) {
        matchReasons.push('Highly rated');
      }

      return { guide, matchScore, matchReasons };
    })
    .sort((first, second) => {
      if (first.matchScore !== second.matchScore) {
        return second.matchScore - first.matchScore;
      }
      if (first.guide.rating !== second.guide.rating) {
        return second.guide.rating - first.guide.rating;
      }
      return first.guide.name < second.guide.name
        ? -1
        : first.guide.name > second.guide.name
          ? 1
          : 0;
    });
}

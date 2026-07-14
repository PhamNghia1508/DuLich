// ============================================================
// LocaLink — Core Type Definitions
// ============================================================

export type Language = {
  code: string;
  name: string;
  proficiency: 'native' | 'fluent' | 'conversational' | 'basic';
};

export type ExperienceCategory =
  | 'street-food'
  | 'history-culture'
  | 'hidden-neighborhoods'
  | 'museums-architecture'
  | 'nightlife'
  | 'photography'
  | 'family-friendly'
  | 'outdoor-adventure'
  | 'local-markets'
  | 'accessible-travel'
  | 'festivals'
  | 'shopping'
  | 'local-daily-life'
  | 'hidden-gems';

export type PersonalityTag =
  | 'friendly-talkative'
  | 'calm-thoughtful'
  | 'energetic'
  | 'humorous'
  | 'professional'
  | 'flexible-spontaneous';

export type GuideGender = 'male' | 'female' | 'non-binary';

export type VerificationStatus = 'verified' | 'pending' | 'unverified';

export type AvailabilityStatus = 'available' | 'limited' | 'unavailable';

export interface Guide {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  gender: GuideGender;
  age: number;
  city: string;
  district: string;
  avatar: string;
  gallery: string[];
  bio: string;
  shortIntro: string;
  languages: Language[];
  experienceCategories: ExperienceCategory[];
  personalityTags: PersonalityTag[];
  specialties: string[];
  credentials: string[];
  rating: number;
  reviewCount: number;
  completedExperiences: number;
  responseTimeMinutes: number;
  verificationStatus: VerificationStatus;
  availabilityStatus: AvailabilityStatus;
  nextAvailable: string; // ISO date string
  pricing: {
    perHour: number;
    halfDay: number;
    fullDay: number;
    currency: string;
  };
  matchLabel?: 'excellent' | 'great' | 'good';
  instantConfirmation: boolean;
  accessibilityExperience: boolean;
  isFavorited?: boolean;
  sampleItineraries: SampleItinerary[];
}

export interface SampleItinerary {
  id: string;
  title: string;
  duration: string;
  highlights: string[];
  price: number;
  currency: string;
}

export interface Review {
  id: string;
  guideId: string;
  travelerName: string;
  travelerCountry: string;
  travelerAvatar: string;
  rating: number;
  date: string;
  text: string;
  experienceType: string;
  verified: boolean;
}

export interface TripRequest {
  id: string;
  destination: string;
  districts: string[];
  startDate: string;
  endDate: string;
  preferredTime: string;
  flexibleDates: boolean;
  groupType: 'solo' | 'couple' | 'family' | 'friends' | 'business';
  adultsCount: number;
  childrenCount: number;
  olderTravelers: boolean;
  preferredLanguage: string;
  guideGenderPreference: GuideGender | 'no-preference';
  communicationStyle: PersonalityTag[];
  experienceInterests: ExperienceCategory[];
  walkingPace: 'slow' | 'moderate' | 'fast';
  mobilityAssistance: boolean;
  foodAllergies: string[];
  dietaryRequirements: string[];
  medicalConsiderations: string;
  heatSensitivity: boolean;
  regularBreaks: boolean;
  otherRequests: string;
  budgetMin: number;
  budgetMax: number;
  budgetUnit: 'per-hour' | 'half-day' | 'full-day';
  privateExperience: boolean;
  budgetNotes: string;
}

export interface Booking {
  id: string;
  guideId: string;
  travelerId: string;
  tripRequestId: string;
  status: BookingStatus;
  date: string;
  startTime: string;
  duration: string;
  meetingArea: string;
  adultsCount: number;
  childrenCount: number;
  experiencePreferences: ExperienceCategory[];
  specialRequirements: string;
  pricing: {
    basePrice: number;
    serviceFee: number;
    total: number;
    currency: string;
  };
  cancellationPolicy: string;
  createdAt: string;
  updatedAt: string;
}

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'payment-pending'
  | 'scheduled'
  | 'completed'
  | 'cancelled';

export interface Traveler {
  id: string;
  name: string;
  email: string;
  country: string;
  avatar: string;
  savedGuides: string[];
  upcomingBookings: string[];
  pastBookings: string[];
  notifications: Notification[];
}

export interface GuideUser {
  id: string;
  guideId: string;
  name: string;
  email: string;
  avatar: string;
  earnings: {
    pending: number;
    paid: number;
    thisMonth: number;
    currency: string;
  };
  pendingRequests: string[];
  upcomingBookings: string[];
  notifications: Notification[];
}

export interface Notification {
  id: string;
  type: 'booking' | 'message' | 'review' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  participantNames: Record<string, string>;
  participantAvatars: Record<string, string>;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
}

export interface PaymentRecord {
  id: string;
  bookingId: string;
  guideId: string;
  amount: number;
  currency: string;
  status: 'awaiting-traveler' | 'paid-to-platform' | 'pending-payout' | 'paid-to-guide';
  weeklyPayoutDate?: string;
}

export interface AdminStats {
  totalGuides: number;
  pendingVerification: number;
  totalTravelers: number;
  totalBookings: number;
  completedThisMonth: number;
  platformRevenue: number;
  pendingPayouts: number;
  reportedIssues: number;
}

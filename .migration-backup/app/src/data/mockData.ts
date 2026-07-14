// ============================================================
// LocaLink — Centralized Mock Data
// ============================================================

import type {
  Guide,
  Review,
  Booking,
  Traveler,
  GuideUser,
  Conversation,
  PaymentRecord,
  AdminStats,
  ExperienceCategory,
} from '@/types';

// ---------------------------------------------------------------------------
// GUIDE PROFILES — 8 diverse local guides
// ---------------------------------------------------------------------------

export const GUIDES: Guide[] = [
  {
    id: 'guide-001',
    firstName: 'Linh',
    lastName: 'Nguyen',
    displayName: 'Linh N.',
    gender: 'female',
    age: 29,
    city: 'Ho Chi Minh City',
    district: 'District 1',
    avatar: '/images/guides/linh.webp',
    gallery: [
      '/images/hero/local-guide-conversation.webp',
      '/images/local-guide-hero.webp',
      '/images/local-guide-hero-v2.webp',
      '/images/experiences/hidden-hoi-an.webp',
      '/images/experiences/photography-vietnam.webp',
    ],
    bio: "I grew up eating my way through every alley in Saigon. From the first steaming bowl of pho at sunrise to the late-night banh mi cart that's been in business since before I was born — food is the best story our city tells. I'll take you beyond tourist menus to the spots locals return to every single day. I speak fluent English and love answering every curious question about Vietnamese food culture.",
    shortIntro: "Street food expert and Saigon native who knows every hidden banh mi cart and dawn pho spot in the city.",
    languages: [
      { code: 'vi', name: 'Vietnamese', proficiency: 'native' },
      { code: 'en', name: 'English', proficiency: 'fluent' },
    ],
    experienceCategories: ['street-food', 'local-markets', 'local-daily-life', 'hidden-gems'],
    personalityTags: ['friendly-talkative', 'humorous', 'energetic'],
    specialties: ['Street food tours', 'Market visits', 'Cooking stories', 'Hidden food stalls'],
    credentials: ['Tourism Licensed Guide', 'Food Safety Certified', 'District 1 Specialist'],
    rating: 4.97,
    reviewCount: 214,
    completedExperiences: 231,
    responseTimeMinutes: 12,
    verificationStatus: 'verified',
    availabilityStatus: 'available',
    nextAvailable: '2026-07-13T07:00:00+07:00',
    pricing: { perHour: 18, halfDay: 55, fullDay: 95, currency: 'USD' },
    matchLabel: 'excellent',
    instantConfirmation: true,
    accessibilityExperience: false,
    sampleItineraries: [
      {
        id: 'itin-001a',
        title: 'Saigon at Dawn — Street Food Walk',
        duration: '3 hours',
        highlights: ['Pho breakfast at a 40-year-old family stall', 'Ben Thanh market tour', 'Bánh mì from a legendary cart', 'Fresh coconut coffee'],
        price: 55,
        currency: 'USD',
      },
      {
        id: 'itin-001b',
        title: 'Hidden Alley Food Hunt',
        duration: '4 hours',
        highlights: ['Hẻm (alley) exploration', 'Bún bò Huế tasting', 'Street-side Chè dessert', 'Night market snacks'],
        price: 70,
        currency: 'USD',
      },
    ],
  },

  {
    id: 'guide-002',
    firstName: 'Minh',
    lastName: 'Tran',
    displayName: 'Minh T.',
    gender: 'male',
    age: 38,
    city: 'Ho Chi Minh City',
    district: 'District 3',
    avatar: '/images/guides/minh.webp',
    gallery: [
      'https://images.unsplash.com/photo-1559562386-5b3de58a6c43?w=800&q=80',
      'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=800&q=80',
      'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80',
    ],
    bio: "Architecture is how a city tells its story across centuries. I studied heritage conservation in Paris and returned to Saigon determined to share what most tourists walk past without seeing. I'll show you the French colonial layering in District 3, the forgotten Chinese shophouse facades of Cholon, and the modernist gems hidden between gleaming towers. I speak French and English fluently.",
    shortIntro: "Heritage conservation expert and Francophone guide specializing in Saigon's colonial and Chinese architectural legacy.",
    languages: [
      { code: 'vi', name: 'Vietnamese', proficiency: 'native' },
      { code: 'fr', name: 'French', proficiency: 'fluent' },
      { code: 'en', name: 'English', proficiency: 'fluent' },
    ],
    experienceCategories: ['museums-architecture', 'history-culture', 'photography', 'hidden-neighborhoods'],
    personalityTags: ['calm-thoughtful', 'professional'],
    specialties: ['Colonial architecture', 'Heritage sites', 'Cholon history', 'Photography walks'],
    credentials: ['Licensed Tour Guide', 'Heritage Conservation Degree (Paris)', 'French Cultural Institute Partner'],
    rating: 4.93,
    reviewCount: 178,
    completedExperiences: 195,
    responseTimeMinutes: 25,
    verificationStatus: 'verified',
    availabilityStatus: 'available',
    nextAvailable: '2026-07-14T09:00:00+07:00',
    pricing: { perHour: 22, halfDay: 65, fullDay: 115, currency: 'USD' },
    matchLabel: 'excellent',
    instantConfirmation: false,
    accessibilityExperience: false,
    sampleItineraries: [
      {
        id: 'itin-002a',
        title: 'Colonial Saigon Walking Tour',
        duration: '4 hours',
        highlights: ['Notre-Dame Cathedral', 'Central Post Office', 'City Hall facade', 'Hidden French villas in District 3'],
        price: 65,
        currency: 'USD',
      },
    ],
  },

  {
    id: 'guide-003',
    firstName: 'Yuki',
    lastName: 'Pham',
    displayName: 'Yuki P.',
    gender: 'female',
    age: 32,
    city: 'Ho Chi Minh City',
    district: 'District 5',
    avatar: '/images/guides/yuki.webp',
    gallery: [
      'https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=800&q=80',
      'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=800&q=80',
    ],
    bio: "I lived in Tokyo for five years and returned home to bridge two cultures I love deeply. My tours for Japanese-speaking families are designed around comfort, clear communication, and creating moments your children will remember. I understand what worries Japanese travelers most — food safety, hygiene, pacing — and I address everything proactively. Your comfort is always the priority.",
    shortIntro: "Bilingual Japanese-Vietnamese guide specializing in family-friendly experiences with a focus on comfort and cultural nuance.",
    languages: [
      { code: 'vi', name: 'Vietnamese', proficiency: 'native' },
      { code: 'ja', name: 'Japanese', proficiency: 'fluent' },
      { code: 'en', name: 'English', proficiency: 'conversational' },
    ],
    experienceCategories: ['family-friendly', 'local-markets', 'history-culture', 'street-food'],
    personalityTags: ['calm-thoughtful', 'professional', 'friendly-talkative'],
    specialties: ['Japanese-speaking families', 'Cholon Chinatown', 'Child-friendly pacing', 'Cultural comparison'],
    credentials: ['Licensed Tour Guide', 'Certified Interpreter (Japanese)', 'First Aid Certified'],
    rating: 4.95,
    reviewCount: 143,
    completedExperiences: 158,
    responseTimeMinutes: 18,
    verificationStatus: 'verified',
    availabilityStatus: 'available',
    nextAvailable: '2026-07-13T09:00:00+07:00',
    pricing: { perHour: 20, halfDay: 60, fullDay: 105, currency: 'USD' },
    matchLabel: 'excellent',
    instantConfirmation: true,
    accessibilityExperience: true,
    sampleItineraries: [
      {
        id: 'itin-003a',
        title: 'Cholon Family Discovery',
        duration: '5 hours',
        highlights: ['Thiên Hậu Temple', 'Bình Tây Market', 'Family-friendly lunch stop', 'Lantern shopping'],
        price: 85,
        currency: 'USD',
      },
    ],
  },

  {
    id: 'guide-004',
    firstName: 'Huy',
    lastName: 'Le',
    displayName: 'Huy L.',
    gender: 'male',
    age: 26,
    city: 'Ho Chi Minh City',
    district: 'District 1',
    avatar: '/images/guides/huy.webp',
    gallery: [
      'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&q=80',
      'https://images.unsplash.com/photo-1560743641-3914f2c45636?w=800&q=80',
    ],
    bio: "Saigon never sleeps, and neither do I. I know every rooftop bar worth the elevator ride, every live music spot where real artists play, and every after-midnight snack stop that only locals know about. If you want to understand the pulse of this city at night — the energy, the people, the stories — I'm the guide for you. Korean and English spoken.",
    shortIntro: "Nightlife specialist and Korean-speaking guide revealing Saigon's after-dark culture and social scene.",
    languages: [
      { code: 'vi', name: 'Vietnamese', proficiency: 'native' },
      { code: 'ko', name: 'Korean', proficiency: 'fluent' },
      { code: 'en', name: 'English', proficiency: 'fluent' },
    ],
    experienceCategories: ['nightlife', 'local-daily-life', 'street-food', 'hidden-gems'],
    personalityTags: ['energetic', 'humorous', 'flexible-spontaneous'],
    specialties: ['Nightlife tours', 'Rooftop bars', 'Live music', 'Night street food'],
    credentials: ['Licensed Tour Guide', 'Hospitality Certificate'],
    rating: 4.89,
    reviewCount: 167,
    completedExperiences: 182,
    responseTimeMinutes: 8,
    verificationStatus: 'verified',
    availabilityStatus: 'limited',
    nextAvailable: '2026-07-15T19:00:00+07:00',
    pricing: { perHour: 16, halfDay: 50, fullDay: 85, currency: 'USD' },
    matchLabel: 'great',
    instantConfirmation: true,
    accessibilityExperience: false,
    sampleItineraries: [
      {
        id: 'itin-004a',
        title: 'Saigon After Dark',
        duration: '4 hours (evening)',
        highlights: ['Skybar sunset views', 'Bùi Viện walking street', 'Live acoustic venue', 'Midnight bánh mì stop'],
        price: 65,
        currency: 'USD',
      },
    ],
  },

  {
    id: 'guide-005',
    firstName: 'Bảo',
    lastName: 'Vo',
    displayName: 'Bảo V.',
    gender: 'male',
    age: 45,
    city: 'Ho Chi Minh City',
    district: 'District 1',
    avatar: '/images/guides/bao.webp',
    gallery: [
      'https://images.unsplash.com/photo-1521791055366-0d553872952f?w=800&q=80',
      'https://images.unsplash.com/photo-1566438480900-0609be27a4be?w=800&q=80',
    ],
    bio: "I've spent 15 years studying Vietnamese history and I still find new stories every week. The War Remnants Museum is different with me — I'll give you context that turns facts into human stories. The Reunification Palace is not just architecture; it's a window into decisions that shaped Southeast Asia. I speak precise, unhurried English and never rush through significance.",
    shortIntro: "History and museum specialist with 15 years of research experience. Thoughtful, context-rich, never rushed.",
    languages: [
      { code: 'vi', name: 'Vietnamese', proficiency: 'native' },
      { code: 'en', name: 'English', proficiency: 'fluent' },
    ],
    experienceCategories: ['history-culture', 'museums-architecture', 'hidden-neighborhoods'],
    personalityTags: ['calm-thoughtful', 'professional'],
    specialties: ['War history', 'Museum curation', 'Political history', 'Cultural context'],
    credentials: ['Licensed Tour Guide', 'History Degree (HCMC University)', 'Museum Partner Guide'],
    rating: 4.96,
    reviewCount: 289,
    completedExperiences: 312,
    responseTimeMinutes: 35,
    verificationStatus: 'verified',
    availabilityStatus: 'available',
    nextAvailable: '2026-07-14T08:30:00+07:00',
    pricing: { perHour: 25, halfDay: 70, fullDay: 125, currency: 'USD' },
    matchLabel: 'excellent',
    instantConfirmation: false,
    accessibilityExperience: true,
    sampleItineraries: [
      {
        id: 'itin-005a',
        title: 'War & Reunification — Full Day',
        duration: '7 hours',
        highlights: ['War Remnants Museum', 'Reunification Palace', 'Cu Chi Tunnels context session', 'Lunch at a 1975-era restaurant'],
        price: 125,
        currency: 'USD',
      },
    ],
  },

  {
    id: 'guide-006',
    firstName: 'Thu',
    lastName: 'Nguyen',
    displayName: 'Thu N.',
    gender: 'female',
    age: 27,
    city: 'Ho Chi Minh City',
    district: 'District 3',
    avatar: '/images/guides/thu.webp',
    gallery: [
      'https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=800&q=80',
      'https://images.unsplash.com/photo-1607462109225-6b64ae2dd3cb?w=800&q=80',
    ],
    bio: "A city seen through a camera is a city truly seen. I'm a professional photographer who uses tours to teach people to capture Vietnam honestly — not postcard shots, but real textures, real light, real people (with consent). I'll show you the alley at 6am when the light falls just right, and the market corner where colour composition is already perfect. German and English spoken.",
    shortIntro: "Professional photographer offering visual storytelling tours for travelers who want authentic, artistic Vietnam images.",
    languages: [
      { code: 'vi', name: 'Vietnamese', proficiency: 'native' },
      { code: 'de', name: 'German', proficiency: 'fluent' },
      { code: 'en', name: 'English', proficiency: 'fluent' },
    ],
    experienceCategories: ['photography', 'hidden-neighborhoods', 'local-daily-life', 'street-food'],
    personalityTags: ['calm-thoughtful', 'friendly-talkative', 'flexible-spontaneous'],
    specialties: ['Photography walks', 'Golden hour tours', 'Market photography', 'Street portraiture ethics'],
    credentials: ['Licensed Tour Guide', 'Professional Photographer', 'Adobe Certified'],
    rating: 4.91,
    reviewCount: 132,
    completedExperiences: 147,
    responseTimeMinutes: 22,
    verificationStatus: 'verified',
    availabilityStatus: 'available',
    nextAvailable: '2026-07-13T06:00:00+07:00',
    pricing: { perHour: 20, halfDay: 60, fullDay: 100, currency: 'USD' },
    matchLabel: 'great',
    instantConfirmation: true,
    accessibilityExperience: false,
    sampleItineraries: [
      {
        id: 'itin-006a',
        title: 'Golden Hour Saigon — Photography Walk',
        duration: '3 hours (sunrise)',
        highlights: ['Dawn light in District 3 alleys', 'Market portrait session', 'Rooftop composition practice', 'Coffee break with photo review'],
        price: 60,
        currency: 'USD',
      },
    ],
  },

  {
    id: 'guide-007',
    firstName: 'Duc',
    lastName: 'Pham',
    displayName: 'Duc P.',
    gender: 'male',
    age: 35,
    city: 'Ho Chi Minh City',
    district: 'District 8',
    avatar: '/images/guides/duc.webp',
    gallery: [
      'https://images.unsplash.com/photo-1466621591366-2d5fba72006d?w=800&q=80',
      'https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=800&q=80',
    ],
    bio: "I've guided travelers in wheelchairs, with visual impairments, and with severe joint pain across every major site in Ho Chi Minh City. Accessibility is not an obstacle — it's a design challenge I've been solving for six years. I work closely with families of older travelers and people with mobility needs to plan routes that are genuinely comfortable, never a compromise. Every person deserves a complete Vietnam experience.",
    shortIntro: "Accessibility specialist with 6 years of experience guiding travelers with mobility, sensory, and health needs.",
    languages: [
      { code: 'vi', name: 'Vietnamese', proficiency: 'native' },
      { code: 'en', name: 'English', proficiency: 'fluent' },
    ],
    experienceCategories: ['accessible-travel', 'history-culture', 'local-markets', 'family-friendly'],
    personalityTags: ['calm-thoughtful', 'professional', 'friendly-talkative'],
    specialties: ['Wheelchair accessible routes', 'Senior travel', 'Low-mobility itineraries', 'Health-aware pacing'],
    credentials: ['Licensed Tour Guide', 'Disability Awareness Certified', 'First Aid & CPR Certified', 'HCMC Accessibility Partner'],
    rating: 4.98,
    reviewCount: 98,
    completedExperiences: 104,
    responseTimeMinutes: 20,
    verificationStatus: 'verified',
    availabilityStatus: 'available',
    nextAvailable: '2026-07-14T09:00:00+07:00',
    pricing: { perHour: 22, halfDay: 65, fullDay: 110, currency: 'USD' },
    matchLabel: 'excellent',
    instantConfirmation: false,
    accessibilityExperience: true,
    sampleItineraries: [
      {
        id: 'itin-007a',
        title: 'Accessible HCMC — Comfort First',
        duration: 'Full day (flexible)',
        highlights: ['Wheelchair-accessible War Remnants Museum', 'Rest-friendly Ben Thanh area', 'Air-conditioned venue lunches', 'Custom pace throughout'],
        price: 110,
        currency: 'USD',
      },
    ],
  },

  {
    id: 'guide-008',
    firstName: 'Khoa',
    lastName: 'Dinh',
    displayName: 'Khoa D.',
    gender: 'male',
    age: 30,
    city: 'Ho Chi Minh City',
    district: 'Can Gio',
    avatar: '/images/guides/khoa.webp',
    gallery: [
      'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80',
      'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800&q=80',
    ],
    bio: "Can Gio biosphere reserve is one of the most misunderstood places near Saigon. Most people visit for monkey photos. I take you for the mangrove ecosystem, the hidden water channels, the fishing villages that have barely changed in generations, and the remarkable story of reforestation after wartime defoliation. It's a half-day journey that completely changes how you think about Vietnam.",
    shortIntro: "Outdoor and nature guide for Can Gio biosphere, Cu Chi waterways, and Saigon's lesser-known natural environments.",
    languages: [
      { code: 'vi', name: 'Vietnamese', proficiency: 'native' },
      { code: 'en', name: 'English', proficiency: 'fluent' },
    ],
    experienceCategories: ['outdoor-adventure', 'hidden-gems', 'history-culture', 'local-daily-life'],
    personalityTags: ['energetic', 'flexible-spontaneous', 'friendly-talkative'],
    specialties: ['Mangrove tours', 'Eco-tourism', 'Kayaking', 'Fishing village visits'],
    credentials: ['Licensed Tour Guide', 'Eco-Tourism Certified', 'Boat License', 'First Aid Certified'],
    rating: 4.88,
    reviewCount: 76,
    completedExperiences: 83,
    responseTimeMinutes: 45,
    verificationStatus: 'verified',
    availabilityStatus: 'available',
    nextAvailable: '2026-07-16T07:00:00+07:00',
    pricing: { perHour: 15, halfDay: 50, fullDay: 90, currency: 'USD' },
    matchLabel: 'good',
    instantConfirmation: true,
    accessibilityExperience: false,
    sampleItineraries: [
      {
        id: 'itin-008a',
        title: 'Can Gio Mangrove & Village Day',
        duration: '8 hours',
        highlights: ['Mangrove canal kayaking', 'Fishing village visit', 'Guerrilla base history', 'Seafood lunch by the river'],
        price: 90,
        currency: 'USD',
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// REVIEWS
// ---------------------------------------------------------------------------

export const REVIEWS: Review[] = [
  {
    id: 'rev-001',
    guideId: 'guide-001',
    travelerName: 'Sarah M.',
    travelerCountry: 'Australia',
    travelerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
    rating: 5,
    date: '2026-06-18',
    text: 'Linh took us to places we never would have found on our own. The dawn pho breakfast felt like a genuine local ritual, not a tourist performance. She speaks perfect English and explains cultural context so naturally you forget she\'s doing a job.',
    experienceType: 'Street Food Tour',
    verified: true,
  },
  {
    id: 'rev-002',
    guideId: 'guide-001',
    travelerName: 'James K.',
    travelerCountry: 'United Kingdom',
    travelerAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80',
    rating: 5,
    date: '2026-05-29',
    text: 'Best food experience of our entire Vietnam trip. Linh is funny, knowledgeable, and incredibly thoughtful. She remembered my wife\'s shellfish allergy without being asked again.',
    experienceType: 'Hidden Alley Food Hunt',
    verified: true,
  },
  {
    id: 'rev-003',
    guideId: 'guide-002',
    travelerName: 'Camille D.',
    travelerCountry: 'France',
    travelerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80',
    rating: 5,
    date: '2026-06-05',
    text: 'Minh parle un français absolument impeccable et possède une connaissance approfondie de l\'architecture coloniale. Notre promenade dans le District 3 était comme un cours magistral en plein air.',
    experienceType: 'Colonial Architecture Walk',
    verified: true,
  },
  {
    id: 'rev-004',
    guideId: 'guide-003',
    travelerName: 'Kenji T.',
    travelerCountry: 'Japan',
    travelerAvatar: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=100&q=80',
    rating: 5,
    date: '2026-06-22',
    text: '子どもたちが大喜びでした。ユキさんは日本語が完璧で、ベトナムの文化を子どもでも理解できるように説明してくださいました。チョロンでの体験は最高でした。',
    experienceType: 'Cholon Family Discovery',
    verified: true,
  },
  {
    id: 'rev-005',
    guideId: 'guide-005',
    travelerName: 'David R.',
    travelerCountry: 'United States',
    travelerAvatar: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=100&q=80',
    rating: 5,
    date: '2026-06-10',
    text: 'Bảo gave our family the most meaningful museum experience we\'ve ever had. He spoke with such depth and care about the history — it felt like hearing from someone who truly understands what those events mean to real people. Highly recommended.',
    experienceType: 'War & Reunification Full Day',
    verified: true,
  },
  {
    id: 'rev-006',
    guideId: 'guide-007',
    travelerName: 'Margaret H.',
    travelerCountry: 'Canada',
    travelerAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80',
    rating: 5,
    date: '2026-06-30',
    text: 'My mother uses a wheelchair and we were so worried about Vietnam being inaccessible. Duc completely changed that experience. He had researched every route, knew every accessible entrance, and never made my mother feel like a burden. She cried at the end of the day — in a good way.',
    experienceType: 'Accessible HCMC',
    verified: true,
  },
];

// ---------------------------------------------------------------------------
// TRAVELER TESTIMONIALS (Homepage)
// ---------------------------------------------------------------------------

export const TESTIMONIALS = [
  {
    id: 'test-001',
    name: 'Emma Larsson',
    country: 'Sweden',
    flag: '🇸🇪',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
    rating: 5,
    text: 'I was traveling solo and felt slightly nervous. LocaLink matched me with Linh, who made me feel completely safe and welcomed from the first message. The street food walk was the highlight of my entire month in Southeast Asia.',
    guide: 'Linh N.',
    experience: 'Street Food Walk, District 1',
  },
  {
    id: 'test-002',
    name: 'Thomas Müller',
    country: 'Germany',
    flag: '🇩🇪',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
    rating: 5,
    text: 'Thu spoke German — genuinely and naturally, not just tourist phrases. As a photographer, her guidance helped me capture images I would never have found alone. The golden hour alley session was extraordinary.',
    guide: 'Thu N.',
    experience: 'Photography Walk, District 3',
  },
  {
    id: 'test-003',
    name: 'Akiko Yamamoto',
    country: 'Japan',
    flag: '🇯🇵',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
    rating: 5,
    text: '家族全員が楽しめるツアーを探していました。LocaLinkのマッチングシステムのおかげで、完璧なガイドさんに出会えました。子どもたちはチョロンの体験が大好きでした。',
    guide: 'Yuki P.',
    experience: 'Family Experience, Cholon',
  },
  {
    id: 'test-004',
    name: 'Robert Chen',
    country: 'United States',
    flag: '🇺🇸',
    avatar: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=100&q=80',
    rating: 5,
    text: 'Business trip with two free evenings. The nightlife tour with Huy was exactly what I needed — real local bars, real conversations, no tourist traps. I left Saigon feeling like I actually experienced the city.',
    guide: 'Huy L.',
    experience: 'Saigon After Dark, District 1',
  },
];

// ---------------------------------------------------------------------------
// BOOKINGS
// ---------------------------------------------------------------------------

export const BOOKINGS: Booking[] = [
  {
    id: 'book-001',
    guideId: 'guide-001',
    travelerId: 'traveler-001',
    tripRequestId: 'req-001',
    status: 'scheduled',
    date: '2026-07-20',
    startTime: '07:00',
    duration: '4 hours',
    meetingArea: 'Ben Thanh Market, Gate 1',
    adultsCount: 2,
    childrenCount: 0,
    experiencePreferences: ['street-food', 'local-markets'],
    specialRequirements: 'One of us is vegetarian.',
    pricing: {
      basePrice: 110,
      serviceFee: 11,
      total: 121,
      currency: 'USD',
    },
    cancellationPolicy: 'Free cancellation up to 48 hours before the experience.',
    createdAt: '2026-07-10T14:22:00+07:00',
    updatedAt: '2026-07-11T09:15:00+07:00',
  },
  {
    id: 'book-002',
    guideId: 'guide-005',
    travelerId: 'traveler-001',
    tripRequestId: 'req-001',
    status: 'completed',
    date: '2026-06-15',
    startTime: '09:00',
    duration: '7 hours',
    meetingArea: 'War Remnants Museum, Main Entrance',
    adultsCount: 2,
    childrenCount: 0,
    experiencePreferences: ['history-culture', 'museums-architecture'],
    specialRequirements: '',
    pricing: {
      basePrice: 125,
      serviceFee: 12.5,
      total: 137.5,
      currency: 'USD',
    },
    cancellationPolicy: 'Free cancellation up to 48 hours before the experience.',
    createdAt: '2026-06-05T10:00:00+07:00',
    updatedAt: '2026-06-15T18:00:00+07:00',
  },
];

// ---------------------------------------------------------------------------
// CONVERSATIONS
// ---------------------------------------------------------------------------

export const CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-001',
    participantIds: ['traveler-001', 'guide-001'],
    participantNames: { 'traveler-001': 'Alex Johnson', 'guide-001': 'Linh N.' },
    participantAvatars: {
      'traveler-001': 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80',
      'guide-001': 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80',
    },
    lastMessage: 'Great, I\'ll be at the gate at 7am sharp. See you then!',
    lastMessageTime: '2026-07-12T08:30:00+07:00',
    unreadCount: 1,
    messages: [
      {
        id: 'msg-001',
        senderId: 'traveler-001',
        senderName: 'Alex Johnson',
        senderAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80',
        text: 'Hi Linh! Looking forward to the food walk on Sunday. My partner has a shellfish allergy — is that something we should discuss beforehand?',
        timestamp: '2026-07-12T07:15:00+07:00',
        read: true,
      },
      {
        id: 'msg-002',
        senderId: 'guide-001',
        senderName: 'Linh N.',
        senderAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80',
        text: 'Hello Alex! Not a problem at all — I\'ve already noted it and I\'ll make sure every stop is shellfish-free. I\'ll also have a list of safe alternatives ready. We start at Ben Thanh Gate 1, 7am.',
        timestamp: '2026-07-12T07:52:00+07:00',
        read: true,
      },
      {
        id: 'msg-003',
        senderId: 'traveler-001',
        senderName: 'Alex Johnson',
        senderAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80',
        text: 'Great, I\'ll be at the gate at 7am sharp. See you then!',
        timestamp: '2026-07-12T08:30:00+07:00',
        read: false,
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// NOTIFICATIONS
// ---------------------------------------------------------------------------

export const TRAVELER_NOTIFICATIONS = [
  {
    id: 'notif-001',
    type: 'booking' as const,
    title: 'Booking confirmed',
    message: 'Your food walk with Linh N. on July 20 is confirmed.',
    timestamp: '2026-07-11T09:15:00+07:00',
    read: false,
  },
  {
    id: 'notif-002',
    type: 'message' as const,
    title: 'New message from Linh N.',
    message: 'Linh sent you a message about your upcoming experience.',
    timestamp: '2026-07-12T07:52:00+07:00',
    read: false,
  },
  {
    id: 'notif-003',
    type: 'review' as const,
    title: 'Leave a review',
    message: 'How was your experience with Bảo V.? Share your feedback.',
    timestamp: '2026-06-15T20:00:00+07:00',
    read: true,
  },
];

export const GUIDE_NOTIFICATIONS = [
  {
    id: 'gnotif-001',
    type: 'booking' as const,
    title: 'New booking request',
    message: 'You have a new booking request for July 20 — Street Food Walk (4 hrs).',
    timestamp: '2026-07-10T14:22:00+07:00',
    read: false,
  },
  {
    id: 'gnotif-002',
    type: 'message' as const,
    title: 'Message from Alex J.',
    message: 'Alex asked about shellfish allergies for the upcoming tour.',
    timestamp: '2026-07-12T07:15:00+07:00',
    read: true,
  },
  {
    id: 'gnotif-003',
    type: 'system' as const,
    title: 'Payout processed',
    message: 'Your weekly payout of $214 has been sent.',
    timestamp: '2026-07-07T10:00:00+07:00',
    read: true,
  },
];

// ---------------------------------------------------------------------------
// PAYMENT RECORDS
// ---------------------------------------------------------------------------

export const PAYMENT_RECORDS: PaymentRecord[] = [
  {
    id: 'pay-001',
    bookingId: 'book-001',
    guideId: 'guide-001',
    amount: 121,
    currency: 'USD',
    status: 'paid-to-platform',
    weeklyPayoutDate: '2026-07-21',
  },
  {
    id: 'pay-002',
    bookingId: 'book-002',
    guideId: 'guide-005',
    amount: 137.5,
    currency: 'USD',
    status: 'paid-to-guide',
    weeklyPayoutDate: '2026-06-22',
  },
];

// ---------------------------------------------------------------------------
// ADMIN STATS
// ---------------------------------------------------------------------------

export const ADMIN_STATS: AdminStats = {
  totalGuides: 47,
  pendingVerification: 6,
  totalTravelers: 1842,
  totalBookings: 3291,
  completedThisMonth: 214,
  platformRevenue: 48720,
  pendingPayouts: 3840,
  reportedIssues: 2,
};

// ---------------------------------------------------------------------------
// EXPERIENCE CATEGORIES (Display)
// ---------------------------------------------------------------------------

export const EXPERIENCE_CATEGORIES: {
  id: ExperienceCategory;
  label: string;
  icon: string;
  description: string;
}[] = [
  { id: 'street-food', label: 'Street Food', icon: '🍜', description: 'Pho, bánh mì, markets, and hidden stalls' },
  { id: 'history-culture', label: 'History & Culture', icon: '🏛️', description: 'Museums, war history, and cultural context' },
  { id: 'hidden-neighborhoods', label: 'Hidden Neighborhoods', icon: '🏘️', description: 'Alleys, local life, and off-map discoveries' },
  { id: 'museums-architecture', label: 'Architecture', icon: '🏗️', description: 'Colonial, Chinese, and modern building stories' },
  { id: 'nightlife', label: 'Nightlife', icon: '🌙', description: 'Rooftop bars, live music, and night street food' },
  { id: 'photography', label: 'Photography', icon: '📷', description: 'Visual storytelling with a professional eye' },
  { id: 'family-friendly', label: 'Family-Friendly', icon: '👨‍👩‍👧', description: 'Child-appropriate pacing and cultural fun' },
  { id: 'outdoor-adventure', label: 'Outdoor Adventure', icon: '🌿', description: 'Can Gio, rivers, mangroves, and eco-tours' },
  { id: 'local-markets', label: 'Local Markets', icon: '🛒', description: 'Bình Tây, Bến Thành, and wet markets' },
  { id: 'accessible-travel', label: 'Accessible Travel', icon: '♿', description: 'Carefully planned routes for all abilities' },
  { id: 'festivals', label: 'Festivals', icon: '🎉', description: 'Seasonal celebrations and local events' },
  { id: 'local-daily-life', label: 'Local Daily Life', icon: '☕', description: 'Morning coffee culture, neighbors, real Saigon' },
  { id: 'hidden-gems', label: 'Hidden Gems', icon: '💎', description: 'Places most travelers never discover' },
  { id: 'shopping', label: 'Shopping & Markets', icon: '🛍️', description: 'Authentic souvenirs and artisan finds' },
];

// ---------------------------------------------------------------------------
// SUPPORTED LANGUAGES
// ---------------------------------------------------------------------------

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
];

// ---------------------------------------------------------------------------
// UI LANGUAGES (for language selector)
// ---------------------------------------------------------------------------

export const UI_LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
  { code: 'de', label: 'Deutsch' },
];

// ---------------------------------------------------------------------------
// TRUST METRICS (Homepage)
// ---------------------------------------------------------------------------

export const TRUST_METRICS = [
  { value: '47+', label: 'Verified Local Guides', icon: 'shield-check' },
  { value: '12', label: 'Languages Supported', icon: 'globe' },
  { value: '4.94', label: 'Average Traveler Rating', icon: 'star' },
  { value: '3,200+', label: 'Local Experiences Completed', icon: 'map-pin' },
];

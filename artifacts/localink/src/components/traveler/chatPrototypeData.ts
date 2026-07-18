export interface PrototypeChatMessage {
  id: string;
  bookingId: string;
  sender: 'traveler' | 'guide';
  text: string;
  timestamp: string;
}

export type PrototypeChatQuickAction =
  | 'meeting-point'
  | 'dietary'
  | 'timing'
  | 'greeting';

const QUICK_ACTION_TEMPLATES: Record<PrototypeChatQuickAction, string> = {
  'meeting-point': 'Can we confirm the exact meeting point? I want to make sure I find you easily.',
  'dietary': 'I have some dietary preferences — is that something we can work around during the experience?',
  'timing': 'Would it be possible to adjust our start time slightly? I want to make sure the pace works for everyone.',
  'greeting': 'Hi! Looking forward to our experience together. Is there anything I should prepare or bring?',
};

export const QUICK_ACTIONS: { key: PrototypeChatQuickAction; label: string }[] = [
  { key: 'greeting', label: 'Say hello' },
  { key: 'meeting-point', label: 'Confirm meeting point' },
  { key: 'dietary', label: 'Dietary preferences' },
  { key: 'timing', label: 'Adjust timing' },
];

export function quickActionText(action: PrototypeChatQuickAction): string {
  return QUICK_ACTION_TEMPLATES[action];
}

function seededGuideReply(guideName: string, travelerText: string): string {
  if (travelerText.toLowerCase().includes('meeting point')) {
    return `Great question! I'll be right at the spot we agreed on — look for someone waving with a Localink lanyard. See you there!`;
  }
  if (travelerText.toLowerCase().includes('dietary')) {
    return `Absolutely, we can work around any dietary needs. Just let me know the details and I'll plan accordingly!`;
  }
  if (travelerText.toLowerCase().includes('timing') || travelerText.toLowerCase().includes('start time')) {
    return `Happy to adjust! Let me know what time works best and we'll make it happen.`;
  }
  return `Thanks for reaching out! I'm ${guideName} and I'm really looking forward to showing you around. Feel free to ask anything before we meet!`;
}

interface SeedMessage {
  sender: 'traveler' | 'guide';
  text: string;
  minutesOffset: number;
}

const SEED_CONVERSATIONS: Record<string, SeedMessage[]> = {
  'FLT-GUIDE001-20260615': [
    { sender: 'guide', text: 'Welcome! I\'m excited to take you through some of the best food spots in Saigon. Any allergies I should know about?', minutesOffset: -180 },
    { sender: 'traveler', text: 'No allergies — we\'re adventurous eaters! Can\'t wait to try everything.', minutesOffset: -170 },
    { sender: 'guide', text: 'Perfect! I\'ve planned a route through District 1 with a few hidden gems. We\'ll start at the market and work our way through the alleys.', minutesOffset: -160 },
  ],
  'FLT-GUIDE003-20260622': [
    { sender: 'guide', text: 'Hello! Looking forward to our history walk tomorrow. The weather should be nice for exploring.', minutesOffset: -120 },
    { sender: 'traveler', text: 'Sounds great! Should I bring comfortable walking shoes?', minutesOffset: -110 },
    { sender: 'guide', text: 'Definitely — we\'ll cover quite a bit of ground. And bring water, it can get warm in the afternoon!', minutesOffset: -100 },
  ],
  'FLT-GUIDE005-20260701': [
    { sender: 'traveler', text: 'Hi! Our group of 3 is really excited about the Cu Chi trip. Is there anything specific we should prepare?', minutesOffset: -240 },
    { sender: 'guide', text: 'Hi there! Just wear comfortable clothes and closed shoes. I\'ll handle everything else including water and snacks for the journey.', minutesOffset: -230 },
  ],
};

function buildTimestamp(bookingDate: string, minutesOffset: number): string {
  const base = new Date(bookingDate + 'T08:00:00');
  base.setMinutes(base.getMinutes() + minutesOffset);
  return base.toISOString();
}

export function getSeededMessages(bookingId: string, bookingDate: string): PrototypeChatMessage[] {
  const conversation = SEED_CONVERSATIONS[bookingId];
  if (!conversation) return [];

  return conversation.map((msg, index) => ({
    id: `${bookingId}-msg-${index}`,
    bookingId,
    sender: msg.sender,
    text: msg.text,
    timestamp: buildTimestamp(bookingDate, msg.minutesOffset),
  }));
}

let messageCounter = 0;

export function createChatMessage(
  bookingId: string,
  sender: 'traveler' | 'guide',
  text: string,
): PrototypeChatMessage {
  messageCounter += 1;
  return {
    id: `${bookingId}-live-${messageCounter}`,
    bookingId,
    sender,
    text,
    timestamp: new Date().toISOString(),
  };
}

export function createAutoReply(
  bookingId: string,
  guideName: string,
  travelerText: string,
): PrototypeChatMessage {
  return createChatMessage(bookingId, 'guide', seededGuideReply(guideName, travelerText));
}

export function formatChatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

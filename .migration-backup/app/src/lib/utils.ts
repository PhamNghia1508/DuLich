import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function getRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
}

export function getMatchLabel(score: number): 'excellent' | 'great' | 'good' {
  if (score >= 90) return 'excellent';
  if (score >= 75) return 'great';
  return 'good';
}

export function personalityLabel(tag: string): string {
  const labels: Record<string, string> = {
    'friendly-talkative': 'Friendly & Talkative',
    'calm-thoughtful': 'Calm & Thoughtful',
    energetic: 'Energetic',
    humorous: 'Humorous',
    professional: 'Professional',
    'flexible-spontaneous': 'Flexible & Spontaneous',
  };
  return labels[tag] || tag;
}

export function categoryLabel(cat: string): string {
  const labels: Record<string, string> = {
    'street-food': 'Street Food',
    'history-culture': 'History & Culture',
    'hidden-neighborhoods': 'Hidden Neighborhoods',
    'museums-architecture': 'Museums & Architecture',
    nightlife: 'Nightlife',
    photography: 'Photography',
    'family-friendly': 'Family-Friendly',
    'outdoor-adventure': 'Outdoor Adventure',
    'local-markets': 'Local Markets',
    'accessible-travel': 'Accessible Travel',
    festivals: 'Festivals',
    shopping: 'Shopping',
    'local-daily-life': 'Local Daily Life',
    'hidden-gems': 'Hidden Gems',
  };
  return labels[cat] || cat;
}

export function proficiencyLabel(level: string): string {
  const labels: Record<string, string> = {
    native: 'Native',
    fluent: 'Fluent',
    conversational: 'Conversational',
    basic: 'Basic',
  };
  return labels[level] || level;
}

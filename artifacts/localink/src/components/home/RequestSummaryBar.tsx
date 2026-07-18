import { CalendarDays, Languages, MapPin, Pencil, RotateCcw, UsersRound } from 'lucide-react';

import { SUPPORTED_LANGUAGES } from '@/data/mockData';

import type { RequestGuideDraft } from './requestGuideValidation';

interface RequestSummaryBarProps {
  request: RequestGuideDraft;
  onEdit: () => void;
  onStartOver: () => void;
}

function formatDate(value: string) {
  const [year, month, day] = value.split('-').map(Number);
  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

function languageName(code: string) {
  return SUPPORTED_LANGUAGES.find((language) => language.code === code)?.name ?? code;
}

export default function RequestSummaryBar({
  request,
  onEdit,
  onStartOver,
}: RequestSummaryBarProps) {
  return (
    <section className="request-summary" aria-label="Your guide request summary">
      <div className="request-summary-details">
        <p className="request-summary-destination">
          <MapPin size={17} aria-hidden="true" />
          <strong>{request.destination}</strong>
        </p>
        <p>
          <CalendarDays size={16} aria-hidden="true" />
          <span>{formatDate(request.startDate)} – {formatDate(request.endDate)}</span>
        </p>
        <p>
          <UsersRound size={16} aria-hidden="true" />
          <span>{request.groupSize} {request.groupSize === 1 ? 'Traveler' : 'Travelers'}</span>
        </p>
        <p>
          <Languages size={16} aria-hidden="true" />
          <span>{request.languages.map(languageName).join(', ')}</span>
        </p>
        {request.experiencePreferences.length > 0 && (
          <p className="request-summary-preferences">
            {request.experiencePreferences.slice(0, 2).map((preference) => (
              <span key={preference}>{preference}</span>
            ))}
          </p>
        )}
      </div>

      <div className="request-summary-actions">
        <button type="button" className="btn btn-outline" onClick={onEdit}>
          <Pencil size={15} aria-hidden="true" /> Edit Request
        </button>
        <button type="button" className="request-start-over" onClick={onStartOver}>
          <RotateCcw size={14} aria-hidden="true" /> Start Over
        </button>
      </div>
    </section>
  );
}

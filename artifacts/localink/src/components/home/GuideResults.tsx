import { useState } from 'react';
import { ArrowRight, CheckCircle2, Clock3, MapPin, Star } from 'lucide-react';
import { Link } from 'wouter';

import { SUPPORTED_LANGUAGES } from '@/data/mockData';
import { formatCurrency } from '@/lib/utils';

import type { GuideMatchResult } from './guideMatching';
import { selectVisibleMatchReasons } from './matchReasonPresentation';

interface GuideResultsProps {
  results: GuideMatchResult[];
  onEditRequest: () => void;
  onViewProfile: (guideId: string, matchReasons: string[]) => void;
}

function languageName(code: string) {
  if (code === 'vi') return 'Vietnamese';
  return SUPPORTED_LANGUAGES.find((language) => language.code === code)?.name ?? code;
}

export default function GuideResults({ results, onEditRequest, onViewProfile }: GuideResultsProps) {
  const [imageErrors, setImageErrors] = useState<string[]>([]);
  const visibleResults = results.slice(0, 6);
  const visibleReasonSets = selectVisibleMatchReasons(
    visibleResults.map(({ matchReasons }) => matchReasons),
  );

  if (visibleResults.length === 0) {
    return (
      <section className="guide-results-empty" aria-labelledby="guide-results-empty-title">
        <div className="guide-results-empty-mark" aria-hidden="true">FL</div>
        <h2 id="guide-results-empty-title">We couldn’t find a close match yet.</h2>
        <p>Try changing the language, destination or dates.</p>
        <button type="button" className="btn btn-accent" onClick={onEditRequest}>
          Edit Request
        </button>
      </section>
    );
  }

  return (
    <section className="guide-results-grid" aria-label={`${visibleResults.length} matching local guides`}>
      {visibleResults.map(({ guide }, index) => (
        <article className="matched-guide-card" key={guide.id}>
          <div className="matched-guide-photo">
            {!imageErrors.includes(guide.id) ? (
              <img
                src={guide.image}
                alt={`${guide.name}, a local guide based in ${guide.city}`}
                onError={() => setImageErrors((current) => [...current, guide.id])}
              />
            ) : (
              <div className="matched-guide-image-fallback" role="img" aria-label={`Portrait unavailable for ${guide.name}`}>
                {guide.name.charAt(0)}
              </div>
            )}
            {index === 0 && <span className="best-match-badge">Best Match</span>}
          </div>

          <div className="matched-guide-content">
            <div className="matched-guide-heading">
              <div>
                <h2>{guide.name}</h2>
                <p><MapPin size={14} aria-hidden="true" /> {guide.city}</p>
              </div>
              <span className="verified-guide"><CheckCircle2 size={15} aria-hidden="true" /> Verified</span>
            </div>

            <p className="matched-guide-languages">
              {guide.languages.map(languageName).join(' · ')}
            </p>

            <div className="matched-guide-reasons" aria-label="Why this guide matches">
              {(visibleReasonSets[index] ?? []).map((reason) => <span key={reason}>{reason}</span>)}
            </div>

            <div className="matched-guide-meta">
              <span><Star size={15} fill="currentColor" aria-hidden="true" /> <strong>{guide.rating}</strong>{guide.reviewCount ? ` (${guide.reviewCount})` : ''}</span>
              {guide.responseTime && <span><Clock3 size={15} aria-hidden="true" /> {guide.responseTime}</span>}
            </div>

            <div className="matched-guide-footer">
              {guide.hourlyRate && guide.currency ? (
                <span>From <strong>{formatCurrency(guide.hourlyRate, guide.currency)}/hr</strong></span>
              ) : <span />}
              {guide.profileId && (
                <Link
                  href={`/guides/${guide.profileId}`}
                  className="guide-profile-link"
                  onClick={() => onViewProfile(guide.profileId!, visibleReasonSets[index] ?? [])}
                >
                  View Profile <ArrowRight size={16} aria-hidden="true" />
                </Link>
              )}
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}

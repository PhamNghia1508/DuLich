import { ArrowLeft, CalendarDays, Languages, MapPin, Users } from 'lucide-react';
import { Link, useParams } from 'wouter';

import SupportChat from '@/components/home/SupportChat';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { createBookingHandoffData } from '@/components/traveler/guideProfileData';
import { useTravelerPrototype } from '@/components/traveler/TravelerPrototypeContext';

import './booking-handoff.css';

export default function BookingHandoffPage() {
  const { guideId = '' } = useParams<{ guideId: string }>();
  const { requestDraft } = useTravelerPrototype();
  const handoff = createBookingHandoffData(guideId, requestDraft);

  if (!handoff) {
    return (
      <div className="booking-handoff-page">
        <Navbar variant="home" />
        <main className="booking-handoff-missing">
          <h1>This guide selection isn’t available.</h1>
          <p>Return to Home to choose another local guide.</p>
          <Link href="/" className="btn btn-accent">Back to Home</Link>
        </main>
        <Footer variant="home" />
      </div>
    );
  }

  const { guide, request } = handoff;

  return (
    <div className="booking-handoff-page">
      <Navbar variant="home" />
      <main className="booking-handoff-container">
        <Link href={`/guides/${guide.id}`} className="booking-handoff-back">
          <ArrowLeft size={16} aria-hidden="true" /> Back to Guide
        </Link>

        <header className="booking-handoff-header">
          <p>Guide selected</p>
          <h1>You’ve chosen a local friend.</h1>
          <span>Booking details will be completed in the next step.</span>
        </header>

        <div className="booking-handoff-grid">
          <section className="booking-handoff-card booking-handoff-guide" aria-labelledby="selected-guide-title">
            <img src={guide.portrait} alt={`${guide.name}, selected local guide`} />
            <div>
              <p className="booking-handoff-label">Selected guide</p>
              <h2 id="selected-guide-title">{guide.name}</h2>
              <p><MapPin size={15} aria-hidden="true" /> {guide.city}</p>
              <p><Languages size={15} aria-hidden="true" /> {guide.languages.map((language) => language.name).join(', ')}</p>
            </div>
          </section>

          {request && (
            <section className="booking-handoff-card" aria-labelledby="handoff-request-title">
              <p className="booking-handoff-label">Your request</p>
              <h2 id="handoff-request-title">Trip summary</h2>
              <dl className="booking-handoff-summary">
                <div><dt><MapPin size={16} aria-hidden="true" /> Destination</dt><dd>{request.destination}</dd></div>
                <div><dt><CalendarDays size={16} aria-hidden="true" /> Dates</dt><dd>{request.startDate} – {request.endDate}</dd></div>
                <div><dt><Users size={16} aria-hidden="true" /> Group</dt><dd>{request.groupSize} traveler{request.groupSize === 1 ? '' : 's'}</dd></div>
                <div><dt><Languages size={16} aria-hidden="true" /> Languages</dt><dd>{request.languages.map((language) => language.toUpperCase()).join(', ')}</dd></div>
              </dl>
              {request.experiencePreferences.length > 0 && (
                <div className="booking-handoff-interests">
                  {request.experiencePreferences.map((interest) => <span key={interest}>{interest}</span>)}
                </div>
              )}
            </section>
          )}
        </div>

        <div className="booking-handoff-actions">
          <Link href={`/guides/${guide.id}`} className="btn btn-accent">Back to Guide</Link>
          <Link href="/" className="booking-handoff-results">Back to Results</Link>
        </div>
      </main>
      <Footer variant="home" />
      <SupportChat />
    </div>
  );
}

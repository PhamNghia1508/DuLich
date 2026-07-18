import { useState } from 'react';
import { ArrowLeft, BadgeCheck, CalendarDays, Languages, MapPin, ShieldCheck, Star, Users } from 'lucide-react';
import { Link, useLocation, useParams } from 'wouter';

import SupportChat from '@/components/home/SupportChat';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import BookingDetailsForm from '@/components/traveler/BookingDetailsForm';
import BookingPriceSummary from '@/components/traveler/BookingPriceSummary';
import { createInitialBookingDraft } from '@/components/traveler/bookingPrototype';
import { getGuideRecommendation, getPrototypeGuideProfile } from '@/components/traveler/guideProfileData';
import { useTravelerPrototype } from '@/components/traveler/TravelerPrototypeContext';

import type { PrototypeBookingDraft } from '@/components/traveler/bookingPrototype';
import './booking-handoff.css';

export default function BookingHandoffPage() {
  const { guideId = '' } = useParams<{ guideId: string }>();
  const [, navigate] = useLocation();
  const {
    bookingDraft,
    recommendation,
    requestDraft,
    saveBookingDraft,
    selectedGuideId,
  } = useTravelerPrototype();
  const guide = getPrototypeGuideProfile(guideId);
  const activeRequest = selectedGuideId && selectedGuideId !== guideId ? null : requestDraft;
  const [draft, setDraft] = useState<PrototypeBookingDraft | null>(() => {
    if (!guide) return null;
    return bookingDraft?.guideId === guideId
      ? bookingDraft
      : createInitialBookingDraft(guide, activeRequest) ?? null;
  });

  if (!guide || !draft) {
    return (
      <div className="prototype-booking-page">
        <Navbar variant="home" />
        <main className="prototype-recovery-state">
          <h1>This guide selection isn’t available.</h1>
          <p>Return to Home to choose another local guide.</p>
          <Link href="/" className="btn btn-accent">Back to Home</Link>
        </main>
        <Footer variant="home" />
      </div>
    );
  }

  const recommendationReasons = getGuideRecommendation(recommendation, guide.id);
  const continueToPayment = (nextDraft: PrototypeBookingDraft) => {
    saveBookingDraft(nextDraft);
    navigate(`/payment/${guide.id}`);
  };

  return (
    <div className="prototype-booking-page">
      <Navbar variant="home" />
      <main className="prototype-booking-container">
        <Link href={`/guides/${guide.id}`} className="prototype-back-link">
          <ArrowLeft size={16} aria-hidden="true" /> Back to Guide Profile
        </Link>

        <header className="prototype-booking-header">
          <p>Booking details</p>
          <h1>Plan your time with {guide.name}</h1>
          <span>Choose the essentials now. Nothing is booked or charged until the demo confirmation step.</span>
        </header>

        <section className="prototype-selected-guide" aria-labelledby="prototype-selected-guide-title">
          <img src={guide.portrait} alt={`${guide.name}, your selected local guide`} />
          <div className="prototype-selected-guide-main">
            <p>Selected local guide</p>
            <div><h2 id="prototype-selected-guide-title">{guide.name}</h2>{guide.verified && <span><BadgeCheck size={17} aria-hidden="true" /> Verified</span>}</div>
            <p><MapPin size={15} aria-hidden="true" /> {guide.city}</p>
          </div>
          <dl className="prototype-selected-guide-facts">
            <div><dt><Languages size={15} aria-hidden="true" /> Languages</dt><dd>{guide.languages.map((language) => language.name).join(', ')}</dd></div>
            <div><dt><Star size={15} aria-hidden="true" /> Rating</dt><dd>{guide.rating} ({guide.reviewCount})</dd></div>
            <div><dt>Hourly rate</dt><dd>{guide.currency} {guide.hourlyRate}/hr</dd></div>
          </dl>
          {recommendationReasons && (
            <ul className="prototype-booking-reasons" aria-label="Why this guide was recommended">
              {recommendationReasons.map((reason) => <li key={reason}>{reason}</li>)}
            </ul>
          )}
        </section>

        {activeRequest ? (
          <section className="prototype-trip-summary" aria-labelledby="prototype-trip-summary-title">
            <div><p>Your request</p><h2 id="prototype-trip-summary-title">Trip information</h2></div>
            <dl>
              <div><dt><MapPin size={15} aria-hidden="true" /> Destination</dt><dd>{activeRequest.destination}</dd></div>
              <div><dt><Users size={15} aria-hidden="true" /> Group</dt><dd>{activeRequest.groupSize} traveler{activeRequest.groupSize === 1 ? '' : 's'}</dd></div>
              <div><dt><CalendarDays size={15} aria-hidden="true" /> Dates</dt><dd>{activeRequest.startDate} – {activeRequest.endDate}</dd></div>
              <div><dt><Languages size={15} aria-hidden="true" /> Languages</dt><dd>{activeRequest.languages.map((language) => language.toUpperCase()).join(', ')}</dd></div>
            </dl>
            {activeRequest.experiencePreferences.length > 0 && <p>{activeRequest.experiencePreferences.join(' · ')}</p>}
          </section>
        ) : (
          <section className="prototype-direct-notice" role="note">
            <CalendarDays size={20} aria-hidden="true" />
            <div><h2>No request details in this session</h2><p>You can still enter the booking details manually below.</p></div>
          </section>
        )}

        <div className="prototype-booking-layout">
          <BookingDetailsForm guide={guide} request={activeRequest} draft={draft} onDraftChange={setDraft} onSubmit={continueToPayment} />
          <aside className="prototype-booking-sidebar" aria-label="Booking price and policies">
            <BookingPriceSummary price={draft.price} actionLabel="Continue to Payment" formId="prototype-booking-form" />
            <section className="prototype-policy-card" aria-labelledby="prototype-policy-title">
              <h2 id="prototype-policy-title"><ShieldCheck size={18} aria-hidden="true" /> Booking policies</h2>
              <ul>
                <li>Guide confirmation is required.</li>
                <li>Chat opens only after booking is confirmed.</li>
                <li>Free cancellation up to 24 hours before the scheduled start.</li>
                <li>No real charge is made in this prototype.</li>
              </ul>
            </section>
          </aside>
        </div>
      </main>
      <Footer variant="home" />
      <SupportChat />
    </div>
  );
}

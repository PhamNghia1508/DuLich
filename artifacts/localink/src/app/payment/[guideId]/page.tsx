import { useState } from 'react';
import { ArrowLeft, BadgeCheck, CalendarDays, Clock3, MapPin, ShieldCheck, Users } from 'lucide-react';
import { Link, useLocation, useParams } from 'wouter';

import SupportChat from '@/components/home/SupportChat';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import BookingPriceSummary from '@/components/traveler/BookingPriceSummary';
import PaymentMethodSelector from '@/components/traveler/PaymentMethodSelector';
import { createPrototypeBooking, validatePrototypePayment } from '@/components/traveler/bookingPrototype';
import { getPrototypeGuideProfile } from '@/components/traveler/guideProfileData';
import { useTravelerPrototype } from '@/components/traveler/TravelerPrototypeContext';

import type { PrototypePaymentErrors } from '@/components/traveler/bookingPrototype';
import './payment.css';

export default function PaymentPage() {
  const { guideId = '' } = useParams<{ guideId: string }>();
  const [, navigate] = useLocation();
  const {
    bookingDraft,
    confirmBooking,
    paymentMethod,
    requestDraft,
    setPaymentMethod,
  } = useTravelerPrototype();
  const [acknowledged, setAcknowledged] = useState(false);
  const [errors, setErrors] = useState<PrototypePaymentErrors>({});
  const guide = getPrototypeGuideProfile(guideId);
  const activeDraft = bookingDraft?.guideId === guideId ? bookingDraft : null;

  if (!guide) {
    return (
      <div className="prototype-payment-page"><Navbar variant="home" /><main className="prototype-recovery-state"><h1>This guide isn’t available.</h1><p>Return to Home to choose another local guide.</p><Link href="/" className="btn btn-accent">Back to Home</Link></main><Footer variant="home" /></div>
    );
  }

  if (!activeDraft) {
    return (
      <div className="prototype-payment-page">
        <Navbar variant="home" />
        <main className="prototype-recovery-state">
          <h1>Complete the booking details first.</h1>
          <p>This demo payment step needs a booking draft from the current session.</p>
          <Link href={`/booking-handoff/${guide.id}`} className="btn btn-accent">Enter Booking Details</Link>
          <Link href="/" className="prototype-recovery-link">Back to Home</Link>
        </main>
        <Footer variant="home" />
      </div>
    );
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validatePrototypePayment(paymentMethod, acknowledged);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0 || !paymentMethod) return;

    confirmBooking(createPrototypeBooking(activeDraft, paymentMethod, requestDraft));
    navigate(`/booking-success/${guide.id}`);
  };

  return (
    <div className="prototype-payment-page">
      <Navbar variant="home" />
      <main className="prototype-payment-container">
        <Link href={`/booking-handoff/${guide.id}`} className="prototype-back-link"><ArrowLeft size={16} aria-hidden="true" /> Back to Booking Details</Link>
        <header className="prototype-payment-header">
          <p>Demo payment</p>
          <h1>Review and confirm</h1>
          <span>This prototype demonstrates the final choice without processing a real payment.</span>
        </header>

        <div className="prototype-payment-layout">
          <form id="prototype-payment-form" className="prototype-payment-form" onSubmit={handleSubmit} noValidate>
            <section className="prototype-payment-review" aria-labelledby="prototype-review-title">
              <div className="prototype-payment-guide">
                <img src={guide.portrait} alt={`${guide.name}, selected local guide`} />
                <div><p>Booking with</p><h2 id="prototype-review-title">{guide.name} <BadgeCheck size={17} aria-label="Verified guide" /></h2><span><MapPin size={14} aria-hidden="true" /> {guide.city}</span></div>
              </div>
              <dl>
                <div><dt><CalendarDays size={16} aria-hidden="true" /> Date</dt><dd>{activeDraft.bookingDate}</dd></div>
                <div><dt><Clock3 size={16} aria-hidden="true" /> Time</dt><dd>{activeDraft.startTime} · {activeDraft.durationHours} hours</dd></div>
                <div><dt><MapPin size={16} aria-hidden="true" /> Meeting point</dt><dd>{activeDraft.meetingPoint}</dd></div>
                <div><dt><Users size={16} aria-hidden="true" /> Group</dt><dd>{activeDraft.groupSize} traveler{activeDraft.groupSize === 1 ? '' : 's'}</dd></div>
                <div><dt>Experience</dt><dd>{activeDraft.experiencePreference}</dd></div>
              </dl>
            </section>

            <section className="prototype-payment-choice" aria-labelledby="prototype-payment-choice-title">
              <div><ShieldCheck size={20} aria-hidden="true" /><div><h2 id="prototype-payment-choice-title">Choose a demo option</h2><p>No credentials or sensitive payment details are collected.</p></div></div>
              <PaymentMethodSelector value={paymentMethod} error={errors.paymentMethod} onChange={(method) => { setPaymentMethod(method); setErrors((current) => ({ ...current, paymentMethod: undefined })); }} />
              <label className="prototype-payment-acknowledgment">
                <input type="checkbox" checked={acknowledged} onChange={(event) => { setAcknowledged(event.target.checked); setErrors((current) => ({ ...current, acknowledgment: undefined })); }} />
                <span>I understand this prototype does not process a real payment.</span>
              </label>
              {errors.acknowledgment && <p className="prototype-field-error" role="alert">{errors.acknowledgment}</p>}
              <button type="submit" className="btn btn-accent prototype-payment-mobile-action">Confirm Demo Booking</button>
            </section>
          </form>

          <aside className="prototype-payment-sidebar">
            <BookingPriceSummary price={activeDraft.price} actionLabel="Confirm Demo Booking" formId="prototype-payment-form" />
          </aside>
        </div>
      </main>
      <Footer variant="home" />
      <SupportChat />
    </div>
  );
}

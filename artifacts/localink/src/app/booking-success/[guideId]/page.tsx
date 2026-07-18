import { BadgeCheck, CalendarDays, Check, Clock3, MapPin, MessageCircleOff, ReceiptText } from 'lucide-react';
import { Link, useParams } from 'wouter';

import SupportChat from '@/components/home/SupportChat';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { formatPrototypeMoney, prototypePaymentLabel } from '@/components/traveler/bookingPrototype';
import { getPrototypeGuideProfile } from '@/components/traveler/guideProfileData';
import { useTravelerPrototype } from '@/components/traveler/TravelerPrototypeContext';

import './booking-success.css';

export default function BookingSuccessPage() {
  const { guideId = '' } = useParams<{ guideId: string }>();
  const { confirmedBooking } = useTravelerPrototype();
  const guide = getPrototypeGuideProfile(guideId);
  const booking = confirmedBooking?.guideId === guideId ? confirmedBooking : null;

  if (!guide || !booking) {
    return (
      <div className="prototype-success-page">
        <Navbar variant="home" />
        <main className="prototype-recovery-state">
          <h1>No confirmed demo booking was found.</h1>
          <p>Complete Booking Details and the demo payment step in this session first.</p>
          {guide && <Link href={`/booking-handoff/${guide.id}`} className="btn btn-accent">Start Booking Details</Link>}
          <Link href="/" className="prototype-recovery-link">Back to Home</Link>
        </main>
        <Footer variant="home" />
      </div>
    );
  }

  return (
    <div className="prototype-success-page">
      <Navbar variant="home" />
      <main className="prototype-success-container">
        <header className="prototype-success-header" role="status">
          <div aria-hidden="true"><Check size={30} /></div>
          <p>Demo booking confirmed</p>
          <h1>Your local experience is reserved.</h1>
          <span>No real payment was processed. This confirmation exists only in the current prototype session.</span>
        </header>

        <section id="prototype-booking-detail" className="prototype-success-detail" aria-labelledby="prototype-success-detail-title">
          <div className="prototype-success-guide">
            <img src={guide.portrait} alt={`${guide.name}, your reserved local guide`} />
            <div><p>Your local guide</p><h2 id="prototype-success-detail-title">{guide.name} <BadgeCheck size={18} aria-label="Verified guide" /></h2><span><MapPin size={14} aria-hidden="true" /> {guide.city}</span></div>
            <strong><Check size={15} aria-hidden="true" /> Confirmed</strong>
          </div>

          <dl className="prototype-success-facts">
            <div><dt><ReceiptText size={16} aria-hidden="true" /> Booking reference</dt><dd>{booking.id}</dd></div>
            <div><dt><CalendarDays size={16} aria-hidden="true" /> Date</dt><dd>{booking.bookingDate}</dd></div>
            <div><dt><Clock3 size={16} aria-hidden="true" /> Time and duration</dt><dd>{booking.startTime} · {booking.durationHours} hours</dd></div>
            <div><dt><MapPin size={16} aria-hidden="true" /> Meeting point</dt><dd>{booking.meetingPoint}</dd></div>
            <div><dt>Experience</dt><dd>{booking.experiencePreference}</dd></div>
            <div><dt>Demo payment</dt><dd>{prototypePaymentLabel(booking.paymentMethod)}</dd></div>
            <div className="prototype-success-total"><dt>Total</dt><dd>{formatPrototypeMoney(booking.price.total, booking.price.currency)}</dd></div>
          </dl>

          <div className="prototype-success-chat-note">
            <MessageCircleOff size={19} aria-hidden="true" />
            <p><strong>Chat is not active yet.</strong> Chat with your guide will be available in the next step.</p>
          </div>
        </section>

        <div className="prototype-success-actions">
          <a href="#prototype-booking-detail" className="btn btn-accent">View Booking</a>
          <Link href="/" className="prototype-success-home">Back to Home</Link>
        </div>
      </main>
      <Footer variant="home" />
      <SupportChat />
    </div>
  );
}

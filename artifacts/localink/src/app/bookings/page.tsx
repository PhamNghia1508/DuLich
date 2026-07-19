import { useEffect, useState } from 'react';
import { CalendarDays, ChevronRight, MapPin, MessageCircle, Star } from 'lucide-react';
import { Link, useLocation, useSearch } from 'wouter';

import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import SupportChat from '@/components/home/SupportChat';
import { useTravelerPrototype } from '@/components/traveler/TravelerPrototypeContext';
import {
  bookingStatusLabel,
  bookingStatusColor,
  canOpenPrototypeChat,
  formatBookingDate,
  formatPrototypeMoney,
} from '@/components/traveler/bookingHistoryData';
import { consumePrototypeSignals } from '@/components/home/requestEntrySignal';

import './bookings.css';

export default function BookingListPage() {
  const { bookingHistory } = useTravelerPrototype();
  const [, navigate] = useLocation();
  const search = useSearch();
  const [confirmation, setConfirmation] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
    if (!params.has('demoSignedIn')) return;
    const consumed = consumePrototypeSignals(search, ['demoSignedIn']);
    if (consumed.present.has('demoSignedIn')) {
      setConfirmation('Demo sign-in complete. Here are your bookings.');
    }
    navigate(`/bookings${consumed.remainingSearch}`, { replace: true });
  }, [navigate, search]);

  const upcoming = bookingHistory.filter((b) => b.status === 'confirmed');
  const past = bookingHistory.filter((b) => b.status !== 'confirmed');

  return (
    <div className="bookings-page">
      <Navbar variant="home" />
      {confirmation && <div className="prototype-confirmation" role="status">{confirmation}</div>}
      <main className="bookings-container">
        <header className="bookings-header">
          <h1>Your Bookings</h1>
          <p>Demo booking history — data resets each session.</p>
        </header>

        {bookingHistory.length === 0 && (
          <div className="bookings-empty">
            <CalendarDays size={40} />
            <p>No bookings yet. Find a local guide and book your first experience!</p>
            <Link href="/" className="btn btn-accent">Browse Guides</Link>
          </div>
        )}

        {upcoming.length > 0 && (
          <section className="bookings-section" aria-labelledby="bookings-upcoming-title">
            <h2 id="bookings-upcoming-title">Upcoming</h2>
            <div className="bookings-list">
              {upcoming.map((booking) => (
                <Link
                  key={booking.id}
                  href={`/bookings/${booking.id}`}
                  className="booking-card"
                >
                  <img src={booking.guidePortrait} alt={booking.guideName} className="booking-card-avatar" />
                  <div className="booking-card-info">
                    <div className="booking-card-top">
                      <h3>{booking.guideName}</h3>
                      <span
                        className="booking-status-badge"
                        style={{ '--status-color': bookingStatusColor(booking.status) } as React.CSSProperties}
                      >
                        {bookingStatusLabel(booking.status)}
                      </span>
                    </div>
                    <p className="booking-card-meta">
                      <CalendarDays size={14} /> {formatBookingDate(booking.bookingDate)}
                      <span className="booking-card-sep">·</span>
                      <MapPin size={14} /> {booking.guideCity}
                    </p>
                    <p className="booking-card-experience">{booking.experiencePreference} · {booking.durationHours}h</p>
                    <div className="booking-card-bottom">
                      <span className="booking-card-price">
                        {formatPrototypeMoney(booking.price.total, booking.price.currency)}
                      </span>
                      {canOpenPrototypeChat(booking.status) && (
                        <span className="booking-card-chat-hint">
                          <MessageCircle size={14} /> Chat available
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight size={18} className="booking-card-arrow" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {past.length > 0 && (
          <section className="bookings-section" aria-labelledby="bookings-past-title">
            <h2 id="bookings-past-title">Past</h2>
            <div className="bookings-list">
              {past.map((booking) => (
                <Link
                  key={booking.id}
                  href={`/bookings/${booking.id}`}
                  className="booking-card booking-card--past"
                >
                  <img src={booking.guidePortrait} alt={booking.guideName} className="booking-card-avatar" />
                  <div className="booking-card-info">
                    <div className="booking-card-top">
                      <h3>{booking.guideName}</h3>
                      <span
                        className="booking-status-badge"
                        style={{ '--status-color': bookingStatusColor(booking.status) } as React.CSSProperties}
                      >
                        {bookingStatusLabel(booking.status)}
                      </span>
                    </div>
                    <p className="booking-card-meta">
                      <CalendarDays size={14} /> {formatBookingDate(booking.bookingDate)}
                      <span className="booking-card-sep">·</span>
                      <MapPin size={14} /> {booking.guideCity}
                    </p>
                    <p className="booking-card-experience">{booking.experiencePreference} · {booking.durationHours}h</p>
                    <div className="booking-card-bottom">
                      <span className="booking-card-price">
                        {formatPrototypeMoney(booking.price.total, booking.price.currency)}
                      </span>
                      {booking.status === 'completed' && (
                        <span className="booking-card-review-hint">
                          <Star size={14} /> Leave a review
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight size={18} className="booking-card-arrow" />
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer variant="home" />
      <SupportChat />
    </div>
  );
}

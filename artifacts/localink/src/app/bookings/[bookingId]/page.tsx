import { useState } from 'react';
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  Clock3,
  MapPin,
  MessageCircle,
  ReceiptText,
  Star,
  Users,
  XCircle,
} from 'lucide-react';
import { Link, useParams } from 'wouter';

import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import SupportChat from '@/components/home/SupportChat';
import { useTravelerPrototype } from '@/components/traveler/TravelerPrototypeContext';
import {
  bookingStatusLabel,
  bookingStatusColor,
  canOpenPrototypeChat,
  canSubmitPrototypeReview,
  formatBookingDate,
  formatPrototypeMoney,
  prototypePaymentLabel,
} from '@/components/traveler/bookingHistoryData';
import {
  validatePrototypeReview,
  hasReviewErrors,
} from '@/components/traveler/reviewPrototypeData';
import type { PrototypeReviewDraft } from '@/components/traveler/reviewPrototypeData';

import './booking-detail.css';

export default function BookingDetailPage() {
  const { bookingId = '' } = useParams<{ bookingId: string }>();
  const { getBookingById, getReview, submitReview } = useTravelerPrototype();
  const booking = getBookingById(bookingId);
  const existingReview = getReview(bookingId);

  const [reviewDraft, setReviewDraft] = useState<PrototypeReviewDraft>({ rating: 0, comment: '' });
  const [reviewErrors, setReviewErrors] = useState<Record<string, string>>({});
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  if (!booking) {
    return (
      <div className="booking-detail-page">
        <Navbar variant="home" />
        <main className="booking-detail-container booking-detail-not-found">
          <XCircle size={40} />
          <h1>Booking not found</h1>
          <p>The booking reference <code>{bookingId}</code> does not exist in this prototype session.</p>
          <Link href="/bookings" className="btn btn-accent">View All Bookings</Link>
        </main>
        <Footer variant="home" />
      </div>
    );
  }

  const showReviewForm = canSubmitPrototypeReview(booking.status) && !existingReview && !reviewSubmitted;
  const showReviewConfirmation = existingReview || reviewSubmitted;

  function handleReviewSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errors = validatePrototypeReview(reviewDraft);
    if (hasReviewErrors(errors)) {
      setReviewErrors(errors);
      return;
    }
    submitReview(booking!.id, booking!.guideId, reviewDraft);
    setReviewErrors({});
    setReviewSubmitted(true);
  }

  return (
    <div className="booking-detail-page">
      <Navbar variant="home" />
      <main className="booking-detail-container">
        <Link href="/bookings" className="booking-detail-back">
          <ArrowLeft size={16} /> All Bookings
        </Link>

        <header className="booking-detail-header">
          <img src={booking.guidePortrait} alt={booking.guideName} className="booking-detail-avatar" />
          <div>
            <h1>
              {booking.guideName} <BadgeCheck size={18} aria-label="Verified guide" />
            </h1>
            <p className="booking-detail-city"><MapPin size={14} /> {booking.guideCity}</p>
          </div>
          <span
            className="booking-status-badge booking-detail-status"
            style={{ '--status-color': bookingStatusColor(booking.status) } as React.CSSProperties}
          >
            {bookingStatusLabel(booking.status)}
          </span>
        </header>

        <section className="booking-detail-facts" aria-label="Booking details">
          <dl>
            <div>
              <dt><ReceiptText size={16} /> Reference</dt>
              <dd>{booking.id}</dd>
            </div>
            <div>
              <dt><CalendarDays size={16} /> Date</dt>
              <dd>{formatBookingDate(booking.bookingDate)}</dd>
            </div>
            <div>
              <dt><Clock3 size={16} /> Time & Duration</dt>
              <dd>{booking.startTime} · {booking.durationHours} hours</dd>
            </div>
            <div>
              <dt><MapPin size={16} /> Meeting Point</dt>
              <dd>{booking.meetingPoint}</dd>
            </div>
            <div>
              <dt><Star size={16} /> Experience</dt>
              <dd>{booking.experiencePreference}</dd>
            </div>
            <div>
              <dt><Users size={16} /> Group Size</dt>
              <dd>{booking.groupSize} {booking.groupSize === 1 ? 'person' : 'people'}</dd>
            </div>
            <div>
              <dt>Payment</dt>
              <dd>{prototypePaymentLabel(booking.paymentMethod)}</dd>
            </div>
            <div className="booking-detail-total">
              <dt>Total</dt>
              <dd>{formatPrototypeMoney(booking.price.total, booking.price.currency)}</dd>
            </div>
          </dl>
        </section>

        {canOpenPrototypeChat(booking.status) && (
          <Link href={`/bookings/${booking.id}/chat`} className="booking-detail-chat-link">
            <MessageCircle size={20} />
            <div>
              <strong>Chat with {booking.guideName}</strong>
              <span>Coordinate details, ask questions, or just say hello</span>
            </div>
          </Link>
        )}

        {booking.status === 'cancelled' && (
          <div className="booking-detail-cancelled-note">
            <XCircle size={18} />
            <p>This booking was cancelled. Chat and reviews are not available for cancelled bookings.</p>
          </div>
        )}

        {showReviewForm && (
          <section className="booking-detail-review" aria-labelledby="review-form-title">
            <h2 id="review-form-title">Leave a Review</h2>
            <p className="booking-detail-review-subtitle">Share your experience with {booking.guideName}.</p>
            <form onSubmit={handleReviewSubmit} className="review-form">
              <fieldset className="review-stars">
                <legend>Rating</legend>
                <div className="review-star-row">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`review-star-btn ${reviewDraft.rating >= star ? 'review-star-btn--active' : ''}`}
                      onClick={() => setReviewDraft((d) => ({ ...d, rating: star }))}
                      aria-label={`${star} star${star > 1 ? 's' : ''}`}
                    >
                      <Star size={28} fill={reviewDraft.rating >= star ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                </div>
                {reviewErrors.rating && <p className="review-error">{reviewErrors.rating}</p>}
              </fieldset>
              <label className="review-comment-label">
                Comment
                <textarea
                  className="review-comment-input"
                  rows={3}
                  placeholder="What stood out about this experience?"
                  value={reviewDraft.comment}
                  onChange={(e) => setReviewDraft((d) => ({ ...d, comment: e.target.value }))}
                />
                {reviewErrors.comment && <p className="review-error">{reviewErrors.comment}</p>}
              </label>
              <button type="submit" className="btn btn-accent review-submit-btn">Submit Review</button>
            </form>
          </section>
        )}

        {showReviewConfirmation && (
          <section className="booking-detail-review-done" aria-label="Your review">
            <Star size={20} fill="currentColor" />
            <div>
              <strong>Your review ({(existingReview ?? { rating: reviewDraft.rating }).rating}/5)</strong>
              <p>{(existingReview ?? { comment: reviewDraft.comment }).comment}</p>
            </div>
          </section>
        )}

        <div className="booking-detail-prototype-note">
          This is a prototype booking — no real payment was processed and data resets each session.
        </div>
      </main>
      <Footer variant="home" />
      <SupportChat />
    </div>
  );
}

import { CalendarDays, Clock3, MessageCircle, ShieldCheck, Star, Users } from 'lucide-react';
import { useMemo, useState } from 'react';

import {
  calculatePrototypePrice,
  formatPrototypeMoney,
} from '../bookingPrototype';
import type { PrototypeDurationHours } from '../bookingPrototype';
import type { RichGuideProfileViewModel } from '../richGuideProfileData';

interface RichGuideBookingCardProps {
  guide: RichGuideProfileViewModel;
  onChoose: () => void;
}

const DURATION_OPTIONS: PrototypeDurationHours[] = [2, 3, 4, 6, 8];

export default function RichGuideBookingCard({ guide, onChoose }: RichGuideBookingCardProps) {
  const firstAvailable = guide.availability.find((day) => day.status === 'available') ?? guide.availability[0];
  const [durationHours, setDurationHours] = useState<PrototypeDurationHours>(3);
  const [groupSize, setGroupSize] = useState(2);
  const [selectedDate, setSelectedDate] = useState(firstAvailable?.date ?? '');
  const [selectedTime, setSelectedTime] = useState('09:00');
  const price = useMemo(
    () => calculatePrototypePrice(guide.hourlyRate, durationHours, guide.currency),
    [durationHours, guide.currency, guide.hourlyRate],
  );

  return (
    <section className="rich-booking-card" aria-labelledby="rich-booking-title">
      <div className="rich-booking-rate">
        <p>Private guide from</p>
        <h2 id="rich-booking-title">{formatPrototypeMoney(guide.hourlyRate, guide.currency)} <span>/ hour</span></h2>
        <span><Star size={14} fill="currentColor" aria-hidden="true" /> {guide.rating} · {guide.reviewCount} reviews</span>
      </div>

      <div className="rich-booking-controls">
        <label htmlFor="profile-duration"><Clock3 size={15} aria-hidden="true" /> Duration</label>
        <select id="profile-duration" value={durationHours} onChange={(event) => setDurationHours(Number(event.target.value) as PrototypeDurationHours)}>
          {DURATION_OPTIONS.map((duration) => <option key={duration} value={duration}>{duration} hours</option>)}
        </select>

        <label htmlFor="profile-date"><CalendarDays size={15} aria-hidden="true" /> Preferred date</label>
        <select id="profile-date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)}>
          {guide.availability.map((day) => (
            <option key={day.date} value={day.date} disabled={day.status === 'unavailable'}>
              {day.label} · {day.status === 'available' ? 'Available' : day.status === 'hold' ? 'On hold' : 'Unavailable'}
            </option>
          ))}
        </select>

        <div className="rich-booking-control-row">
          <div>
            <label htmlFor="profile-time"><Clock3 size={15} aria-hidden="true" /> Time</label>
            <select id="profile-time" value={selectedTime} onChange={(event) => setSelectedTime(event.target.value)}>
              <option value="09:00">09:00</option><option value="13:30">13:30</option><option value="17:00">17:00</option>
            </select>
          </div>
          <div>
            <label htmlFor="profile-group"><Users size={15} aria-hidden="true" /> Group</label>
            <select id="profile-group" value={groupSize} onChange={(event) => setGroupSize(Number(event.target.value))}>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((size) => <option key={size} value={size}>{size}</option>)}
            </select>
          </div>
        </div>
      </div>

      <dl className="rich-booking-price">
        <div><dt>{durationHours} hours × {formatPrototypeMoney(guide.hourlyRate, guide.currency)}</dt><dd>{formatPrototypeMoney(price.subtotal, guide.currency)}</dd></div>
        <div><dt>Service fee (5%)</dt><dd>{formatPrototypeMoney(price.serviceFee, guide.currency)}</dd></div>
        <div><dt>Estimated total</dt><dd>{formatPrototypeMoney(price.total, guide.currency)}</dd></div>
      </dl>

      <button type="button" className="btn btn-accent rich-booking-primary" onClick={onChoose}>Continue to Booking</button>
      <button type="button" className="rich-message-disabled" disabled title="Messaging becomes available after booking confirmation">
        <MessageCircle size={16} aria-hidden="true" /> Message Guide · Available after booking
      </button>
      <p className="rich-booking-assurance"><ShieldCheck size={16} aria-hidden="true" /> No booking or payment is created on this profile.</p>
    </section>
  );
}

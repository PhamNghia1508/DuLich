import { CalendarDays, Clock3, ShieldCheck, Star, Users } from 'lucide-react';
import { useMemo } from 'react';

import { calculatePrototypePrice, formatPrototypeMoney } from '../bookingPrototype';
import type { PrototypeDurationHours } from '../bookingPrototype';
import type { RichGuideProfileViewModel, RichProfileScheduleSelection } from '../richGuideProfileData';

interface RichGuideBookingCardProps {
  guide: RichGuideProfileViewModel;
  selection: RichProfileScheduleSelection;
  durationHours: PrototypeDurationHours;
  groupSize: number;
  onDurationChange: (duration: PrototypeDurationHours) => void;
  onGroupSizeChange: (size: number) => void;
  onChoose: () => void;
}

const DURATION_OPTIONS: PrototypeDurationHours[] = [2, 3, 4, 6, 8];

export default function RichGuideBookingCard({
  guide,
  selection,
  durationHours,
  groupSize,
  onDurationChange,
  onGroupSizeChange,
  onChoose,
}: RichGuideBookingCardProps) {
  const selectedDay = guide.availability.find((day) => day.date === selection.date);
  const selectedSlot = selectedDay?.slots.find((slot) => slot.time === selection.time);
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
        <div className="rich-booking-schedule" aria-live="polite">
          <span><CalendarDays size={15} aria-hidden="true" /> Selected schedule</span>
          {selectedDay && selectedSlot ? (
            <strong>{selectedDay.label} <span aria-hidden="true">·</span> {selectedSlot.label}{selectedSlot.status === 'hold' ? ' (Hold)' : ''}</strong>
          ) : (
            <strong>Select a date and time from the calendar</strong>
          )}
          <a href="#availability">Change in calendar</a>
          {selectedSlot?.status === 'hold' && <small>Final availability is confirmed during booking.</small>}
        </div>

        <div className="rich-booking-control-row">
          <div>
            <label htmlFor="profile-duration"><Clock3 size={15} aria-hidden="true" /> Duration</label>
            <select id="profile-duration" value={durationHours} onChange={(event) => onDurationChange(Number(event.target.value) as PrototypeDurationHours)}>
              {DURATION_OPTIONS.map((duration) => <option key={duration} value={duration}>{duration} hours</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="profile-group"><Users size={15} aria-hidden="true" /> Group</label>
            <select id="profile-group" value={groupSize} onChange={(event) => onGroupSizeChange(Number(event.target.value))}>
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
      {!selection.time && <p className="rich-booking-prompt">Select a date and time, or continue to choose them during booking.</p>}
      <p className="rich-booking-assurance"><ShieldCheck size={16} aria-hidden="true" /> Prototype preview — no real booking or payment is created.</p>
    </section>
  );
}

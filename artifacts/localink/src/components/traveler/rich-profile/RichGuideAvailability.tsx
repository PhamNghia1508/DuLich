import { CalendarDays, Clock3 } from 'lucide-react';

import { isProfileSlotSelectable } from '../richGuideProfileData';
import type { RichGuideProfileViewModel, RichProfileScheduleSelection } from '../richGuideProfileData';

interface RichGuideAvailabilityProps {
  guide: RichGuideProfileViewModel;
  selection: RichProfileScheduleSelection;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
}

export default function RichGuideAvailability({ guide, selection, onDateChange, onTimeChange }: RichGuideAvailabilityProps) {
  const selectedDay = guide.availability.find((day) => day.date === selection.date) ?? guide.availability[0];

  return (
    <section id="availability" className="rich-section rich-availability" aria-labelledby="rich-availability-title">
      <header className="rich-availability-heading">
        <div>
          <p className="rich-eyebrow">Availability</p>
          <h2 id="rich-availability-title">Guide Availability Calendar</h2>
          <p>Preview this guide&apos;s available dates and times. Your selection is confirmed in the next booking step.</p>
        </div>
      </header>

      <div className="rich-date-rail" aria-label={`${guide.displayName} seven-day availability`}>
        {guide.availability.map((day) => (
          <button
            key={day.date}
            type="button"
            className={`rich-date-chip is-${day.status}`}
            aria-label={`${day.label}: ${day.status === 'available' ? 'available slots' : day.status === 'hold' ? 'has hold slots' : 'fully booked'}`}
            aria-pressed={selection.date === day.date}
            onClick={() => onDateChange(day.date)}
          >
            <span>{day.weekday}</span>
            <strong>{day.dayNumber}</strong>
            <small>{day.status === 'available' ? 'Open' : day.status === 'hold' ? 'Hold' : 'Booked'}</small>
          </button>
        ))}
      </div>

      {selectedDay && (
        <div className="rich-slot-panel">
          <div className="rich-slot-toolbar">
            <p><Clock3 size={15} aria-hidden="true" /> Times for {selectedDay.label}</p>
            <div className="rich-availability-legend" aria-label="Time slot legend">
              <span className="is-available">Available</span>
              <span className="is-hold">Hold</span>
              <span className="is-booked">Booked</span>
            </div>
          </div>

          <div className="rich-time-slot-grid" aria-label={`Time slots for ${selectedDay.label}`}>
            {selectedDay.slots.map((slot) => {
              const selectable = isProfileSlotSelectable(selectedDay, slot.time);
              return (
                <button
                  key={slot.time}
                  type="button"
                  className={`rich-time-slot is-${slot.status}`}
                  disabled={!selectable}
                  aria-pressed={selectable ? selection.time === slot.time : undefined}
                  aria-label={`${slot.label}, ${slot.status}`}
                  onClick={() => onTimeChange(slot.time)}
                >
                  <span>{slot.label}</span>
                  {slot.status !== 'available' && <small>{slot.status === 'hold' ? 'Hold' : 'Booked'}</small>}
                </button>
              );
            })}
          </div>

          {selectedDay.status === 'booked' && (
            <p className="rich-calendar-note"><CalendarDays size={15} aria-hidden="true" /> This day is fully booked. Choose another date to preview times.</p>
          )}
        </div>
      )}
    </section>
  );
}

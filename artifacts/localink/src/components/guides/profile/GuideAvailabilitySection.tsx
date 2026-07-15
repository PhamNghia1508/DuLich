import React, { useState } from 'react';
import { Calendar, Info, Clock } from 'lucide-react';
import type { Guide } from '@/types';
import { getGuideAvailability } from '@/data/availability';

interface GuideAvailabilitySectionProps {
  guide: Guide;
  selectedDate: string;
  setSelectedDate: (d: string) => void;
  selectedTime: string;
  setSelectedTime: (t: string) => void;
}

const formatDateString = (d: Date) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatTimeLabel = (timeStr: string) => {
  const [hourStr, minStr] = timeStr.split(':');
  const hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  
  let label = `${displayHour}:${minStr} ${ampm}`;
  if (timeStr === '06:00') label += ' (Sunrise)';
  if (timeStr === '16:00') label += ' (Golden hr)';
  if (timeStr === '18:00') label += ' (Sunset)';
  return label;
};

const ALL_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', 
  '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
];

export default function GuideAvailabilitySection({
  guide,
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
}: GuideAvailabilitySectionProps) {
  const todayStr = formatDateString(new Date());
  const [showManualDatePicker, setShowManualDatePicker] = useState(false);

  // Generate 7 days carousel list
  const next7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  const activeAvailability = getGuideAvailability(guide.id, selectedDate);

  return (
    <section 
      id="availability-section" 
      className="bg-white border border-[#E8E4DC] p-6 sm:p-8 rounded-3xl shadow-sm space-y-6"
      aria-labelledby="availability-section-title"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#F5F0EA] pb-4">
        <div>
          <span className="section-label">Realtime Schedule</span>
          <h3 id="availability-section-title" className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[#1C3A2E]">
            Guide Availability Calendar
          </h3>
          <p className="text-xs text-[#5A5A5A] mt-1">
            Check {guide.firstName}'s live calendar. Booked slots are kept private to protect traveler identity.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowManualDatePicker(!showManualDatePicker)}
          className="text-xs font-bold text-[#C4614A] hover:underline bg-transparent border-0 cursor-pointer self-start sm:self-center"
        >
          {showManualDatePicker ? 'Show 7 Days' : 'Pick other date'}
        </button>
      </div>

      {/* 7 Days Carousel */}
      {!showManualDatePicker ? (
        <div className="calendar-carousel">
          {next7Days.map((d) => {
            const dStr = formatDateString(d);
            const isActive = selectedDate === dStr;
            const dayNum = d.getDate();
            const dayOfWeek = d.toLocaleDateString('en-US', { weekday: 'short' });
            
            // Get availability dots for the day
            const dayAvail = getGuideAvailability(guide.id, dStr);
            const bookedCount = dayAvail.bookedSlots.length;
            const pendingCount = dayAvail.pendingSlots.length;
            const totalUnavailable = bookedCount + pendingCount;
            
            let dotClass = 'free';
            if (totalUnavailable >= ALL_SLOTS.length) {
              dotClass = 'booked';
            } else if (totalUnavailable >= 5) {
              dotClass = 'busy';
            }

            return (
              <button
                key={dStr}
                type="button"
                onClick={() => setSelectedDate(dStr)}
                className={`calendar-day-chip focus:outline-none focus:ring-1 focus:ring-[#1C3A2E] ${
                  isActive ? 'active' : ''
                }`}
              >
                <span className="text-[10px] font-semibold opacity-70 uppercase">{dayOfWeek}</span>
                <span className="text-base font-bold mt-0.5">{dayNum}</span>
                <div className={`day-dot ${dotClass}`} />
              </button>
            );
          })}
        </div>
      ) : (
        /* Manual Date Picker Input wrapper */
        <div className="relative max-w-sm">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={todayStr}
            className="w-full h-11 border border-[#E8E4DC] rounded-xl px-3 py-2 text-xs font-semibold text-[#1A1A1A] bg-white focus:outline-none focus:ring-2 focus:ring-[#1C3A2E] transition-all"
          />
        </div>
      )}

      {/* Timeline Slot Selection Grid */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-[#FAFAF7] p-3 rounded-2xl border border-[#E8E4DC]">
          <span className="text-xs font-bold text-[#1C3A2E] flex items-center gap-1.5">
            <Clock size={14} className="text-[#1C3A2E]" />
            Slots for {selectedDate === todayStr ? 'Today' : selectedDate}:
          </span>
          <div className="flex gap-3 text-[10px] font-bold">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-[#22c55e] border border-[#E8E4DC]" /> Available
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-[#fef3c7] border border-[#f59e0b] border-dashed" /> Hold
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-[#f3f4f6] border border-[#e5e7eb]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, #e5e7eb 2px, #e5e7eb 4px)' }} /> Booked
            </span>
          </div>
        </div>

        <div className="time-slots-grid sm:grid-cols-4">
          {ALL_SLOTS.map((slot) => {
            const isBooked = activeAvailability.bookedSlots.includes(slot);
            const isPending = activeAvailability.pendingSlots.includes(slot);
            const isSelected = selectedTime === slot;

            let slotClass = '';
            let isDisabled = false;
            let titleText = 'Available slot';

            if (isBooked) {
              slotClass = 'booked';
              isDisabled = true;
              titleText = 'Booked by another traveler';
            } else if (isPending) {
              slotClass = 'pending';
              isDisabled = true;
              titleText = 'Pending confirmation';
            } else if (isSelected) {
              slotClass = 'active';
            }

            return (
              <button
                key={slot}
                type="button"
                disabled={isDisabled}
                onClick={() => setSelectedTime(slot)}
                title={titleText}
                className={`time-slot-btn focus:outline-none focus:ring-1 focus:ring-[#C4614A] ${slotClass}`}
              >
                <span>{formatTimeLabel(slot)}</span>
                {isBooked && <span className="text-[7px] font-bold opacity-60 scale-90 uppercase mt-0.5">Booked</span>}
                {isPending && <span className="text-[7px] font-bold opacity-80 scale-90 uppercase mt-0.5">Hold</span>}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

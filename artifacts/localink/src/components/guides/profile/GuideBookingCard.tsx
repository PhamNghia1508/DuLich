import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Calendar, Clock, Users, Shield, MessageSquare, Info, Plus, Minus, ChevronRight, HelpCircle } from 'lucide-react';
import type { Guide } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { getGuideAvailability } from '@/data/availability';

interface GuideBookingCardProps {
  guide: Guide;
  selectedDuration: 'hour' | 'half' | 'full';
  setSelectedDuration: (d: 'hour' | 'half' | 'full') => void;
  onBook?: () => void; // Optional callback for drawer completion
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

export default function GuideBookingCard({
  guide,
  selectedDuration,
  setSelectedDuration,
  onBook,
}: GuideBookingCardProps) {
  const [, navigate] = useLocation();
  const { isAuthenticated } = useAuth();

  // Initialize selectedDate to today
  const todayStr = formatDateString(new Date());
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [time, setTime] = useState('09:00');
  const [groupSize, setGroupSize] = useState(2);
  const [hours, setHours] = useState(3);
  const [showManualDatePicker, setShowManualDatePicker] = useState(false);

  // Generate 7 days carousel list
  const next7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  const activeAvailability = getGuideAvailability(guide.id, selectedDate);

  const handleRequestBooking = (e: React.MouseEvent) => {
    e.preventDefault();
    const targetUrl = `/book/${guide.id}?duration=${selectedDuration}&date=${selectedDate}&time=${time}&groupSize=${groupSize}&hours=${hours}`;
    if (onBook) onBook();
    if (isAuthenticated) {
      navigate(targetUrl);
    } else {
      navigate(`/signin?redirect=${encodeURIComponent(targetUrl)}`);
    }
  };

  const handleMessageGuide = (e: React.MouseEvent) => {
    e.preventDefault();
    const targetUrl = `/dashboard?chat=${guide.id}`;
    if (isAuthenticated) {
      navigate(targetUrl);
    } else {
      navigate(`/signin?redirect=${encodeURIComponent(targetUrl)}`);
    }
  };

  // Compute pricing
  const getPriceDetails = () => {
    let basePrice = 0;
    let label = '';
    
    if (selectedDuration === 'half') {
      basePrice = guide.pricing.halfDay;
      label = 'Half Day (4 hrs)';
    } else if (selectedDuration === 'full') {
      basePrice = guide.pricing.fullDay;
      label = 'Full Day (8 hrs)';
    } else {
      basePrice = guide.pricing.perHour * hours;
      label = `Hourly (${hours} hrs)`;
    }

    const serviceFee = Math.round(basePrice * 0.1); // 10% platform fee
    const total = basePrice + serviceFee;

    return { basePrice, serviceFee, total, label };
  };

  const { basePrice, serviceFee, total, label } = getPriceDetails();

  const handleGroupSizeChange = (val: number) => {
    const nextVal = groupSize + val;
    if (nextVal >= 1 && nextVal <= 10) {
      setGroupSize(nextVal);
    }
  };

  const handleHoursChange = (val: number) => {
    const nextVal = hours + val;
    if (nextVal >= 1 && nextVal <= 24) {
      setHours(nextVal);
    }
  };

  return (
    <div className="bg-white border border-[#E8E4DC] p-6 rounded-3xl shadow-lg space-y-6 relative transition-all">
      
      {/* Starting Rate & Rating Header */}
      <div className="flex justify-between items-baseline border-b border-[#F5F0EA] pb-4">
        <div>
          <span className="text-xs font-bold text-[#8A8A8A] uppercase tracking-wider block">Estimated rate</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-[#1C3A2E]">
              {formatCurrency(selectedDuration === 'half' ? guide.pricing.halfDay : selectedDuration === 'full' ? guide.pricing.fullDay : guide.pricing.perHour)}
            </span>
            <span className="text-xs text-[#5A5A5A] font-semibold">
              {selectedDuration === 'hour' ? '/ hour' : selectedDuration === 'half' ? '/ half day' : '/ full day'}
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className="inline-flex items-center gap-1 bg-[#FAF0ED] text-[#C4614A] font-bold text-xs px-2.5 py-1 rounded-full">
            ★ {guide.rating}
          </span>
        </div>
      </div>

      {/* Duration Style Selector */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-[#8A8A8A] uppercase tracking-wider block">
          Select duration style
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(['hour', 'half', 'full'] as const).map((dur) => (
            <button
              key={dur}
              type="button"
              onClick={() => setSelectedDuration(dur)}
              className={`h-11 rounded-xl border text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-[#1C3A2E] cursor-pointer ${
                selectedDuration === dur
                  ? 'border-[#1C3A2E] bg-[#EAF0EC] text-[#1C3A2E]'
                  : 'border-[#E8E4DC] text-[#5A5A5A] hover:bg-[#FAFAF7]'
              }`}
            >
              {dur === 'hour' ? 'Hourly' : dur === 'half' ? 'Half Day' : 'Full Day'}
            </button>
          ))}
        </div>
      </div>

      {/* Number of Hours Counter (Hourly only) */}
      {selectedDuration === 'hour' && (
        <div className="flex items-center justify-between bg-[#FAFAF7] border border-[#E8E4DC] p-3 rounded-2xl">
          <span className="text-xs font-semibold text-[#5A5A5A]">Number of hours</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleHoursChange(-1)}
              disabled={hours <= 1}
              className="w-10 h-10 rounded-full bg-white border border-[#E8E4DC] flex items-center justify-center text-[#1C3A2E] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#FAFAF7]"
              aria-label="Decrease hours"
            >
              <Minus size={14} />
            </button>
            <span className="text-sm font-bold text-[#1A1A1A] w-6 text-center">{hours}</span>
            <button
              type="button"
              onClick={() => handleHoursChange(1)}
              disabled={hours >= 24}
              className="w-10 h-10 rounded-full bg-white border border-[#E8E4DC] flex items-center justify-center text-[#1C3A2E] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#FAFAF7]"
              aria-label="Increase hours"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      )}

      {/* ─── CUSTOM VISUAL SCHEDULER ────────────────────────────────────────── */}
      <div className="space-y-3.5">
        <div className="flex justify-between items-center">
          <label className="text-xs font-bold text-[#8A8A8A] uppercase tracking-wider">
            Check availability schedule
          </label>
          <button
            type="button"
            onClick={() => setShowManualDatePicker(!showManualDatePicker)}
            className="text-[10px] font-bold text-[#C4614A] hover:underline bg-transparent border-0 cursor-pointer"
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
                  <span className="text-sm font-bold mt-0.5">{dayNum}</span>
                  <div className={`day-dot ${dotClass}`} />
                </button>
              );
            })}
          </div>
        ) : (
          /* Manual Date Picker Input wrapper */
          <div className="relative">
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
        <div className="space-y-2">
          <p className="text-[10px] font-semibold text-[#8A8A8A] flex justify-between">
            <span>Available slots for {selectedDate === todayStr ? 'Today' : selectedDate}</span>
            <span className="flex gap-2">
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" /> Free</span>
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" /> Hold</span>
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#e5e7eb]" /> Booked</span>
            </span>
          </p>

          <div className="time-slots-grid">
            {ALL_SLOTS.map((slot) => {
              const isBooked = activeAvailability.bookedSlots.includes(slot);
              const isPending = activeAvailability.pendingSlots.includes(slot);
              const isSelected = time === slot;

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
                  onClick={() => setTime(slot)}
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
      </div>

      {/* Group Size Selector */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-[#8A8A8A] uppercase tracking-wider block">
          Group size
        </label>
        <div className="flex items-center justify-between border border-[#E8E4DC] p-3 rounded-2xl h-12 bg-white">
          <span className="text-xs text-[#5A5A5A] font-semibold">Number of travelers</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleGroupSizeChange(-1)}
              disabled={groupSize <= 1}
              className="w-10 h-10 rounded-full bg-[#FAFAF7] border border-[#E8E4DC] flex items-center justify-center text-[#1C3A2E] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#1C3A2E]"
              aria-label="Decrease group size"
            >
              <Minus size={14} />
            </button>
            <span className="text-sm font-bold text-[#1A1A1A] w-6 text-center">{groupSize}</span>
            <button
              type="button"
              onClick={() => handleGroupSizeChange(1)}
              disabled={groupSize >= 10}
              className="w-10 h-10 rounded-full bg-[#FAFAF7] border border-[#E8E4DC] flex items-center justify-center text-[#1C3A2E] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#1C3A2E]"
              aria-label="Increase group size"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Breakdown Card */}
      <div className="bg-[#FAFAF7] p-4 rounded-2xl border border-[#E8E4DC] space-y-2 text-xs font-semibold">
        <span className="text-[10px] font-bold text-[#8A8A8A] uppercase tracking-wider block">Price breakdown</span>
        <div className="flex justify-between text-[#5A5A5A]">
          <span>{label}</span>
          <span>{formatCurrency(basePrice)}</span>
        </div>
        <div className="flex justify-between text-[#5A5A5A]">
          <span>Friendlocalcheap Platform Fee (10%)</span>
          <span>{formatCurrency(serviceFee)}</span>
        </div>
        <div className="h-[1px] bg-[#E8E4DC] my-1"></div>
        <div className="flex justify-between text-sm font-bold text-[#1A1A1A]">
          <span>Total estimated cost</span>
          <span className="text-[#1C3A2E]">{formatCurrency(total)}</span>
        </div>
      </div>

      {/* Booking Actions */}
      <div className="space-y-3 pt-2">
        <button
          onClick={handleRequestBooking}
          className="btn btn-accent h-12 w-full text-center shadow-md flex items-center justify-center gap-2 font-bold text-sm rounded-xl hover:shadow-lg active:scale-95 transition-all border-0 cursor-pointer"
        >
          Request booking
        </button>
        
        <button
          onClick={handleMessageGuide}
          className="btn btn-outline h-12 w-full text-center flex items-center justify-center gap-2 font-semibold text-xs rounded-xl hover:bg-[#FAFAF7] active:scale-95 transition-all border border-[#1C3A2E] cursor-pointer"
        >
          <MessageSquare size={16} />
          <span>Message {guide.firstName}</span>
        </button>
      </div>

      {/* trust verification seals */}
      <div className="border-t border-[#F5F0EA] pt-4 text-[10px] text-[#8A8A8A] space-y-2 leading-relaxed">
        <div className="flex items-start gap-1">
          <Info size={12} className="text-[#C4614A] shrink-0 mt-0.5" />
          <p>Payment instructions provided after guide confirmation. Travelers review details before final submission.</p>
        </div>
        <div className="flex items-start gap-1">
          <Shield size={12} className="text-[#C4614A] shrink-0 mt-0.5" />
          <p>Cancellation terms shown before booking. Free cancellation up to 48 hours beforehand.</p>
        </div>
      </div>

    </div>
  );
}

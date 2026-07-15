import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Clock, Users, Shield, MessageSquare, Info, Plus, Minus, CheckCircle, Calendar } from 'lucide-react';
import type { Guide } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

interface GuideBookingCardProps {
  guide: Guide;
  selectedDuration: 'hour' | 'half' | 'full';
  setSelectedDuration: (d: 'hour' | 'half' | 'full') => void;
  selectedDate: string;
  setSelectedDate: (d: string) => void;
  selectedTime: string;
  setSelectedTime: (t: string) => void;
  onBook?: () => void; // Optional callback for drawer completion
}

const formatDateLabel = (dateStr: string) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
};

const formatTimeLabel = (timeStr: string) => {
  if (!timeStr) return '';
  const [hourStr, minStr] = timeStr.split(':');
  const hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${minStr} ${ampm}`;
};

export default function GuideBookingCard({
  guide,
  selectedDuration,
  setSelectedDuration,
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  onBook,
}: GuideBookingCardProps) {
  const [, navigate] = useLocation();
  const { isAuthenticated } = useAuth();

  // Booking details state
  const [groupSize, setGroupSize] = useState(2);
  const [hours, setHours] = useState(3);

  const handleRequestBooking = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Check if slot has been selected, if not scroll to section
    if (!selectedDate || !selectedTime) {
      scrollToCalendar();
      return;
    }

    const targetUrl = `/book/${guide.id}?duration=${selectedDuration}&date=${selectedDate}&time=${selectedTime}&groupSize=${groupSize}&hours=${hours}`;
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

  const scrollToCalendar = () => {
    const el = document.getElementById('availability-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
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

  const hasSelectedSlot = selectedDate && selectedTime;

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

      {/* ─── SIMPLIFIED SELECTED SLOT VIEW ──────────────────────────────────── */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-[#8A8A8A] uppercase tracking-wider block">
          Selected Schedule
        </label>
        
        {hasSelectedSlot ? (
          <div className="flex items-center gap-3 bg-[#EAF0EC] border border-[#C5D1CA] p-3.5 rounded-2xl">
            <CheckCircle size={18} className="text-[#1D6C3D] shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-[#1C3A2E] block">
                {formatDateLabel(selectedDate)}
              </span>
              <span className="text-[11px] font-semibold text-[#1C3A2E]/80">
                Starts at {formatTimeLabel(selectedTime)}
              </span>
            </div>
            <button
              type="button"
              onClick={scrollToCalendar}
              className="ml-auto text-[10px] font-bold text-[#C4614A] hover:underline bg-transparent border-0 cursor-pointer"
            >
              Change
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={scrollToCalendar}
            className="w-full flex items-center justify-between border border-[#E8E4DC] p-3.5 rounded-2xl hover:border-[#1C3A2E] bg-white text-left transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#1C3A2E]"
          >
            <span className="flex items-center gap-2 text-xs font-bold text-[#5A5A5A]">
              <Calendar size={16} className="text-[#8A8A8A]" />
              Select date & time slot...
            </span>
            <span className="text-[10px] font-bold text-[#C4614A] hover:underline">
              Choose slot
            </span>
          </button>
        )}
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
          {hasSelectedSlot ? 'Request booking' : 'Choose time slot to book'}
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

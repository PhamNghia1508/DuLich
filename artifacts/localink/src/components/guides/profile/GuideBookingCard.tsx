import React, { useState } from 'react';
import { Link } from 'wouter';
import { Calendar, Clock, Users, Shield, MessageSquare, Info, Plus, Minus } from 'lucide-react';
import type { Guide } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface GuideBookingCardProps {
  guide: Guide;
  selectedDuration: 'hour' | 'half' | 'full';
  setSelectedDuration: (d: 'hour' | 'half' | 'full') => void;
  onBook?: () => void; // Optional callback for drawer completion
}

export default function GuideBookingCard({
  guide,
  selectedDuration,
  setSelectedDuration,
  onBook,
}: GuideBookingCardProps) {
  // Booking state variables
  const [date, setDate] = useState('');
  const [time, setTime] = useState('09:00');
  const [groupSize, setGroupSize] = useState(2);
  const [hours, setHours] = useState(3);

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
      
      {/* Starting Price & Rating Header */}
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

      {/* Duration Selector */}
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

      {/* Hourly duration count selector (only shows if hourly is selected) */}
      {selectedDuration === 'hour' && (
        <div className="flex items-center justify-between bg-[#FAFAF7] border border-[#E8E4DC] p-3 rounded-2xl">
          <span className="text-xs font-semibold text-[#5A5A5A]">Number of hours</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleHoursChange(-1)}
              disabled={hours <= 1}
              className="w-10 h-10 rounded-full bg-white border border-[#E8E4DC] flex items-center justify-center text-[#1C3A2E] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#FAFAF7] focus:outline-none focus:ring-2 focus:ring-[#1C3A2E]"
              aria-label="Decrease hours"
            >
              <Minus size={14} />
            </button>
            <span className="text-sm font-bold text-[#1A1A1A] w-6 text-center">{hours}</span>
            <button
              type="button"
              onClick={() => handleHoursChange(1)}
              disabled={hours >= 24}
              className="w-10 h-10 rounded-full bg-white border border-[#E8E4DC] flex items-center justify-center text-[#1C3A2E] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#FAFAF7] focus:outline-none focus:ring-2 focus:ring-[#1C3A2E]"
              aria-label="Increase hours"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Date & Time Selectors */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label htmlFor="booking-date" className="text-xs font-bold text-[#8A8A8A] uppercase tracking-wider block">
            Date
          </label>
          <div className="relative">
            <input
              id="booking-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full h-11 border border-[#E8E4DC] rounded-xl px-3 py-2 text-xs font-semibold text-[#1A1A1A] bg-white focus:outline-none focus:ring-2 focus:ring-[#1C3A2E] focus:border-transparent transition-all"
              required
            />
          </div>
        </div>
        
        <div className="space-y-1.5">
          <label htmlFor="booking-time" className="text-xs font-bold text-[#8A8A8A] uppercase tracking-wider block">
            Start Time
          </label>
          <select
            id="booking-time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full h-11 border border-[#E8E4DC] rounded-xl px-3 py-2 text-xs font-semibold text-[#1A1A1A] bg-white focus:outline-none focus:ring-2 focus:ring-[#1C3A2E] focus:border-transparent transition-all cursor-pointer"
          >
            <option value="06:00">6:00 AM (Sunrise)</option>
            <option value="07:00">7:00 AM</option>
            <option value="08:00">8:00 AM</option>
            <option value="09:00">9:00 AM</option>
            <option value="10:00">10:00 AM</option>
            <option value="11:00">11:00 AM</option>
            <option value="12:00">12:00 PM</option>
            <option value="13:00">1:00 PM</option>
            <option value="14:00">2:00 PM</option>
            <option value="15:00">3:00 PM</option>
            <option value="16:00">4:00 PM (Golden hr)</option>
            <option value="17:00">5:00 PM</option>
            <option value="18:00">6:00 PM (Sunset)</option>
            <option value="19:00">7:00 PM</option>
            <option value="20:00">8:00 PM</option>
          </select>
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

      {/* Quick Availability check */}
      <div className="flex items-center justify-between bg-[#EAF0EC] border border-[#C5D1CA] p-3.5 rounded-2xl text-xs text-[#1C3A2E]">
        <span className="flex items-center gap-1.5 font-bold">
          <span className="w-2 h-2 bg-[#1D6C3D] rounded-full animate-pulse"></span>
          Available slot:
        </span>
        <span className="font-bold">Tomorrow 9:00am</span>
      </div>

      {/* Pricing Breakdown */}
      <div className="bg-[#FAFAF7] p-4 rounded-2xl border border-[#E8E4DC] space-y-2 text-xs font-semibold">
        <span className="text-[10px] font-bold text-[#8A8A8A] uppercase tracking-wider block">Price breakdown</span>
        <div className="flex justify-between text-[#5A5A5A]">
          <span>{label}</span>
          <span>{formatCurrency(basePrice)}</span>
        </div>
        <div className="flex justify-between text-[#5A5A5A]">
          <span>LocalLink Platform Fee (10%)</span>
          <span>{formatCurrency(serviceFee)}</span>
        </div>
        <div className="h-[1px] bg-[#E8E4DC] my-1"></div>
        <div className="flex justify-between text-sm font-bold text-[#1A1A1A]">
          <span>Total estimated cost</span>
          <span className="text-[#1C3A2E]">{formatCurrency(total)}</span>
        </div>
      </div>

      {/* Call to Actions */}
      <div className="space-y-3 pt-2">
        <Link
          href={`/book/${guide.id}?duration=${selectedDuration}&date=${date}&time=${time}&groupSize=${groupSize}`}
          onClick={onBook}
          className="btn btn-accent h-12 w-full text-center shadow-md flex items-center justify-center gap-2 font-bold text-sm rounded-xl hover:shadow-lg active:scale-95 transition-all"
        >
          Request booking
        </Link>
        
        <Link
          href={`/dashboard?chat=${guide.id}`}
          className="btn btn-outline h-12 w-full text-center flex items-center justify-center gap-2 font-semibold text-xs rounded-xl hover:bg-[#FAFAF7] active:scale-95 transition-all"
        >
          <MessageSquare size={16} />
          <span>Message {guide.firstName}</span>
        </Link>
      </div>

      {/* Disclaimers (Prototype-safe) */}
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

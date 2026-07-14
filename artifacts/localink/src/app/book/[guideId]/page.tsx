import React, { useState, Suspense } from 'react';
import { Link, useParams, useSearch } from 'wouter';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { GUIDES } from '@/data/mockData';
import { 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Users, 
  Calendar, 
  CheckSquare, 
  ArrowLeft, 
  CheckCircle,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import type { Booking } from '@/types';

function BookingRequestContent() {
  const params = useParams();
  const searchParams = new URLSearchParams(useSearch());
  const guideId = params?.guideId as string;
  const durationPreset = searchParams?.get('duration') || 'hour';

  const guide = GUIDES.find((g) => g.id === guideId);

  // States
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [durationStyle, setDurationStyle] = useState<'hour' | 'half' | 'full'>(durationPreset as any);
  const [hoursCount, setHoursCount] = useState(3);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [meetingArea, setMeetingArea] = useState('');
  const [experienceNotes, setExperienceNotes] = useState('');
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [randomRef, setRandomRef] = useState('');

  if (!guide) {
    return (
      <div className="flex flex-col min-h-screen bg-[#FAFAF7]">
        <Navbar />
        <main className="flex-1 container py-24 text-center">
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold mb-4">Guide not found</h2>
          <Link href="/guides" className="btn btn-primary">
            Back to search
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // Cost calculation
  const getRate = () => {
    if (durationStyle === 'half') return guide.pricing.halfDay;
    if (durationStyle === 'full') return guide.pricing.fullDay;
    return guide.pricing.perHour * hoursCount;
  };

  const getBasePrice = getRate();
  const serviceFee = Math.round(getBasePrice * 0.1);
  const totalCost = getBasePrice + serviceFee;

  const getPriceLabel = () => {
    if (durationStyle === 'half') return 'Half Day (4 hrs)';
    if (durationStyle === 'full') return 'Full Day (8 hrs)';
    return 'Per hour';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) {
      alert('Please select a date.');
      return;
    }
    if (!meetingArea) {
      alert('Please specify a meeting area.');
      return;
    }
    if (!confirmed) {
      alert('Please confirm the terms of the booking request.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setRandomRef(`LL-${Math.floor(100000 + Math.random() * 900000)}`);
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col min-h-screen bg-[#FAFAF7]">
        <Navbar />
        <main className="flex-1 container py-16 flex items-center justify-center">
          <div className="bg-white border border-[#E8E4DC] p-8 md:p-12 rounded-2xl max-w-xl w-full text-center shadow-lg space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#E8F5EE] border border-[#B8DFC8] flex items-center justify-center text-[#1C6B3A] mx-auto animate-scale-in">
              <CheckCircle size={36} />
            </div>

            <div className="space-y-2">
              <h1 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl font-bold text-[#1A1A1A]">
                Booking Request Sent!
              </h1>
              <p className="text-xs text-[#5A5A5A] max-w-md mx-auto leading-relaxed">
                Your request has been forwarded to {guide.firstName}. They typically review and respond within 24 hours. No payment has been charged yet.
              </p>
            </div>

            {/* Reference info card */}
            <div className="bg-[#FAFAF7] border border-[#E8E4DC] p-5 rounded-xl text-left text-xs divide-y divide-[#F5F0EA] space-y-3">
              <div className="flex justify-between items-center pb-2">
                <span className="font-bold text-[#8A8A8A]">Booking Ref:</span>
                <span className="font-bold text-[#1A1A1A]">{randomRef}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-bold text-[#8A8A8A]">Guide:</span>
                <span className="font-bold text-[#1A1A1A]">{guide.firstName} {guide.lastName}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-bold text-[#8A8A8A]">Date & Time:</span>
                <span className="font-bold text-[#1A1A1A]">{selectedDate} at {selectedTime}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="font-bold text-[#8A8A8A]">Status:</span>
                <span className="font-bold text-[#C4614A] bg-[#FAF0ED] px-2 py-0.5 rounded capitalize">
                  Pending guide approval
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-[10px] font-bold text-[#8A8A8A] uppercase tracking-wider block">What happens next</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-left text-[#5A5A5A]">
                <div className="bg-[#FAFAF7] border border-[#E8E4DC] p-3 rounded-lg">
                  <span className="font-bold text-[#1A1A1A] block mb-1">1. Guide approves</span>
                  <span>{guide.firstName} will accept or propose a shift.</span>
                </div>
                <div className="bg-[#FAFAF7] border border-[#E8E4DC] p-3 rounded-lg">
                  <span className="font-bold text-[#1A1A1A] block mb-1">2. Secure Payment</span>
                  <span>You pay platform deposit securely.</span>
                </div>
                <div className="bg-[#FAFAF7] border border-[#E8E4DC] p-3 rounded-lg">
                  <span className="font-bold text-[#1A1A1A] block mb-1">3. Meet up</span>
                  <span>Explore Vietnam with trust and confidence!</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/dashboard" className="btn btn-primary flex-1">
                View in traveler dashboard
              </Link>
              <Link href={`/dashboard?chat=${guide.id}`} className="btn btn-outline flex-1">
                Message {guide.firstName}
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAF7]">
      <Navbar />

      <main className="container py-10 flex-1">
        
        {/* Back Link */}
        <button 
          onClick={() => window.history.back()}
          className="mb-6 flex items-center gap-1 text-xs font-bold text-[#5A5A5A] hover:text-[#1A1A1A] transition-colors"
        >
          <ArrowLeft size={14} /> Back to profile
        </button>

        <h1 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-8 leading-tight">
          Request booking with {guide.firstName}
        </h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: FORM (65%) */}
          <div className="lg:col-span-8 bg-white border border-[#E8E4DC] rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
            
            {/* Guide Card Mini */}
            <div className="flex items-center gap-4 bg-[#FAFAF7] p-4 rounded-xl border border-[#E8E4DC]">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-[#E8E4DC] shrink-0">
                <img
                  src={guide.avatar}
                  alt={guide.firstName}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div>
                <h3 className="font-sans text-sm font-bold text-[#1A1A1A] flex items-center gap-1.5 leading-none mb-1">
                  {guide.firstName} {guide.lastName}
                  <span className="badge badge-verified text-[9px] py-0.5 px-1 font-bold bg-[#E8F5EE] text-[#1C6B3A] rounded">
                    Verified
                  </span>
                </h3>
                <p className="text-xs text-[#5A5A5A]">{guide.city} · {guide.district}</p>
              </div>
            </div>

            {/* Date & Time Section */}
            <div className="space-y-4">
              <h3 className="font-sans text-xs font-bold text-[#8A8A8A] uppercase tracking-wider border-b border-[#F5F0EA] pb-2">
                Date & Timing
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="label">Meeting Date</label>
                  <input
                    type="date"
                    required
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="input text-xs"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <label className="label">Meeting Time</label>
                  <input
                    type="time"
                    required
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="input text-xs"
                  />
                </div>
                <div>
                  <label className="label">Rate Style</label>
                  <select
                    value={durationStyle}
                    onChange={(e) => setDurationStyle(e.target.value as any)}
                    className="input text-xs"
                  >
                    <option value="hour">Hourly Rate</option>
                    <option value="half">Half Day (4 hrs)</option>
                    <option value="full">Full Day (8 hrs)</option>
                  </select>
                </div>
              </div>

              {/* Hourly Count Stepper (Only if hourly chosen) */}
              {durationStyle === 'hour' && (
                <div className="flex items-center justify-between bg-[#FAFAF7] p-3 rounded-lg border border-[#E8E4DC] w-full sm:w-80">
                  <span className="text-xs font-bold text-[#5A5A5A]">Duration (Hours)</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setHoursCount(prev => Math.max(1, prev - 1))}
                      className="w-7 h-7 rounded-full bg-white border border-[#E8E4DC] font-bold text-xs flex items-center justify-center hover:border-[#1C3A2E]"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold text-[#1A1A1A] w-4 text-center">{hoursCount}</span>
                    <button
                      type="button"
                      onClick={() => setHoursCount(prev => Math.min(8, prev + 1))}
                      className="w-7 h-7 rounded-full bg-white border border-[#E8E4DC] font-bold text-xs flex items-center justify-center hover:border-[#1C3A2E]"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Travelers counts */}
            <div className="space-y-4">
              <h3 className="font-sans text-xs font-bold text-[#8A8A8A] uppercase tracking-wider border-b border-[#F5F0EA] pb-2">
                Travelers
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center justify-between bg-[#FAFAF7] p-3 rounded-lg border border-[#E8E4DC]">
                  <div>
                    <span className="text-xs font-bold text-[#1A1A1A] block">Adults</span>
                    <span className="text-[10px] text-[#8A8A8A]">Ages 13+</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setAdults(prev => Math.max(1, prev - 1))}
                      className="w-7 h-7 rounded-full bg-white border border-[#E8E4DC] font-bold text-xs flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold text-[#1A1A1A] w-4 text-center">{adults}</span>
                    <button
                      type="button"
                      onClick={() => setAdults(prev => prev + 1)}
                      className="w-7 h-7 rounded-full bg-white border border-[#E8E4DC] font-bold text-xs flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-[#FAFAF7] p-3 rounded-lg border border-[#E8E4DC]">
                  <div>
                    <span className="text-xs font-bold text-[#1A1A1A] block">Children</span>
                    <span className="text-[10px] text-[#8A8A8A]">Ages 0-12</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setChildren(prev => Math.max(0, prev - 1))}
                      className="w-7 h-7 rounded-full bg-white border border-[#E8E4DC] font-bold text-xs flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold text-[#1A1A1A] w-4 text-center">{children}</span>
                    <button
                      type="button"
                      onClick={() => setChildren(prev => prev + 1)}
                      className="w-7 h-7 rounded-full bg-white border border-[#E8E4DC] font-bold text-xs flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Logistics & Special Requirements */}
            <div className="space-y-4">
              <h3 className="font-sans text-xs font-bold text-[#8A8A8A] uppercase tracking-wider border-b border-[#F5F0EA] pb-2">
                Logistics & Experience Details
              </h3>
              
              <div>
                <label className="label">Meeting Point / Area</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ben Thanh Market Gate 1, or our hotel (District 1 / 3 lobby)"
                  value={meetingArea}
                  onChange={(e) => setMeetingArea(e.target.value)}
                  className="input"
                />
              </div>

              <div>
                <label className="label">Experience Notes / What would you like to focus on?</label>
                <textarea
                  placeholder="Tell your guide about your interests, preferred highlights, or specific goals..."
                  value={experienceNotes}
                  onChange={(e) => setExperienceNotes(e.target.value)}
                  className="input min-h-[96px] py-2 text-xs"
                />
              </div>

              <div>
                <label className="label">Dietary requirements or accessibility accommodations (Optional)</label>
                <textarea
                  placeholder="Allergies, wheelchair access routes, mobility requirements, regular breaks needs..."
                  value={specialRequirements}
                  onChange={(e) => setSpecialRequirements(e.target.value)}
                  className="input min-h-[64px] py-2 text-xs"
                />
              </div>
            </div>

            {/* Terms confirmation */}
            <div className="border-t border-[#F5F0EA] pt-6 flex items-start gap-3">
              <input
                type="checkbox"
                required
                id="booking-confirm"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="w-4 h-4 accent-[#1C3A2E] cursor-pointer mt-0.5 shrink-0"
              />
              <label htmlFor="booking-confirm" className="text-xs font-semibold text-[#5A5A5A] cursor-pointer select-none leading-normal">
                I understand that this is a booking request, not an instant charge. {guide.firstName} will accept or decline this request within 24 hours. I will not make direct cash payments outside the secure platform.
              </label>
            </div>

          </div>

          {/* RIGHT: COST SUMMARY SIDEBAR (35%) */}
          <aside className="lg:col-span-4 bg-white border border-[#E8E4DC] p-6 rounded-2xl shadow-md space-y-6">
            <h3 className="font-sans text-sm font-bold text-[#1A1A1A] pb-2 border-b border-[#F5F0EA]">
              Price Breakdown
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center text-[#5A5A5A]">
                <span>
                  {durationStyle === 'hour' 
                    ? `Base Rate (${hoursCount} hrs x ${formatCurrency(guide.pricing.perHour)}/hr)` 
                    : `${getPriceLabel()} Rate`
                  }
                </span>
                <span className="font-semibold text-[#1A1A1A]">
                  {formatCurrency(getBasePrice)}
                </span>
              </div>
              
              <div className="flex justify-between items-center text-[#5A5A5A]">
                <span className="flex items-center gap-1" title="Covers secure escrow handling and support">
                  Platform Service Fee (10%) <HelpCircle size={12} className="text-[#8A8A8A]" />
                </span>
                <span className="font-semibold text-[#1A1A1A]">
                  {formatCurrency(serviceFee)}
                </span>
              </div>

              <hr className="border-[#F5F0EA]" />

              <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-[#1C3A2E]">Estimated Total</span>
                <span className="text-[#1C3A2E]">{formatCurrency(totalCost)}</span>
              </div>
            </div>

            {/* Shield notes */}
            <div className="bg-[#E8F5EE] border border-[#B8DFC8] p-4 rounded-xl flex gap-3 text-xs text-[#1C6B3A]">
              <ShieldCheck size={18} className="shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Secure Escrow Booking</span>
                <span className="leading-relaxed block mt-0.5">
                  Your funds are secure. Payments are held by the platform and only payout to the guide after your tour completes.
                </span>
              </div>
            </div>

            {/* Cancellation alert */}
            <div className="flex gap-2 text-xs text-[#5A5A5A]">
              <AlertCircle size={14} className="shrink-0 mt-0.5 text-amber-500" />
              <span>Free cancellation up to 48 hours before start date. Re-scheduling options available.</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-accent btn-lg w-full text-center shadow-md flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'Sending Request...' : 'Send Booking Request'}
            </button>
          </aside>

        </form>
      </main>

      <Footer />
    </div>
  );
}

export default function BookingRequestPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen bg-[#FAFAF7]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1C3A2E]" />
      </div>
    }>
      <BookingRequestContent />
    </Suspense>
  );
}

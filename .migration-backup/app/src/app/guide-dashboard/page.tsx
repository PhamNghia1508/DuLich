'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { 
  GUIDES, 
  GUIDE_NOTIFICATIONS, 
  BOOKINGS, 
  PAYMENT_RECORDS 
} from '@/data/mockData';
import { 
  Calendar, 
  DollarSign, 
  Clock, 
  Bell, 
  ShieldCheck, 
  Check, 
  X, 
  MessageSquare,
  Award,
  Info,
  Layers,
  ArrowRight
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function GuideDashboardPage() {
  const guide = GUIDES[0]; // Linh N. is guide-001

  // local requests state
  const [incomingRequests, setIncomingRequests] = useState([
    {
      id: 'req-002',
      travelerName: 'Sarah Miller',
      travelerCountry: 'Canada',
      date: '2026-07-22',
      time: '09:00',
      duration: '4 hours',
      pax: '2 Adults',
      notes: 'We want to focus on coffee culture and street alleys in District 3. Shellfish allergy consideration.',
      status: 'pending',
      amount: 72,
    }
  ]);

  const [earnings, setEarnings] = useState({
    pending: 72,
    paid: 110,
    thisMonth: 182,
  });

  const handleAccept = (id: string, amount: number) => {
    setIncomingRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'confirmed' } : r));
    setEarnings(prev => ({
      ...prev,
      pending: prev.pending - amount,
      paid: prev.paid + amount,
      thisMonth: prev.thisMonth + amount,
    }));
  };

  const handleDecline = (id: string) => {
    setIncomingRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'declined' } : r));
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAF7]">
      <Navbar />

      <main className="container py-10 flex-1">
        
        {/* Guide header */}
        <div className="bg-[#1C3A2E] text-white p-6 md:p-8 rounded-2xl shadow-md flex flex-col md:flex-row items-center justify-between gap-6 mb-8 border border-[#142A21]">
          <div className="flex items-center gap-4 text-left">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20 shrink-0 bg-[#F5F0EA]">
              <img
                src={guide.avatar}
                alt="Guide avatar"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="font-[family-name:var(--font-playfair)] text-xl md:text-2xl font-bold leading-none">
                  {guide.firstName} Nguyen
                </h1>
                <span className="badge badge-verified bg-white/95 text-[9px] py-0.5 px-1 font-bold text-[#1C6B3A] rounded">
                  ✓ Verified Guide
                </span>
              </div>
              <p className="text-xs text-[#7C9080] flex items-center gap-1.5">
                <span>District 1 Specialist</span>
                <span>·</span>
                <span>ID #5104</span>
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="bg-[#142A21] border border-[#2A5243] py-2.5 px-4 rounded-xl text-center min-w-[100px]">
              <span className="text-[10px] font-bold text-[#7C9080] uppercase tracking-wider block">Rating</span>
              <span className="text-base font-bold text-white">4.97 ★</span>
            </div>
            <div className="bg-[#142A21] border border-[#2A5243] py-2.5 px-4 rounded-xl text-center min-w-[100px]">
              <span className="text-[10px] font-bold text-[#7C9080] uppercase tracking-wider block">Escrow Paid</span>
              <span className="text-base font-bold text-white">{formatCurrency(earnings.paid)}</span>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: WORKSPACE / BOOKINGS (8 columns) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* INCOMING BOOKING REQUESTS */}
            <div className="bg-white border border-[#E8E4DC] rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-sans text-xs font-bold text-[#8A8A8A] uppercase tracking-wider border-b border-[#F5F0EA] pb-2">
                Incoming Booking Requests
              </h3>

              <div className="space-y-4">
                {incomingRequests.map((req) => (
                  <div key={req.id} className="bg-[#FAFAF7] border border-[#E8E4DC] p-5 rounded-xl text-xs space-y-4">
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <div className="text-left space-y-0.5">
                        <span className="text-[10px] font-bold text-[#8A8A8A] uppercase tracking-wider block">Guest traveler</span>
                        <h4 className="text-sm font-bold text-[#1A1A1A]">{req.travelerName}</h4>
                        <span className="text-[#8A8A8A]">{req.travelerCountry} · {req.pax}</span>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-bold text-[#8A8A8A] uppercase tracking-wider block">Est Payout (90%)</span>
                        <span className="text-base font-bold text-[#1C3A2E]">{formatCurrency(req.amount)}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-3 rounded-lg border border-[#E8E4DC]">
                      <div className="flex items-center gap-1.5 text-[#5A5A5A]">
                        <Calendar size={14} className="text-[#C4614A]" />
                        <span>Date: <strong>{req.date}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[#5A5A5A]">
                        <Clock size={14} className="text-[#C4614A]" />
                        <span>Time: <strong>{req.time}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[#5A5A5A]">
                        <Layers size={14} className="text-[#C4614A]" />
                        <span>Duration: <strong>{req.duration}</strong></span>
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-[#E8E4DC] text-[#5A5A5A] leading-relaxed">
                      <strong>Traveler notes:</strong> “{req.notes}”
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2 pt-2 border-t border-[#F5F0EA]">
                      {req.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => handleDecline(req.id)}
                            className="btn btn-ghost btn-sm text-red-600 hover:bg-red-50 border-red-200"
                          >
                            <X size={14} /> Decline
                          </button>
                          <button
                            onClick={() => handleAccept(req.id, req.amount)}
                            className="btn btn-primary btn-sm bg-emerald-700 border-emerald-700 hover:bg-emerald-800"
                          >
                            <Check size={14} /> Accept Request
                          </button>
                        </>
                      ) : (
                        <span className={`font-bold px-3 py-1 rounded capitalize ${
                          req.status === 'confirmed' ? 'text-emerald-700 bg-emerald-50' : 'text-red-600 bg-red-50'
                        }`}>
                          ✓ Request {req.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* UPCOMING SCHEDULE PREVIEW */}
            <div className="bg-white border border-[#E8E4DC] rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-sans text-xs font-bold text-[#8A8A8A] uppercase tracking-wider border-b border-[#F5F0EA] pb-2">
                Upcoming Guiding Schedule
              </h3>

              <div className="bg-[#FAFAF7] border border-[#E8E4DC] p-4 rounded-xl flex items-center justify-between text-xs text-left">
                <div className="space-y-1">
                  <span className="badge badge-verified bg-emerald-50 text-emerald-700 font-bold">Confirmed booking</span>
                  <h4 className="font-bold text-[#1A1A1A] text-sm">Alex Johnson · 2 Travelers</h4>
                  <div className="flex gap-4 text-[#8A8A8A] pt-1">
                    <span>Date: <strong>July 20, 2026</strong></span>
                    <span>Time: <strong>07:00 AM</strong></span>
                    <span>Meeting: <strong>Ben Thanh Gate 1</strong></span>
                  </div>
                </div>
                <span className="text-[#C4614A] bg-[#FAF0ED] px-2.5 py-1 rounded font-bold">
                  $99 payout pending
                </span>
              </div>
            </div>

          </div>

          {/* RIGHT: EARNINGS & NOTIFICATIONS SIDEBAR (4 columns) */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* Earnings details */}
            <div className="bg-white border border-[#E8E4DC] p-6 rounded-2xl shadow-sm space-y-4 text-left">
              <h3 className="font-sans text-xs font-bold text-[#1A1A1A] pb-2 border-b border-[#F5F0EA]">
                Earnings Overview
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs text-[#5A5A5A]">
                  <span>Awaiting Weekly Payout</span>
                  <span className="font-bold text-[#1A1A1A]">{formatCurrency(earnings.pending)}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-[#5A5A5A]">
                  <span>Completed & Reconciled</span>
                  <span className="font-bold text-[#1C6B3A]">{formatCurrency(earnings.paid)}</span>
                </div>
                <hr className="border-[#F5F0EA]" />
                <div className="flex justify-between items-center text-sm font-bold text-[#1C3A2E]">
                  <span>Total Earnings (This Month)</span>
                  <span>{formatCurrency(earnings.thisMonth)}</span>
                </div>
              </div>

              <div className="bg-[#FAFAF7] border border-[#E8E4DC] p-3 rounded-lg flex gap-2 text-[10px] text-[#8A8A8A]">
                <Info size={14} className="shrink-0 mt-0.5 text-[#C4614A]" />
                <span>Payouts are processed automatically every Monday morning at 09:00 AM.</span>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white border border-[#E8E4DC] p-6 rounded-2xl shadow-sm space-y-4 text-left">
              <h3 className="font-sans text-xs font-bold text-[#1A1A1A] pb-2 border-b border-[#F5F0EA]">
                Alert Center
              </h3>

              <div className="space-y-3 text-xs">
                {GUIDE_NOTIFICATIONS.map((notif) => (
                  <div key={notif.id} className="flex gap-2 items-start hover:bg-[#FAFAF7] p-2 rounded">
                    <Bell size={14} className="text-[#C4614A] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[#1A1A1A] block">{notif.title}</span>
                      <p className="text-[10px] text-[#5A5A5A] leading-tight mt-0.5">{notif.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </aside>

        </div>
      </main>
      <Footer />
    </div>
  );
}

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { 
  ADMIN_STATS, 
  PAYMENT_RECORDS, 
  BOOKINGS, 
  GUIDES 
} from '@/data/mockData';
import { 
  ShieldCheck, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Check, 
  X, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function AdminOverviewPage() {
  // Pending guides verification applications
  const [pendingApplications, setPendingApplications] = useState([
    {
      id: 'app-001',
      name: 'Nguyen Van A',
      languages: 'English (Fluent), Chinese (Conversational)',
      districts: 'District 5, District 8, Cholon',
      specialty: 'Temples history & Chinatown street food',
      status: 'pending',
    },
    {
      id: 'app-002',
      name: 'Le Thi B',
      languages: 'English (Fluent), French (Fluent)',
      districts: 'District 1, District 3',
      specialty: 'Museum tours & Architecture stories',
      status: 'pending',
    }
  ]);

  const [localPayments, setLocalPayments] = useState(PAYMENT_RECORDS);

  const handleApproveGuide = (id: string) => {
    setPendingApplications(prev => prev.map(a => a.id === id ? { ...a, status: 'approved' } : a));
  };

  const handleRejectGuide = (id: string) => {
    setPendingApplications(prev => prev.map(a => a.id === id ? { ...a, status: 'rejected' } : a));
  };

  const handlePayoutStatusChange = (paymentId: string) => {
    setLocalPayments(prev => prev.map(p => {
      if (p.id === paymentId) {
        return {
          ...p,
          status: p.status === 'paid-to-platform' ? 'pending-payout' : 'paid-to-guide',
        };
      }
      return p;
    }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAF7]">
      <Navbar />

      <main className="container py-10 flex-1">
        <h1 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-8 leading-tight text-left">
          LocaLink Administrator Panel
        </h1>

        {/* METRICS STATS BAR */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 text-left">
          <div className="bg-white border border-[#E8E4DC] p-5 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="bg-[#EAF0EC] p-3 rounded-lg text-[#1C3A2E] border border-[#B8DFC8]">
              <Users size={24} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#8A8A8A] uppercase tracking-wider block">Total Guides</span>
              <span className="text-xl font-bold text-[#1A1A1A]">{ADMIN_STATS.totalGuides}</span>
            </div>
          </div>

          <div className="bg-white border border-[#E8E4DC] p-5 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="bg-amber-50 p-3 rounded-lg text-amber-600 border border-amber-200">
              <Clock size={24} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#8A8A8A] uppercase tracking-wider block">Pending Vetting</span>
              <span className="text-xl font-bold text-[#1A1A1A]">{pendingApplications.filter(a => a.status === 'pending').length}</span>
            </div>
          </div>

          <div className="bg-white border border-[#E8E4DC] p-5 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="bg-[#FAF0ED] p-3 rounded-lg text-[#C4614A] border border-red-100">
              <TrendingUp size={24} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#8A8A8A] uppercase tracking-wider block">Total bookings</span>
              <span className="text-xl font-bold text-[#1A1A1A]">{ADMIN_STATS.totalBookings}</span>
            </div>
          </div>

          <div className="bg-white border border-[#E8E4DC] p-5 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="bg-emerald-50 p-3 rounded-lg text-emerald-700 border border-emerald-200">
              <DollarSign size={24} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#8A8A8A] uppercase tracking-wider block">Est Platform Fee</span>
              <span className="text-xl font-bold text-[#1A1A1A]">{formatCurrency(ADMIN_STATS.platformRevenue)}</span>
            </div>
          </div>
        </div>

        {/* WORKSPACE LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: PENDING VERIFICATIONS APPLICATIONS (8 columns) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Vetting Applications Queue */}
            <div className="bg-white border border-[#E8E4DC] rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-sans text-xs font-bold text-[#8A8A8A] uppercase tracking-wider border-b border-[#F5F0EA] pb-2">
                Pending Guide Applications Queue
              </h3>

              <div className="space-y-4">
                {pendingApplications.map((app) => (
                  <div key={app.id} className="bg-[#FAFAF7] border border-[#E8E4DC] p-5 rounded-xl text-xs space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="text-left space-y-1">
                        <span className="text-[10px] font-bold text-[#8A8A8A] uppercase tracking-wider block">Applicant name</span>
                        <h4 className="text-sm font-bold text-[#1A1A1A]">{app.name}</h4>
                        <p className="text-[#5A5A5A]"><strong>Languages:</strong> {app.languages}</p>
                        <p className="text-[#5A5A5A]"><strong>Target districts:</strong> {app.districts}</p>
                        <p className="text-[#5A5A5A]"><strong>Guiding Specialty:</strong> “{app.specialty}”</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap justify-end gap-2 pt-2 border-t border-[#F5F0EA]">
                      {app.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => handleRejectGuide(app.id)}
                            className="btn btn-ghost btn-sm text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <X size={14} /> Reject application
                          </button>
                          <button
                            onClick={() => handleApproveGuide(app.id)}
                            className="btn btn-primary btn-sm bg-emerald-700 border-emerald-700 hover:bg-emerald-800"
                          >
                            <Check size={14} /> Verify & Approve
                          </button>
                        </>
                      ) : (
                        <span className={`font-bold px-3 py-1 rounded capitalize ${
                          app.status === 'approved' ? 'text-emerald-700 bg-emerald-50' : 'text-red-600 bg-red-50'
                        }`}>
                          Application status: {app.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECURE ESCROW TRANSACTION MONITOR */}
            <div className="bg-white border border-[#E8E4DC] rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-sans text-xs font-bold text-[#8A8A8A] uppercase tracking-wider border-b border-[#F5F0EA] pb-2">
                Escrow Booking Payments Monitor
              </h3>

              <div className="overflow-x-auto whitespace-nowrap">
                <table className="w-full text-left text-xs divide-y divide-[#F5F0EA]">
                  <thead>
                    <tr className="font-bold text-[#8A8A8A]">
                      <th className="pb-3 pr-4">Txn ID</th>
                      <th className="pb-3 pr-4">Booking Ref</th>
                      <th className="pb-3 pr-4">Amount</th>
                      <th className="pb-3 pr-4">Payment status</th>
                      <th className="pb-3 pr-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F5F0EA]">
                    {localPayments.map((pay) => (
                      <tr key={pay.id} className="hover:bg-[#FAFAF7]">
                        <td className="py-3 pr-4 font-bold text-[#1A1A1A]">{pay.id}</td>
                        <td className="py-3 pr-4 font-semibold text-[#5A5A5A]">{pay.bookingId}</td>
                        <td className="py-3 pr-4 font-bold text-[#1C3A2E]">{formatCurrency(pay.amount)}</td>
                        <td className="py-3 pr-4 font-semibold capitalize">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            pay.status === 'paid-to-guide' 
                              ? 'text-emerald-700 bg-emerald-50' 
                              : pay.status === 'paid-to-platform'
                              ? 'text-blue-700 bg-blue-50'
                              : 'text-amber-700 bg-amber-50'
                          }`}>
                            {pay.status.replace(/-/g, ' ')}
                          </span>
                        </td>
                        <td className="py-3 pr-4">
                          {pay.status !== 'paid-to-guide' && (
                            <button
                              onClick={() => handlePayoutStatusChange(pay.id)}
                              className="text-[#C4614A] hover:underline font-bold text-[10px]"
                            >
                              {pay.status === 'paid-to-platform' ? 'Mark weekly payout' : 'Release to guide'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* RIGHT: MANUAL ACTIONS & METRICS INFO (4 columns) */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* Quick Audit Check */}
            <div className="bg-[#F5F0EA] border border-[#E8E4DC] p-6 rounded-2xl shadow-sm space-y-4 text-left">
              <h3 className="font-sans text-xs font-bold text-[#1A1A1A] pb-2 border-b border-[#E8E4DC] flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-[#C4614A]" /> Compliance Check
              </h3>
              <p className="text-xs text-[#5A5A5A] leading-relaxed">
                All platform guides are compliance checked monthly. Verified background checks must be refreshed annually. Weekly payouts reconcile manual transfers and platform escrow matching.
              </p>
              
              <div className="space-y-2 text-xs">
                <div className="flex justify-between font-semibold text-[#5A5A5A]">
                  <span>Compliance score</span>
                  <span className="text-[#1C3A2E] font-bold">100% Ok</span>
                </div>
                <div className="flex justify-between font-semibold text-[#5A5A5A]">
                  <span>Audited guides</span>
                  <span className="text-[#1A1A1A] font-bold">47 / 47</span>
                </div>
              </div>
            </div>

            {/* Audit log preview */}
            <div className="bg-white border border-[#E8E4DC] p-6 rounded-2xl shadow-sm space-y-4 text-left">
              <h3 className="font-sans text-xs font-bold text-[#1A1A1A] pb-2 border-b border-[#F5F0EA] flex items-center gap-1.5">
                <FileText size={16} /> Audit logs
              </h3>

              <div className="space-y-3 text-[10px] text-[#5A5A5A] leading-tight divide-y divide-[#F5F0EA]">
                <div className="pt-2">
                  <span className="text-[#8A8A8A] block">Today 10:22am</span>
                  <span className="font-semibold text-[#1A1A1A]">Payment release request pay-002 processed</span>
                </div>
                <div className="pt-2">
                  <span className="text-[#8A8A8A] block">Yesterday 04:15pm</span>
                  <span className="font-semibold text-[#1A1A1A]">Guide Yuki P. updated Japanese credentials certificate</span>
                </div>
                <div className="pt-2">
                  <span className="text-[#8A8A8A] block">July 10 09:00am</span>
                  <span className="font-semibold text-[#1A1A1A]">Weekly payouts completed to 47 verified guides</span>
                </div>
              </div>
            </div>

          </aside>

        </div>
      </main>

      <Footer />
    </div>
  );
}

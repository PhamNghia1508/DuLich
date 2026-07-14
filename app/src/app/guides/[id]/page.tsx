'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { GUIDES, REVIEWS } from '@/data/mockData';
import { ChevronRight } from 'lucide-react';

// Subcomponents
import GuideHero from '@/components/guides/profile/GuideHero';
import GuideAbout from '@/components/guides/profile/GuideAbout';
import GuideAtAGlance from '@/components/guides/profile/GuideAtAGlance';
import GuideExperienceCard from '@/components/guides/profile/GuideExperienceCard';
import GuideGallery from '@/components/guides/profile/GuideGallery';
import GuideVideoIntro from '@/components/guides/profile/GuideVideoIntro';
import GuideReviews from '@/components/guides/profile/GuideReviews';
import GuideCredentials from '@/components/guides/profile/GuideCredentials';
import GuideBookingCard from '@/components/guides/profile/GuideBookingCard';
import SimilarGuides from '@/components/guides/profile/SimilarGuides';
import GuideFinalCTA from '@/components/guides/profile/GuideFinalCTA';
import { formatCurrency } from '@/lib/utils';
import './profile.css';

export default function GuideProfilePage() {
  const params = useParams();
  const guideId = params?.id as string;

  const guide = GUIDES.find((g) => g.id === guideId);
  const guideReviews = REVIEWS.filter((r) => r.guideId === guideId);

  const [selectedDuration, setSelectedDuration] = useState<'hour' | 'half' | 'full'>('hour');
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const focusBookingArea = () => {
    if (window.innerWidth < 1024) setIsMobileDrawerOpen(true);
    else document.getElementById('profile-booking')?.focus();
  };

  if (!guide) {
    return (
      <div className="flex flex-col min-h-screen bg-[#FAFAF7]">
        <Navbar />
        <main className="flex-1 container py-24 text-center">
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold mb-4">Guide not found</h2>
          <p className="text-xs text-[#5A5A5A] mb-8">The guide profile you are trying to view does not exist or has been deactivated.</p>
          <Link href="/guides" className="btn btn-primary">
            Back to search
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAF7] pb-20 lg:pb-0">
      {/* Global CSS to add drawer animation */}
      <style jsx global>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      <Navbar />

      <main className="profile-page-container flex-1">
        {/* Navigation Breadcrumbs */}
        <nav aria-label="Breadcrumbs" className="mb-6 text-xs font-semibold text-[#8A8A8A] flex items-center gap-1.5">
          <Link href="/guides" className="hover:text-[#1C3A2E] hover:underline">Local Guides</Link>
          <ChevronRight size={12} />
          <span className="text-[#1A1A1A]">{guide.firstName} {guide.lastName.charAt(0)}.</span>
        </nav>

        {/* Responsive Layout Grid */}
        <div className="profile-commerce-region">
          
          {/* LEFT COLUMN: Main details (8 cols on desktop) */}
          <div className="profile-main-column space-y-8">
            
            {/* Guide Hero Section */}
            <GuideHero guide={guide} onCheckAvailability={focusBookingArea} />

            <GuideAtAGlance guide={guide} />

            <GuideAbout guide={guide} />

            {/* Signature Experiences (replaces table-style sample itineraries) */}
            <div className="profile-signature-section space-y-6">
              <div className="space-y-1">
                <h3 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[#1C3A2E]">
                  Signature experiences
                </h3>
                <p className="text-xs sm:text-sm text-[#5A5A5A]">
                  Customizable walks and tastings designed and led by {guide.firstName}.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {guide.sampleItineraries.map((itin) => (
                  <GuideExperienceCard key={itin.id} itinerary={itin} guideId={guide.id} />
                ))}
              </div>
            </div>

            {/* Photo Gallery with lightbox */}
            <GuideGallery guide={guide} />

            {/* Video Introduction with custom mock modal */}
            <GuideVideoIntro guide={guide} />

            {/* Traveler Reviews with score breakdown & sorting */}
            <GuideReviews 
              reviews={guideReviews} 
              overallRating={guide.rating} 
              reviewCount={guide.reviewCount} 
            />

            {/* Credentials / Manually Reviewed Trust */}
            <GuideCredentials guide={guide} />

          </div>

          {/* RIGHT COLUMN: Sticky Booking Sidecard (4 cols, desktop only) */}
          <aside id="profile-booking" tabIndex={-1} className="profile-booking-sidebar">
            <GuideBookingCard
              guide={guide}
              selectedDuration={selectedDuration}
              setSelectedDuration={setSelectedDuration}
            />
          </aside>

        </div>
        <div className="profile-after-commerce">
          <SimilarGuides currentGuide={guide} />
          <GuideFinalCTA guide={guide} onCheckAvailability={focusBookingArea} />
        </div>
      </main>

      {/* MOBILE FLOATING BOOKING BOTTOM BAR (sticky at bottom of viewport) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E8E4DC] p-4 flex items-center justify-between z-40 shadow-lg pb-safe">
        <div>
          <span className="text-[10px] font-bold text-[#8A8A8A] uppercase tracking-wider block">Starting rate</span>
          <span className="text-lg font-bold text-[#1C3A2E] block">
            {formatCurrency(guide.pricing.perHour)}/hr
          </span>
        </div>
        <button
          onClick={() => setIsMobileDrawerOpen(true)}
          className="btn btn-accent px-6 py-3 font-bold text-xs rounded-xl shadow-md active:scale-95 transition-all cursor-pointer"
        >
          Check Availability
        </button>
      </div>

      {/* MOBILE BOTTOM SLIDE-UP DRAWER */}
      {isMobileDrawerOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center backdrop-blur-sm transition-all"
          onClick={() => setIsMobileDrawerOpen(false)}
        >
          <div 
            className="bg-white rounded-t-3xl w-full max-h-[85vh] overflow-y-auto p-5 pb-8 shadow-2xl relative space-y-5 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Grab bar */}
            <div 
              className="w-12 h-1.5 bg-[#EDE8E0] rounded-full mx-auto -mt-1 mb-2 cursor-pointer"
              onClick={() => setIsMobileDrawerOpen(false)}
            ></div>
            
            <div className="flex justify-between items-center pb-2 border-b border-[#F5F0EA]">
              <h3 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#1C3A2E]">
                Select details & book
              </h3>
              <button 
                onClick={() => setIsMobileDrawerOpen(false)}
                className="text-xs font-bold text-[#C4614A] hover:underline"
              >
                Cancel
              </button>
            </div>
            
            <GuideBookingCard
              guide={guide}
              selectedDuration={selectedDuration}
              setSelectedDuration={setSelectedDuration}
              onBook={() => setIsMobileDrawerOpen(false)}
            />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

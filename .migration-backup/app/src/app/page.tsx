import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import TrustMetrics from '@/components/home/TrustMetrics';
import FeaturedGuides from '@/components/home/FeaturedGuides';
import HowItWorks from '@/components/home/HowItWorks';
import ExperienceCategories from '@/components/home/ExperienceCategories';
import SafetyVerification from '@/components/home/SafetyVerification';
import Testimonials from '@/components/home/Testimonials';
import FinalCTA from '@/components/home/FinalCTA';
import BecomeGuide from '@/components/home/BecomeGuide';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <TrustMetrics />
        <FeaturedGuides />
        <HowItWorks />
        <ExperienceCategories />
        <SafetyVerification />
        <Testimonials />
        <FinalCTA />
        <BecomeGuide />
      </main>
      <Footer />
    </div>
  );
}

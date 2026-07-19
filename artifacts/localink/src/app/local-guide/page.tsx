import { Calendar, DollarSign, Globe2, LayoutDashboard } from 'lucide-react';
import { Link } from 'wouter';

import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import SupportChat from '@/components/home/SupportChat';

import './local-guide.css';

export default function LocalGuideHubPage() {
  return (
    <div className="lg-page">
      <Navbar variant="home" />
      <main className="lg-container">
        <header className="lg-hub-header">
          <p className="lg-hub-eyebrow">For local guides</p>
          <h1>Share your city with travelers</h1>
          <p>Join FriendLocalTrip as a local guide. Set your own schedule, share what you love about your city, and earn on your own terms.</p>
        </header>

        <div className="lg-hub-actions">
          <Link href="/local-guide/register" className="btn btn-accent">Apply to Become a Guide</Link>
          <Link href="/local-guide/dashboard" className="lg-btn-secondary">
            <LayoutDashboard size={16} /> View Demo Dashboard
          </Link>
        </div>

        <div className="lg-benefits">
          <div className="lg-benefit-card">
            <Calendar size={24} />
            <h3>Flexible availability</h3>
            <p>Choose your own hours and days. Guide when it works for you.</p>
          </div>
          <div className="lg-benefit-card">
            <DollarSign size={24} />
            <h3>Set your own rate</h3>
            <p>You decide your hourly rate. No fixed pricing required.</p>
          </div>
          <div className="lg-benefit-card">
            <Globe2 size={24} />
            <h3>Meet travelers</h3>
            <p>Connect with visitors from around the world who want authentic experiences.</p>
          </div>
          <div className="lg-benefit-card">
            <LayoutDashboard size={24} />
            <h3>Manage in one place</h3>
            <p>Bookings, messages, earnings and reviews — all in your dashboard.</p>
          </div>
        </div>

        <div className="lg-steps">
          <h2>How it works</h2>
          <div className="lg-steps-list">
            <div className="lg-step-item">
              <div className="lg-step-num">1</div>
              <div>
                <h3>Create your profile</h3>
                <p>Tell travelers about yourself, your city and your experiences.</p>
              </div>
            </div>
            <div className="lg-step-item">
              <div className="lg-step-num">2</div>
              <div>
                <h3>Submit verification</h3>
                <p>Complete the prototype verification steps to build trust.</p>
              </div>
            </div>
            <div className="lg-step-item">
              <div className="lg-step-num">3</div>
              <div>
                <h3>Start guiding</h3>
                <p>Receive booking requests and share your local knowledge.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer variant="home" />
      <SupportChat />
    </div>
  );
}

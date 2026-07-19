import { BarChart3, Link2, QrCode, TrendingUp } from 'lucide-react';
import { Link } from 'wouter';

import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import SupportChat from '@/components/home/SupportChat';

import './partner.css';

export default function PartnerEntryPage() {
  return <div className="partner-page"><Navbar variant="home" /><main className="partner-entry">
    <section className="partner-entry-hero"><div><p className="partner-eyebrow">For Partners</p><h1>Connect your guests with trusted local guides.</h1><p>Share a simple FriendLocalTrip referral experience and preview transparent booking and commission reporting—all in a frontend-only demo.</p><div className="partner-entry-actions"><Link href="/partner/dashboard" className="partner-primary">Open Demo Partner Dashboard</Link><a href="#referral-steps" className="partner-secondary">See How Referrals Work</a></div></div><div className="partner-entry-visual"><QrCode size={82} /><strong>Saigon Riverside Hotel</strong><span>Demo referral experience</span></div></section>
    <section className="partner-benefits" aria-label="Partner benefits"><article><Link2 size={20}/><div><h2>Offer local experiences</h2><p>Give guests a trusted way to meet local guides.</p></div></article><article><BarChart3 size={20}/><div><h2>Track referred bookings</h2><p>Review deterministic requests and booking status.</p></div></article><article><TrendingUp size={20}/><div><h2>Transparent demo commissions</h2><p>See the exact 5% prototype commission rule.</p></div></article></section>
    <section className="partner-steps" id="referral-steps"><div><p className="partner-eyebrow">Referral flow</p><h2>Three steps, no complex setup</h2></div><ol><li><span>1</span><div><h3>Share your QR or referral link</h3><p>Place the demo link at your front desk, in rooms, or on social media.</p></div></li><li><span>2</span><div><h3>Travelers request a Local Guide</h3><p>The approved Traveler request flow remains unchanged.</p></div></li><li><span>3</span><div><h3>Completed bookings generate commission</h3><p>Eligible completed booking total × 5%, shown as prototype data.</p></div></li></ol></section>
  </main><Footer variant="home"/><SupportChat/></div>;
}

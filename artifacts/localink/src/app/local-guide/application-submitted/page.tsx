import { Check, CheckCircle2, Clock3, FileText } from 'lucide-react';
import { Link } from 'wouter';

import Navbar from '@/components/layout/Navbar';
import SupportChat from '@/components/home/SupportChat';
import { useLocalGuidePrototype } from '@/components/local-guide/LocalGuidePrototypeContext';
import { calculateGuideProfileCompleteness } from '@/components/local-guide/localGuideRegistrationData';

import '../local-guide.css';

export default function ApplicationSubmittedPage() {
  const { submittedApplication } = useLocalGuidePrototype();
  const completeness = submittedApplication ? calculateGuideProfileCompleteness(submittedApplication) : null;

  return (
    <div className="lg-page">
      <Navbar variant="home" />
      <main className="lg-submitted-shell">
        <section className="lg-submitted-card">
          <div className="lg-submitted-icon"><CheckCircle2 size={34} /></div>
          <p className="lg-status-pill"><Clock3 size={14} /> Pending Review — Demo</p>
          <h1>Your guide application has been submitted.</h1>
          <p className="lg-lead">This prototype saves your application only in local React state. No real reviewer, verification, or approval process is running.</p>

          {submittedApplication && (
            <div className="lg-submitted-summary">
              <div><span>Applicant</span><strong>{submittedApplication.displayName}</strong></div>
              <div><span>Location</span><strong>{submittedApplication.city}</strong></div>
              <div><span>Application reference</span><strong>{submittedApplication.id}</strong></div>
              <div><span>Profile completeness</span><strong>{completeness?.percentage}%</strong></div>
            </div>
          )}

          <div className="lg-demo-checklist">
            <h2><FileText size={18} /> Demo application status</h2>
            <p><Check size={15} /> Profile information captured</p>
            <p><Check size={15} /> Availability added</p>
            <p><Check size={15} /> Verification choices recorded for prototype</p>
          </div>

          <div className="lg-submitted-actions">
            <Link href="/local-guide/dashboard" className="lg-btn-primary">View Demo Guide Dashboard</Link>
            <Link href="/local-guide/register" className="lg-btn-secondary">Review Application</Link>
            <Link href="/local-guide" className="lg-text-link">Return to Local Guide Home</Link>
          </div>
        </section>
      </main>
      <SupportChat />
    </div>
  );
}

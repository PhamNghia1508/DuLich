import { CheckCircle } from 'lucide-react';
import { Link } from 'wouter';

import Navbar from '@/components/layout/Navbar';
import { useLocalGuidePrototype } from '@/components/local-guide/LocalGuidePrototypeContext';

import '../local-guide.css';

export default function ApplicationSubmittedPage() {
  const { submittedApplication } = useLocalGuidePrototype();

  return (
    <div className="lg-page">
      <Navbar variant="home" />
      <main className="lg-container lg-submitted">
        <div className="lg-submitted-icon">
          <CheckCircle size={64} />
        </div>
        <h1>Application Submitted!</h1>
        <p>
          Thank you{submittedApplication ? `, ${submittedApplication.displayName}` : ''}! Your guide application
          has been received. In a real application, our team would review your profile within 48 hours.
        </p>
        <p className="lg-submitted-note">
          This is a prototype — no real review process occurs. You can explore the demo dashboard below.
        </p>
        <div className="lg-submitted-actions">
          <Link href="/local-guide/dashboard" className="btn btn-accent">
            View Demo Dashboard
          </Link>
          <Link href="/local-guide" className="lg-btn-secondary">
            Back to Local Guide Hub
          </Link>
        </div>
        {submittedApplication && (
          <div className="lg-submitted-summary">
            <h3>Application Summary</h3>
            <dl>
              <dt>Name</dt><dd>{submittedApplication.displayName}</dd>
              <dt>City</dt><dd>{submittedApplication.city}</dd>
              <dt>Languages</dt><dd>{submittedApplication.languages.join(', ')}</dd>
              <dt>Rate</dt><dd>${submittedApplication.hourlyRate}/hr</dd>
              <dt>Application ID</dt><dd>{submittedApplication.id}</dd>
            </dl>
          </div>
        )}
      </main>
    </div>
  );
}

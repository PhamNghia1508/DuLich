import { ArrowRight, Compass } from 'lucide-react';
import { Link } from 'wouter';

import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { DEMO_WORKSPACE_CARDS } from '@/components/navigation/prototypeNavigation';

import './demo.css';

export default function DemoPage() {
  return (
    <div className="demo-portal-page">
      <Navbar />
      <main className="demo-portal-main">
        <header className="demo-portal-header">
          <span><Compass size={16} aria-hidden="true" /> Customer review portal</span>
          <h1>Explore FriendLocalTrip by role</h1>
          <p>Choose a focused journey. Every workspace uses deterministic frontend-only prototype data.</p>
        </header>
        <section className="demo-workspace-grid" aria-label="FriendLocalTrip demo workspaces">
          {DEMO_WORKSPACE_CARDS.map((workspace) => (
            <article key={workspace.role} className="demo-workspace-card">
              <div className="demo-workspace-card-title">
                <h2>{workspace.role}</h2>
                {workspace.badge && <span>{workspace.badge}</span>}
              </div>
              <p>{workspace.description}</p>
              <div className="demo-workspace-actions">
                {workspace.actions.map((action, index) => (
                  <Link key={action.href} href={action.href} className={index === 0 ? 'demo-action-primary' : 'demo-action-secondary'}>
                    {action.label}<ArrowRight size={16} aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </section>
        <p className="demo-portal-note">No sign-in is required. Demo changes reset with the current browser session.</p>
      </main>
      <Footer />
    </div>
  );
}

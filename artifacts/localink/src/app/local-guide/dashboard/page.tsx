import { useState } from 'react';
import {
  BarChart3, Calendar, Clock, DollarSign, LayoutDashboard,
  MessageSquare, Star, User, Check, X,
} from 'lucide-react';

import Navbar from '@/components/layout/Navbar';
import { useLocalGuidePrototype } from '@/components/local-guide/LocalGuidePrototypeContext';
import {
  DEMO_GUIDE_PROFILE,
  SEEDED_GUIDE_TRANSACTIONS,
  SEEDED_GUIDE_REVIEWS,
  SEEDED_GUIDE_CONVERSATIONS,
  filterGuideBookings,
  computeDashboardOverview,
  guideBookingStatusLabel,
  guideBookingStatusColor,
  transactionStatusLabel,
  formatGuideMoney,
} from '@/components/local-guide/localGuideDashboardData';

import '../local-guide.css';

type DashboardTab = 'overview' | 'bookings' | 'availability' | 'earnings' | 'messages' | 'reviews' | 'profile';

const TABS: { id: DashboardTab; label: string; icon: React.ReactNode }[] = [
  { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={16} /> },
  { id: 'bookings', label: 'Bookings', icon: <Calendar size={16} /> },
  { id: 'availability', label: 'Availability', icon: <Clock size={16} /> },
  { id: 'earnings', label: 'Earnings', icon: <DollarSign size={16} /> },
  { id: 'messages', label: 'Messages', icon: <MessageSquare size={16} /> },
  { id: 'reviews', label: 'Reviews', icon: <Star size={16} /> },
  { id: 'profile', label: 'Profile', icon: <User size={16} /> },
];

export default function GuideDashboardPage() {
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const { guideBookings, guideAvailability, acceptBooking, declineBooking, updateAvailabilityDay } = useLocalGuidePrototype();

  const overview = computeDashboardOverview(guideBookings, SEEDED_GUIDE_TRANSACTIONS, SEEDED_GUIDE_REVIEWS, DEMO_GUIDE_PROFILE);

  return (
    <div className="lg-page">
      <Navbar variant="home" />
      <main className="lg-dash-layout">
        <nav className="lg-dash-sidebar">
          <div className="lg-dash-sidebar-profile">
            <img src={DEMO_GUIDE_PROFILE.portrait} alt={DEMO_GUIDE_PROFILE.displayName} className="lg-dash-sidebar-avatar" />
            <p className="lg-dash-sidebar-name">{DEMO_GUIDE_PROFILE.displayName}</p>
            <p className="lg-dash-sidebar-city">{DEMO_GUIDE_PROFILE.city}</p>
          </div>
          <div className="lg-dash-nav">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </nav>

        <section className="lg-dash-main">
          {activeTab === 'overview' && <OverviewPanel overview={overview} />}
          {activeTab === 'bookings' && <BookingsPanel guideBookings={guideBookings} onAccept={acceptBooking} onDecline={declineBooking} />}
          {activeTab === 'availability' && <AvailabilityPanel availability={guideAvailability} onUpdate={updateAvailabilityDay} />}
          {activeTab === 'earnings' && <EarningsPanel overview={overview} />}
          {activeTab === 'messages' && <MessagesPanel />}
          {activeTab === 'reviews' && <ReviewsPanel />}
          {activeTab === 'profile' && <ProfilePanel />}
        </section>
      </main>
    </div>
  );
}

function OverviewPanel({ overview }: { overview: ReturnType<typeof computeDashboardOverview> }) {
  return (
    <div>
      <h1>Dashboard Overview</h1>
      <div className="lg-overview-stats">
        <div className="lg-stat-card">
          <p className="lg-stat-card-label">Pending Requests</p>
          <p className="lg-stat-card-value">{overview.pendingRequestCount}</p>
        </div>
        <div className="lg-stat-card">
          <p className="lg-stat-card-label">Upcoming</p>
          <p className="lg-stat-card-value">{overview.upcomingCount}</p>
        </div>
        <div className="lg-stat-card">
          <p className="lg-stat-card-label">Completed</p>
          <p className="lg-stat-card-value">{overview.completedCount}</p>
        </div>
        <div className="lg-stat-card">
          <p className="lg-stat-card-label">Rating</p>
          <p className="lg-stat-card-value">{overview.averageRating} <Star size={14} /></p>
        </div>
        <div className="lg-stat-card">
          <p className="lg-stat-card-label">Total Earned</p>
          <p className="lg-stat-card-value">{formatGuideMoney(overview.totalEarned, 'USD')}</p>
        </div>
        <div className="lg-stat-card">
          <p className="lg-stat-card-label">Available Balance</p>
          <p className="lg-stat-card-value">{formatGuideMoney(overview.availableBalance, 'USD')}</p>
        </div>
      </div>
      <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary, #6b7280)' }}>{overview.responseTime}</p>
    </div>
  );
}

function BookingsPanel({ guideBookings, onAccept, onDecline }: {
  guideBookings: ReturnType<typeof filterGuideBookings>;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
}) {
  const [filter, setFilter] = useState<'all' | 'request' | 'confirmed' | 'completed' | 'cancelled'>('all');
  const filtered = filterGuideBookings(guideBookings, filter);

  return (
    <div>
      <h1>Bookings</h1>
      <div className="lg-booking-filters">
        {(['all', 'request', 'confirmed', 'completed', 'cancelled'] as const).map((f) => (
          <button
            key={f}
            type="button"
            className={`lg-booking-filter-btn ${filter === f ? 'lg-booking-filter-btn--active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All' : guideBookingStatusLabel(f)}
          </button>
        ))}
      </div>
      <div className="lg-booking-list">
        {filtered.length === 0 && <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.88rem' }}>No bookings match this filter.</p>}
        {filtered.map((b) => (
          <div key={b.bookingId} className="lg-booking-card">
            <div className="lg-booking-card-header">
              <h3 style={{ color: guideBookingStatusColor(b.status) }}>
                {guideBookingStatusLabel(b.status)}
              </h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>{b.bookingId}</span>
            </div>
            <div className="lg-booking-card-meta">
              <span><strong>{b.travelerName}</strong> ({b.travelerCountry})</span>
              <span>{b.experience}</span>
              <span>{b.date} at {b.startTime}</span>
              <span>{b.durationHours}h · {b.groupSize} guest{b.groupSize > 1 ? 's' : ''}</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', margin: '0 0 0.5rem' }}>{b.meetingPoint}</p>
            {b.travelerNotes && <div className="lg-booking-card-notes">&ldquo;{b.travelerNotes}&rdquo;</div>}
            <div className="lg-booking-card-footer">
              <span className="lg-booking-payout">{formatGuideMoney(b.netPayout, b.currency)} net</span>
              {b.status === 'request' && (
                <div className="lg-booking-actions">
                  <button type="button" className="lg-btn-accept" onClick={() => onAccept(b.bookingId)}>
                    <Check size={14} /> Accept
                  </button>
                  <button type="button" className="lg-btn-decline" onClick={() => onDecline(b.bookingId)}>
                    <X size={14} /> Decline
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AvailabilityPanel({ availability, onUpdate }: {
  availability: { schedule: { day: string; available: boolean; startTime: string; endTime: string }[] };
  onUpdate: (i: number, u: { available?: boolean; startTime?: string; endTime?: string }) => void;
}) {
  return (
    <div>
      <h1>Weekly Availability</h1>
      <div className="lg-schedule-editor">
        {availability.schedule.map((day, i) => (
          <div key={day.day} className="lg-schedule-row">
            <span>{day.day}</span>
            <button
              type="button"
              className={`lg-schedule-toggle ${day.available ? 'lg-schedule-toggle--on' : ''}`}
              onClick={() => onUpdate(i, { available: !day.available })}
              aria-label={`Toggle ${day.day}`}
            />
            {day.available ? (
              <>
                <input type="time" className="lg-schedule-time" value={day.startTime} onChange={(e) => onUpdate(i, { startTime: e.target.value })} />
                <input type="time" className="lg-schedule-time" value={day.endTime} onChange={(e) => onUpdate(i, { endTime: e.target.value })} />
              </>
            ) : (
              <span style={{ gridColumn: 'span 2', fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>Unavailable</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function EarningsPanel({ overview }: { overview: ReturnType<typeof computeDashboardOverview> }) {
  return (
    <div>
      <h1>Earnings</h1>
      <div className="lg-earnings-summary">
        <div className="lg-stat-card">
          <p className="lg-stat-card-label">Total Earned (net)</p>
          <p className="lg-stat-card-value">{formatGuideMoney(overview.totalEarned, 'USD')}</p>
        </div>
        <div className="lg-stat-card">
          <p className="lg-stat-card-label">Pending</p>
          <p className="lg-stat-card-value">{formatGuideMoney(overview.pendingEarnings, 'USD')}</p>
        </div>
        <div className="lg-stat-card">
          <p className="lg-stat-card-label">Available</p>
          <p className="lg-stat-card-value">{formatGuideMoney(overview.availableBalance, 'USD')}</p>
        </div>
      </div>

      <h2 style={{ fontSize: '1rem', fontWeight: 600, margin: '0 0 0.75rem' }}>Transactions</h2>
      <div className="lg-txn-table-wrap">
        <table className="lg-txn-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Traveler</th>
              <th>Gross</th>
              <th>Fee (10%)</th>
              <th>Net</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {SEEDED_GUIDE_TRANSACTIONS.map((t) => (
              <tr key={t.id}>
                <td>{t.date}</td>
                <td>{t.travelerName}</td>
                <td>{formatGuideMoney(t.gross, t.currency)}</td>
                <td>{formatGuideMoney(t.platformFee, t.currency)}</td>
                <td>{formatGuideMoney(t.net, t.currency)}</td>
                <td>{transactionStatusLabel(t.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="lg-payout-note">Prototype — no real payouts are processed.</div>
    </div>
  );
}

function MessagesPanel() {
  return (
    <div>
      <h1>Messages</h1>
      <div className="lg-msg-list">
        {SEEDED_GUIDE_CONVERSATIONS.map((c) => (
          <div key={c.bookingId} className={`lg-msg-item ${c.unread ? 'lg-msg-item--unread' : ''}`}>
            {c.unread && <div className="lg-msg-unread-dot" />}
            <div className="lg-msg-info">
              <h3>{c.travelerName} ({c.travelerCountry})</h3>
              <p>{c.lastMessage}</p>
            </div>
            <span className="lg-msg-time">{new Date(c.lastMessageTime).toLocaleDateString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReviewsPanel() {
  return (
    <div>
      <h1>Reviews Received</h1>
      <div className="lg-review-summary">
        <div className="lg-review-avg">
          <p className="lg-review-avg-num">{DEMO_GUIDE_PROFILE.rating}</p>
          <span className="lg-review-avg-label">{DEMO_GUIDE_PROFILE.reviewCount} reviews</span>
        </div>
      </div>
      {SEEDED_GUIDE_REVIEWS.map((r) => (
        <div key={r.id} className="lg-review-card">
          <div className="lg-review-card-header">
            <h3>{r.travelerName} ({r.travelerCountry})</h3>
            <span>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
          </div>
          <p>{r.comment}</p>
          <footer>{r.experience} · {r.date}</footer>
        </div>
      ))}
    </div>
  );
}

function ProfilePanel() {
  const p = DEMO_GUIDE_PROFILE;
  return (
    <div>
      <h1>Guide Profile</h1>
      <div className="lg-profile-section">
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <img src={p.portrait} alt={p.displayName} className="lg-dash-sidebar-avatar" style={{ width: 80, height: 80 }} />
          <div style={{ flex: 1, minWidth: 200 }}>
            <h2 style={{ fontSize: '1.1rem', margin: '0 0 0.25rem' }}>{p.fullName}</h2>
            <p style={{ fontStyle: 'italic', color: 'var(--color-text-secondary)', margin: '0 0 0.5rem', fontSize: '0.88rem' }}>{p.tagline}</p>
            <p style={{ fontSize: '0.88rem', margin: '0 0 0.75rem', color: 'var(--color-text-secondary)' }}>{p.bio}</p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><BarChart3 size={14} /> {p.completedExperiences} tours</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Star size={14} /> {p.rating} ({p.reviewCount} reviews)</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={14} /> {p.responseTime}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="lg-profile-section">
        <h2>Details</h2>
        <dl>
          <div className="lg-profile-row"><dt>City</dt><dd>{p.city}</dd></div>
          <div className="lg-profile-row"><dt>Areas</dt><dd>{p.operatingAreas.join(', ')}</dd></div>
          <div className="lg-profile-row"><dt>Languages</dt><dd>{p.languages.join(', ')}</dd></div>
          <div className="lg-profile-row"><dt>Experiences</dt><dd>{p.experienceTypes.join(', ')}</dd></div>
          <div className="lg-profile-row"><dt>Rate</dt><dd>${p.hourlyRate}/hr</dd></div>
          <div className="lg-profile-row"><dt>Member since</dt><dd>{p.memberSince}</dd></div>
        </dl>
      </div>
    </div>
  );
}

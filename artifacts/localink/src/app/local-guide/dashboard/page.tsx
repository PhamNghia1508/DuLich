import { useMemo, useState } from 'react';
import { Link } from 'wouter';
import {
  ArrowLeft, BarChart3, Calendar, Check, Clock, DollarSign, ExternalLink,
  LayoutDashboard, MessageSquare, RotateCcw, Send, Star, User, X,
} from 'lucide-react';

import Navbar from '@/components/layout/Navbar';
import SupportChat from '@/components/home/SupportChat';
import { useLocalGuidePrototype } from '@/components/local-guide/LocalGuidePrototypeContext';
import {
  DEMO_GUIDE_PROFILE, SEEDED_GUIDE_TRANSACTIONS, SEEDED_GUIDE_REVIEWS,
  SEEDED_GUIDE_CONVERSATIONS, filterGuideBookings, computeDashboardOverview,
  guideBookingStatusLabel, guideBookingStatusColor, transactionStatusLabel, formatGuideMoney,
  type PrototypeGuideBooking, type PrototypeGuideWeeklyAvailability,
} from '@/components/local-guide/localGuideDashboardData';
import {
  GUIDE_DASHBOARD_NAV_ITEMS, createDashboardMetricCards,
  normalizeGuideTransactionsForCards, type GuideDashboardTab,
} from '@/components/local-guide/localGuidePresentation';

import '../local-guide.css';

const TAB_ICONS = {
  overview: LayoutDashboard, bookings: Calendar, availability: Clock,
  earnings: DollarSign, messages: MessageSquare, reviews: Star, profile: User,
};

export default function GuideDashboardPage() {
  const [activeTab, setActiveTab] = useState<GuideDashboardTab>('overview');
  const prototype = useLocalGuidePrototype();
  const overview = computeDashboardOverview(prototype.guideBookings, SEEDED_GUIDE_TRANSACTIONS, SEEDED_GUIDE_REVIEWS, DEMO_GUIDE_PROFILE);

  return (
    <div className="lg-page">
      <Navbar variant="home" />
      <main className="lg-dash-layout">
        <nav className="lg-dash-sidebar" aria-label="Guide dashboard">
          <div className="lg-dash-sidebar-profile">
            <img src={DEMO_GUIDE_PROFILE.portrait} alt={DEMO_GUIDE_PROFILE.displayName} className="lg-dash-sidebar-avatar" />
            <p className="lg-dash-sidebar-name">{DEMO_GUIDE_PROFILE.displayName}</p>
            <p className="lg-dash-sidebar-city">{DEMO_GUIDE_PROFILE.city}</p>
            <span className="lg-dash-demo-pill">Demo workspace</span>
          </div>
          <div className="lg-dash-nav">
            {GUIDE_DASHBOARD_NAV_ITEMS.map((tab) => {
              const Icon = TAB_ICONS[tab.id];
              return <button key={tab.id} type="button" aria-selected={activeTab === tab.id} onClick={() => setActiveTab(tab.id)}><Icon size={16} />{tab.label}</button>;
            })}
          </div>
          <Link href="/" className="lg-dash-return"><ArrowLeft size={14} /> Traveler site</Link>
        </nav>

        <section className="lg-dash-main">
          {activeTab === 'overview' && <OverviewPanel overview={overview} bookings={prototype.guideBookings} onNavigate={setActiveTab} />}
          {activeTab === 'bookings' && <BookingsPanel bookings={prototype.guideBookings} onAccept={prototype.acceptBooking} onDecline={prototype.declineBooking} />}
          {activeTab === 'availability' && <AvailabilityPanel availability={prototype.guideAvailability} onUpdate={prototype.updateAvailabilityDay} onReset={prototype.resetAvailability} />}
          {activeTab === 'earnings' && <EarningsPanel overview={overview} />}
          {activeTab === 'messages' && <MessagesPanel messages={prototype.guideMessages} onSend={prototype.sendGuideMessage} />}
          {activeTab === 'reviews' && <ReviewsPanel />}
          {activeTab === 'profile' && <ProfilePanel />}
        </section>
      </main>
      {activeTab !== 'messages' && <SupportChat />}
    </div>
  );
}

function PanelHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <header className="lg-panel-header"><p className="lg-eyebrow">{eyebrow}</p><h1>{title}</h1><p>{description}</p></header>;
}

function OverviewPanel({ overview, bookings, onNavigate }: {
  overview: ReturnType<typeof computeDashboardOverview>; bookings: PrototypeGuideBooking[]; onNavigate: (tab: GuideDashboardTab) => void;
}) {
  const upcoming = bookings.filter((booking) => booking.status === 'confirmed').slice(0, 2);
  return <div>
    <PanelHeader eyebrow="Guide workspace" title={`Good morning, ${DEMO_GUIDE_PROFILE.displayName}`} description="Here is what needs your attention in this demo workspace." />
    <div className="lg-overview-stats lg-overview-stats--priority">
      {createDashboardMetricCards(overview).map((card) => <article className="lg-stat-card" key={card.id}><p className="lg-stat-card-label">{card.label}</p><p className="lg-stat-card-value">{card.format === 'currency' ? formatGuideMoney(card.value, 'USD') : card.format === 'rating' ? `${card.value} ★` : card.value}</p></article>)}
    </div>
    <div className="lg-overview-grid">
      <section className="lg-dash-card"><div className="lg-card-heading"><div><h2>Action center</h2><p>Keep your guide work moving.</p></div></div>
        <button type="button" onClick={() => onNavigate('bookings')}><span><strong>{overview.pendingRequestCount} booking requests</strong><small>Review traveler details and respond</small></span><Calendar size={17} /></button>
        <button type="button" onClick={() => onNavigate('availability')}><span><strong>Availability ready</strong><small>Review your weekly hours</small></span><Clock size={17} /></button>
        <button type="button" onClick={() => onNavigate('profile')}><span><strong>{overview.profileCompleteness}% profile complete</strong><small>Preview or update your public profile</small></span><User size={17} /></button>
      </section>
      <section className="lg-dash-card"><div className="lg-card-heading"><div><h2>Upcoming experiences</h2><p>Your next confirmed bookings.</p></div><button type="button" onClick={() => onNavigate('bookings')}>View all</button></div>
        {upcoming.map((booking) => <div className="lg-compact-booking" key={booking.bookingId}><div><strong>{booking.experience}</strong><span>{booking.travelerName} · {booking.groupSize} travelers</span></div><time>{booking.date}<br />{booking.startTime}</time></div>)}
      </section>
      <section className="lg-dash-card lg-dash-card--wide"><div className="lg-card-heading"><div><h2>Recent messages</h2><p>Continue conversations without losing booking context.</p></div><button type="button" onClick={() => onNavigate('messages')}>Open inbox</button></div>
        <div className="lg-overview-messages">{SEEDED_GUIDE_CONVERSATIONS.slice(0, 2).map((item) => <div key={item.bookingId}><span>{item.travelerName}</span><p>{item.lastMessage}</p><time>{new Date(item.lastMessageTime).toLocaleDateString()}</time></div>)}</div>
      </section>
    </div>
  </div>;
}

function BookingsPanel({ bookings, onAccept, onDecline }: { bookings: PrototypeGuideBooking[]; onAccept: (id: string) => void; onDecline: (id: string) => void }) {
  const [filter, setFilter] = useState<'all' | 'request' | 'confirmed' | 'completed' | 'cancelled'>('all');
  const filtered = filterGuideBookings(bookings, filter);
  const labels = { all: 'All', request: 'Requests', confirmed: 'Upcoming', completed: 'Completed', cancelled: 'Cancelled' };
  return <div><PanelHeader eyebrow="Bookings" title="Traveler requests and experiences" description="Review details, respond to new requests, and track confirmed experiences." />
    <div className="lg-booking-filters">{(Object.keys(labels) as (keyof typeof labels)[]).map((item) => <button key={item} type="button" className={`lg-booking-filter-btn ${filter === item ? 'lg-booking-filter-btn--active' : ''}`} onClick={() => setFilter(item)}>{labels[item]}</button>)}</div>
    <div className="lg-booking-list">{filtered.length === 0 && <div className="lg-empty-panel">No bookings match this filter.</div>}{filtered.map((booking) => <article key={booking.bookingId} className="lg-booking-card">
      <div className="lg-booking-card-header"><h3 style={{ color: guideBookingStatusColor(booking.status) }}>{guideBookingStatusLabel(booking.status)}</h3><span>{booking.bookingId}</span></div>
      <div className="lg-booking-card-meta"><span><strong>{booking.travelerName}</strong> · {booking.travelerCountry}</span><span>{booking.experience}</span><span>{booking.date} at {booking.startTime}</span><span>{booking.durationHours}h · {booking.groupSize} traveler{booking.groupSize > 1 ? 's' : ''}</span></div>
      <p className="lg-booking-location">Meet at {booking.meetingPoint}</p>{booking.travelerNotes && <div className="lg-booking-card-notes">“{booking.travelerNotes}”</div>}
      <div className="lg-booking-card-footer"><span className="lg-booking-payout">{formatGuideMoney(booking.netPayout, booking.currency)} estimated net</span>{booking.status === 'request' && <div className="lg-booking-actions"><button type="button" className="lg-btn-accept" onClick={() => onAccept(booking.bookingId)}><Check size={14} />Accept</button><button type="button" className="lg-btn-decline" onClick={() => onDecline(booking.bookingId)}><X size={14} />Decline</button></div>}</div>
    </article>)}</div>
  </div>;
}

function AvailabilityPanel({ availability, onUpdate, onReset }: { availability: PrototypeGuideWeeklyAvailability; onUpdate: (i: number, update: Partial<PrototypeGuideWeeklyAvailability['schedule'][number]>) => void; onReset: () => void }) {
  const [saved, setSaved] = useState(false);
  return <div><PanelHeader eyebrow="Availability" title="Set when travelers can request you" description="Manage a weekly pattern and preview the booking preferences shown in this prototype." />
    <div className="lg-availability-layout"><section><div className="lg-schedule-editor">{availability.schedule.map((day, index) => <div key={day.day} className="lg-schedule-row"><strong>{day.day}</strong><button type="button" className={`lg-schedule-toggle ${day.available ? 'lg-schedule-toggle--on' : ''}`} onClick={() => { onUpdate(index, { available: !day.available }); setSaved(false); }} aria-label={`Toggle ${day.day}`} />{day.available ? <div className="lg-schedule-times"><input aria-label={`${day.day} start time`} type="time" value={day.startTime} onChange={(event) => onUpdate(index, { startTime: event.target.value })} /><span>to</span><input aria-label={`${day.day} end time`} type="time" value={day.endTime} onChange={(event) => onUpdate(index, { endTime: event.target.value })} /></div> : <span className="lg-unavailable">Unavailable</span>}</div>)}</div>
      <div className="lg-availability-actions"><button type="button" className="lg-btn-primary" onClick={() => setSaved(true)}>{saved ? 'Saved locally' : 'Save Availability'}</button><button type="button" className="lg-btn-secondary" onClick={() => { onReset(); setSaved(false); }}><RotateCcw size={15} />Reset</button></div></section>
      <aside className="lg-dash-card"><h2>Traveler booking preview</h2><dl className="lg-preference-list"><div><dt>Minimum booking</dt><dd>{availability.minBookingHours} hours</dd></div><div><dt>Advance notice</dt><dd>{availability.advanceNoticeDays} days</dd></div><div><dt>Daily booking limit</dt><dd>{availability.maxBookingsPerDay}</dd></div><div><dt>Maximum group</dt><dd>{availability.maxGroupSize} travelers</dd></div></dl><div className="lg-blocked-demo"><strong>Blocked dates</strong><p>No blocked dates in this demo.</p></div></aside></div>
  </div>;
}

function EarningsPanel({ overview }: { overview: ReturnType<typeof computeDashboardOverview> }) {
  const cards = normalizeGuideTransactionsForCards(SEEDED_GUIDE_TRANSACTIONS);
  return <div><PanelHeader eyebrow="Earnings" title="Clear, demo-safe earnings overview" description="Gross amount minus the unchanged 10% platform fee equals your estimated net earnings." />
    <div className="lg-earnings-summary"><div className="lg-stat-card"><p className="lg-stat-card-label">Total net earned</p><p className="lg-stat-card-value">{formatGuideMoney(overview.totalEarned, 'USD')}</p></div><div className="lg-stat-card"><p className="lg-stat-card-label">Pending</p><p className="lg-stat-card-value">{formatGuideMoney(overview.pendingEarnings, 'USD')}</p></div><div className="lg-stat-card"><p className="lg-stat-card-label">Estimated available</p><p className="lg-stat-card-value">{formatGuideMoney(overview.availableBalance, 'USD')}</p></div></div>
    <div className="lg-fee-note"><DollarSign size={16} /><span>Prototype ledger · Platform fee remains 10% · No real payouts are processed.</span><button type="button" disabled>Withdraw unavailable</button></div>
    <div className="lg-txn-table-wrap"><table className="lg-txn-table"><thead><tr><th>Date / booking</th><th>Traveler</th><th>Gross</th><th>Fee (10%)</th><th>Net</th><th>Status</th></tr></thead><tbody>{cards.map((item) => <tr key={item.id}><td>{item.date}<small>{item.bookingId}</small></td><td>{item.travelerName}</td><td>{formatGuideMoney(item.gross,item.currency)}</td><td>{formatGuideMoney(item.platformFee,item.currency)}</td><td><strong>{formatGuideMoney(item.net,item.currency)}</strong></td><td>{transactionStatusLabel(item.status)}</td></tr>)}</tbody></table></div>
    <div className="lg-txn-cards">{cards.map((item) => <article key={item.id}><header><strong>{item.travelerName}</strong><span>{transactionStatusLabel(item.status)}</span></header><p>{item.bookingId} · {item.date}</p><dl><div><dt>Gross</dt><dd>{formatGuideMoney(item.gross,item.currency)}</dd></div><div><dt>Platform fee</dt><dd>− {formatGuideMoney(item.platformFee,item.currency)}</dd></div><div><dt>Estimated net</dt><dd>{formatGuideMoney(item.net,item.currency)}</dd></div></dl></article>)}</div>
  </div>;
}

function MessagesPanel({ messages, onSend }: { messages: Record<string, string[]>; onSend: (id: string, text: string) => void }) {
  const [selectedId, setSelectedId] = useState(''); const [draft, setDraft] = useState(''); const selected = SEEDED_GUIDE_CONVERSATIONS.find((item) => item.bookingId === selectedId) ?? SEEDED_GUIDE_CONVERSATIONS[0]; const activeConversationId = selectedId || selected.bookingId;
  function submit(event: React.FormEvent) { event.preventDefault(); if (!draft.trim()) return; onSend(activeConversationId, draft); setDraft(''); }
  return <div><PanelHeader eyebrow="Messages" title="Traveler conversations" description="Keep every message connected to its booking reference." />
    <div className="lg-inbox"><aside className={`lg-inbox-list ${selectedId ? 'lg-inbox-list--selected' : ''}`}><h2>Inbox</h2>{SEEDED_GUIDE_CONVERSATIONS.map((item) => <button type="button" key={item.bookingId} aria-current={item.bookingId === selectedId} onClick={() => setSelectedId(item.bookingId)}><span className="lg-message-avatar">{item.travelerName.charAt(0)}</span><span><strong>{item.travelerName}</strong><small>{item.bookingId}</small><p>{item.lastMessage}</p></span>{item.unread && <i />}</button>)}</aside>
      <section className={`lg-chat-panel ${selectedId ? 'lg-chat-panel--selected' : ''}`}><header><button className="lg-chat-back" type="button" onClick={() => setSelectedId('')} aria-label="Back to conversations"><ArrowLeft size={17} /></button><div><h2>{selected.travelerName}</h2><p>{selected.bookingId} · {selected.travelerCountry}</p></div></header><div className="lg-chat-body"><div className="lg-chat-bubble lg-chat-bubble--traveler">{selected.lastMessage}</div>{(messages[activeConversationId] ?? []).map((message,index) => <div className="lg-chat-bubble lg-chat-bubble--guide" key={`${message}-${index}`}>{message}</div>)}</div><form className="lg-chat-compose" onSubmit={submit}><label><span className="sr-only">Message {selected.travelerName}</span><input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Write a demo reply…" /></label><button type="submit" aria-label="Send message"><Send size={17} /></button></form></section>
    </div>
  </div>;
}

function ReviewsPanel() {
  const counts = useMemo(() => [5,4,3,2,1].map((rating) => ({ rating, count: SEEDED_GUIDE_REVIEWS.filter((review) => review.rating === rating).length })), []);
  return <div><PanelHeader eyebrow="Reviews" title="Traveler feedback" description="See your rating summary and recent experience reviews." /><div className="lg-reviews-layout"><aside className="lg-dash-card lg-rating-card"><strong>{DEMO_GUIDE_PROFILE.rating}</strong><span>★★★★★</span><p>{DEMO_GUIDE_PROFILE.reviewCount} total profile reviews</p>{counts.map((item) => <div key={item.rating}><label>{item.rating} star</label><i><b style={{ width: `${item.count * 25}%` }} /></i><span>{item.count}</span></div>)}</aside><section>{SEEDED_GUIDE_REVIEWS.map((review) => <article key={review.id} className="lg-review-card"><div className="lg-review-card-header"><h3>{review.travelerName} · {review.travelerCountry}</h3><span>{'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}</span></div><p>{review.comment}</p><footer>{review.experience} · {review.date}</footer></article>)}</section></div></div>;
}

function ProfilePanel() { const p = DEMO_GUIDE_PROFILE; return <div><PanelHeader eyebrow="Public profile" title="Your guide profile" description="Review the information travelers see before they request an experience." /><section className="lg-profile-hero"><img src={p.portrait} alt={p.displayName} /><div><span className="lg-dash-demo-pill">{p.verified ? 'Verified demo profile' : 'Demo profile'}</span><h2>{p.fullName}</h2><p className="lg-profile-tagline">{p.tagline}</p><p>{p.bio}</p><div className="lg-profile-facts"><span><BarChart3 size={14} />{p.completedExperiences} experiences</span><span><Star size={14} />{p.rating} ({p.reviewCount})</span><span><Clock size={14} />{p.responseTime}</span></div></div></section><div className="lg-profile-grid"><section className="lg-profile-section"><h2>Service details</h2><dl><div className="lg-profile-row"><dt>Location</dt><dd>{p.city}</dd></div><div className="lg-profile-row"><dt>Operating areas</dt><dd>{p.operatingAreas.join(', ')}</dd></div><div className="lg-profile-row"><dt>Languages</dt><dd>{p.languages.join(', ')}</dd></div><div className="lg-profile-row"><dt>Experience types</dt><dd>{p.experienceTypes.join(', ')}</dd></div></dl></section><section className="lg-profile-section"><h2>Guide details</h2><dl><div className="lg-profile-row"><dt>Hourly rate</dt><dd>{formatGuideMoney(p.hourlyRate,p.currency)}</dd></div><div className="lg-profile-row"><dt>Experience</dt><dd>{p.experienceYears} years</dd></div><div className="lg-profile-row"><dt>Member since</dt><dd>{p.memberSince}</dd></div></dl></section></div><div className="lg-profile-actions"><Link href="/local-guide/register" className="lg-btn-primary">Edit Profile</Link><Link href="/guides/guide-001" className="lg-btn-secondary">Preview Public Profile <ExternalLink size={15} /></Link></div></div>; }

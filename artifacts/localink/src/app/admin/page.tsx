import { BarChart3, BookOpenCheck, Handshake, Settings, ShieldCheck, Users } from 'lucide-react';
import { Link } from 'wouter';

import Navbar from '@/components/layout/Navbar';

import './admin.css';

export default function AdminEntryPage() {
  const modules = [
    { icon: Users, label: 'Travelers and guide verification' },
    { icon: Handshake, label: 'Partners and referral operations' },
    { icon: BookOpenCheck, label: 'Requests and bookings' },
    { icon: BarChart3, label: 'Payments, commissions, and reports' },
    { icon: Settings, label: 'Prototype-only settings' },
  ];
  return <div className="admin-page"><Navbar variant="home"/><main className="admin-entry"><section><div className="admin-entry-mark"><ShieldCheck size={28}/></div><p className="admin-eyebrow">Platform Administration</p><h1>FriendLocalTrip Admin Demo</h1><p>This frontend-only workspace presents deterministic platform operations. No login, permissions, API, payment processing, or production action is connected.</p><Link href="/admin/dashboard" className="admin-primary">Open Admin Dashboard</Link></section><aside><h2>Modules covered</h2>{modules.map(({icon:Icon,label})=><div key={label}><Icon size={17}/><span>{label}</span></div>)}<p>Prototype environment · Local React state only</p></aside></main></div>;
}

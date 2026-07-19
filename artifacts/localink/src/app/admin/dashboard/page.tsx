import { useState } from 'react';
import { BarChart3, BookOpen, CalendarDays, Handshake, LayoutDashboard, Settings, ShieldCheck, UserRoundCheck, UsersRound, WalletCards } from 'lucide-react';

import RoleDashboardShell, { type WorkspaceNavItem } from '@/components/workspace/RoleDashboardShell';
import AdminDashboardPanels, { type AdminSection } from '@/components/admin/AdminDashboardPanels';

import '../admin.css';

const ADMIN_NAV: readonly WorkspaceNavItem<AdminSection>[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'travelers', label: 'Travelers', icon: UsersRound },
  { id: 'guides', label: 'Guides', icon: UserRoundCheck },
  { id: 'partners', label: 'Partners', icon: Handshake },
  { id: 'requests', label: 'Requests', icon: BookOpen },
  { id: 'bookings', label: 'Bookings', icon: CalendarDays },
  { id: 'payments', label: 'Payments', icon: WalletCards },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function AdminDashboardPage() {
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');
  return <RoleDashboardShell<AdminSection> role="admin" workspaceLabel="Admin Workspace" accountName="Platform Operations" accountMeta="Frontend-only demo" activeSection={activeSection} navigation={ADMIN_NAV} onSectionChange={setActiveSection}>
    <AdminDashboardPanels activeSection={activeSection} onSectionChange={setActiveSection}/>
  </RoleDashboardShell>;
}

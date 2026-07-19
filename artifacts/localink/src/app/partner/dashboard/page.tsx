import { useState } from 'react';
import { BarChart3, BriefcaseBusiness, Building2, CalendarDays, LayoutDashboard, Link2 } from 'lucide-react';

import SupportChat from '@/components/home/SupportChat';
import RoleDashboardShell, { type WorkspaceNavItem } from '@/components/workspace/RoleDashboardShell';
import { usePartnerPrototype } from '@/components/partner/PartnerPrototypeContext';
import PartnerDashboardPanels from '@/components/partner/PartnerDashboardPanels';

import '../partner.css';

export type PartnerSection = 'overview' | 'referral' | 'bookings' | 'commissions' | 'reports' | 'profile';

const PARTNER_NAV: readonly WorkspaceNavItem<PartnerSection>[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'referral', label: 'Referral Tools', icon: Link2 },
  { id: 'bookings', label: 'Bookings', icon: CalendarDays },
  { id: 'commissions', label: 'Commissions', icon: BriefcaseBusiness },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'profile', label: 'Partner Profile', icon: Building2 },
];

export default function PartnerDashboardPage() {
  const [activeSection, setActiveSection] = useState<PartnerSection>('overview');
  const partner = usePartnerPrototype();
  return <RoleDashboardShell<PartnerSection> role="partner" workspaceLabel="Partner Workspace" accountName={partner.selectedPartner.name} accountMeta={`${partner.selectedPartner.type} · Demo`} activeSection={activeSection} navigation={PARTNER_NAV} onSectionChange={setActiveSection}>
    <PartnerDashboardPanels activeSection={activeSection} onSectionChange={setActiveSection}/>
    {activeSection === 'overview' && <SupportChat/>}
  </RoleDashboardShell>;
}

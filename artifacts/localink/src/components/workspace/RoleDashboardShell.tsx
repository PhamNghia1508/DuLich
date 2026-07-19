import { useState, type ComponentType, type ReactNode } from 'react';
import { ChevronDown, Compass, Menu, X } from 'lucide-react';
import { Link } from 'wouter';
import WorkspaceSwitcher from '@/components/navigation/WorkspaceSwitcher';

import './role-dashboard.css';

export interface WorkspaceNavItem<T extends string> {
  id: T;
  label: string;
  icon: ComponentType<{ size?: number }>;
}

interface RoleDashboardShellProps<T extends string> {
  role: 'partner' | 'admin';
  workspaceLabel: string;
  accountName: string;
  accountMeta: string;
  activeSection: T;
  navigation: readonly WorkspaceNavItem<T>[];
  onSectionChange: (section: T) => void;
  children: ReactNode;
}

export default function RoleDashboardShell<T extends string>({
  role, workspaceLabel, accountName, accountMeta, activeSection, navigation, onSectionChange, children,
}: RoleDashboardShellProps<T>) {
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const current = navigation.find((item) => item.id === activeSection) ?? navigation[0];

  const navButtons = navigation.map((item) => {
    const Icon = item.icon;
    return <button key={item.id} type="button" aria-selected={activeSection === item.id} onClick={() => { onSectionChange(item.id); setAdminMenuOpen(false); }}><Icon size={16} /><span>{item.label}</span></button>;
  });

  return (
    <div className={`role-workspace role-workspace--${role}`}>
      <header className="role-workspace-header">
        <Link href="/" aria-label="FriendLocalTrip home" className="role-workspace-brand"><Compass size={18} />FriendLocal<span>Trip</span></Link>
        <div><strong>{workspaceLabel}</strong><span>Prototype environment</span></div>
        <div className="role-workspace-header-actions"><WorkspaceSwitcher /><Link href={role === 'partner' ? '/partner' : '/admin'} className="role-workspace-exit">Exit workspace</Link></div>
      </header>

      <div className="role-workspace-layout">
        <aside className="role-workspace-sidebar">
          <div className="role-account"><span>{accountName.charAt(0)}</span><div><strong>{accountName}</strong><small>{accountMeta}</small></div></div>
          <nav aria-label={`${workspaceLabel} navigation`}>{navButtons}</nav>
        </aside>

        {role === 'partner' ? (
          <nav className="role-mobile-rail" aria-label={`${workspaceLabel} mobile navigation`}>{navButtons}</nav>
        ) : (
          <div className="role-mobile-menu">
            <button type="button" aria-expanded={adminMenuOpen} onClick={() => setAdminMenuOpen((open) => !open)}>
              {adminMenuOpen ? <X size={17} /> : <Menu size={17} />}<span>{current.label}</span><ChevronDown size={15} />
            </button>
            {adminMenuOpen && <nav aria-label={`${workspaceLabel} mobile navigation`}>{navButtons}</nav>}
          </div>
        )}

        <main className="role-workspace-main">{children}</main>
      </div>
    </div>
  );
}

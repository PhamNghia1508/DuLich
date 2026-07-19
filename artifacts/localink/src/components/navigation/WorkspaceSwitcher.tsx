import { Check, ChevronDown, Grid3X3 } from 'lucide-react';
import { Link, useLocation } from 'wouter';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { prototypeNavigationEnabled, WORKSPACE_SWITCHER_ITEMS, workspaceForPath } from './prototypeNavigation';

import './workspace-switcher.css';

export default function WorkspaceSwitcher() {
  const [location] = useLocation();
  if (!prototypeNavigationEnabled) return null;
  const current = workspaceForPath(location);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" className="workspace-switcher-trigger" aria-label="Switch FriendLocalTrip demo workspace">
          <Grid3X3 size={15} aria-hidden="true" /><span>Switch workspace</span><ChevronDown size={14} aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="workspace-switcher-content">
        <DropdownMenuLabel className="workspace-switcher-label">FriendLocalTrip workspaces</DropdownMenuLabel>
        {WORKSPACE_SWITCHER_ITEMS.map((item) => item.workspace ? (
          <DropdownMenuItem asChild key={item.href} className="workspace-switcher-item">
            <Link href={item.href}><span>{item.label}{item.badge && <em>{item.badge}</em>}</span>{current === item.workspace && <Check size={15} aria-label="Current workspace" />}</Link>
          </DropdownMenuItem>
        ) : (
          <div key={item.href}>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="workspace-switcher-item workspace-switcher-item--all"><Link href={item.href}>{item.label}</Link></DropdownMenuItem>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

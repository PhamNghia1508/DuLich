import { ChevronDown, Grid3X3 } from 'lucide-react';
import { Link } from 'wouter';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EXPLORE_DEMO_ITEMS, prototypeNavigationEnabled } from './prototypeNavigation';

export default function ExploreDemoMenu() {
  if (!prototypeNavigationEnabled) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" className="demo-menu-trigger" aria-label="Explore FriendLocalTrip demo workspaces">
          <Grid3X3 size={16} aria-hidden="true" />
          <span>Explore Demo</span>
          <ChevronDown size={14} aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="demo-menu-content" align="end" sideOffset={10}>
        <DropdownMenuLabel className="demo-menu-label">Explore FriendLocalTrip</DropdownMenuLabel>
        {EXPLORE_DEMO_ITEMS.map((item) => (
          <DropdownMenuItem key={item.href} asChild className="demo-menu-item">
            <Link href={item.href}>
              <span>
                <strong>{item.label}</strong>
                <small>{item.description}</small>
              </span>
              {item.badge && <em>{item.badge}</em>}
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator className="demo-menu-separator" />
        <DropdownMenuItem asChild className="demo-menu-all">
          <Link href="/demo">View All Demo Workspaces</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

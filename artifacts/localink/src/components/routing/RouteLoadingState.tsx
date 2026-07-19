import { Compass } from 'lucide-react';

import './route-loading.css';

export default function RouteLoadingState() {
  return (
    <main className="route-loading-state" aria-busy="true" aria-live="polite">
      <span className="route-loading-mark" aria-hidden="true"><Compass size={22} /></span>
      <p>Loading FriendLocalTrip workspace…</p>
    </main>
  );
}

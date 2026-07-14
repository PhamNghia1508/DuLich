import { Route, Switch, Router as WouterRouter } from 'wouter';

import HomePage from '@/app/page';
import GuidesPage from '@/app/guides/page';
import GuideProfilePage from '@/app/guides/[id]/page';
import BookingRequestPage from '@/app/book/[guideId]/page';
import DashboardPage from '@/app/dashboard/page';
import GuideDashboardPage from '@/app/guide-dashboard/page';
import MatchPage from '@/app/match/page';
import AdminPage from '@/app/admin/page';
import NotFound from '@/pages/not-found';

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/guides" component={GuidesPage} />
      <Route path="/guides/:id" component={GuideProfilePage} />
      <Route path="/book/:guideId" component={BookingRequestPage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/guide-dashboard" component={GuideDashboardPage} />
      <Route path="/match" component={MatchPage} />
      <Route path="/admin" component={AdminPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <Router />
    </WouterRouter>
  );
}

export default App;

import { Route, Switch, Router as WouterRouter } from 'wouter';

import HomePage from '@/app/page';
import GuidesPage from '@/app/guides/page';
import GuideProfilePage from '@/app/guides/[id]/page';
import BookingRequestPage from '@/app/book/[guideId]/page';
import DashboardPage from '@/app/dashboard/page';
import GuideDashboardPage from '@/app/guide-dashboard/page';
import MatchPage from '@/app/match/page';
import AdminPage from '@/app/admin/page';
import SignInPage from '@/app/signin/page';
import SignUpPage from '@/app/signup/page';
import NotFound from '@/pages/not-found';
import ScrollToTop from '@/components/ScrollToTop';
import { AuthProvider } from '@/hooks/useAuth';
import { TravelerPrototypeProvider } from '@/components/traveler/TravelerPrototypeContext';

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
      <Route path="/signin" component={SignInPage} />
      <Route path="/signup" component={SignUpPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <AuthProvider>
      <TravelerPrototypeProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        {/* Reset scroll về đầu trang mỗi khi route thay đổi */}
        <ScrollToTop />
        <Router />
        </WouterRouter>
      </TravelerPrototypeProvider>
    </AuthProvider>
  );
}

export default App;

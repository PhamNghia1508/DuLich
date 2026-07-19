import { Route, Switch, Router as WouterRouter } from 'wouter';

import HomePage from '@/app/page';
import GuidesPage from '@/app/guides/page';
import GuideProfilePage from '@/app/guides/[id]/page';
import BookingRequestPage from '@/app/book/[guideId]/page';
import BookingHandoffPage from '@/app/booking-handoff/[guideId]/page';
import PaymentPage from '@/app/payment/[guideId]/page';
import BookingSuccessPage from '@/app/booking-success/[guideId]/page';
import BookingListPage from '@/app/bookings/page';
import BookingDetailPage from '@/app/bookings/[bookingId]/page';
import BookingChatPage from '@/app/bookings/[bookingId]/chat/page';
import DashboardPage from '@/app/dashboard/page';
import GuideDashboardPage from '@/app/guide-dashboard/page';
import MatchPage from '@/app/match/page';
import AdminPage from '@/app/admin/page';
import SignInPage from '@/app/signin/page';
import SignUpPage from '@/app/signup/page';
import NotFound from '@/pages/not-found';
import ScrollToTop from '@/components/ScrollToTop';
import LocalGuideHubPage from '@/app/local-guide/page';
import LocalGuideRegisterPage from '@/app/local-guide/register/page';
import ApplicationSubmittedPage from '@/app/local-guide/application-submitted/page';
import LocalGuideDashboardPage from '@/app/local-guide/dashboard/page';
import { AuthProvider } from '@/hooks/useAuth';
import { TravelerPrototypeProvider } from '@/components/traveler/TravelerPrototypeContext';
import { LocalGuidePrototypeProvider } from '@/components/local-guide/LocalGuidePrototypeContext';
import { PartnerPrototypeProvider } from '@/components/partner/PartnerPrototypeContext';
import { AdminPrototypeProvider } from '@/components/admin/AdminPrototypeContext';

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/guides" component={GuidesPage} />
      <Route path="/guides/:id" component={GuideProfilePage} />
      <Route path="/booking-handoff/:guideId" component={BookingHandoffPage} />
      <Route path="/payment/:guideId" component={PaymentPage} />
      <Route path="/booking-success/:guideId" component={BookingSuccessPage} />
      <Route path="/bookings" component={BookingListPage} />
      <Route path="/bookings/:bookingId" component={BookingDetailPage} />
      <Route path="/bookings/:bookingId/chat" component={BookingChatPage} />
      <Route path="/book/:guideId" component={BookingRequestPage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/local-guide" component={LocalGuideHubPage} />
      <Route path="/local-guide/register" component={LocalGuideRegisterPage} />
      <Route path="/local-guide/application-submitted" component={ApplicationSubmittedPage} />
      <Route path="/local-guide/dashboard" component={LocalGuideDashboardPage} />
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
        <LocalGuidePrototypeProvider>
          <PartnerPrototypeProvider>
            <AdminPrototypeProvider>
              <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
                <ScrollToTop />
                <Router />
              </WouterRouter>
            </AdminPrototypeProvider>
          </PartnerPrototypeProvider>
        </LocalGuidePrototypeProvider>
      </TravelerPrototypeProvider>
    </AuthProvider>
  );
}

export default App;

import { lazy, Suspense } from 'react';
import { Route, Switch, Router as WouterRouter } from 'wouter';

import HomePage from '@/app/page';
import GuidesPage from '@/app/guides/page';
import BookingHandoffPage from '@/app/booking-handoff/[guideId]/page';
import PaymentPage from '@/app/payment/[guideId]/page';
import BookingSuccessPage from '@/app/booking-success/[guideId]/page';
import BookingListPage from '@/app/bookings/page';
import BookingDetailPage from '@/app/bookings/[bookingId]/page';
import AdminPage from '@/app/admin/page';
import NotFound from '@/pages/not-found';
import ScrollToTop from '@/components/ScrollToTop';
import LocalGuideHubPage from '@/app/local-guide/page';
import LocalGuideRegisterPage from '@/app/local-guide/register/page';
import ApplicationSubmittedPage from '@/app/local-guide/application-submitted/page';
import PartnerEntryPage from '@/app/partner/page';
import { AuthProvider } from '@/hooks/useAuth';
import { TravelerPrototypeProvider } from '@/components/traveler/TravelerPrototypeContext';
import { LocalGuidePrototypeProvider } from '@/components/local-guide/LocalGuidePrototypeContext';
import { PartnerPrototypeProvider } from '@/components/partner/PartnerPrototypeContext';
import { AdminPrototypeProvider } from '@/components/admin/AdminPrototypeContext';
import {
  LegacyBookRedirect,
  LegacyDashboardRecovery,
  LegacyGuideDashboardRedirect,
  LegacyMatchRedirect,
  LegacySigninRecovery,
  LegacySignupRecovery,
} from '@/components/routing/LegacyRouteBridge';
import RouteLoadingState from '@/components/routing/RouteLoadingState';

const GuideProfilePage = lazy(() => import('@/app/guides/[id]/page'));
const BookingChatPage = lazy(() => import('@/app/bookings/[bookingId]/chat/page'));
const LocalGuideDashboardPage = lazy(() => import('@/app/local-guide/dashboard/page'));
const PartnerDashboardPage = lazy(() => import('@/app/partner/dashboard/page'));
const AdminDashboardPage = lazy(() => import('@/app/admin/dashboard/page'));

function Router() {
  return (
    <Suspense fallback={<RouteLoadingState />}>
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
      <Route path="/book/:guideId" component={LegacyBookRedirect} />
      <Route path="/dashboard" component={LegacyDashboardRecovery} />
      <Route path="/local-guide" component={LocalGuideHubPage} />
      <Route path="/local-guide/register" component={LocalGuideRegisterPage} />
      <Route path="/local-guide/application-submitted" component={ApplicationSubmittedPage} />
      <Route path="/local-guide/dashboard" component={LocalGuideDashboardPage} />
      <Route path="/partner" component={PartnerEntryPage} />
      <Route path="/partner/dashboard" component={PartnerDashboardPage} />
      <Route path="/guide-dashboard" component={LegacyGuideDashboardRedirect} />
      <Route path="/match" component={LegacyMatchRedirect} />
      <Route path="/admin" component={AdminPage} />
      <Route path="/admin/dashboard" component={AdminDashboardPage} />
      <Route path="/signin" component={LegacySigninRecovery} />
      <Route path="/signup" component={LegacySignupRecovery} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
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

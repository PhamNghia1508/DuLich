import { Link, useLocation, useParams } from 'wouter';

import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import SupportChat from '@/components/home/SupportChat';
import PrototypeGuideProfile from '@/components/traveler/PrototypeGuideProfile';
import {
  getGuideRecommendation,
  getPrototypeGuideProfile,
} from '@/components/traveler/guideProfileData';
import { useTravelerPrototype } from '@/components/traveler/TravelerPrototypeContext';

import './profile.css';

export default function GuideProfilePage() {
  const { id = '' } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { recommendation, selectGuide } = useTravelerPrototype();
  const guide = getPrototypeGuideProfile(id);

  if (!guide) {
    return (
      <div className="traveler-profile-page">
        <Navbar variant="home" />
        <main className="traveler-profile-missing">
          <div className="traveler-profile-missing-mark" aria-hidden="true">FL</div>
          <h1>We couldn’t find this local guide.</h1>
          <p>The profile may no longer be available, or the link may be incomplete.</p>
          <Link href="/" className="btn btn-accent">Back to Home</Link>
        </main>
        <Footer variant="home" />
      </div>
    );
  }

  const recommendationReasons = getGuideRecommendation(recommendation, guide.id);
  const handleChoose = () => {
    selectGuide(guide.id);
    navigate(`/booking-handoff/${guide.id}`);
  };

  return (
    <div className="traveler-profile-page">
      <Navbar variant="home" />
      <main className="traveler-profile-container">
        <PrototypeGuideProfile
          guide={guide}
          recommendationReasons={recommendationReasons}
          onChoose={handleChoose}
        />
      </main>
      <Footer variant="home" />
      <SupportChat />
    </div>
  );
}

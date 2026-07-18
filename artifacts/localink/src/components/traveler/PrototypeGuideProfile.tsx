import RichGuideBookingCard from './rich-profile/RichGuideBookingCard';
import RichGuideHero from './rich-profile/RichGuideHero';
import RichGuideMedia from './rich-profile/RichGuideMedia';
import RichGuideOverview from './rich-profile/RichGuideOverview';
import RichGuideTrust from './rich-profile/RichGuideTrust';
import RichRelatedGuides from './rich-profile/RichRelatedGuides';

import type { RichGuideProfileViewModel } from './richGuideProfileData';

interface PrototypeGuideProfileProps {
  guide: RichGuideProfileViewModel;
  onChoose: () => void;
}

export default function PrototypeGuideProfile({ guide, onChoose }: PrototypeGuideProfileProps) {
  return (
    <>
      <RichGuideHero guide={guide} onChoose={onChoose} />
      <div className="rich-profile-commerce">
        <div className="rich-profile-content">
          <RichGuideOverview guide={guide} />
          <RichGuideMedia guide={guide} />
          <RichGuideTrust guide={guide} />
        </div>
        <aside className="rich-profile-sidebar" aria-label="Booking preview">
          <RichGuideBookingCard guide={guide} onChoose={onChoose} />
        </aside>
      </div>
      <RichRelatedGuides guide={guide} />
    </>
  );
}

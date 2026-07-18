import { useState } from 'react';

import type { PrototypeDurationHours } from './bookingPrototype';
import RichGuideAvailability from './rich-profile/RichGuideAvailability';
import RichGuideBookingCard from './rich-profile/RichGuideBookingCard';
import RichGuideHero from './rich-profile/RichGuideHero';
import RichGuideMedia from './rich-profile/RichGuideMedia';
import RichGuideOverview from './rich-profile/RichGuideOverview';
import RichGuideTrust from './rich-profile/RichGuideTrust';
import RichProfileNav from './rich-profile/RichProfileNav';
import RichRelatedGuides from './rich-profile/RichRelatedGuides';
import { changeProfileScheduleDate } from './richGuideProfileData';

import type {
  RichGuideProfileViewModel,
  RichProfileBookingDefaults,
  RichProfileScheduleSelection,
} from './richGuideProfileData';

interface PrototypeGuideProfileProps {
  guide: RichGuideProfileViewModel;
  onChoose: (defaults: RichProfileBookingDefaults) => void;
}

export default function PrototypeGuideProfile({ guide, onChoose }: PrototypeGuideProfileProps) {
  const firstDay = guide.availability.find((day) => day.status !== 'booked') ?? guide.availability[0];
  const [selection, setSelection] = useState<RichProfileScheduleSelection>({
    date: firstDay?.date ?? '',
    time: '',
  });
  const [durationHours, setDurationHours] = useState<PrototypeDurationHours>(3);
  const [groupSize, setGroupSize] = useState(2);
  const continueToBooking = () => onChoose({ ...selection, durationHours, groupSize });

  const scrollToAvailability = () => {
    const target = document.getElementById('availability');
    if (target) {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <RichGuideHero guide={guide} onChoose={continueToBooking} onCheckAvailability={scrollToAvailability} />
      <RichProfileNav />
      <div className="rich-profile-commerce">
        <div className="rich-profile-content">
          <RichGuideOverview guide={guide} />
          <RichGuideMedia guide={guide} />
          <RichGuideAvailability
            guide={guide}
            selection={selection}
            onDateChange={(date) => setSelection((current) => (
              changeProfileScheduleDate(guide.availability, date, current.time)
            ))}
            onTimeChange={(time) => setSelection((current) => ({ ...current, time }))}
          />
          <RichGuideTrust guide={guide} />
        </div>
        <aside className="rich-profile-sidebar" aria-label="Booking preview">
          <RichGuideBookingCard
            guide={guide}
            selection={selection}
            durationHours={durationHours}
            groupSize={groupSize}
            onDurationChange={setDurationHours}
            onGroupSizeChange={setGroupSize}
            onChoose={continueToBooking}
          />
        </aside>
      </div>
      <RichRelatedGuides guide={guide} />
    </>
  );
}

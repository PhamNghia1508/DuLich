import { createContext, useContext, useMemo, useState } from 'react';

import {
  DEMO_PARTNER,
  PARTNER_CAMPAIGNS,
  PARTNER_REFERRED_BOOKINGS,
  type DemoPartner,
} from './partnerPrototypeData';

interface PartnerPrototypeValue {
  selectedPartner: DemoPartner;
  referralCampaigns: typeof PARTNER_CAMPAIGNS;
  referredBookings: typeof PARTNER_REFERRED_BOOKINGS;
  generatedDemoLink: string;
  updateDemoProfile: (update: Pick<DemoPartner, 'contactDisplayName' | 'publicReferralLabel'>) => void;
}

const PartnerPrototypeContext = createContext<PartnerPrototypeValue | null>(null);

export function PartnerPrototypeProvider({ children }: { children: React.ReactNode }) {
  const [selectedPartner, setSelectedPartner] = useState<DemoPartner>({ ...DEMO_PARTNER });
  const value = useMemo<PartnerPrototypeValue>(() => ({
    selectedPartner,
    referralCampaigns: PARTNER_CAMPAIGNS,
    referredBookings: PARTNER_REFERRED_BOOKINGS,
    generatedDemoLink: `friendlocaltrip.com/r/${selectedPartner.referralCode}`,
    updateDemoProfile: (update) => setSelectedPartner((current) => ({ ...current, ...update })),
  }), [selectedPartner]);

  return <PartnerPrototypeContext.Provider value={value}>{children}</PartnerPrototypeContext.Provider>;
}

export function usePartnerPrototype() {
  const context = useContext(PartnerPrototypeContext);
  if (!context) throw new Error('usePartnerPrototype must be used within PartnerPrototypeProvider');
  return context;
}

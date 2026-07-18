import { createContext, useContext, useMemo, useState } from 'react';

import type { RequestGuideDraft } from '../home/requestGuideValidation';
import type { TravelerRecommendation } from './guideProfileData';

interface TravelerPrototypeValue {
  requestDraft: RequestGuideDraft | null;
  recommendation: TravelerRecommendation | null;
  selectedGuideId: string | null;
  submitRequest: (draft: RequestGuideDraft) => void;
  setRecommendation: (recommendation: TravelerRecommendation) => void;
  selectGuide: (guideId: string) => void;
  resetPrototype: () => void;
}

const TravelerPrototypeContext = createContext<TravelerPrototypeValue | null>(null);

export function TravelerPrototypeProvider({ children }: { children: React.ReactNode }) {
  const [requestDraft, setRequestDraft] = useState<RequestGuideDraft | null>(null);
  const [recommendation, setRecommendationState] = useState<TravelerRecommendation | null>(null);
  const [selectedGuideId, setSelectedGuideId] = useState<string | null>(null);

  const value = useMemo<TravelerPrototypeValue>(() => ({
    requestDraft,
    recommendation,
    selectedGuideId,
    submitRequest: (draft) => {
      setRequestDraft(draft);
      setRecommendationState(null);
      setSelectedGuideId(null);
    },
    setRecommendation: setRecommendationState,
    selectGuide: setSelectedGuideId,
    resetPrototype: () => {
      setRequestDraft(null);
      setRecommendationState(null);
      setSelectedGuideId(null);
    },
  }), [recommendation, requestDraft, selectedGuideId]);

  return (
    <TravelerPrototypeContext.Provider value={value}>
      {children}
    </TravelerPrototypeContext.Provider>
  );
}

export function useTravelerPrototype() {
  const context = useContext(TravelerPrototypeContext);
  if (!context) {
    throw new Error('useTravelerPrototype must be used within TravelerPrototypeProvider');
  }
  return context;
}

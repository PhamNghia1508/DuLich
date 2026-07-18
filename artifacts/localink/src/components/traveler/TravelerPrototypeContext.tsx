import { createContext, useContext, useMemo, useState } from 'react';

import type { RequestGuideDraft } from '../home/requestGuideValidation';
import type { TravelerRecommendation } from './guideProfileData';
import type {
  PrototypeBooking,
  PrototypeBookingDraft,
  PrototypePaymentMethod,
} from './bookingPrototype';

interface TravelerPrototypeValue {
  requestDraft: RequestGuideDraft | null;
  recommendation: TravelerRecommendation | null;
  selectedGuideId: string | null;
  bookingDraft: PrototypeBookingDraft | null;
  paymentMethod: PrototypePaymentMethod | null;
  confirmedBooking: PrototypeBooking | null;
  submitRequest: (draft: RequestGuideDraft) => void;
  setRecommendation: (recommendation: TravelerRecommendation) => void;
  selectGuide: (guideId: string) => void;
  saveBookingDraft: (draft: PrototypeBookingDraft) => void;
  setPaymentMethod: (method: PrototypePaymentMethod | null) => void;
  confirmBooking: (booking: PrototypeBooking) => void;
  resetPrototype: () => void;
}

const TravelerPrototypeContext = createContext<TravelerPrototypeValue | null>(null);

export function TravelerPrototypeProvider({ children }: { children: React.ReactNode }) {
  const [requestDraft, setRequestDraft] = useState<RequestGuideDraft | null>(null);
  const [recommendation, setRecommendationState] = useState<TravelerRecommendation | null>(null);
  const [selectedGuideId, setSelectedGuideId] = useState<string | null>(null);
  const [bookingDraft, setBookingDraft] = useState<PrototypeBookingDraft | null>(null);
  const [paymentMethod, setPaymentMethodState] = useState<PrototypePaymentMethod | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<PrototypeBooking | null>(null);

  const clearBookingFlow = () => {
    setBookingDraft(null);
    setPaymentMethodState(null);
    setConfirmedBooking(null);
  };

  const value = useMemo<TravelerPrototypeValue>(() => ({
    requestDraft,
    recommendation,
    selectedGuideId,
    bookingDraft,
    paymentMethod,
    confirmedBooking,
    submitRequest: (draft) => {
      setRequestDraft(draft);
      setRecommendationState(null);
      setSelectedGuideId(null);
      clearBookingFlow();
    },
    setRecommendation: setRecommendationState,
    selectGuide: (guideId) => {
      if (selectedGuideId !== guideId) clearBookingFlow();
      setSelectedGuideId(guideId);
    },
    saveBookingDraft: (draft) => {
      setBookingDraft(draft);
      setPaymentMethodState(null);
      setConfirmedBooking(null);
    },
    setPaymentMethod: setPaymentMethodState,
    confirmBooking: setConfirmedBooking,
    resetPrototype: () => {
      setRequestDraft(null);
      setRecommendationState(null);
      setSelectedGuideId(null);
      clearBookingFlow();
    },
  }), [
    bookingDraft,
    confirmedBooking,
    paymentMethod,
    recommendation,
    requestDraft,
    selectedGuideId,
  ]);

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

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

import type { RequestGuideDraft } from '../home/requestGuideValidation';
import type { TravelerRecommendation } from './guideProfileData';
import type {
  PrototypeBooking,
  PrototypeBookingDraft,
  PrototypePaymentMethod,
} from './bookingPrototype';
import type { PrototypeHistoryBooking } from './bookingHistoryData';
import type { PrototypeChatMessage } from './chatPrototypeData';
import type { PrototypeTravelerReview } from './reviewPrototypeData';
import {
  SEEDED_BOOKING_HISTORY,
  mergePrototypeBookingHistory,
  findBookingById,
} from './bookingHistoryData';
import { getSeededMessages, createChatMessage, createAutoReply } from './chatPrototypeData';
import { createPrototypeReview } from './reviewPrototypeData';
import type { PrototypeReviewDraft } from './reviewPrototypeData';

interface TravelerPrototypeValue {
  requestDraft: RequestGuideDraft | null;
  recommendation: TravelerRecommendation | null;
  selectedGuideId: string | null;
  bookingDraft: PrototypeBookingDraft | null;
  paymentMethod: PrototypePaymentMethod | null;
  confirmedBooking: PrototypeBooking | null;
  bookingHistory: PrototypeHistoryBooking[];
  chatMessagesByBookingId: Record<string, PrototypeChatMessage[]>;
  submittedReviewsByBookingId: Record<string, PrototypeTravelerReview>;
  submitRequest: (draft: RequestGuideDraft) => void;
  setRecommendation: (recommendation: TravelerRecommendation) => void;
  selectGuide: (guideId: string) => void;
  saveBookingDraft: (draft: PrototypeBookingDraft) => void;
  setPaymentMethod: (method: PrototypePaymentMethod | null) => void;
  confirmBooking: (booking: PrototypeBooking) => void;
  resetPrototype: () => void;
  getBookingById: (bookingId: string) => PrototypeHistoryBooking | undefined;
  getChatMessages: (bookingId: string, bookingDate: string) => PrototypeChatMessage[];
  appendChatMessage: (bookingId: string, text: string, guideName: string) => void;
  submitReview: (bookingId: string, guideId: string, draft: PrototypeReviewDraft) => void;
  getReview: (bookingId: string) => PrototypeTravelerReview | undefined;
}

const TravelerPrototypeContext = createContext<TravelerPrototypeValue | null>(null);

export function TravelerPrototypeProvider({ children }: { children: React.ReactNode }) {
  const [requestDraft, setRequestDraft] = useState<RequestGuideDraft | null>(null);
  const [recommendation, setRecommendationState] = useState<TravelerRecommendation | null>(null);
  const [selectedGuideId, setSelectedGuideId] = useState<string | null>(null);
  const [bookingDraft, setBookingDraft] = useState<PrototypeBookingDraft | null>(null);
  const [paymentMethod, setPaymentMethodState] = useState<PrototypePaymentMethod | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<PrototypeBooking | null>(null);
  const [liveChatMessages, setLiveChatMessages] = useState<Record<string, PrototypeChatMessage[]>>({});
  const [submittedReviews, setSubmittedReviews] = useState<Record<string, PrototypeTravelerReview>>({});

  const clearBookingFlow = () => {
    setBookingDraft(null);
    setPaymentMethodState(null);
    setConfirmedBooking(null);
  };

  const bookingHistory = useMemo(
    () => mergePrototypeBookingHistory(SEEDED_BOOKING_HISTORY, confirmedBooking),
    [confirmedBooking],
  );

  const getChatMessages = useCallback((bookingId: string, bookingDate: string): PrototypeChatMessage[] => {
    const seeded = getSeededMessages(bookingId, bookingDate);
    const live = liveChatMessages[bookingId] ?? [];
    return [...seeded, ...live];
  }, [liveChatMessages]);

  const appendChatMessage = useCallback((bookingId: string, text: string, guideName: string) => {
    setLiveChatMessages((prev) => {
      const travelerMsg = createChatMessage(bookingId, 'traveler', text);
      const guideReply = createAutoReply(bookingId, guideName, text);
      const existing = prev[bookingId] ?? [];
      return { ...prev, [bookingId]: [...existing, travelerMsg, guideReply] };
    });
  }, []);

  const submitReview = useCallback((bookingId: string, guideId: string, draft: PrototypeReviewDraft) => {
    const review = createPrototypeReview(bookingId, guideId, draft);
    setSubmittedReviews((prev) => ({ ...prev, [bookingId]: review }));
  }, []);

  const getBookingById = useCallback(
    (bookingId: string) => findBookingById(bookingHistory, bookingId),
    [bookingHistory],
  );

  const getReview = useCallback(
    (bookingId: string) => submittedReviews[bookingId],
    [submittedReviews],
  );

  const value = useMemo<TravelerPrototypeValue>(() => ({
    requestDraft,
    recommendation,
    selectedGuideId,
    bookingDraft,
    paymentMethod,
    confirmedBooking,
    bookingHistory,
    chatMessagesByBookingId: liveChatMessages,
    submittedReviewsByBookingId: submittedReviews,
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
    getBookingById,
    getChatMessages,
    appendChatMessage,
    submitReview,
    getReview,
  }), [
    bookingDraft,
    confirmedBooking,
    paymentMethod,
    recommendation,
    requestDraft,
    selectedGuideId,
    bookingHistory,
    liveChatMessages,
    submittedReviews,
    getBookingById,
    getChatMessages,
    appendChatMessage,
    submitReview,
    getReview,
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

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

import type { PrototypeGuideApplication } from './localGuideRegistrationData.ts';
import type { PrototypeGuideBooking, PrototypeGuideWeeklyAvailability } from './localGuideDashboardData.ts';
import {
  SEEDED_GUIDE_BOOKINGS,
  createDefaultGuideAvailability,
  acceptGuideBooking,
  declineGuideBooking,
  updateWeeklySchedule,
} from './localGuideDashboardData.ts';
import type { PrototypeGuideWeekday } from './localGuideRegistrationData.ts';

interface LocalGuidePrototypeValue {
  submittedApplication: PrototypeGuideApplication | null;
  guideBookings: PrototypeGuideBooking[];
  guideAvailability: PrototypeGuideWeeklyAvailability;
  guideMessages: Record<string, string[]>;
  submitApplication: (app: PrototypeGuideApplication) => void;
  acceptBooking: (bookingId: string) => void;
  declineBooking: (bookingId: string) => void;
  updateAvailabilityDay: (dayIndex: number, updates: Partial<PrototypeGuideWeekday>) => void;
  resetAvailability: () => void;
  sendGuideMessage: (bookingId: string, text: string) => void;
}

const LocalGuidePrototypeContext = createContext<LocalGuidePrototypeValue | null>(null);

export function LocalGuidePrototypeProvider({ children }: { children: React.ReactNode }) {
  const [submittedApplication, setSubmittedApplication] = useState<PrototypeGuideApplication | null>(null);
  const [guideBookings, setGuideBookings] = useState<PrototypeGuideBooking[]>([...SEEDED_GUIDE_BOOKINGS]);
  const [guideAvailability, setGuideAvailability] = useState<PrototypeGuideWeeklyAvailability>(createDefaultGuideAvailability());
  const [guideMessages, setGuideMessages] = useState<Record<string, string[]>>({});

  const submitApplication = useCallback((app: PrototypeGuideApplication) => {
    setSubmittedApplication(app);
  }, []);

  const acceptBooking = useCallback((bookingId: string) => {
    setGuideBookings((prev) => acceptGuideBooking(prev, bookingId));
  }, []);

  const declineBookingAction = useCallback((bookingId: string) => {
    setGuideBookings((prev) => declineGuideBooking(prev, bookingId));
  }, []);

  const updateAvailabilityDay = useCallback((dayIndex: number, updates: Partial<PrototypeGuideWeekday>) => {
    setGuideAvailability((prev: PrototypeGuideWeeklyAvailability) => updateWeeklySchedule(prev, dayIndex, updates));
  }, []);

  const resetAvailability = useCallback(() => {
    setGuideAvailability(createDefaultGuideAvailability());
  }, []);

  const sendGuideMessage = useCallback((bookingId: string, text: string) => {
    if (!text.trim()) return;
    setGuideMessages((prev) => ({
      ...prev,
      [bookingId]: [...(prev[bookingId] ?? []), text.trim()],
    }));
  }, []);

  const value = useMemo<LocalGuidePrototypeValue>(() => ({
    submittedApplication,
    guideBookings,
    guideAvailability,
    guideMessages,
    submitApplication,
    acceptBooking,
    declineBooking: declineBookingAction,
    updateAvailabilityDay,
    resetAvailability,
    sendGuideMessage,
  }), [
    submittedApplication,
    guideBookings,
    guideAvailability,
    guideMessages,
    submitApplication,
    acceptBooking,
    declineBookingAction,
    updateAvailabilityDay,
    resetAvailability,
    sendGuideMessage,
  ]);

  return (
    <LocalGuidePrototypeContext.Provider value={value}>
      {children}
    </LocalGuidePrototypeContext.Provider>
  );
}

export function useLocalGuidePrototype() {
  const context = useContext(LocalGuidePrototypeContext);
  if (!context) {
    throw new Error('useLocalGuidePrototype must be used within LocalGuidePrototypeProvider');
  }
  return context;
}

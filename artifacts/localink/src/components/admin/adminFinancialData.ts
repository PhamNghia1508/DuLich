import type { AdminBooking } from './adminPrototypeData.ts';

function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function calculateAdminFinancialSummary(bookings: readonly AdminBooking[]) {
  const reportable = bookings.filter((booking) => booking.status !== 'cancelled');
  const grossBookingValue = roundMoney(reportable.reduce((total, booking) => total + booking.total, 0));
  const travelerServiceFees = roundMoney(reportable.reduce((total, booking) => total + booking.travelerServiceFee, 0));
  const guidePlatformFees = roundMoney(reportable.reduce((total, booking) => total + booking.guidePlatformFee, 0));
  const partnerCommissionExpense = roundMoney(reportable
    .filter((booking) => booking.status === 'completed' && Boolean(booking.partnerSource))
    .reduce((total, booking) => total + booking.total * 0.05, 0));

  // Gross Booking Value is a reporting metric only and is deliberately not
  // included in platform revenue. This avoids double-counting booking value.
  const prototypePlatformRevenue = roundMoney(travelerServiceFees + guidePlatformFees - partnerCommissionExpense);

  return {
    grossBookingValue,
    travelerServiceFees,
    guidePlatformFees,
    partnerCommissionExpense,
    prototypePlatformRevenue,
    successfulPaymentCount: bookings.filter((booking) => booking.paymentStatus === 'successful-demo').length,
    failedPaymentCount: bookings.filter((booking) => booking.paymentStatus === 'failed-demo').length,
  };
}

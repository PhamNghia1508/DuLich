import { formatCurrency } from '@/lib/utils';

import type { PrototypePriceBreakdown } from './bookingPrototype';

interface BookingPriceSummaryProps {
  price: PrototypePriceBreakdown;
  actionLabel?: string;
  formId?: string;
}

export default function BookingPriceSummary({ price, actionLabel, formId }: BookingPriceSummaryProps) {
  const money = (value: number) => formatCurrency(value, price.currency);

  return (
    <section className="prototype-price-card" aria-labelledby="prototype-price-title">
      <h2 id="prototype-price-title">Price summary</h2>
      <dl>
        <div><dt>Guide rate</dt><dd>{money(price.hourlyRate)} / hour</dd></div>
        <div><dt>Duration</dt><dd>{price.durationHours} hours</dd></div>
        <div><dt>Subtotal</dt><dd>{money(price.subtotal)}</dd></div>
        <div><dt>Service fee (5%)</dt><dd>{money(price.serviceFee)}</dd></div>
        <div className="prototype-price-total"><dt>Total</dt><dd>{money(price.total)}</dd></div>
      </dl>
      {actionLabel && formId && (
        <button type="submit" form={formId} className="btn btn-accent prototype-primary-action">
          {actionLabel}
        </button>
      )}
      <p>No real charge is made in this prototype.</p>
    </section>
  );
}

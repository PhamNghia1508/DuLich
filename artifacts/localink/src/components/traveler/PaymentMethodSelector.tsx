import { CreditCard, HandCoins, WalletCards } from 'lucide-react';

import type { PrototypePaymentMethod } from './bookingPrototype';

interface PaymentMethodSelectorProps {
  value: PrototypePaymentMethod | null;
  error?: string;
  onChange: (method: PrototypePaymentMethod) => void;
}

const METHODS = [
  { value: 'card-demo', title: 'Card — Demo', description: 'No card details will be requested.', icon: CreditCard },
  { value: 'paypal-demo', title: 'PayPal — Demo', description: 'No account sign-in or redirect.', icon: WalletCards },
  { value: 'pay-later-demo', title: 'Pay at meeting — Prototype', description: 'An illustrative option for review.', icon: HandCoins },
] as const;

export default function PaymentMethodSelector({ value, error, onChange }: PaymentMethodSelectorProps) {
  return (
    <fieldset className="prototype-payment-methods" aria-describedby={error ? 'prototype-payment-method-error' : undefined}>
      <legend>Mock payment method <span aria-hidden="true">*</span></legend>
      <div>
        {METHODS.map(({ value: method, title, description, icon: Icon }) => (
          <label key={method}>
            <input type="radio" name="prototype-payment-method" value={method} checked={value === method} onChange={() => onChange(method)} />
            <span>
              <Icon size={20} aria-hidden="true" />
              <span><strong>{title}</strong><small>{description}</small></span>
              <span className="prototype-method-indicator" aria-hidden="true">{value === method ? 'Selected' : 'Choose'}</span>
            </span>
          </label>
        ))}
      </div>
      {error && <p id="prototype-payment-method-error" className="prototype-field-error" role="alert">{error}</p>}
    </fieldset>
  );
}

export function calculateFeeCents(subtotalCents: number, rateBps: number): number {
  return Math.round((subtotalCents * rateBps) / 10_000);
}

export function formatPrice(cents: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(cents / 100);
}

export function assertNonEmpty(value: string, message = 'Required') {
  if (!value || value.trim() === '') throw new Error(message);
  return value;
}



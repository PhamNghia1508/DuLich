export function shouldOpenRequestFromSearch(search: string): boolean {
  const normalizedSearch = search.startsWith('?') ? search.slice(1) : search;
  return new URLSearchParams(normalizedSearch).get('openRequest') === '1';
}

export type PrototypeSignalKey = 'openRequest' | 'demoAccountCreated' | 'demoSignedIn';

export function consumePrototypeSignals(
  search: string,
  keys: readonly PrototypeSignalKey[],
): { present: Set<PrototypeSignalKey>; remainingSearch: string } {
  const normalizedSearch = search.startsWith('?') ? search.slice(1) : search;
  const params = new URLSearchParams(normalizedSearch);
  const present = new Set<PrototypeSignalKey>();

  for (const key of keys) {
    if (params.get(key) === '1') present.add(key);
    if (params.has(key)) params.delete(key);
  }

  const remaining = params.toString();
  return { present, remainingSearch: remaining ? `?${remaining}` : '' };
}

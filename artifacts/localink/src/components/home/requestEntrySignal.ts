export function shouldOpenRequestFromSearch(search: string): boolean {
  const normalizedSearch = search.startsWith('?') ? search.slice(1) : search;
  return new URLSearchParams(normalizedSearch).get('openRequest') === '1';
}

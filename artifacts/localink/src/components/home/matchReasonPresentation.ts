function reasonPairs(reasons: readonly string[]) {
  const uniqueReasons = [...new Set(reasons)];

  if (uniqueReasons.length < 2) return [uniqueReasons];

  const pairs: string[][] = [];
  for (let first = 0; first < uniqueReasons.length - 1; first += 1) {
    for (let second = first + 1; second < uniqueReasons.length; second += 1) {
      pairs.push([uniqueReasons[first], uniqueReasons[second]]);
    }
  }

  return pairs;
}

export function selectVisibleMatchReasons(
  reasonSets: readonly (readonly string[])[],
): string[][] {
  const usedPairs = new Set<string>();

  return reasonSets.map((reasons) => {
    const candidates = reasonPairs(reasons);
    const selected =
      candidates.find((pair) => !usedPairs.has(pair.join('\u0000'))) ??
      candidates[0] ??
      [];

    if (selected.length > 0) usedPairs.add(selected.join('\u0000'));
    return selected;
  });
}

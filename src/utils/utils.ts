export const addInRing = (n: number, ringSize: number, add = 1): number => (n + add >= ringSize ? 0 : n + add);
export const subInRing = (n: number, ringSize: number, add = 1): number => (n - add <= 0 ? ringSize - 1 : n - add);

export const intRange = (length: number, startFrom = 0): number[] =>
  Array.from({ length }).map((_, i) => startFrom + i);

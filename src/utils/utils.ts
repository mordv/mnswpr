export const addInRing = (n: number, ringSize: number, add = 1): number => (n + add >= ringSize ? 0 : n + add);
export const subInRing = (n: number, ringSize: number, add = 1): number => (n - add < 0 ? ringSize - 1 : n - add);

export const intRange = (length: number, startFrom = 0): number[] =>
  Array.from({ length }).map((_, i) => startFrom + i);

export const randomInt = (min = 0, maxIncluded: number): number => {
  min = Math.ceil(min);
  maxIncluded = Math.floor(maxIncluded);
  return Math.floor(Math.random() * (maxIncluded - min + 1)) + min;
};

export const capitalize = (string: string): string => string.replace(/^\w/, (c) => c.toUpperCase());

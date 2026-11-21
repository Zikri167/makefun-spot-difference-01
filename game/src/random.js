// Seeded deterministic random helpers for Lantern Lane.
// Every scene uses one fixed seed, so the same picture renders on every load
// and no wall-clock value ever leaks into a drawing.

export function makeSeededRandom(seed) {
  let state = seed >>> 0;
  if (state === 0) state = 0x9e3779b9;
  return function nextRandom() {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function pickFrom(random, list) {
  return list[Math.floor(random() * list.length)];
}

export function rangeBetween(random, low, high) {
  return low + random() * (high - low);
}

export function wholeBetween(random, low, high) {
  return low + Math.floor(random() * (high - low + 1));
}

export function jitter(random, amount) {
  return (random() * 2 - 1) * amount;
}

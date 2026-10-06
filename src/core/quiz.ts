import type { Rng } from './daily';
import type { Cloud } from './types';

export function shuffle<T>(items: T[], rng: Rng = Math.random): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** True if either cloud lists the other as a look-alike, so the data only needs one direction. */
export function areLookalikes(a: Cloud, b: Cloud): boolean {
  return a.id !== b.id && (a.lookalikes.includes(b.id) || b.lookalikes.includes(a.id));
}

/** Everything `cloud` is commonly mistaken for, from `all`. */
export function lookalikesOf(cloud: Cloud, all: Cloud[]): Cloud[] {
  return all.filter((m) => areLookalikes(cloud, m));
}

/**
 * Multiple-choice options: the answer plus distractors drawn from its real look-alikes first,
 * from anywhere in `all` (chanterelle next to jack-o'-lantern is the lesson that matters), then
 * the same group in the user's deck (a contrail next to three main types is too easy), then
 * the rest of the deck, then anything.
 */
export function buildChoices(
  answer: Cloud,
  deck: Cloud[],
  all: Cloud[] = deck,
  count = 4,
  rng: Rng = Math.random,
): Cloud[] {
  const usable = (m: Cloud) => m.id !== answer.id && m.commonName !== answer.commonName;
  const lookalikes = shuffle(
    all.filter((m) => usable(m) && areLookalikes(answer, m)),
    rng,
  );
  const taken = new Set(lookalikes.map((m) => m.id));
  const fromDeck = deck.filter((m) => usable(m) && !taken.has(m.id));
  const sameCategory = shuffle(
    fromDeck.filter((m) => m.category === answer.category),
    rng,
  );
  const restOfDeck = shuffle(
    fromDeck.filter((m) => m.category !== answer.category),
    rng,
  );
  const inDeck = new Set(deck.map((m) => m.id));
  const anything = shuffle(
    all.filter((m) => usable(m) && !taken.has(m.id) && !inDeck.has(m.id)),
    rng,
  );
  const distractors = [...lookalikes, ...sameCategory, ...restOfDeck, ...anything].slice(0, count - 1);
  return shuffle([answer, ...distractors], rng);
}

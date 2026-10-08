import { sha256Hex } from './sha256';
import type { CloudCategory } from './types';

/**
 * CloudLock Plus lifts the free version's limits. Free: up to FREE_APP_LIMIT locked apps and the
 * ten main cloud types. Plus: unlimited apps and every cloud group. It's sold two ways through
 * Google Play (product ids below): a one-time purchase, or a monthly subscription that keeps Plus
 * while it's active.
 */
export const PLUS_PRODUCT_ID = 'cloudlock_plus';
export const PLUS_MONTHLY_ID = 'cloudlock_plus_monthly';

export type PlusPlan = 'lifetime' | 'monthly';

/** What Google Play reports this account owns (one-time products and active subscriptions). */
export interface OwnedPlusProduct {
  productId: string;
  state: 'purchased' | 'pending';
}

/**
 * How this account has Plus: the one-time purchase wins over a subscription, since it never
 * ends. "pending" while a payment hasn't gone through yet; "none" when Play lists neither.
 */
export function plusFromOwned(owned: OwnedPlusProduct[]): { status: 'owned' | 'pending' | 'none'; plan: PlusPlan | null } {
  const find = (id: string) => owned.find((p) => p.productId === id);
  for (const [id, plan] of [
    [PLUS_PRODUCT_ID, 'lifetime'],
    [PLUS_MONTHLY_ID, 'monthly'],
  ] as const) {
    if (find(id)?.state === 'purchased') return { status: 'owned', plan };
  }
  if (find(PLUS_PRODUCT_ID) || find(PLUS_MONTHLY_ID)) return { status: 'pending', plan: null };
  return { status: 'none', plan: null };
}
export const FREE_APP_LIMIT = 2;
export const FREE_CATEGORIES: CloudCategory[] = ['main'];

export function isPlusCategory(category: CloudCategory): boolean {
  return !FREE_CATEGORIES.includes(category);
}

/** The cloud groups the deck really uses: the chosen ones the user is entitled to, never none. */
export function deckCategories(chosen: CloudCategory[], plus: boolean): CloudCategory[] {
  if (plus) return chosen.length ? chosen : FREE_CATEGORIES;
  const allowed = chosen.filter((c) => !isPlusCategory(c));
  return allowed.length ? allowed : FREE_CATEGORIES;
}

export function canLockAnother(lockedCount: number, plus: boolean): boolean {
  return plus || lockedCount < FREE_APP_LIMIT;
}

/** Locked apps the user is entitled to; after a refund, the first ones stay locked. */
export function allowedLockedApps(locked: string[], plus: boolean): string[] {
  return plus ? locked : locked.slice(0, FREE_APP_LIMIT);
}

/**
 * Review codes unlock Plus on one phone without a purchase, so Google Play's reviewers (who
 * can't buy anything) can check every feature. Only SHA-256 hashes of the normalized codes
 * are kept here, never the codes; add a new hash to rotate a code that leaked.
 */
export const REVIEW_CODE_HASHES = ['f20c619a029a1cd607f51fb578fc0f05d4c20d055af0ab680bda471989322b22'];

/** "shroom-abcd efgh…" → "CLOUDABCDEFGH…": case, spaces and dashes don't matter. */
export function normalizeCode(input: string): string {
  return input.toUpperCase().replace(/[^A-Z0-9]/g, '');
}

export function isReviewCode(input: string, hashes: string[] = REVIEW_CODE_HASHES): boolean {
  const code = normalizeCode(input);
  return code.length >= 8 && hashes.includes(sha256Hex(code));
}

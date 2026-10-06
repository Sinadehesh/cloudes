/** How the deck is grouped: the ten main types first, then their species, then special clouds. */
export type CloudCategory = 'main' | 'species' | 'special';

/** What a cloud usually says about the weather. For learning only, not a forecast. */
export type Weather = 'fair' | 'change' | 'rain' | 'storm' | 'hazard';

/** How to recognise a cloud in the sky. */
export interface Clues {
  /** How high it usually forms. */
  height: string;
  /** Shape, texture and colour. */
  look: string;
  /** Water droplets, ice crystals or both. */
  madeOf: string;
  /** The weather it tends to bring. */
  weather: string;
  /** When and where it is most often seen. */
  when: string;
  /** The one feature that tells it apart from its look-alikes. */
  key: string;
}

export interface Cloud {
  id: string;
  commonName: string;
  /** The international (WMO) name, e.g. "Cumulus humilis". */
  scientificName: string;
  /** Where it sits in the classification, e.g. "Low cloud · genus Cumulus (Cu)". */
  family: string;
  category: CloudCategory;
  weather: Weather;
  /** Other names the cloud goes by (everyday and older names). */
  aliases: string[];
  /** Ids of clouds it is commonly mistaken for. Listing one side of a pair is enough. */
  lookalikes: string[];
  /** One-sentence micro-fact shown during the Genius Penalty. */
  fact: string;
}

/** Answer history for one cloud, keyed by cloud id. */
export interface CloudStats {
  seen: number;
  correct: number;
  wrong: number;
}

export type StatsMap = Record<string, CloudStats>;

/**
 * Where a cloud is in the review schedule (see daily.ts). It's introduced in a lesson on
 * `learnedOn`; each right answer on or after its due day moves it one `step` further out, and a
 * miss starts the schedule over from tomorrow.
 */
export interface LearnRecord {
  learnedOn: string;
  step: number;
  dueOn: string;
}

export type LearnMap = Record<string, LearnRecord>;

/** Days in a row with the lesson's exam done. */
export interface Streak {
  /** Last day the exam was done ("" if never). */
  last: string;
  count: number;
  best: number;
}

export interface Settings {
  /** New clouds introduced in each day's lesson. */
  cloudsPerDay: number;
  /** How long a correct answer unlocks the blocked app for. */
  unlockMinutes: number;
  penaltySeconds: number;
  /** Emergency bypasses per day, so a locked-out user doesn't uninstall. */
  emergencyUnlocksPerDay: number;
  categories: CloudCategory[];
  /** First-launch setup finished. */
  onboarded: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  cloudsPerDay: 3,
  unlockMinutes: 10,
  penaltySeconds: 10,
  emergencyUnlocksPerDay: 2,
  categories: ['main', 'species', 'special'],
  onboarded: false,
};

export const CLOUDS_PER_DAY_MIN = 1;
export const CLOUDS_PER_DAY_MAX = 10;

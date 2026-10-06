/**
 * The lock-screen intercept as a pure state machine, so the Genius Penalty
 * can't be bypassed by tapping fast: answers are ignored while frozen, and a
 * retry is refused until the penalty has fully elapsed.
 */
export type ChallengeState =
  | { phase: 'question'; cloudId: string; attempts: number }
  | { phase: 'penalty'; cloudId: string; attempts: number; endsAt: number; guess: string }
  | { phase: 'unlocked'; cloudId: string; attempts: number };

export type ChallengeEvent =
  | { type: 'answer'; correct: boolean; guess: string; now: number; penaltySeconds: number }
  | { type: 'retry'; now: number; nextCloudId: string };

export function startChallenge(cloudId: string): ChallengeState {
  return { phase: 'question', cloudId, attempts: 0 };
}

export function challengeReducer(state: ChallengeState, event: ChallengeEvent): ChallengeState {
  switch (event.type) {
    case 'answer': {
      if (state.phase !== 'question') return state;
      const attempts = state.attempts + 1;
      if (event.correct) return { phase: 'unlocked', cloudId: state.cloudId, attempts };
      return {
        phase: 'penalty',
        cloudId: state.cloudId,
        attempts,
        endsAt: event.now + event.penaltySeconds * 1000,
        guess: event.guess,
      };
    }
    case 'retry': {
      if (state.phase !== 'penalty' || event.now < state.endsAt) return state;
      return { phase: 'question', cloudId: event.nextCloudId, attempts: state.attempts };
    }
  }
}

export function penaltySecondsLeft(state: ChallengeState, now: number): number {
  if (state.phase !== 'penalty') return 0;
  return Math.max(0, Math.ceil((state.endsAt - now) / 1000));
}

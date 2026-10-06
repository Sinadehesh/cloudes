import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { blocker } from '../blocker';
import { WeatherBadge } from '../components/WeatherBadge';
import { CloudPhoto } from '../components/CloudPhoto';
import { Button } from '../components/ui';
import {
  challengeReducer,
  penaltySecondsLeft,
  startChallenge,
  type ChallengeEvent,
  type ChallengeState,
} from '../core/challenge';
import { dayKey, lockScreenPool, pickLockCloud } from '../core/daily';
import { areLookalikes, buildChoices } from '../core/quiz';
import type { Cloud } from '../core/types';
import { CLOUD_CLUES } from '../data/cloudClues';
import { CLOUDS, CLOUDS_BY_ID } from '../data/clouds';
import { correctToday, emergencyLeft, useDeck, useStore } from '../state/store';
import { serif, useColors } from '../theme';

const randomPhoto = () => Math.floor(Math.random() * 1_000_000);

function haptic(success: boolean) {
  if (Platform.OS === 'web') return;
  Haptics.notificationAsync(
    success ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error,
  ).catch(() => {});
}

/**
 * The lock-screen intercept. Opened by the native blocker as
 * `cloudlock://challenge?source=Instagram`, or from the home screen with
 * `?practice=1` for extra practice (no unlock, no emergency exit).
 * Questions come from today's exam: the clouds learned today and the ones due for review.
 */
export default function ChallengeScreen() {
  // `package` is set when the Android blocker opened this screen over a locked app.
  const {
    source,
    practice,
    package: lockedPackage,
  } = useLocalSearchParams<{ source?: string; practice?: string; package?: string }>();
  const isPractice = practice === '1';
  const { state: store, dispatch } = useStore();
  const deck = useDeck();
  const c = useColors();

  const [challenge, setChallenge] = useState<ChallengeState | null>(null);
  const [now, setNow] = useState(Date.now);
  const [emergencyUsed, setEmergencyUsed] = useState(false);
  // A fresh photo for every question, so users learn the cloud rather than one picture.
  const [photo, setPhoto] = useState(randomPhoto);

  const pickCloud = (excludeId?: string) => {
    const t = Date.now();
    const pool = lockScreenPool(deck, store.learn, dayKey(t), store.settings.cloudsPerDay);
    return pickLockCloud(pool, correctToday(store, t), Math.random, excludeId);
  };

  // Pick the first cloud only once saved progress has loaded, so the daily plan sees it.
  useEffect(() => {
    if (store.hydrated && !challenge && deck.length) setChallenge(startChallenge(pickCloud().id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.hydrated, challenge, deck]);

  // Tick the penalty countdown.
  useEffect(() => {
    if (challenge?.phase !== 'penalty') return;
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [challenge?.phase]);

  const cloud: Cloud | undefined = challenge ? CLOUDS_BY_ID[challenge.cloudId] : undefined;
  const choices = useMemo(
    () => (cloud ? buildChoices(cloud, deck, CLOUDS) : []),
    // Re-deal only when the cloud changes, not on every progress update.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cloud?.id],
  );

  if (!challenge || !cloud) {
    return <View style={[styles.screen, { backgroundColor: c.background }]} />;
  }

  const send = (event: ChallengeEvent) => setChallenge((s) => (s ? challengeReducer(s, event) : s));

  const answer = (guess: string, correct: boolean) => {
    if (challenge.phase !== 'question') return;
    const t = Date.now();
    dispatch({ type: 'answer', cloudId: cloud.id, correct, now: t });
    send({ type: 'answer', correct, guess, now: t, penaltySeconds: store.settings.penaltySeconds });
    setNow(t);
    haptic(correct);
    if (correct && !isPractice) blocker.grantTemporaryAccess(lockedPackage, store.settings.unlockMinutes);
  };

  // After a penalty, ask a different cloud: re-asking the same one would be a free guess.
  const retry = () => {
    setPhoto(randomPhoto());
    send({ type: 'retry', now: Date.now(), nextCloudId: pickCloud(cloud.id).id });
  };

  const nextCard = () => {
    setPhoto(randomPhoto());
    setChallenge(startChallenge(pickCloud(cloud.id).id));
  };

  const emergencyUnlock = () => {
    dispatch({ type: 'useEmergency', now: Date.now() });
    blocker.grantTemporaryAccess(lockedPackage, store.settings.unlockMinutes);
    setEmergencyUsed(true);
  };

  const leave = () => (router.canGoBack() ? router.back() : router.replace('/'));
  // Leaving a real lock: close the challenge, then open the unlocked app or go to the home screen.
  const continueToApp = () => {
    router.replace('/');
    if (lockedPackage) blocker.returnToApp(lockedPackage);
  };
  const skipApp = () => {
    router.replace('/');
    if (lockedPackage) blocker.goHome();
  };
  const secondsLeft = penaltySecondsLeft(challenge, now);
  // A wrong guess that was one of the cloud's real look-alikes gets a how-to-tell note.
  const guess = challenge.phase === 'penalty' ? challenge.guess : undefined;
  const guessed = CLOUDS.find((m) => m.commonName === guess);
  const lookalikeGuess = guessed && areLookalikes(cloud, guessed) ? guessed : undefined;
  const emergencies = emergencyLeft(store, now);
  const appName = source ?? 'your app';

  if (emergencyUsed) {
    return (
      <Result
        title="Emergency unlock"
        body={`${appName} is open for ${store.settings.unlockMinutes} minutes. ${emergencies} emergency unlock${emergencies === 1 ? '' : 's'} left today.`}
        primary={{ label: `Continue to ${appName}`, onPress: continueToApp }}
      />
    );
  }

  if (challenge.phase === 'unlocked') {
    return (
      <Result
        cloud={cloud}
        photo={photo}
        title={`Yes — ${cloud.commonName}!`}
        body={
          isPractice ? cloud.fact : `You earned ${store.settings.unlockMinutes} minutes of ${appName}. ${cloud.fact}`
        }
        primary={
          isPractice
            ? { label: 'Next card', onPress: nextCard }
            : { label: `Continue to ${appName}`, onPress: continueToApp }
        }
        secondary={isPractice ? { label: 'Done', onPress: leave } : undefined}
      />
    );
  }

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: c.background }]} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={[styles.kicker, { color: c.textMuted }]}>
            {isPractice ? 'Practice' : `${appName} is locked`}
          </Text>
          {isPractice && (
            <Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={leave} hitSlop={12}>
              <Text style={{ color: c.textMuted, fontSize: 22 }}>✕</Text>
            </Pressable>
          )}
        </View>

        <View style={[styles.photo, { backgroundColor: c.surfaceMuted }]}>
          <CloudPhoto cloud={cloud} photo={photo} showHint={challenge.phase === 'question'} />
          {challenge.phase === 'penalty' && (
            <View style={[StyleSheet.absoluteFill, styles.penaltyOverlay, { backgroundColor: c.overlay }]}>
              <Text style={styles.countdown} accessibilityLiveRegion="polite">
                {secondsLeft}
              </Text>
              <Text style={styles.countdownLabel}>{secondsLeft ? 'Take a good look' : 'Ready'}</Text>
            </View>
          )}
        </View>

        {challenge.phase === 'question' ? (
          <View style={styles.panel}>
            <Text style={[styles.prompt, { color: c.text, fontFamily: serif }]}>What is this cloud?</Text>
            <View style={styles.choices}>
              {choices.map((choice) => (
                <Button
                  key={choice.id}
                  variant="secondary"
                  label={choice.commonName}
                  onPress={() => answer(choice.commonName, choice.id === cloud.id)}
                />
              ))}
            </View>

            {!isPractice && (
              <View style={styles.escapes}>
                <Button variant="ghost" label={`I don't need ${appName} right now`} onPress={skipApp} />
                {emergencies > 0 && (
                  <Pressable accessibilityRole="button" onPress={emergencyUnlock} hitSlop={8}>
                    <Text style={[styles.emergency, { color: c.textMuted }]}>
                      Emergency unlock ({emergencies} left today)
                    </Text>
                  </Pressable>
                )}
              </View>
            )}
          </View>
        ) : (
          <View style={styles.panel}>
            <Text style={[styles.wrong, { color: c.danger }]}>
              Not quite{challenge.guess ? ` — not ${challenge.guess}` : ''}.
            </Text>
            <Text style={[styles.answerName, { color: c.text, fontFamily: serif }]}>{cloud.commonName}</Text>
            <Text style={[styles.sci, { color: c.textMuted, fontFamily: serif }]}>
              {cloud.scientificName} · {cloud.family}
            </Text>
            <WeatherBadge weather={cloud.weather} />
            {lookalikeGuess && (
              <View style={[styles.note, { borderColor: lookalikeGuess.weather === 'hazard' ? c.danger : c.warning }]}>
                <Text style={[styles.noteTitle, { color: c.text }]}>
                  {lookalikeGuess.weather === 'hazard' ? '⚠️ ' : ''}
                  {lookalikeGuess.commonName} is a real look-alike
                  {lookalikeGuess.weather === 'hazard' ? ', and it means dangerous weather' : ''}.
                </Text>
                <Text style={[styles.noteBody, { color: c.text }]}>How to tell: {CLOUD_CLUES[cloud.id]?.key}</Text>
              </View>
            )}
            <Text style={[styles.fact, { color: c.text }]}>{cloud.fact}</Text>
            <Button
              label={secondsLeft ? `Try again in ${secondsLeft}s` : 'Try another cloud'}
              disabled={secondsLeft > 0}
              onPress={retry}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Result({
  cloud,
  photo,
  title,
  body,
  primary,
  secondary,
}: {
  cloud?: Cloud;
  photo?: number;
  title: string;
  body: string;
  primary: { label: string; onPress: () => void };
  secondary?: { label: string; onPress: () => void };
}) {
  const c = useColors();
  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: c.background }]} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {cloud && (
          <View style={[styles.photo, { backgroundColor: c.surfaceMuted }]}>
            <CloudPhoto cloud={cloud} photo={photo} />
          </View>
        )}
        <View style={styles.panel}>
          <Text style={[styles.answerName, { color: c.success, fontFamily: serif }]}>{title}</Text>
          {cloud && <WeatherBadge weather={cloud.weather} />}
          {cloud && (
            <Text style={[styles.sci, { color: c.textMuted, fontFamily: serif }]}>
              {cloud.scientificName} · {cloud.family}
            </Text>
          )}
          <Text style={[styles.fact, { color: c.text }]}>{body}</Text>
          <Button label={primary.label} onPress={primary.onPress} />
          {secondary && <Button variant="ghost" label={secondary.label} onPress={secondary.onPress} />}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 32, maxWidth: 560, width: '100%', alignSelf: 'center', flexGrow: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  kicker: { fontSize: 14, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase' },
  photo: { width: '100%', aspectRatio: 1, maxHeight: 380, borderRadius: 24, overflow: 'hidden' },
  penaltyOverlay: { alignItems: 'center', justifyContent: 'center' },
  countdown: { color: '#fff', fontSize: 96, fontWeight: '800', fontVariant: ['tabular-nums'] },
  countdownLabel: { color: '#fff', fontSize: 16, fontWeight: '600', opacity: 0.9 },
  panel: { marginTop: 20, gap: 10 },
  prompt: { fontSize: 26, fontWeight: '700', marginBottom: 4 },
  choices: { gap: 10 },
  escapes: { marginTop: 8, alignItems: 'center', gap: 4 },
  emergency: { fontSize: 14, textDecorationLine: 'underline', paddingVertical: 6 },
  wrong: { fontSize: 16, fontWeight: '700' },
  answerName: { fontSize: 32, fontWeight: '700' },
  sci: { fontSize: 16, fontStyle: 'italic' },
  fact: { fontSize: 17, lineHeight: 25, marginVertical: 8 },
  note: { borderWidth: 1.5, borderRadius: 14, padding: 12, gap: 6 },
  noteTitle: { fontSize: 16, fontWeight: '700', lineHeight: 22 },
  noteBody: { fontSize: 16, lineHeight: 22 },
});

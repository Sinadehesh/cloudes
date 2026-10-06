import { Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { WeatherBadge } from '../../components/WeatherBadge';
import { CloudPhoto, PhotoCredit } from '../../components/CloudPhoto';
import { CluesList, Lookalikes, SafetyNote } from '../../components/CloudFacts';
import { Card, SectionTitle } from '../../components/ui';
import { MASTERED_STEP } from '../../core/daily';
import { lookalikesOf } from '../../core/quiz';
import { CLOUD_DETAILS } from '../../data/cloudDetails';
import { CLOUD_IMAGES } from '../../data/cloudImages.generated';
import { CLOUDS, CLOUDS_BY_ID } from '../../data/clouds';
import { useStore } from '../../state/store';
import { CATEGORY_LABEL, serif, useColors } from '../../theme';

export default function CloudDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const cloud = CLOUDS_BY_ID[id];
  const c = useColors();
  const { state } = useStore();
  const [photo, setPhoto] = useState(0);

  if (!cloud) return <Text style={{ padding: 16, color: c.text }}>Unknown cloud.</Text>;

  const record = state.learn[cloud.id];
  const stats = state.stats[cloud.id];
  const photoCount = CLOUD_IMAGES[cloud.id]?.length ?? 0;
  const lookalikes = lookalikesOf(cloud, CLOUDS);
  const details = CLOUD_DETAILS[cloud.id];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen options={{ title: cloud.commonName }} />
      <View style={[styles.photo, { backgroundColor: c.surfaceMuted }]}>
        <CloudPhoto cloud={cloud} photo={photo} />
      </View>
      <PhotoCredit cloud={cloud} photo={photo} />
      {photoCount > 1 && (
        <View style={styles.thumbs}>
          {Array.from({ length: photoCount }, (_, i) => (
            <Pressable
              key={i}
              accessibilityRole="button"
              accessibilityLabel={`Photo ${i + 1} of ${photoCount}`}
              accessibilityState={{ selected: i === photo }}
              onPress={() => setPhoto(i)}
              style={[styles.thumb, { borderColor: i === photo ? c.primary : 'transparent' }]}
            >
              <CloudPhoto cloud={cloud} photo={i} compact />
            </Pressable>
          ))}
        </View>
      )}

      <Text style={[styles.name, { color: c.text, fontFamily: serif }]}>{cloud.commonName}</Text>
      <Text style={[styles.sci, { color: c.textMuted, fontFamily: serif }]}>{cloud.scientificName}</Text>
      <View style={{ marginTop: 10 }}>
        <WeatherBadge weather={cloud.weather} />
      </View>

      <Card style={{ marginTop: 16 }}>
        <Text style={[styles.fact, { color: c.text }]}>{cloud.fact}</Text>
      </Card>

      <SectionTitle>How to recognise it</SectionTitle>
      <CluesList cloud={cloud} />

      {details && (
        <>
          <SectionTitle>About</SectionTitle>
          <Paragraph>{details.about}</Paragraph>

          <SectionTitle>Where and when to see it</SectionTitle>
          <Paragraph>{details.where}</Paragraph>

          {details.lore && (
            <>
              <SectionTitle>Lore</SectionTitle>
              <Paragraph>{details.lore}</Paragraph>
            </>
          )}

          {details.saying && (
            <>
              <SectionTitle>Weather saying</SectionTitle>
              <Paragraph>{`“${details.saying}”`}</Paragraph>
            </>
          )}
        </>
      )}

      <SectionTitle>Details</SectionTitle>
      <Detail label="Family" value={cloud.family} />
      <Detail label="Group" value={CATEGORY_LABEL[cloud.category]} />
      {cloud.aliases.length > 0 && <Detail label="Also called" value={cloud.aliases.join(', ')} />}

      {lookalikes.length > 0 && (
        <>
          <SectionTitle>Often confused with</SectionTitle>
          <Lookalikes cloud={cloud} />
        </>
      )}

      <SectionTitle>Your record</SectionTitle>
      {record ? (
        <>
          <Detail label="Collected" value={formatDay(record.learnedOn)} />
          <Detail label="Reviews passed" value={`${Math.min(record.step, MASTERED_STEP)} of ${MASTERED_STEP}`} />
          <Detail label="Next review" value={record.step >= MASTERED_STEP ? 'Mastered' : formatDay(record.dueOn)} />
          {stats && <Detail label="Right answers" value={`${stats.correct} of ${stats.seen}`} />}
        </>
      ) : (
        <Text style={{ color: c.textMuted }}>Not in your collection yet: it comes up in a daily lesson.</Text>
      )}

      <SafetyNote />
    </ScrollView>
  );
}

function formatDay(day: string): string {
  const [y, m, d] = day.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

function Paragraph({ children }: { children: string }) {
  const c = useColors();
  return <Text style={[styles.paragraph, { color: c.text }]}>{children}</Text>;
}

function Detail({ label, value }: { label: string; value: string }) {
  const c = useColors();
  return (
    <View style={[styles.detail, { borderColor: c.border }]}>
      <Text style={{ color: c.textMuted, fontSize: 15 }}>{label}</Text>
      <Text style={{ color: c.text, fontSize: 15, flexShrink: 1, textAlign: 'right' }}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 48, maxWidth: 640, width: '100%', alignSelf: 'center' },
  photo: { width: '100%', aspectRatio: 4 / 3, borderRadius: 20, overflow: 'hidden' },
  thumbs: { flexDirection: 'row', gap: 8, marginTop: 10 },
  thumb: { width: 60, height: 60, borderRadius: 10, overflow: 'hidden', borderWidth: 2 },
  name: { fontSize: 32, fontWeight: '700', marginTop: 16 },
  sci: { fontSize: 18, fontStyle: 'italic' },
  fact: { fontSize: 17, lineHeight: 25 },
  paragraph: { fontSize: 16, lineHeight: 24 },
  detail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

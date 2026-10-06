# CloudLock

An app blocker that teaches you to read the sky. It's the third sibling of
[FloraLock](https://github.com/sinadehesh/flora) (plants) and [ShroomLock](https://github.com/sinadehesh/mushroom)
(mushrooms), built from the same code.

You choose the apps that eat your time and how many clouds you want to learn a day. Each day's lesson shows each new
cloud once (photos, field clues, the weather it brings and the clouds it's mistaken for), then a short
multiple-choice exam. When you open a locked app, CloudLock shows a photo of one of your clouds with four names, and
the wrong names are its real look-alikes first.

- **Correct:** the app unlocks for your chosen window (default 10 minutes).
- **Wrong (the Genius Penalty):** the screen freezes for 10 seconds and shows the right name, its weather and a
  fact. If you picked a real look-alike, it says so and shows how to tell them apart.
- **Escape hatches, so people don't uninstall:** "I don't need Instagram right now" (the best outcome), plus a few
  emergency unlocks per day (configurable, default 2).

Everything runs offline; nothing leaves the phone ([privacy policy](PRIVACY.md)).

> **Safety:** CloudLock is for learning, not forecasting. In stormy weather, follow your local weather service and
> take shelter. Never stay outside to watch a funnel, wall or shelf cloud.

## The deck

36 clouds from the WMO International Cloud Atlas, in three groups (choose them in Settings):

- **The 10 main types (free):** cumulus, stratocumulus, stratus, nimbostratus, altostratus, altocumulus, cirrus,
  cirrocumulus, cirrostratus and cumulonimbus.
- **Species & varieties:** fair-weather, medium, towering and ragged cumulus; mares' tails and dense cirrus;
  lenticular, turreted and tufted altocumulus; bald cumulonimbus and the anvil.
- **Special & rare:** mammatus, shelf, roll, wall and funnel clouds, cap clouds, virga, fallstreak holes, wave
  clouds, asperitas, contrails, fire clouds, noctilucent and mother-of-pearl clouds, and fog.

Each cloud has a weather meaning (fair weather, weather may change, rain or snow, thunderstorms, dangerous weather),
field clues (height, look, what it's made of, the weather it brings, when it's seen, and the one feature that gives
it away) and look-alikes, such as altocumulus vs. cirrocumulus vs. stratocumulus (the classic "finger, thumb or fist
at arm's length" test). Its page in the collection adds what it is, where and when to see it, its lore and name,
and the old weather saying that goes with it (`src/data/cloudDetails.ts`), like FloraLock's plant pages.

## Learning model

Pure rules in `src/core/`, covered by `npm test`:

- **Lesson** (`daily.ts`): each day brings the next _n_ clouds you haven't met (1–10).
- **Spaced reviews** (`daily.ts`): after 1, 3, 7, 14 and 30 days; a miss starts it over from tomorrow; then it's
  mastered. A day's exam asks at most 15 reviews, the most overdue first.
- **Look-alikes** (`quiz.ts`): wrong choices are a cloud's real look-alikes first, then the same group.
- **Progress** (`progress.ts`, `stats.ts`): a daily streak, collected and mastered counts, milestones, and Sky IQ
  from 60 to 160.

## Run it

```bash
npm install
npx expo start         # press a / i / w for Android, iOS or web
npm test               # core logic tests (vitest)
npm run typecheck
```

The lock is native code (`modules/app-blocker`), so it doesn't run in Expo Go. On iOS and the web, **Preview the
lock screen** on the Today tab shows the challenge instead.

## Android builds

Every push to `main` or a `claude/**` branch runs [.github/workflows/main.yml](.github/workflows/main.yml): a
signed, R8-optimized AAB for the Play Store (`cloudlock-aab`) and emulator tests on Android 8, 10, 13 and 15
([e2e/lock.yaml](e2e/lock.yaml) and [e2e/update.yaml](e2e/update.yaml)). Signing needs the
`ANDROID_KEYSTORE_BASE64` and `ANDROID_KEYSTORE_PASSWORD` secrets (see [docs/PLAY_STORE.md](docs/PLAY_STORE.md)).
[.github/workflows/fgs-video.yml](.github/workflows/fgs-video.yml) records the foreground service demo video Play
Console asks for.

## Photos

Wikimedia Commons and iNaturalist don't work here (Commons rate-limits cloud machines; iNaturalist is for living
things), so the photos come from **Flickr** through [Openverse](https://openverse.org), an open index of Creative
Commons images. Only **CC0, Public Domain Mark, CC BY and CC BY-SA** photos are used, each checked by eye and
credited on the Photo credits screen and in every store image.

```bash
npm run photos:find -- lenticular "lenticular cloud"   # candidates from Openverse, with links
# paste the ones you like into scripts/cloud-photos.json
npm run photos:download                                # downloads from Flickr, resizes to 1000px
npm run icons                                          # app icons and the store icon
npm run store-art                                      # the Play Store feature graphic
```

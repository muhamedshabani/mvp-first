# Playbook: mobile app (iOS / Android)

First, sanity-check the target. If the demo is really just "an app-shaped UI" and doesn't need
device hardware or the native feel, build it as a **web app** ([web.md](web.md)) and show it in a
phone-sized browser — it's faster to share and iterate. Use this playbook when "it's a real
mobile app" is the point, or you need both iOS and Android from one codebase.

## Stack (don't deliberate)

Expo (React Native, TypeScript). One codebase → iOS + Android, and it publishes a link/QR anyone
can open in the free **Expo Go** app — no App Store, no signing, no build queue.

## Scaffold

```bash
npx create-expo-app@latest DEMO_NAME
cd DEMO_NAME
npx expo start          # press i (iOS sim), a (Android emulator), or scan the QR in Expo Go
```

The default template ships file-based routing (`expo-router`) and a working tab layout — build
your screens inside `app/`. Drop [../assets/mockdata.ts](../assets/mockdata.ts) into the project
and import it; it's plain TS and runs fine in React Native.

## Make it look real

- Use plain React Native components + `StyleSheet`. For a faster "designed" look, add a UI kit:
  `npx expo install react-native-paper`. Don't hand-craft a design system.
- Avatars from `mockdata` (pravatar URLs) render in `<Image>` with an explicit `width`/`height`.
- Fill lists with `FlatList` over 10–20 `mockdata` rows so screens look alive.

## Share it → a link the audience can open (required)

```bash
npm i -g eas-cli
eas update --auto        # publishes an over-the-air link; opens in Expo Go via link or QR
```

or, for a plain URL that opens in any browser with no app install:

```bash
npx expo export -p web   # produces a static web build in dist/ …
npx netlify deploy --prod --dir dist   # …deploy it like any static site
```

Prefer the web export when the audience won't have Expo Go installed — a URL is the lowest-friction
way to demo. Skip real TestFlight/Play builds entirely; they need accounts, signing, and review.

## Traps that waste time (skip them)

- **Native modules / custom native code.** Stay inside Expo Go's included APIs. If a library needs
  a custom native build, fake that feature instead.
- **Push notifications, real auth, in-app purchases.** Fake with a local toast / an always-succeeds
  screen / a "Purchased!" state.
- **Camera/sensors.** Accept the tap, show a hardcoded result.
- **App Store / Play Store submission, icons, splash polish.** None of it shows in the demo.

## Hand off

Give the user the Expo Go link + QR (or the deployed web URL) and a short script of what to tap.
Note they'll need Expo Go installed if you went the `eas update` route.

# Playbook: desktop app

Read this decision first — it saves the most time:

> **Does the demo actually need to be a native window?** Usually no. A web app styled to look
> like a desktop app (chrome-less layout, sidebar, menus, a title bar) demos just as well, ships
> as a URL, and skips all the native-build pain. Default to that — build it with [web.md](web.md)
> and give it a desktop-y layout.

Only use a real native toolchain when *native-ness itself* is the point: OS menus/tray, local
file-system access, offline-first, a system the client will literally install.

## If it must be native: Tauri (lighter than Electron)

```bash
npm create tauri-app@latest        # pick the web frontend you know; Tauri wraps it in a native shell
cd DEMO_NAME
npm install
npm run tauri dev                  # live native window while you build
```

Tauri uses the OS webview, so your UI is still web (React/Vanilla/etc.) — reuse everything from
[web.md](web.md) and [../assets/mockdata.ts](../assets/mockdata.ts). Electron works too but ships a
whole Chromium; only reach for it if the user specifically wants it.

## Share it → because a desktop app isn't a URL

A native build can't be texted as a link, so produce **both** so there's always something to show:

```bash
npm run tauri build     # produces an installable bundle in src-tauri/target/release/bundle/
```

1. The installable artifact (hand the path to the user), **and**
2. A 30–60s screen recording of the happy path — this is what actually travels in an email or a
   deck when the client can't install anything.

If you can get away with the web version, do that instead and just hand over a URL.

## Traps that waste time (skip them)

- **Code signing & notarization.** The single biggest desktop time sink. Ship unsigned; the user
  clicks through the "unidentified developer" warning for a demo. Never set up certificates.
- **Auto-update, installers, multi-OS builds.** Build for the presenter's OS only.
- **Native menus/tray/shortcuts** beyond the one or two the demo shows.
- **File-system/DB persistence.** Use in-memory state or `mockdata` like everywhere else.

## Hand off

Give the user the build path **and** the recording, plus a short script. Lead with "this is a
prototype build, it's unsigned, click through the warning."

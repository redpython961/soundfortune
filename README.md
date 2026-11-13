# Sound Fortune Productions — Website

A premium, single-page website for **Sound Fortune Productions**, the independent creative studio of composer and music producer **Ziad Mahjoub** (Music · Sound · Moving Images).

This is a full redesign of <https://www.soundfortuneproductions.com/>. It keeps the original content, artwork, music projects and videos and presents them in a dark, futuristic, purple design system.

- **Pure static site**: HTML5 + CSS3 + vanilla JavaScript. No build step, no backend, no database, no frameworks.
- **GitHub Pages ready**: all local paths are relative, so it works at a user page (`username.github.io`) or a project page (`username.github.io/repo-name/`).

---

## Sections

| # | Section | What's in it |
|---|---------|--------------|
| — | **Hero** | Headline "Where sound meets vision", studio photo with animated purple aurora, original gold logo banner, scroll indicator |
| 01 | **Visual Work** | *Action Figure Alpha I*: poster, description, full credits, video gallery (Trailer, Full Sequence, Visual Clip) in a lightbox, key-art still |
| 02 | **Music** | Syntric (*Purple Nights*), X-61 (*Parallel Voices*), Daisy Blue (*The Blue Note*), Ziad Mahjoub (*Lotus*), each with its original artwork and a custom audio player |
| 03 | **Services** | Audio Post-Production · Film Scoring & Original Music · Podcast Production · Cinematic Video & Visual Editing |
| 04 | **About** | Ziad Mahjoub biography, roles, focus areas, studio imagery |
| 05 | **Contact** | "Let's create something extraordinary", email button, copy-to-clipboard email |
| — | **Footer** | © 2026 Sound Fortune Productions. All Rights Reserved. Back to top |

### Features
- Sticky, transparent navigation that darkens on scroll, with active-section highlighting and a full-screen mobile menu
- Custom audio players with play/pause, an animated waveform-style progress bar (click or drag to seek, arrow keys supported), current time and duration, volume and mute, and an equalizer animation. Only one track plays at a time and nothing autoplays.
- Video lightbox using YouTube's privacy-enhanced (`youtube-nocookie.com`) player. It loads only when clicked and pauses any playing music.
- Scroll reveal, subtle parallax, card spotlight hover and poster tilt. All animation is turned off under `prefers-reduced-motion`.
- SEO meta, Open Graph/Twitter cards, JSON-LD, favicon/apple-touch icon, semantic landmarks, skip link, focus states and ARIA labels
- Lazy-loaded images. The SoundCloud engine loads only when the visitor nears the Music section.

---

## Folder structure

```
sound-fortune-productions/
├── index.html
├── README.md
├── css/
│   └── style.css
├── js/
│   └── main.js
├── assets/
│   ├── images/          ← original site artwork (descriptive filenames)
│   ├── videos/          ← video poster frames (optimized) + originals/ (full-quality source)
│   ├── audio/           ← README.txt (audio streams from SoundCloud, see below)
│   ├── fonts/           ← Sora, Space Grotesk, Orbitron (self-hosted, SIL OFL)
│   └── icons/           ← favicon.png, apple-touch-icon.png
└── tools/
    ├── asset-manifest.txt          ← original URL → local filename map
    ├── fetch-original-assets.sh    ← re-download originals (macOS/Linux)
    └── fetch-original-assets.ps1   ← re-download originals (Windows)
```

---

## Asset information

All imagery was downloaded from the original website at its highest available resolution and renamed descriptively:

| Local file | Original source | Size |
|---|---|---|
| `assets/images/sound-fortune-logo-banner.jpg` | `assets/images/image05.jpg` | 2160×720 |
| `assets/images/studio-hero.jpg` | `assets/images/image02.jpg` | 1600×901 |
| `assets/images/action-figure-alpha-poster.jpg` | `assets/images/image01.jpg` | 1254×1254 |
| `assets/images/action-figure-alpha-key-art.jpg` | `assets/images/gallery01/912f84ae_original.jpg` | 1254×755 |
| `assets/images/action-figure-alpha-character.jpg` | `assets/images/gallery01/fbeaf5b9.jpg` | 752×752 |
| `assets/images/syntric-purple-nights.jpg` | `assets/images/image04.jpg` | 915×851 |
| `assets/images/x-61-parallel-voices.jpg` | `assets/images/image07.jpg` | 915×915 |
| `assets/images/daisy-blue-the-blue-note.jpg` | `assets/images/image08.jpg` | 915×915 |
| `assets/images/ziad-mahjoub-lotus.jpg` | `assets/images/image09.jpg` | 915×915 |
| `assets/images/sound-fortune-emblem.jpg` | `assets/images/image06.jpg` | 600×600 |
| `assets/images/og-share.jpg` | `assets/images/share.jpg` | 1200×1200 |
| `assets/videos/action-figure-alpha-trailer-poster.jpg` | `assets/videos/video01_thumbnail.jpg` | 1672×941 (optimized; original in `originals/`) |
| `assets/videos/action-figure-alpha-full-sequence-poster.jpg` | `assets/videos/video02_thumbnail.jpg` | 1280×720 (optimized; original in `originals/`) |
| `assets/icons/favicon.png` | `assets/images/favicon.png` | 64×64 |
| `assets/icons/apple-touch-icon.png` | `assets/images/apple-touch-icon.png` | 228×228 |

The two video posters were 2.0 MB and 1.1 MB, so the page uses high-quality optimized copies (472 KB and 317 KB). The untouched originals are kept in `assets/videos/originals/`.

**Fonts:** Sora, Space Grotesk and Orbitron come from the Fontsource npm packages and are self-hosted in `assets/fonts/` under the SIL Open Font License (`OFL-LICENSE.txt`). No Google Fonts request is made.

---

## Third-party media dependencies that remain

The original website didn't host its audio or video files. It embedded them from SoundCloud and YouTube, and neither platform offers these files as downloads. To stay within those platforms' terms, the redesign streams them the same way:

| Media | Service | How it's used |
|---|---|---|
| Syntric – *Purple Nights* (track 2434443189) | SoundCloud | Played through the official [SoundCloud Widget API](https://developers.soundcloud.com/docs/api/html5-widget) behind the custom player |
| X-61 – *Parallel Voices* (2434407444) | SoundCloud | same |
| Daisy Blue – *The Blue Note* (2434404258) | SoundCloud | same |
| Ziad Mahjoub – *Lotus* (2434404255) | SoundCloud | same |
| Action Figure Alpha I – Trailer (`hvyGp6KXUqI`) | YouTube | Privacy-enhanced embed in the lightbox |
| Action Figure Alpha I – Full Sequence (`NbtfHszOKrI`) | YouTube | same |
| Action Figure Alpha I – Visual Clip (`rKe8yPPwskI`) | YouTube | same (linked from the original site's gallery) |

These are the only external requests. They're loaded on demand, and everything else (images, fonts, CSS, JS) is local.

**Mobile note:** some mobile browsers block audio started from inside an embedded player. If a track hasn't started within a few seconds of pressing play, the site reveals the official SoundCloud player under the custom one so the visitor can start it with one tap.

### Switching to local audio files (optional)
If you have the MP3 masters and want to self-host:
1. Put them in `assets/audio/`, for example `syntric-purple-nights.mp3`.
2. In `js/main.js`, swap the SoundCloud widget calls in the `Player` prototype for an `HTMLAudioElement`: `new Audio('assets/audio/…')`, then `play()`, `pause()`, `currentTime`, `duration` and `volume`. The UI, waveform, one-at-a-time logic and controls stay the same. Ask your developer, or ask Claude, to make this change.

---

## Run locally

Some browsers block fonts when a page is opened straight from disk (`file://`), so use a tiny local server:

```bash
cd sound-fortune-productions
python3 -m http.server 8000
# then open http://localhost:8000
```

Alternatives: `npx serve .`, or VS Code's **Live Server** extension.

---

## Deploy to GitHub Pages

1. Create a new repository on GitHub, for example `sound-fortune-productions`.
2. Upload the **contents** of this folder to the repository root, so that `index.html` sits at the top level. Either:
   - drag and drop the files on GitHub (**Add file → Upload files**), or
   - use git:
     ```bash
     cd sound-fortune-productions
     git init
     git add .
     git commit -m "Sound Fortune Productions website"
     git branch -M main
     git remote add origin https://github.com/<your-username>/sound-fortune-productions.git
     git push -u origin main
     ```
3. In the repository, go to **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, then select **main** and **/ (root)**, and click **Save**.
4. After a minute or two the site is live at `https://<your-username>.github.io/sound-fortune-productions/`.

**Custom domain (optional):** in **Settings → Pages → Custom domain**, enter `www.soundfortuneproductions.com`. Then add a `CNAME` DNS record pointing `www` to `<your-username>.github.io` at your domain registrar, and tick **Enforce HTTPS** once it's available. After switching the domain, set the absolute URL of `og:image` in `index.html` (for example `https://www.soundfortuneproductions.com/assets/images/og-share.jpg`) so social previews pick up the image.

---

## Editing content

- **Text:** all copy is in `index.html` and organized by section with clear comments.
- **Colors:** the CSS variables at the top of `css/style.css` (`--bg`, `--accent`, and so on).
- **Swap a SoundCloud track:** change `data-track` on the matching `.player` element in `index.html`.
- **Swap a video:** change `data-video` (the YouTube video ID) on the matching `.reel` button.
- **Re-download original images:** run `bash tools/fetch-original-assets.sh` (macOS/Linux) or `powershell -ExecutionPolicy Bypass -File tools\fetch-original-assets.ps1` (Windows).

© 2026 Sound Fortune Productions. All Rights Reserved.

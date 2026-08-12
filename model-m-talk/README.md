# Model M MIDI Talk

An anime-inspired Reveal.js deck for **“That Time We Turned an IBM Model M into a MIDI Instrument to Meet Mark Rober.”** The primary 58-slide cut follows the lived discovery story before opening up the technical system. It uses a fixed 1600 × 900 canvas, runs without a build step, and includes speaker notes on every slide.

## Run locally

From the repository root, enter the deck folder, then compile and run the included dependency-free Rust server:

```bash
cd model-m-talk
mkdir -p target
rustc server.rs -o target/model-m-talk-server
./target/model-m-talk-server
```

Open <http://127.0.0.1:8000>. Pass another port as the first argument if needed, for example `./target/model-m-talk-server 8080`. Reveal.js is loaded from jsDelivr, so the first run needs internet access. A browser that has already cached those files can run the deck offline.

Pages hot-reload: the server injects a small poller into every page shell (root pages and each slide group's `index.html`) that watches the deck folder for edits and reloads the tab automatically. No extra setup or build step required — just edit a slide and save.

Three entry points are available:

- `/` — the primary discovery-led cut: research → false hope → acceptance → build
- `/technical.html` — the 60-slide technical-first cut
- `/discovery.html` — a direct alias for the primary discovery-led sequence
- `/keyboard-keyboard/` — a standalone cut with its own slide fragments and manifest
- `/compare.html` — both cuts side by side, with links to open either one full-size

## Controls

- `←` / `→` or Space: previous / next slide
- `S`: speaker view and notes
- `F`: fullscreen
- `O`: overview
- `D`: jump directly to the live demo screen
- `Esc`: leave fullscreen or enter overview

## Editing

- Individual slide markup and notes: `slides/*.html`
- Discovery-cut slide markup and notes: `slides-discovery/*.html`
- keyboard-keyboard cut markup, notes, and page shell: `keyboard-keyboard/`. Its `slide-manifest.js` is generated, not hand-edited: add or remove a numbered `NN-slug.html` fragment and the order updates itself — the dev server (`server.rs`) generates it live for any `<folder>/slide-manifest.js` request, and `tools/generate-manifest.sh <folder>` regenerates the static copy used by the production build (wired into the deploy workflow).
- Slide order: `slide-manifest.js`
- Discovery-cut order: `slide-manifest-discovery.js`
- Slide loading/bootstrap: `slide-loader.js`
- Page shell and Reveal dependencies: `index.html`
- Visual system and reusable layouts: `styles.css`
- Reveal configuration and custom keys: `presentation.js`
- Title illustration: `assets/characters/title-hero.webp` (optimized) and `title-hero.png` (source)
- Real keyboard photograph: `assets/keyboard/keyboard-keyboard.webp`
- Original title cast and transparent reaction libraries: `assets/characters/`
- Standalone manga characters, quest prompts, and item cards: `assets/manga/*.png`

Every file under `slides/` and `slides-discovery/` contains exactly one `<section class="slide">` and its `<aside class="notes">`. Keep caveats, transitions, and demo cues there rather than shrinking body text. To add or reorder original slides, update `slide-manifest.js`. To change the alternate story, update `slide-manifest-discovery.js`; it can reuse canonical slides alongside discovery-specific fragments. The loader fetches the selected ordered list before `presentation.js` initializes Reveal.

Because the browser loads slide fragments with `fetch`, opening `index.html` directly from the filesystem is not supported. Use the included Rust server.

## Motion and delivery timing

- Adjacent story sequences use Reveal `data-auto-animate` and stable `data-id` values so headings, diagrams, and system states morph between slides.
- Selected grids, tradeoffs, state machines, and pipelines use `data-stagger` attributes. `presentation.js` converts them into grouped click reveals before Reveal initializes.
- `step-pop`, `step-wipe`, and `step-punch` provide distinct delivery beats without introducing another animation library.
- Speaker view shows each slide's pace target and number of staged reveals. The deck targets roughly 40 minutes including a seven-minute demo block.
- Change an individual slide's pace with `data-timing="45"`. Change the overall target in `presentation.js`.
- Reduced-motion mode removes the decorative motion while leaving every delivery step accessible.

## Manga presentation system

- `/storyboard-library.html` is the combined visual catalog for camera shots, character blocking, emotion effects, story beats, expression cutouts, props, and reference assets. The reusable staging API is documented in `ANIME_STORYBOARD.md` and implemented in `anime-storyboard.css`.
- `/bubble-library.html` is the visual inventory for eight reusable, text-editable chat-bubble families. Copy/paste recipes and modifiers are documented in `MANGA_BUBBLES.md`; the shared rules live in `manga-bubbles.css` and are available to every slide through `styles.css`.
- Everyday story and technical slides use warm paper, subtle halftone dots, and low-contrast radial lines. Dark backgrounds are reserved for title cards, act breaks, the demo, and theatrical finale beats.
- `manga-panel-grid`, `manga-quote-stage`, and `manga-objective` reproduce the reaction-panel, punch-line, and season-finale layouts from the earlier deck.
- `manga-cameo` is a large, rotated, text-only corner callout with Japanese headline copy, an English translation, an offset cyan/ink shadow, and a typographic `ドン!!` impact mark.
- Manga reactions and character bubbles use concise Japanese copy with adjacent English translations; `lang="ja"` and a Japanese-capable system font stack keep the typography intentional and accessible.
- Semantic card tones repeat throughout the deck: cyan rays mean insight, green bursts mean success, orange rings mean time, teal diagonals mean signal, sage contours mean physical hardware, violet grids mean software/system, red stripes mean warning, magenta dashed frames mean protocol boundaries, and pink dots mean external systems.
- Slow ray rotation, floating stamps, chromatic title drift, cameo movement, and objective pulses run only while their slide is present and collapse under `prefers-reduced-motion`.

## Image replacement checklist

The generated title art is presentation-ready, and the hardware overview now uses the real project photograph. Replace the remaining conceptual cards with owned project photography where possible:

1. Verified Wicki-Hayden key-label reference
2. Additional PCB revision screenshots beyond the generated current-board renders
3. Actual decoder-enable and pot-ADC bodge photos
4. Synth Phone exterior and internal controls
5. Backup demo video with captions

Keep the deterministic HTML diagrams when a photo would imply an inaccurate keyboard or sensor layout. Credit external projects in notes or a visible source caption.

The deck uses standalone transparent PNGs rather than tile-sheet crops. Add new project art under `assets/manga/` with a descriptive filename and reference it directly from the relevant slide fragment.

## Export to PDF

1. Open `http://127.0.0.1:8000/?print-pdf` in Chrome or Chromium.
2. Print to PDF.
3. Enable background graphics, use landscape orientation, zero margins, and one slide per page.

## Test reduced motion

- macOS: System Settings → Accessibility → Display → Reduce motion
- Browser DevTools: emulate the `prefers-reduced-motion: reduce` media feature

All decorative animations collapse to near-zero duration in reduced-motion mode.

## Demo section

Press `D` to jump to **LIVE DEMO**. The preceding slide contains the six-step runbook and backup-video cue. Treat status lights as visual prompts, not live telemetry.

## Preflight before presenting

- Replace `[add contact details]` on the final slide.
- Confirm the compiled firmware constants still match the repository values quoted in the deck.
- Validate Synth Phone DSP and voice-count claims against its separate repository.
- Replace the two verified schematic errata cards with actual bodge photography when available.
- Test the keyboard, phone, MIDI route, audio route, and captioned backup video.
- Run the deck at 1366 × 768, 1920 × 1080, and an ultrawide viewport.

## Asset provenance

`assets/characters/title-hero.png` was generated with OpenAI's built-in image generation tool for this project; `title-hero.webp` is the optimized delivery copy. Prompt summary: original anime/manga key art of electroNuck and N8 with a modified beige Model M-style MIDI keyboard, negative space for title copy, cream/mint/cyan/magenta palette, no text, logos, celebrity likeness, piano keys, hex grids, or coffee imagery.

`assets/characters/reactions/*.png` are six legacy, project-specific transparent cutouts generated with OpenAI's built-in image generation tool, using `title-hero.png` only as the cast and style reference. Prompt set summary: isolated waist-up reactions of the two original title characters—panic, skepticism, eureka, exhaustion, triumph, and “uh-oh”—in the deck's polished manga style, with no text, logos, props, or borrowed characters. Each was generated against a flat chroma-key field, then converted to alpha locally with edge cleanup. They remain available but are no longer referenced by the active decks; Mio and Ren now provide the recurring reaction cast.

`assets/characters/faces/mio/*.png`, `assets/characters/faces/ren/*.png`, and `assets/characters/faces/kaori/*.png` are 64 original, text-free reaction cutouts generated with OpenAI's built-in image generation tool. Mio (美緒) is a dusty-rose-haired character with six expressions: confidence, confusion, dread, realization, amazement, and defeat. Ren (蓮) is a navy-haired character with a cyan strap and nine reusable reactions: immediate understanding, happiness, sadness, exhaustion, annoyance, frustration, fury, unhinged comedy, and harmless knocked-out defeat. Every Mio and Ren emotion has a restrained base image plus `-big` and `-max` exaggeration levels. Kaori (香織) is a coral-pink-haired fantasy heroine, theatrical skeptic, and gyaru-manga reaction specialist with 19 distinct poses spanning teasing, confidence, embarrassment, adoration, judgment, rage, confusion, exhaustion, defeat, and maximal crying. These names identify the characters without assigning an instrument or fixed story role. Prompt set summary: economical hand-drawn TV-anime cel language, simple production linework, flat colors, one hard-edged shadow, original recurring characters, expressive squash-and-stretch acting, no text, speech bubbles, logos, franchise characters, or watermarks. Each was generated against a flat chroma-key field, converted to alpha locally, edge-checked, and trimmed to its visible bounds. See `assets/characters/faces/README.md` for the catalog and naming convention.

The standalone PNGs under `assets/manga/` were copied from the project root and renamed descriptively; their source artwork is otherwise unchanged.

`assets/manga/model-m-senpai.webp` is a lossless WebP delivery copy of the repository-root `141.png` reaction meme. Treat the supplied meme as third-party material unless ownership or reuse rights are confirmed.

`assets/manga/its-fine.webp`, `project-despair.webp`, and `thats-illegal.webp` are lossless WebP delivery copies of the repository-root `024.png`, `040.png`, and `142.png` reaction assets. Their source artwork is otherwise unchanged. They remain as legacy assets but are no longer referenced by either active deck.

`assets/manga/lucky-star-keyboard.gif` is a legacy third-party animation excerpt from *Lucky Star*, produced by Kyoto Animation, supplied from `https://image.myanimelist.net/ui/5LYzTBVoS196gvYvw3zjwI6dbw19qysxdOlqR6dNT_w`. It is no longer referenced by either active deck; the debugging slide now uses original reaction art.

`assets/keyboard/keyboard-keyboard.jpg` was copied from the sibling `keyboard-keyboard` project's `images/keyboard-keyboard.jpg`; `keyboard-keyboard.webp` is the optimized delivery copy used by the deck.

`assets/kicad/board-top-crop.png` and `copper-routing.svg` were regenerated with KiCad 9 CLI from sibling repo `keyboard-keyboard`, branch `main`, commit `58f0e0e`. They show that source snapshot rather than a conceptual recreation; their canvases were cropped for stage readability.

`assets/open-hardware/sparkfun-tpa2005d1.jpg`, `sparkfun-tpa2005d1-schematic.pdf`, and the PNG rendering of that schematic come from SparkFun's official BOB-11044 product documentation. The product is certified as open source hardware under OSHWA UID US001040; retain source attribution and the applicable hardware/documentation licenses when redistributing or adapting these assets.

`assets/research/*.webp` are optimized delivery copies of the project-owned photos and research captures in `docs/`. The Discord captures are used as documentary evidence in the discovery cut; confirm participant permission or replace them with redrawn quotations before public distribution.

`assets/research/melodicade-mx.webp` is an optimized delivery copy of the official Melodicade MX project photo from KOOP Instruments, sourced from `https://www.koopinstruments.com/instrument-projects/melodicade-mx`. It is visibly credited on the discovery slide and in speaker notes. Attribution does not itself grant reuse permission; confirm permission before redistributing the deck.

# Model M MIDI Talk

An anime-inspired Reveal.js deck for **“That Time We Turned an IBM Model M into a MIDI Instrument to Meet Mark Rober.”** It uses a fixed 1600 × 900 canvas, runs without a build step, and includes speaker notes on every slide.

## Run locally

From the repository root, enter the deck folder, then compile and run the included dependency-free Rust server:

```bash
cd model-m-talk
mkdir -p target
rustc server.rs -o target/model-m-talk-server
./target/model-m-talk-server
```

Open <http://127.0.0.1:8000>. Pass another port as the first argument if needed, for example `./target/model-m-talk-server 8080`. Reveal.js is loaded from jsDelivr, so the first run needs internet access. A browser that has already cached those files can run the deck offline.

## Controls

- `←` / `→` or Space: previous / next slide
- `S`: speaker view and notes
- `F`: fullscreen
- `O`: overview
- `D`: jump directly to the live demo screen
- `Esc`: leave fullscreen or enter overview

## Editing

- Individual slide markup and notes: `slides/*.html`
- Slide order: `slide-manifest.js`
- Slide loading/bootstrap: `slide-loader.js`
- Page shell and Reveal dependencies: `index.html`
- Visual system and reusable layouts: `styles.css`
- Reveal configuration and custom keys: `presentation.js`
- Title illustration: `assets/characters/title-hero.webp` (optimized) and `title-hero.png` (source)
- Real keyboard photograph: `assets/keyboard/keyboard-keyboard.webp`
- Standalone manga characters, reactions, quest prompts, and item cards: `assets/manga/*.png`

Every file under `slides/` contains exactly one `<section class="slide">` and its `<aside class="notes">`. Keep caveats, transitions, and demo cues there rather than shrinking body text. To add or reorder slides, update `slide-manifest.js`; the loader fetches that ordered list before `presentation.js` initializes Reveal.

Because the browser loads slide fragments with `fetch`, opening `index.html` directly from the filesystem is not supported. Use the included Rust server.

## Motion and delivery timing

- Adjacent story sequences use Reveal `data-auto-animate` and stable `data-id` values so headings, diagrams, and system states morph between slides.
- Selected grids, tradeoffs, state machines, and pipelines use `data-stagger` attributes. `presentation.js` converts them into grouped click reveals before Reveal initializes.
- `step-pop`, `step-wipe`, and `step-punch` provide distinct delivery beats without introducing another animation library.
- Speaker view shows each slide's pace target and number of staged reveals. The deck targets roughly 40 minutes including a seven-minute demo block.
- Change an individual slide's pace with `data-timing="45"`. Change the overall target in `presentation.js`.
- Reduced-motion mode removes the decorative motion while leaving every delivery step accessible.

## Manga presentation system

- The default slide canvas uses a high-contrast night background, subtle halftone dots, and radial speed lines; cream and colored cards always reset to dark text.
- `manga-panel-grid`, `manga-quote-stage`, and `manga-objective` reproduce the reaction-panel, punch-line, and season-finale layouts from the earlier deck.
- `manga-cameo` is a large, rotated, text-only corner callout with Japanese headline copy, an English translation, an offset cyan/ink shadow, and a typographic `ドン!!` impact mark.
- Manga reactions and character bubbles use concise Japanese copy with adjacent English translations; `lang="ja"` and a Japanese-capable system font stack keep the typography intentional and accessible.
- Semantic card tones repeat throughout the deck: cyan rays mean insight, green bursts mean success, orange rings mean time, teal diagonals mean signal, sage contours mean physical hardware, violet grids mean software/system, red stripes mean warning, magenta dashed frames mean protocol boundaries, and pink dots mean external systems.
- Slow ray rotation, floating stamps, chromatic title drift, cameo movement, and objective pulses run only while their slide is present and collapse under `prefers-reduced-motion`.

## Image replacement checklist

The generated title art is presentation-ready, and the hardware overview now uses the real project photograph. Replace the remaining conceptual cards with owned project photography where possible:

1. Verified Wicki-Hayden key-label reference
2. KiCad board overview and PCB revisions
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

The standalone PNGs under `assets/manga/` were copied from the project root and renamed descriptively; their source artwork is otherwise unchanged.

`assets/manga/lucky-star-keyboard.gif` is a third-party animation excerpt from *Lucky Star*, produced by Kyoto Animation, supplied from `https://image.myanimelist.net/ui/5LYzTBVoS196gvYvw3zjwI6dbw19qysxdOlqR6dNT_w`. It is visibly credited on slide 42. Attribution does not itself grant reuse permission; confirm the intended presentation context or replace it with original reaction art before distributing the deck commercially.

`assets/keyboard/keyboard-keyboard.jpg` was copied from the sibling `keyboard-keyboard` project's `images/keyboard-keyboard.jpg`; `keyboard-keyboard.webp` is the optimized delivery copy used by the deck.

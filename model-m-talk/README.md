# Model M MIDI Talk

An anime-inspired Reveal.js deck for **“That Time We Turned an IBM Model M into a MIDI Instrument to Meet Mark Rober.”** The primary 58-slide keyboard-keyboard cut uses a fixed 1600 × 900 canvas, runs without a build step, and includes speaker notes on every slide. Earlier discovery-led and technical-first cuts are preserved under `archive/`.

## Run locally

From the repository root, enter the deck folder, then compile and run the included dependency-free Rust server:

```bash
cd model-m-talk
mkdir -p target
rustc server.rs -o target/model-m-talk-server
./target/model-m-talk-server
```

Open <http://127.0.0.1:8000>. Pass another port as the first argument if needed, for example `./target/model-m-talk-server 8080`. Reveal.js is loaded from jsDelivr, so the first run needs internet access. A browser that has already cached those files can run the deck offline.

Pages hot-reload: the server injects a small poller into every page shell that watches the deck folder for edits and reloads the tab automatically. No extra setup or build step required — just edit a slide and save.

The presentation entry points are:

- `/` — the primary keyboard-keyboard presentation
- `/archive/` — the archived discovery-led cut
- `/archive/technical.html` — the archived technical-first cut
- `/archive/compare.html` — both archived cuts side by side

## Controls

- `←` / `→` or Space: previous / next slide
- `S`: speaker view and notes
- `F`: fullscreen
- `O`: overview
- `D`: jump directly to the live demo screen
- `Esc`: leave fullscreen or enter overview

## Editing

- Main slide markup and notes: `slides/*.html`
- Main slide order: `slide-manifest.js`
- Archived slide markup: `archive/slides/*.html` and `archive/slides-discovery/*.html`
- Archived slide order: `archive/slide-manifest-technical.js` and `archive/slide-manifest-discovery.js`
- Slide loading/bootstrap: `slide-loader.js`
- Page shell and Reveal dependencies: `index.html`
- Visual system and reusable layouts: `styles.css`
- Reveal configuration and custom keys: `presentation.js`
- Title photo composite: `assets/characters/title-mark-rober.webp` (optimized) and `title-mark-rober.png` (source)
- Real keyboard photograph: `assets/keyboard/keyboard-keyboard.webp`
- Original title cast and transparent reaction libraries: `assets/characters/`
- Standalone manga characters, quest prompts, and item cards: `assets/manga/*.png`

Every slide fragment contains exactly one `<section class="slide">` and its `<aside class="notes">`. Keep caveats, transitions, and demo cues there rather than shrinking body text. To add, remove, or reorder main slides, edit `slide-manifest.js`. Archived slides remain reusable: add a path such as `archive/slides/23-the-board-is-an-analog-routing-problem.html` to the main manifest. The loader fetches the selected ordered list before `presentation.js` initializes Reveal.

Because the browser loads slide fragments with `fetch`, opening `index.html` directly from the filesystem is not supported. Use the included Rust server.

## Motion and delivery timing

- Adjacent story sequences use Reveal `data-auto-animate` and stable `data-id` values so headings, diagrams, and system states morph between slides.
- Selected grids, tradeoffs, state machines, and pipelines use `data-stagger` attributes. `presentation.js` converts them into grouped click reveals before Reveal initializes.
- Plain fragments automatically receive the subtle `step-rise` entrance. `step-panel`, `step-pop`, `step-wipe`, and `step-punch` provide progressively stronger delivery beats without introducing another animation library.
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
- Keep `clip-path` on borderless decorative pseudo-elements. Do not apply it directly to bordered cards, photos, banners, or frames: the browser clips their painted border and creates broken corners. In the keyboard-keyboard cut, structural frames also stay axis-aligned; put rotation or skew on borderless accents, stamps, type, and character art instead.
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

Press `D` to jump to **LIVE DEMO**. Its speaker notes contain the six-step runbook and backup-video cue; the projected slide is intentionally a clean showtime card rather than live telemetry.

## Preflight before presenting

- Replace `[add contact details]` on the final slide.
- Confirm the compiled firmware constants still match the repository values quoted in the deck.
- Validate Synth Phone DSP and voice-count claims against its separate repository.
- Replace the two verified schematic errata cards with actual bodge photography when available.
- Test the keyboard, phone, MIDI route, audio route, and captioned backup video.
- Run the deck at 1366 × 768, 1920 × 1080, and an ultrawide viewport.

## Asset provenance

`assets/characters/title-mark-rober.png` was created with OpenAI's built-in image editing tool for this project. It composites the presenter-supplied Open Sauce photo of electroNuck and N8 with a Mark Rober display and the project-owned `assets/keyboard/keyboard-keyboard.jpg`, preserving the people and finished instrument while extending the navy background for title copy. Prompt summary: photoreal 16:9 editorial collage, selfie subjects on the right, modified Model M keyboard in the lower-right foreground, quiet navy negative space on the left, no text or added logos.

`assets/characters/title-hero.png` was generated with OpenAI's built-in image generation tool for this project; `title-hero.webp` is the optimized delivery copy. Prompt summary: original anime/manga key art of electroNuck and N8 with a modified beige Model M-style MIDI keyboard, negative space for title copy, cream/mint/cyan/magenta palette, no text, logos, celebrity likeness, piano keys, hex grids, or coffee imagery.

`assets/phone/synthphone-angle-source.png` is the untouched user-supplied photograph used for the live-demo slide. `synthphone-cutout.png` retains the original photographic pixels and uses a deterministic macOS Vision foreground mask plus transparent-canvas trimming; no details were generated, reconstructed, or repainted. The cutout is composited over the same `title-mark-rober.webp` image used by the opening slide.

`assets/characters/reactions/*.png` are six legacy, project-specific transparent cutouts generated with OpenAI's built-in image generation tool, using `title-hero.png` only as the cast and style reference. Prompt set summary: isolated waist-up reactions of the two original title characters—panic, skepticism, eureka, exhaustion, triumph, and “uh-oh”—in the deck's polished manga style, with no text, logos, props, or borrowed characters. Each was generated against a flat chroma-key field, then converted to alpha locally with edge cleanup. They remain available but are no longer referenced by the active decks; Mio and Ren now provide the recurring reaction cast.

`assets/characters/faces/mio/*.png`, `assets/characters/faces/ren/*.png`, and `assets/characters/faces/kaori/*.png` are 65 original, text-free reaction cutouts generated with OpenAI's built-in image generation tool. Mio (美緒) has long espresso-brown waves with smoky-lavender highlights, gray-violet eyes, a dusty-pink T-shirt, straight-leg light jeans, white canvas sneakers, and restrained gyaru-influenced accessories; her six expression families cover confidence, confusion, dread, realization, amazement, and defeat. Ren (蓮) has warm medium-brown skin, navy hair in a loose low ponytail, amber-brown eyes, a brick-red T-shirt, an open warm off-white button-up, and a muted-cyan strap; Ren's nine reusable reactions cover immediate understanding, happiness, sadness, exhaustion, annoyance, frustration, fury, unhinged comedy, and harmless knocked-out defeat. Every Mio and Ren emotion has a restrained base image plus `-big` and `-max` exaggeration levels. Kaori (香織) is the cast's artistic north star: a coral-pink-haired fantasy heroine, theatrical skeptic, and gyaru-manga reaction specialist with 19 distinct poses spanning teasing, confidence, embarrassment, adoration, judgment, rage, confusion, exhaustion, defeat, and maximal crying. These names identify the characters without assigning an instrument or fixed story role. Prompt set summary: polished anime/manga cel rendering aligned to Kaori, with fine confident dark linework, rich cel contrast, layered hard-edged shadows, controlled blush, glossy hair and eye highlights, dimensional anatomy, dynamic silhouettes, and expressive squash-and-stretch acting; no text, speech bubbles, logos, franchise characters, watermarks, or pale sticker borders. Each Mio and Ren reaction used its previous asset only for pose and emotional intensity, while the approved redesign reference fixed identity and clothing. The images were generated against a flat chroma-key field, converted to alpha locally with color-spill cleanup, edge-checked, and trimmed to visible bounds. See `assets/characters/faces/README.md` for the catalog and naming convention.

`assets/characters/poses/{kaori,mio,ren}/*.png` are 12 matching full-body cutouts generated with OpenAI's built-in image generation tool: neutral, presenting, thinking, and celebrating poses for each character. Kaori's established reaction art supplied the shared linework, cel-shadow, anatomy, and acting reference; the approved Mio and Ren redesigns fixed their identities and wardrobes. Prompt set summary: one complete head-to-shoes silhouette, presentation-friendly gesture, exact recurring-character costume, polished Kaori-aligned anime/manga rendering, and no text, props, border, cast shadow, environment, or crop. Each was generated against solid chroma green, selectively converted to alpha without desaturating Kaori's teal belt or Ren's cyan strap, edge-checked, and trimmed to visible bounds. See `assets/characters/poses/README.md` for the pose catalog.

The standalone PNGs under `assets/manga/` were copied from the project root and renamed descriptively; their source artwork is otherwise unchanged.

`assets/manga/model-m-senpai.webp` is a lossless WebP delivery copy of the repository-root `141.png` reaction meme. Treat the supplied meme as third-party material unless ownership or reuse rights are confirmed.

`assets/manga/its-fine.webp`, `project-despair.webp`, and `thats-illegal.webp` are lossless WebP delivery copies of the repository-root `024.png`, `040.png`, and `142.png` reaction assets. Their source artwork is otherwise unchanged. They remain as legacy assets but are no longer referenced by either active deck.

`assets/manga/lucky-star-keyboard.gif` is a legacy third-party animation excerpt from *Lucky Star*, produced by Kyoto Animation, supplied from `https://image.myanimelist.net/ui/5LYzTBVoS196gvYvw3zjwI6dbw19qysxdOlqR6dNT_w`. It is no longer referenced by either active deck; the debugging slide now uses original reaction art.

`assets/keyboard/keyboard-keyboard.jpg` was copied from the sibling `keyboard-keyboard` project's `images/keyboard-keyboard.jpg`; `keyboard-keyboard.webp` is the optimized delivery copy used by the deck.

`assets/keyboard/keyboard-controls-oled.webp` is a cropped and optimized derivative of that same project-owned photograph. It shows the instrument's real OLED and status-light area on the observability slide.

`assets/reference-projects/mod-mmm-board.webp` is an optimized derivative of dcpedit's mod-mmm build photograph from the project's GitHub README. The mod-mmm repository is licensed CC BY 4.0: `https://github.com/dcpedit/mod-mmm`. The photograph is used to identify the real curved mechanical reference on the open-source parentage slide.

`assets/reference-projects/he60-assembled.webp` is an optimized derivative of `doc/3-assembled.jpg` from peppapighs' HE60 repository, which is licensed GPL-3.0: `https://github.com/peppapighs/HE60`. It is used to identify the real Hall-effect electrical reference on the open-source parentage slide.

`assets/midi/midi-ports-and-cable.webp` is an optimized derivative of Wikimedia Commons contributor Pretzelpaws' “MIDI ports and cable,” licensed CC BY-SA 3.0 / GFDL and available at `https://commons.wikimedia.org/wiki/File:Midi_ports_and_cable.jpg`. It is cropped in CSS to connect the USART configuration to the real five-pin DIN interface.

`assets/pcb-rework/*.png` are project-owned photographs supplied by the presenter showing the keyboard PCB bodge wires and the actual U1 removal/replacement. The matching `.webp` files are optimized delivery copies used by the keyboard-keyboard field-guide slides.

`assets/electronics-tips/assembly/hand-smt-placement.webp` is an optimized delivery copy of Wikimedia Commons contributor Aisart's “Soldering a 0805,” showing soldering tweezers on a small surface-mount component. The source is licensed CC BY-SA 3.0 / GFDL and is available at `https://commons.wikimedia.org/wiki/File:Soldering_a_0805.jpg`. `assets/electronics-tips/assembly/pick-and-place-line.webp` is an optimized delivery copy of Wikimedia Commons contributor Shixart1985's photograph “Machine places components on a circuit board during manufacturing in a factory environment,” licensed CC BY 2.0 and available at `https://commons.wikimedia.org/wiki/File:Machine_places_components_on_a_circuit_board_during_manufacturing_in_a_factory_environment.jpg`. Both images are cropped in CSS for the factory-assembly slide; no endorsement by the photographers is implied.

`assets/firmware/stm32h7-microcontroller.webp` is an optimized derivative of Wikimedia Commons contributor Giansi80's “Microcontrollore STM32H7B0VBT6,” a macro photograph of an STM32H7-family Cortex-M microcontroller licensed CC BY-SA 4.0: `https://commons.wikimedia.org/wiki/File:Microcontrollore_STM32H7B0VBT6.jpg`. It appears with the existing CC0 USB connector and CC BY-SA 3.0 SEGGER J-Link photographs to show the physical host-to-probe-to-MCU firmware path; no endorsement is implied.

`assets/kicad/board-top-crop.png` and `copper-routing.svg` were regenerated with KiCad 9 CLI from sibling repo `keyboard-keyboard`, branch `main`, commit `58f0e0e`. They show that source snapshot rather than a conceptual recreation; their canvases were cropped for stage readability.

`assets/kicad/jlcpcb-keyboard-quote.png` is a project-owned capture of the actual `keyboard_keyboard` Gerber upload and PCB quote in JLCPCB. It is cropped in CSS on the fabrication-handoff slide to show the front/back Gerber preview and the selected board specifications without redrawing the vendor UI.

`assets/open-hardware/sparkfun-tpa2005d1.jpg`, `sparkfun-tpa2005d1-schematic.pdf`, and the PNG rendering of that schematic come from SparkFun's official BOB-11044 product documentation. The product is certified as open source hardware under OSHWA UID US001040; retain source attribution and the applicable hardware/documentation licenses when redistributing or adapting these assets.

`assets/open-hardware/sparkfun-mark.svg` is the SparkFun flame mark from the CC0-licensed Simple Icons vector collection. SparkFun's official Press & Media page publishes downloadable logo assets and says users may choose among its logo variants. It is used only to identify SparkFun; SparkFun® is a trademark of SparkFun Electronics, Inc.

`assets/open-hardware/arduino-logo.svg` is Arduino's unmodified color logo from its official Brand Identity page. Arduino's trademark guidance permits the logo for descriptive or explanatory purposes inside publication content and requests a trademark acknowledgment. It is used only to identify Arduino; Arduino® is a trademark of Arduino S.r.l.

`assets/research/*.webp` are optimized delivery copies of the project-owned photos and research captures in `docs/`. The Discord captures are used as documentary evidence in the discovery cut; confirm participant permission or replace them with redrawn quotations before public distribution.

`assets/research/melodicade-mx.webp` is an optimized delivery copy of the official Melodicade MX project photo from KOOP Instruments, sourced from `https://www.koopinstruments.com/instrument-projects/melodicade-mx`. It is visibly credited on the discovery slide and in speaker notes. Attribution does not itself grant reuse permission; confirm permission before redistributing the deck.

`assets/research/gateron-exploded-he-switch.jpg` is the downloaded source image and `gateron-exploded-he-switch.webp` is its optimized delivery copy. The image depicts a Gateron KS-20 Magnetic Orange switch; RTINGS modified Gateron's original to highlight the permanent magnet and PCB-mounted Hall sensor. It is sourced from `https://www.rtings.com/keyboard/learn/what-is-a-hall-effect-keyboard` and visibly credits both Gateron and RTINGS. Attribution does not itself grant reuse permission; confirm permission before redistributing the deck.

`assets/keyboard/ibm-model-m-spanish-keyboard.jpg` is a 1280-pixel delivery copy of the CC0-licensed “IBM Model M Spanish Keyboard” photo by Wikimedia Commons contributor Wilfredor, sourced from `https://commons.wikimedia.org/wiki/File:IBM_Model_M_Spanish_Keyboard.jpg`. `ibm-model-m-spanish-keyboard-cutout.png` is the background-removed presentation asset used on the keyboard-keyboard cut's challenger-reveal slide.

`assets/ui/usb-connector.png` is a background-removed crop of a CC0-licensed photo by Wikimedia Commons contributor Evan-Amos, sourced from `https://en.wikipedia.org/wiki/File:USB-Connector-Standard.jpg`. Used on the keyboard-keyboard cut's design-fork slide.

`assets/keyboard/buckling-spring-mechanism.jpg` is a patent-style cross-section diagram of the IBM buckling spring switch, sourced from a third-party blog post at `https://www.valoroso.it/`. **Reuse check**: likely derived from expired IBM patent artwork (which would be public domain), but provenance is not independently confirmed. Confirm permission before public redistribution. Used on the keyboard-keyboard cut's buckling-spring-mechanism slide.

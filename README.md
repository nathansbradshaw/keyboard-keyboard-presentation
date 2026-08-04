# Model M MIDI Talk

Source for **“That Time We Turned an IBM Model M into a MIDI Instrument to Meet Mark Rober,”** an anime-inspired technical talk by electroNuck and N8.

The presentation tells the story of rebuilding an IBM Model M as a 100-key Hall effect MIDI controller: preserving the original enclosure, mapping its rectangular grid to a Wicki–Hayden layout, turning analog key travel into musical intent, and sending the result to an external Synth Phone. The 58-slide Reveal.js deck is designed for a roughly 40-minute live talk, including a seven-minute demo.

## Run the presentation

The deck has no package-manager or build-step dependency. Compile the included Rust development server and serve the deck from its directory:

```bash
cd model-m-talk
mkdir -p target
rustc server.rs -o target/model-m-talk-server
./target/model-m-talk-server
```

Open <http://127.0.0.1:8000>. To use another port, pass it as the first argument:

```bash
./target/model-m-talk-server 8080
```

Reveal.js is loaded from jsDelivr, so an uncached first run requires internet access. Opening `index.html` directly is not supported because the browser loads the individual slide files with `fetch`.

## Presenting

- `←`, `→`, or Space: navigate
- `S`: open speaker view and notes
- `F`: enter fullscreen
- `O`: open the slide overview
- `D`: jump to the live demo
- `Esc`: leave fullscreen or enter the overview

Every slide includes speaker notes. Staged reveals, auto-animation, and decorative motion respect the operating system's reduced-motion preference.

## Repository layout

```text
.
├── DESIGN.md                  # Original visual and content specification
├── model-m-talk/
│   ├── assets/                # Character art, project photos, and manga cut-ins
│   ├── slides/                # One HTML fragment per slide
│   ├── tools/validate_deck.rs # Dependency-free structural validator
│   ├── index.html             # Reveal.js shell
│   ├── presentation.js        # Reveal configuration and custom behavior
│   ├── slide-loader.js        # Fragment loader
│   ├── slide-manifest.js      # Canonical slide order
│   ├── styles.css             # Layout and visual system
│   └── README.md              # Detailed authoring, export, and preflight guide
└── n8_electronuck_anime_reveal_deck_code.html # Earlier single-file deck
```

See [the deck guide](model-m-talk/README.md) for editing conventions, motion and timing controls, PDF export instructions, presentation preflight checks, and asset provenance.

## Validate changes

From the repository root:

```bash
rustc model-m-talk/tools/validate_deck.rs -o /tmp/validate-model-m-talk
/tmp/validate-model-m-talk model-m-talk
```

The validator checks the 58-file manifest, one slide and one notes block per fragment, duplicate or unlisted slides, and missing local assets.

## Host with GitHub Pages

The included GitHub Actions workflow validates the deck and publishes `model-m-talk` as the site root whenever presentation files are pushed to `main`.

After pushing the repository to GitHub, open **Settings → Pages** and select **GitHub Actions** as the publishing source. The first successful **Deploy presentation to GitHub Pages** workflow run will show the public URL on its summary page. You can also redeploy at any time from the repository's **Actions** tab.

## Content and asset note

The talk documents the keyboard project in the sibling `keyboard-keyboard` repository. Generated, project-owned, and third-party assets have different provenance and reuse considerations; review the asset-provenance section in [the deck guide](model-m-talk/README.md) before redistributing the presentation.

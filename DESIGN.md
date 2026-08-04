# Design Specification: Anime-Inspired Reveal.js Talk

## Project title

**That Time We Turned an IBM Model M into a MIDI Instrument to Meet Mark Rober**

Presenters: **electroNuck** and **N8**

## Goal

Build a polished, anime-inspired Reveal.js presentation for a live technical talk aimed primarily at web developers, software engineers, embedded developers, hardware hackers, keyboard enthusiasts, and music-technology nerds.

The talk should feel like an anime episode rather than a corporate deck. Combine anime title cards, manga panels, JRPG quest interfaces, retro hardware manuals, clean technical diagrams, modern web presentation design, and meme cut-ins. The styling must support the story rather than overwhelm it.

## Deliverables

Create a self-contained Reveal.js presentation with:

```text
model-m-talk/
├── index.html
├── styles.css
├── presentation.js
├── README.md
└── assets/
    ├── characters/
    ├── keyboard/
    ├── phone/
    ├── diagrams/
    ├── memes/
    ├── ui/
    └── backgrounds/
```

The deck must run locally with no build step. Use Reveal.js from a CDN unless a local copy is already available.

## Core technical requirements

### Reveal.js configuration

Use a fixed 16:9 canvas that preserves its logical aspect ratio regardless of browser or screen dimensions.

```js
Reveal.initialize({
  width: 1600,
  height: 900,
  margin: 0.04,
  minScale: 0.2,
  maxScale: 2,
  center: false,
  controls: true,
  progress: true,
  hash: true,
  history: true,
  transition: "fade",
  backgroundTransition: "fade",
  autoAnimate: true,
  autoAnimateDuration: 0.8,
  autoAnimateEasing: "ease-in-out",
  slideNumber: "c/t",
  plugins: [RevealNotes, RevealHighlight]
});
```

Do not use responsive CSS that changes the logical slide dimensions. All slides must fit inside the 1600 × 900 design canvas without clipping.

### Layout system

Implement reusable layout classes, similar to PowerPoint masters:

```text
layout-title
layout-chapter
layout-split
layout-content
layout-diagram
layout-code
layout-quote
layout-gallery
layout-full-bleed
layout-demo
layout-finale
```

Each layout must use a consistent internal grid and support:

- arc or episode label
- slide title
- optional subtitle
- main content region
- optional side annotation
- footer with presenter names
- slide number
- decorative manga accent

Example:

```html
<section class="slide layout-split">
  <div class="slide-header"></div>
  <div class="slide-body">
    <div class="column column-left"></div>
    <div class="column column-right"></div>
  </div>
  <div class="slide-footer"></div>
</section>
```

## Design language

### Overall direction

The deck should feel like:

- an anime season recap
- a dramatic engineering quest
- a technical keynote
- an RPG system menu
- a retro computer manual

Avoid generic cyberpunk overload, muddy dark backgrounds, unreadable neon-on-neon, tiny text, random decorative Japanese, fake keyboards, hexagonal Wicki-Hayden layouts, and generic piano imagery.

### Palette

```css
--cream: #f4efd8;
--sage: #8ea98f;
--mint: #b8d7bd;
--forest: #1f4034;
--charcoal: #161b1d;
--paper: #fffdf4;
--cyan: #35d6d0;
--magenta: #f25aa2;
--yellow: #ffd34f;
--red: #ef4f4f;
--blue: #4c76d7;
```

Use cream or paper backgrounds for most technical slides. Use dark chapter cards sparingly.

### Typography

- title: 72–110 px
- chapter title: 80–130 px
- slide heading: 48–64 px
- body: 28–34 px
- labels: 18–24 px
- code: 22–28 px

No text smaller than 18 px. Use CSS custom properties for type scale.

### Graphic treatment

Use thick outlines, offset shadows, manga halftones, speech bubbles, speed-line overlays, clean UI cards, paper textures, dashed technical callouts, animated arrows, status tags, quest cards, and boss-introduction cards. Do not put every effect on every slide.

## Presenter character rules

### electroNuck

- male
- long hair
- hair may be blond, teal, blue, or blond with teal/blue accents
- no facial hair
- hardware and music hacker aesthetic
- may appear with soldering tools, keyboards, synths, phones, or PCBs
- no coffee imagery

### N8

- male
- curly or wavy brown hair
- no facial hair
- software and embedded-systems builder aesthetic
- may appear with terminals, firmware, PCBs, MIDI, or debugging tools
- no coffee imagery

Do not make every decorative asset feature the presenters. Use supporting anime characters, reaction panels, UI widgets, technical icons, and manga effects.

## Canonical keyboard rules

The real keyboard design is the visual source of truth.

### Physical form

- IBM Model M or Lexmark Model M enclosure
- standard staggered computer-keyboard rows
- navigation cluster remains on the right
- several rotary encoders in recessed upper bays
- small display in the upper-right area
- prototype labels may resemble masking tape
- industrial beige or gray case
- muted green, mint, and cream keycaps

### Wicki-Hayden pattern

Do not replace the layout with piano keys, a hexagonal grid, an ortholinear grid, random notes, or a generic isomorphic keyboard.

The keyboard preserves standard staggered Model M rows. Horizontally adjacent notes in a playable row are whole steps apart. Diagonal movement provides the semitone relationship.

Conceptual pattern:

```text
Upper note row:      C   D   E
Adjacent note row: F   G   A   B
Next note row:       C   D   E
Next note row:     F   G   A   B
Lower note row:      C   D   E
```

The exact placement must follow the supplied keyboard references. The repeating staggered zig-zag is the visual signature.

When a correct keyboard image is unavailable, use a simplified labeled diagram instead of inventing a new physical layout.

## Canonical synth phone rules

The synth phone is a previous project that returns in the final system.

It is:

- a telephone converted into a vocal-effects processor
- capable of real-time microphone processing
- controlled by MIDI from the keyboard
- capable of vocoding
- capable of multiple synthesized voices
- capable of a harmony or harmonics mode
- intended to create stacked vocal textures inspired by “Hide and Seek”

Do not use copyrighted lyrics or audio.

Represent the phone as a vintage telephone or answering-machine-style enclosure with physical controls, audio waveform UI, MIDI input, and multiple generated voice paths.

## Audience and framing

The audience is mostly web developers and software engineers. Every hardware topic should connect to a familiar software concept without trivializing the hardware.

Recurring parallels:

```text
Human interface       → API design
PCB revision          → deployment
Bodge wire             → hotfix
Test point             → observability
Schematic              → architecture diagram
Datasheet              → API documentation
Calibration            → configuration
MIDI                    → protocol boundary
Manufacturing lead time → extremely slow CI
```

The core thesis is:

> The best way to stretch your software brain is to build something where the bugs are physical.

## Narrative structure

Target 40–55 slides for 35–45 minutes of speaking, followed by a 5–10 minute live demonstration.

Structure the presentation as anime arcs.

# Slide outline

## Arc 0 — Cold Open

### 1. Title

**That Time We Turned an IBM Model M into a MIDI Instrument to Meet Mark Rober**

Include the keyboard hero image, electroNuck and N8, anime episode-title treatment, and subtle motion. No dense text.

### 2. The Quest

```text
PRIMARY OBJECTIVE
Build something cool enough to meet Mark Rober
```

Reveal:

```text
Difficulty: Unknown
Budget: Concerning
Scope: Expanding
```

### 3. What We Built

```text
Hall Effect Model M
        ↓ MIDI
Synth Phone
        ↓
Voice + Harmonies + Vocoder
```

### 4. Why Software Engineers Should Care

- physical interfaces are APIs for humans
- hardware decisions create software constraints
- analog signals eventually become data structures
- latency is a full-stack problem
- prototypes are architecture documents you can touch

## Arc 1 — Why Build Another Keyboard?

### 5. “The MIDI Keyboard Is a Solved Problem”

Show a normal MIDI keyboard, then reveal:

```text
So why did we build the wrong one?
```

### 6. A Keyboard Is a Human API

Compare QWERTY, piano, game controller, touch screen, and isomorphic layouts.

Question:

```text
What assumptions are hiding inside the interface?
```

### 7. Requirements

```text
Must look like a Model M
Must feel mechanically satisfying
Must support expressive input
Must send MIDI
Must fit in the original shell
Must connect to the Synth Phone
Must be repairable
Must be weird enough to justify this talk
```

### 8. Inspiration Board

Include IBM Model M, alternative layouts, isomorphic instruments, arcade controls, custom MIDI controllers, Melodicade MX, Hall effect gaming keyboards, and synthesizer control panels.

Attribute external projects in notes or footer text.

### 9. The Two-Switch Idea

Explain the early Melodicade-inspired approach:

- combine or stack two switches
- first action triggers a note
- second action provides another state or control
- understandable and easy to prototype
- mechanically tall and complicated
- difficult to align, fit, and maintain

### 10. Tradeoff Screen

```text
Two-switch approach
+ understandable
+ digital
+ easy to prototype
- more moving parts
- tall stack
- difficult alignment
- limited sensing resolution
```

End with:

```text
What if one switch could give us a continuous signal?
```

## Arc 2 — Why the IBM Model M?

### 11. Legendary Item Acquired

```text
LEGENDARY ITEM
IBM Model M

+ Iconic design
+ Heavy enough to survive impact
+ Repairable
+ Lots of internal volume
- Not designed for any of this
```

### 12. Why This Chassis?

Cover recognizable design, nostalgia, enclosure strength, interior space, stage presence, and the contrast between old hardware and new music.

### 13. What Is Inside a Model M?

Exploded diagram of keycaps, buckling springs, membranes, barrel plate, case, and controller.

### 14. The Constraint Becomes the Design

Explain how the shell and stagger dictated PCB shape, sensor placement, spacing, cable routing, encoder locations, and display placement.

## Arc 3 — Wicki-Hayden Layout

### 15. Where Are the Black Keys?

Use an anime pianist reaction panel. The keyboard must match the real layout.

### 16. Whole Steps Across

Overlay:

```text
Horizontal movement = whole step
```

### 17. Semitones on the Diagonal

Overlay:

```text
Diagonal movement = semitone
```

### 18. Same Shape, New Key

Show one chord or scale pattern transposed without changing shape.

```text
The fingering stays the same when transposed.
```

### 19. Pianist vs Isomorphic Layout

```text
Pianist:
“My muscle memory is useless.”

Software engineer:
“Wait, the interface is internally consistent?”
```

### 20. Why It Matters to Software People

```text
Piano layout:
special cases encoded into the interface

Wicki-Hayden:
a more regular coordinate system
```

Do not claim one layout is universally superior.

## Arc 4 — PCB and KiCad

### 21. The KiCad Arc

Chapter card.

### 22. Turning the Keyboard into Coordinates

Show key centers, row stagger, sensor coordinates, mounting holes, and case boundaries.

### 23. The First Board Plan

Show a simplified KiCad-style overview with sensor matrix, traces, microcontroller, connectors, encoders, and display.

### 24. Hardware Is CSS with Consequences

```text
Web layout:
move it 4 px

PCB layout:
reroute 38 traces and order another board
```

### 25. Routing Strategy

Cover analog paths, power, ground, row/column organization, noise, connector placement, and enclosure constraints.

### 26. Mistake Gallery

Show representative failures such as mirrored connectors, wrong footprints, missing pull-ups, insufficient clearance, swapped pins, case collisions, and traces through mounting areas. Present each as a “BUG UNLOCKED” card.

### 27. What Software Engineers Recognize

Use the recurring hardware/software mapping.

## Arc 5 — Hall Effect Discovery

### 28. ZMK Community Side Quest

Explain that conversations with the ZMK community introduced Hall effect switches and continuous position sensing. Do not imply ZMK supplied the final implementation unless accurate.

### 29. Hall Effect in One Slide

```text
Magnet moves
Magnetic field changes
Sensor voltage changes
ADC reads voltage
Firmware estimates position
Position becomes musical intent
```

### 30. Magnetic Field Visualization

Animate magnet, sensor, field lines, distance, and output voltage. Do not imply a perfectly linear relationship.

### 31. Voltage over Travel

Graph key travel versus measured voltage, including noise, calibration range, press direction, and release direction.

### 32. Analog Becomes Digital

```text
Voltage
→ ADC sample
→ filtered value
→ normalized position
→ state machine
→ MIDI event
```

### 33. Double Actuation

```text
Actuation point 1:
start note

Actuation point 2:
trigger alternate action, articulation, effect, or mode
```

Clearly identify whether this is implemented, experimental, or planned.

### 34. Velocity

Explain a practical method:

```text
measure travel time between two thresholds
faster travel = higher velocity
slower travel = lower velocity
```

Mention calibration and velocity curves.

### 35. Hall Effect Tradeoffs

```text
Pros
+ continuous key position
+ configurable actuation
+ velocity possibilities
+ no contact debounce

Cons
- calibration
- magnet variation
- analog noise
- sensor cost
- firmware complexity
- mechanical alignment
```

## Arc 6 — Firmware

### 36. Firmware Architecture

```text
Sensor scan
→ calibration
→ filtering
→ key state machine
→ note mapping
→ MIDI encoder
→ USB MIDI
```

### 37. Scanning the Board

Discuss scan rate, ADC timing, multiplexing if used, frame consistency, and latency budget. Label conceptual details that are not yet final.

### 38. Calibration

Explain resting value, fully pressed value, direction, noise floor, dead zone, and normalized travel per key.

### 39. State Machine

```text
IDLE
→ PRESSING
→ ACTIVE
→ RELEASING
→ IDLE
```

Optional states: secondary actuation, aftertouch, retrigger.

### 40. Code Slide

Use a small readable example:

```js
for (const key of keys) {
  const sample = readSensor(key);
  const position = normalize(sample, key.calibration);
  const event = key.state.update(position, now);

  if (event) {
    midi.send(event);
  }
}
```

### 41. Latency Is Full Stack

```text
sensor sampling
filtering
state detection
MIDI packet creation
USB transfer
phone processing
audio buffer
audio output
```

### 42. Debugging Without a Browser Console

Show serial logs, oscilloscope, logic analyzer, test firmware, LEDs, test points, synthetic input, and MIDI monitor.

## Arc 7 — The Synth Phone Returns

### 43. Previously On…

Anime recap card for the synth phone.

### 44. What the Synth Phone Does

Cover telephone enclosure, microphone input, real-time effects, physical interaction, and MIDI-controlled note generation.

### 45. Keyboard Meets Phone

```text
Model M keys
→ MIDI notes and controls
→ Synth Phone
→ voice analysis / synthesis
→ vocoder or harmony engine
→ audio output
```

### 46. Multiple Voices

```text
Voice input
├── voice 1
├── voice 2
├── voice 3
└── voice 4
```

The keyboard supplies harmony pitches.

### 47. Vocoder Mode

Explain that the voice supplies articulation or spectral shape while synthesized notes supply pitch content, with the keyboard controlling the notes.

### 48. Harmony Mode

Explain that one sung note can be expanded into layered voices selected or structured by the keyboard, enabling Imogen Heap-style stacked vocal textures. Mention “Hide and Seek” only as inspiration.

### 49. Why MIDI Was the Right Boundary

```text
Keyboard owns intent
Phone owns sound
MIDI is the protocol boundary
```

Benefits: separation of concerns, interchangeable components, debugging, interoperability, and clear responsibility.

## Arc 8 — Lessons and Future

### 50. The Real Product Was the Constraints

Summarize the old enclosure, new sensing, unusual layout, custom PCB, firmware, MIDI, and real-time audio.

### 51. Lessons for Software Engineers

```text
Interfaces encode assumptions
Physical constraints are architecture
Analog inputs are messy user data
Calibration is configuration
Latency belongs to the whole system
Protocols create freedom
Prototype failures are information
```

### 52. What We Would Change

Cover PCB cleanup, fewer bodges, better connectors, more test points, modular sensor boards, calibration tooling, manufacturability, and assembly documentation.

### 53. Can We Sell It?

Discuss PCB revision, BOM, sourcing enclosures, assembly, test fixtures, firmware updates, documentation, regulatory issues, and kit versus finished product. Avoid unsupported business claims.

### 54. Next Quest

```text
PCB REVISION 2
MANUFACTURING TEST
BETTER ENCLOSURE STRATEGY
CALIBRATION TOOLING
OPEN SOURCE OR PRODUCT PATH
```

## Arc 9 — Live Demo

### 55. Demo Setup

```text
1. Play the keyboard
2. Demonstrate velocity
3. Demonstrate alternate actuation or control
4. Send MIDI to the phone
5. Demonstrate vocoder
6. Demonstrate harmony mode
```

Fallback:

```text
In case of hardware betrayal:
play recorded backup video
```

### 56. Demo Screen

Full-bleed minimal slide:

```text
LIVE DEMO
```

Optional status indicators: MIDI connected, audio connected, phone ready, keyboard calibrated.

### 57. Final Quest Log

```text
✓ Rebuild an IBM Model M
✓ Learn KiCad
✓ Discover Hall effect sensing
✓ Write firmware
✓ Build a MIDI instrument
✓ Connect it to the Synth Phone
✓ Perform a live demo
☐ Meet Mark Rober
```

### 58. Closing

```text
The best way to stretch your software brain
is to build something where the bugs are physical.
```

Include presenters and contact details.

## Animation system

Use Reveal fragments for joke timing, pipelines, tradeoffs, errors, and quest updates. Do not reveal every bullet individually.

Use `data-auto-animate` for title morphs, keyboard zooms, the Hall effect pipeline, voltage-to-MIDI flow, system assembly, and quest progression.

Preferred motion:

- fade
- slide
- scale
- transform
- clip-path reveal
- subtle parallax
- pulse
- glitch for failures
- shake for boss or error moments

Avoid constant bouncing, spinning text, long waits, and motion on every element.

Respect reduced-motion preferences:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.001ms !important;
    transition-duration: 0.001ms !important;
  }
}
```

## Reusable components

Create reusable styles and markup for:

- quest cards
- status badges
- technical pipelines
- tradeoff grids
- manga reaction cut-ins
- arc labels
- item cards
- boss cards
- source captions
- presenter footer
- demo status lights

Example quest card:

```html
<div class="quest-card">
  <div class="quest-label">PRIMARY OBJECTIVE</div>
  <h3>Build something cool enough to meet Mark Rober</h3>
  <div class="quest-meta">
    <span>Difficulty: Unknown</span>
    <span>Status: Active</span>
  </div>
</div>
```

Example pipeline:

```html
<div class="pipeline">
  <div class="pipeline-step">Sensor</div>
  <div class="pipeline-arrow">→</div>
  <div class="pipeline-step">ADC</div>
  <div class="pipeline-arrow">→</div>
  <div class="pipeline-step">Firmware</div>
  <div class="pipeline-arrow">→</div>
  <div class="pipeline-step">MIDI</div>
</div>
```

## Required diagrams

Prefer SVG or HTML/CSS diagrams over raster screenshots when practical.

Create:

1. keyboard-to-phone system
2. Model M exploded construction
3. Wicki-Hayden note relationship
4. keyboard mechanical coordinate plan
5. PCB system overview
6. magnet and Hall sensor
7. voltage versus key travel
8. analog-to-MIDI pipeline
9. key state machine
10. firmware architecture
11. latency chain
12. MIDI-to-phone audio architecture
13. multiple voice generation

## Speaker notes

Every slide must include Reveal.js notes:

```html
<aside class="notes">
  Speaker notes go here.
</aside>
```

Notes should include the key message, optional joke, transition, caveat, and demo cue. Keep paragraphs off-screen when they belong in notes.

## Accuracy rules

- Spell **Wicki-Hayden** correctly.
- Spell **Hall effect** correctly.
- Spell **KiCad** correctly.
- Spell **electroNuck** exactly.
- Spell **N8** exactly.
- Use **IBM Model M** or **Lexmark Model M** accurately.
- Do not invent hardware specifications.
- Clearly label conceptual diagrams.
- Distinguish implemented, experimental, and planned features.
- Do not depict the keyboard as a piano.
- Do not draw Wicki-Hayden as a hex grid.
- Do not add coffee jokes.
- Do not add facial hair to either presenter.
- Do not include copyrighted song lyrics.

## Accessibility

- strong color contrast
- alt text for informative images
- empty alt text for decorative images
- do not rely on color alone
- conference-room-readable type
- captions for video
- keyboard navigation
- reduced-motion support
- diagrams readable when projected

## Performance

- lazy-load large images
- use compressed PNG, WebP, or SVG
- avoid base64 blobs
- preload only title assets
- use GPU-friendly animation
- avoid heavy animation libraries unless necessary
- support offline use after dependencies are downloaded

## README requirements

Document:

- how to run locally
- keyboard controls
- where to replace image assets
- how to edit notes
- how to export to PDF
- how to test reduced motion
- how to enter the live demo section
- which slides require real project photos

Example:

```bash
python3 -m http.server 8000
```

Open:

```text
http://localhost:8000
```

## Implementation priorities

### Priority 1

- fixed 16:9 canvas
- reusable layouts
- complete narrative
- readable technical content
- accurate keyboard layout
- speaker notes
- clean diagrams

### Priority 2

- auto-animate sequences
- anime chapter cards
- reaction cut-ins
- quest UI
- code highlighting
- live demo mode

### Priority 3

- parallax
- particles
- advanced transitions
- optional sound cues
- easter eggs

Never sacrifice clarity or accuracy for Priority 3.

## Definition of done

The deck is complete when:

- all arcs are represented
- layouts are consistent
- 16:9 is preserved on normal, small, and ultrawide screens
- nothing clips at 1366×768, 1920×1080, or ultrawide dimensions
- technical diagrams are legible
- Wicki-Hayden is represented accurately
- the synth phone integration is clear
- the content appeals to software engineers without dumbing down hardware
- anime styling is cohesive
- every slide has notes
- the live demo sequence is simple and dependable
- the deck runs locally without a build system

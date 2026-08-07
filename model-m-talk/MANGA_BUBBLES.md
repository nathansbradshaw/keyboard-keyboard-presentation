# Manga bubble component kit

Open [`bubble-library.html`](bubble-library.html) through the local deck server to see every variant. The implementation lives in [`manga-bubbles.css`](manga-bubbles.css), which is imported by `styles.css`, so the components work in any existing slide.

## Basic markup

```html
<div class="mb mb--speech mb--tail-bl mb--cyan mb--md">
  <div class="mb__body">
    <span class="mb__name">Mio</span>
    <span class="mb__jp" lang="ja">待って。</span>
    <p class="mb__text">The same shape works in every key?</p>
    <span class="mb__note">calm · conversational</span>
  </div>
</div>
```

Only `.mb`, one type, and `.mb__body` are required. The speaker name, Japanese line, main text, and note are all optional.

## Bubble types

| Class | Best use |
| --- | --- |
| `mb--speech` | Ordinary dialogue; the default workhorse |
| `mb--cloud` | Friendly, animated, or enthusiastic dialogue |
| `mb--angular` | Technical, confident, or deadpan dialogue |
| `mb--shout` | Panic, triumph, reveals, and punch lines |
| `mb--thought` | Internal monologue and quiet reasoning |
| `mb--whisper` | Asides, secrets, uncertainty, and low-volume jokes |
| `mb--narrator` | Time jumps, scene setting, and editorial commentary |
| `mb--radio` | Phone audio, firmware, terminal, robot, or system voices |
| `mb--interrupt` | A voice entering from outside the panel |
| `mb--mutter` | A tiny under-the-breath remark near a character |

`mb--interrupt` points in from the right by default. Add `mb--from-right` when the unseen speaker is to the right and the jagged edge should face left.

## Tail direction

Add one tail class to speech, angular, thought, whisper, or radio bubbles:

- `mb--tail-l`: directly left
- `mb--tail-r`: directly right
- `mb--tail-bl`: bottom-left
- `mb--tail-br`: bottom-right
- `mb--tail-tl`: top-left
- `mb--tail-tr`: top-right

Leave all tail classes off for a floating bubble. Thought bubbles automatically turn a selected corner tail into a trail of circles.

## Size, tone, and placement

Sizes: `mb--xs`, `mb--sm`, `mb--md`, `mb--lg`, `mb--wide`, and `mb--tall`.

`mb--vertical` creates a tall balloon and sets the main text vertically. It is best for concise Japanese copy. Apply `mb__text--vertical` to an individual line when only that line should run vertically.

Palette: `mb--cyan`, `mb--magenta`, `mb--yellow`, `mb--red`, `mb--mint`, `mb--violet`, plus `mb--dark` for light text on dark paper.

Delivery: `mb--quiet`, `mb--loud`, `mb--lettered`, and `mb--compact`.

Treatment: `mb--plain` removes the colored shadow, `mb--accented` increases it, `mb--shadow-left` reverses its direction, and `mb--dark` produces a dark system balloon.

Placement nudges: `mb--rotate-left` and `mb--rotate-right`.

## Linked dialogue

Use `mb-group` for two related but separate beats. The balloons overlap slightly without becoming one unreadable shape:

```html
<div class="mb-group">
  <div class="mb mb--cloud mb--tail-bl mb--yellow mb--sm">
    <div class="mb__body"><p class="mb__text">But where are the black keys?</p></div>
  </div>
  <div class="mb mb--speech mb--tail-br mb--cyan mb--xs">
    <div class="mb__body"><p class="mb__text">There aren't any.</p></div>
  </div>
</div>
```

`mb-group--vertical` stacks connected beats downward. `mb-group--separated` retains group behavior without overlapping the balloons.

For staged Reveal.js dialogue, add the normal fragment classes to the outer element:

```html
<div class="mb mb--speech mb--tail-br mb--magenta mb--md fragment step-pop">
  <div class="mb__body"><p class="mb__text">Second beat.</p></div>
</div>
```

## Slide composition pattern

Keep portraits separate from bubbles so either piece can be swapped independently:

```html
<div class="dialogue-beat">
  <img src="assets/characters/faces/ren/understands-big.png" alt="Ren understands">
  <div class="mb mb--angular mb--tail-bl mb--cyan mb--lg">
    <div class="mb__body"><p class="mb__text">The geometry stays put.</p></div>
  </div>
</div>
```

The balloon kit does not choose screen coordinates. Use an `as-stage` shot recipe or the surrounding slide layout to place it. Block the actor first, then choose the tail that terminates nearest the speaker's mouth.

## Authoring guidance

- Prefer one sentence per bubble and aim for fewer than 18 words.
- Use speech or cloud bubbles most often; the other shapes work best as emphasis.
- Point the tail toward the speaker's mouth, even when the portrait is cropped off-panel.
- Use tall narration boxes and vertical balloons when copy naturally reads downward; do not stretch an oval around a paragraph.
- Crop interruptions and narrator boxes against panel edges rather than centering everything.
- Protect eyes, mouths, expressive hands, and the object under discussion from balloon overlap.
- Keep text as HTML for editing, accessibility, translation, and PDF export.
- Japanese copy is optional. If used, keep `lang="ja"` on the Japanese span.
- Use `mb--shout` once in a sequence, not on every beat.

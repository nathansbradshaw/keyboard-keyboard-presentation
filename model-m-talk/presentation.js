/* global Reveal, RevealNotes, RevealHighlight */

// Declarative delivery beats. A container can reveal selected descendants one
// click at a time (or in small groups) without filling the slide markup with
// fragment boilerplate.
document.querySelectorAll("[data-stagger]").forEach((container) => {
  const selector = container.dataset.stagger;
  const effect = container.dataset.staggerEffect || "step-pop";
  const groupSize = Number(container.dataset.staggerGroup || 1);
  const startAt = Number(container.dataset.staggerStart || 0);

  container.querySelectorAll(selector).forEach((element, index) => {
    element.classList.add("fragment", effect);
    element.dataset.fragmentIndex = String(startAt + Math.floor(index / groupSize));
  });
});

// Reveal's speaker view uses per-slide timing data. These defaults create a
// realistic 35–45 minute talk while reserving a longer block for the demo.
document.querySelectorAll("section.slide").forEach((slide) => {
  if (slide.dataset.timing) return;
  if (slide.classList.contains("layout-title")) slide.dataset.timing = "25";
  else if (slide.classList.contains("layout-chapter")) slide.dataset.timing = "20";
  else if (slide.classList.contains("layout-demo")) slide.dataset.timing = "420";
  else slide.dataset.timing = "35";
});

// Put pacing and click counts where the presenters can see them: Reveal's
// speaker notes. These cues never appear on the projected slide.
document.querySelectorAll("section.slide").forEach((slide) => {
  const notes = slide.querySelector("aside.notes");
  if (!notes) return;

  const fragments = [...slide.querySelectorAll(".fragment")];
  const indexedBeats = new Set(
    fragments.map((fragment) => fragment.dataset.fragmentIndex).filter(Boolean),
  );
  const unindexedBeats = fragments.filter(
    (fragment) => fragment.dataset.fragmentIndex === undefined,
  ).length;
  const revealBeats = indexedBeats.size + unindexedBeats;

  const cue = document.createElement("p");
  cue.className = "delivery-cue";
  cue.textContent = `PACE ${slide.dataset.timing}s · ${revealBeats} staged reveal${revealBeats === 1 ? "" : "s"}`;
  notes.append(cue);
});

const japaneseNumber = (value) => {
  const digits = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
  if (value < 10) return digits[value];
  if (value < 100) {
    const tens = Math.floor(value / 10);
    const ones = value % 10;
    return `${tens === 1 ? "" : digits[tens]}十${ones === 0 ? "" : digits[ones]}`;
  }
  return String(value);
};

const updateJapaneseSlideNumber = () => {
  const reveal = document.querySelector(".reveal");
  if (!reveal) return;

  let counter = reveal.querySelector(".jp-slide-number");
  if (!counter) {
    counter = document.createElement("div");
    counter.className = "jp-slide-number";
    reveal.append(counter);
  }

  const current = Reveal.getIndices().h + 1;
  const total = Reveal.getTotalSlides();
  counter.innerHTML = `<span class="jp-slide-count" lang="ja">第${japaneseNumber(current)}頁 ／ 全${japaneseNumber(total)}頁</span>`;
};

// Subfolder decks use a parent <base> for shared assets. Give Reveal Notes an
// explicit presentation URL so its preview frames reopen the same deck rather
// than resolving to a top-level page shell.
const configuredPresentationUrl = document.documentElement.dataset.presentationUrl;
const presentationId = document.documentElement.dataset.presentationId;
let presentationUrl;

if (configuredPresentationUrl) {
  const resolvedPresentationUrl = new URL(
    configuredPresentationUrl,
    document.baseURI,
  );
  if (presentationId) {
    resolvedPresentationUrl.searchParams.set("deck", presentationId);
  }
  presentationUrl = resolvedPresentationUrl.href;
}

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
  autoAnimateEasing: "cubic-bezier(.22,1,.36,1)",
  autoAnimateUnmatched: false,
  defaultTiming: 35,
  totalTime: 40 * 60,
  url: presentationUrl,
  slideNumber: false,
  plugins: [RevealNotes, RevealHighlight],
  keyboard: {
    68: () => {
      const demo = document.querySelector("#demo-screen");
      if (demo) Reveal.slide(Reveal.getIndices(demo).h);
    }
  }
}).then(() => {
  updateJapaneseSlideNumber();
  Reveal.on("slidechanged", updateJapaneseSlideNumber);
});

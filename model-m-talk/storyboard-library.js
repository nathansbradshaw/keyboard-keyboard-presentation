const characterSets = [
  { character: "Mio", folder: "mio", emotions: ["confident", "confused", "dread", "realization", "amazed", "defeated"], levels: ["base", "big", "max"] },
  { character: "Ren", folder: "ren", emotions: ["understands", "happy", "sad", "exhausted", "annoyed", "frustrated", "furious", "unhinged", "knocked-out"], levels: ["base", "big", "max"] },
  {
    character: "Kaori",
    folder: "kaori",
    emotions: [
      "scandalized", "teasing-wink", "smug", "cackling", "tongue-out",
      "flustered", "smitten", "ugly-crying", "pouting", "judging",
      "furious", "stunned", "confused", "exhausted", "scheming",
      "triumphant", "pleading", "deadpan", "knocked-out",
    ],
    levels: ["base"],
    singlePose: true,
  },
];

const singlePoseFaces = [
  { character: "Kaori", folder: "kaori", emotion: "mischievous-confidence" },
  { character: "Mio", folder: "mio", emotion: "mischievous-confidence" },
  { character: "Ren", folder: "ren", emotion: "mischievous-confidence" },
  { character: "Kaori", folder: "kaori", emotion: "maniacal" },
  { character: "Mio", folder: "mio", emotion: "maniacal" },
  { character: "Ren", folder: "ren", emotion: "maniacal" },
  { character: "Kaori", folder: "kaori", emotion: "evil" },
  { character: "Mio", folder: "mio", emotion: "evil" },
  { character: "Ren", folder: "ren", emotion: "evil" },
  { character: "Mio", folder: "mio", emotion: "scandalized" },
  { character: "Ren", folder: "ren", emotion: "scandalized" },
  { character: "Mio", folder: "mio", emotion: "teasing-wink" },
  { character: "Ren", folder: "ren", emotion: "teasing-wink" },
  { character: "Mio", folder: "mio", emotion: "flustered" },
  { character: "Ren", folder: "ren", emotion: "flustered" },
  { character: "Mio", folder: "mio", emotion: "pouting" },
  { character: "Ren", folder: "ren", emotion: "pouting" },
  { character: "Mio", folder: "mio", emotion: "pleading" },
  { character: "Ren", folder: "ren", emotion: "pleading" },
  { character: "Mio", folder: "mio", emotion: "ugly-crying" },
  { character: "Ren", folder: "ren", emotion: "ugly-crying" },
];

const fullBodyPoseSets = [
  { character: "Kaori", folder: "kaori" },
  { character: "Mio", folder: "mio" },
  { character: "Ren", folder: "ren" },
];

const fullBodyPoses = ["neutral", "presenting", "thinking", "celebrating"];

const sceneSpecificPoses = [
  { character: "Mio", folder: "mio", pose: "warning-model-m", subtitle: "Model M warning" },
  { character: "Kaori", folder: "kaori", pose: "flustered-screwdriver", subtitle: "Model M interlude · flustered" },
  { character: "Kaori", folder: "kaori", pose: "confident-model-m", subtitle: "Model M interlude · confident" },
  { character: "Mio", folder: "mio", pose: "lovestruck-model-m-warning", subtitle: "Model M interlude · lovestruck warning" },
  { character: "Mio", folder: "mio", pose: "tsundere-baka", subtitle: "Model M interlude · embarrassed denial" },
  { character: "Ren", folder: "ren", pose: "confident-screwdriver", subtitle: "Model M interlude · confident senpai" },
];

const supportingAssets = [
  { group: "Technical anchors", kind: "technical", files: ["keyboard/keyboard-keyboard.webp", "kicad/board-top-crop.png", "kicad/copper-routing.svg"], root: "assets/", rights: "mixed" },
  { group: "Research and documentary", kind: "documentary", files: ["image_1.webp", "image_2.webp", "image_3.webp", "image_4.webp", "image_5.webp", "image_6.webp", "image_7.webp", "image_8.webp", "initial-hall-hypothesis.webp", "melodicade-mx.webp"], root: "assets/research/", rights: "mixed" },
];

const faceGrid = document.querySelector("#face-grid");
const poseGrid = document.querySelector("#pose-grid");
const assetGrid = document.querySelector("#asset-grid");
const castExpressionCount = document.querySelector("#cast-expression-count");
const fullBodyPoseCount = document.querySelector("#full-body-pose-count");
const emotionEffectCount = document.querySelector("#emotion-effect-count");
const faceFilterStatus = document.querySelector("#face-filter-status");

if (emotionEffectCount) {
  const effectCount = document.querySelectorAll(".sbl-effect-grid .sbl-effect").length;
  emotionEffectCount.textContent = `${effectCount} emotion effects`;
}

const titleCase = (value) => value
  .replace(/-/g, " ")
  .replace(/\b\w/g, (letter) => letter.toUpperCase());

const makeAssetCard = ({ path, title, subtitle, character = "", level = "", kind = "face", rights = "project art" }) => {
  const card = document.createElement("article");
  card.className = "sbl-asset-card";
  card.dataset.character = character.toLowerCase();
  card.dataset.level = level;
  card.dataset.kind = kind;

  const visual = document.createElement("div");
  visual.className = "sbl-asset-visual";
  const image = document.createElement("img");
  image.src = path;
  image.alt = `${title} — ${subtitle}`;
  image.loading = "lazy";
  visual.append(image);

  const rightsTag = document.createElement("span");
  rightsTag.className = `sbl-rights${rights === "reuse check" ? " sbl-rights--check" : ""}`;
  rightsTag.textContent = rights;
  visual.append(rightsTag);

  const meta = document.createElement("div");
  meta.className = "sbl-asset-meta";
  const heading = document.createElement("strong");
  heading.textContent = title;
  const detail = document.createElement("span");
  detail.textContent = subtitle;
  const pathButton = document.createElement("button");
  pathButton.className = "sbl-path";
  pathButton.type = "button";
  pathButton.dataset.copyPath = path;
  pathButton.title = `Copy ${path}`;
  pathButton.textContent = path;
  meta.append(heading, detail, pathButton);
  card.append(visual, meta);
  return card;
};

if (faceGrid) {
  characterSets.forEach(({ character, folder, emotions, levels, singlePose = false }) => {
    emotions.forEach((emotion) => {
      levels.forEach((level) => {
        const suffix = level === "base" ? "" : `-${level}`;
        faceGrid.append(makeAssetCard({
          path: `assets/characters/faces/${folder}/${emotion}${suffix}.png`,
          title: `${character} · ${titleCase(emotion)}`,
          subtitle: singlePose ? "single slide-readable pose" : `${level} intensity`,
          character,
          level,
        }));
      });
    });
  });
  singlePoseFaces.forEach(({ character, folder, emotion }) => {
    faceGrid.append(makeAssetCard({
      path: `assets/characters/faces/${folder}/${emotion}.png`,
      title: `${character} · ${titleCase(emotion)}`,
      subtitle: "single slide-readable pose",
      character,
      level: "base",
    }));
  });
  if (castExpressionCount) {
    castExpressionCount.textContent = `${faceGrid.children.length} cast expressions`;
  }
}

if (poseGrid) {
  fullBodyPoseSets.forEach(({ character, folder }) => {
    fullBodyPoses.forEach((pose) => {
      poseGrid.append(makeAssetCard({
        path: `assets/characters/poses/${folder}/${pose}.png`,
        title: `${character} · ${titleCase(pose)}`,
        subtitle: "full-body pose",
        character,
        kind: "pose",
      }));
    });
  });
  sceneSpecificPoses.forEach(({ character, folder, pose, subtitle }) => {
    poseGrid.append(makeAssetCard({
      path: `assets/characters/poses/${folder}/${pose}.png`,
      title: `${character} · ${titleCase(pose)}`,
      subtitle,
      character,
      kind: "pose",
    }));
  });
  if (fullBodyPoseCount) {
    fullBodyPoseCount.textContent = `${poseGrid.children.length} full-body poses`;
  }
}

if (assetGrid) {
  supportingAssets.forEach(({ group, kind, files, root, rights }) => {
    files.forEach((file) => {
      const filename = file.split("/").pop().replace(/\.(png|webp|jpg|gif|svg)$/i, "");
      assetGrid.append(makeAssetCard({
        path: `${root}${file}`,
        title: titleCase(filename),
        subtitle: group,
        kind,
        rights,
      }));
    });
  });
}

const applyFaceFilters = () => {
  const character = document.querySelector("[data-filter-group='character'] [aria-pressed='true']")?.dataset.filter || "all";
  const level = document.querySelector("[data-filter-group='level'] [aria-pressed='true']")?.dataset.filter || "all";
  let visibleCount = 0;
  document.querySelectorAll("#face-grid .sbl-asset-card").forEach((card) => {
    const characterMatches = character === "all" || card.dataset.character === character;
    const levelMatches = level === "all" || card.dataset.level === level;
    card.hidden = !(characterMatches && levelMatches);
    if (!card.hidden) visibleCount += 1;
  });
  if (faceFilterStatus) {
    const characterLabel = character === "all" ? "all characters" : titleCase(character);
    const levelLabel = level === "all" ? "all intensities" : `${titleCase(level)} intensity`;
    faceFilterStatus.textContent = `Showing ${visibleCount} expressions · ${characterLabel} · ${levelLabel}.`;
  }
};

applyFaceFilters();

document.querySelectorAll(".sbl-filter").forEach((button) => {
  button.addEventListener("click", () => {
    const group = button.closest("[data-filter-group]");
    group.querySelectorAll(".sbl-filter").forEach((peer) => peer.setAttribute("aria-pressed", "false"));
    button.setAttribute("aria-pressed", "true");
    applyFaceFilters();
  });
});

const copyText = async (text, button) => {
  try {
    await navigator.clipboard.writeText(text);
    const oldText = button.textContent;
    button.textContent = "Copied";
    window.setTimeout(() => { button.textContent = oldText; }, 1200);
  } catch {
    button.textContent = "Select path";
  }
};

document.addEventListener("click", (event) => {
  const pathButton = event.target.closest("[data-copy-path]");
  if (pathButton) copyText(pathButton.dataset.copyPath, pathButton);

  const recipeButton = event.target.closest("[data-copy-recipe]");
  if (recipeButton) {
    const code = document.querySelector(`#${recipeButton.dataset.copyRecipe}`);
    if (code) copyText(code.textContent.trim(), recipeButton);
  }
});

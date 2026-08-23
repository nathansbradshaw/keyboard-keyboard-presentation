/* global Reveal */

(async () => {
  // Speaker-view preview windows can survive a full hot reload. Carry a deck
  // identity in their query string so a stale preview that lands on another
  // page shell can route itself back to the presentation that opened it.
  const presentationRoutes = {
    "keyboard-keyboard": "./",
  };
  const requestedPresentationId = new URLSearchParams(
    window.location.search,
  ).get("deck");
  const currentPresentationId =
    document.documentElement.dataset.presentationId;
  const requestedPresentationRoute =
    presentationRoutes[requestedPresentationId];

  if (
    requestedPresentationRoute &&
    requestedPresentationId !== currentPresentationId
  ) {
    const target = new URL(requestedPresentationRoute, document.baseURI);
    target.search = window.location.search;
    target.hash = window.location.hash;
    window.location.replace(target.href);
    return;
  }

  const root = document.querySelector("#slide-root");
  const files = window.SLIDE_FILES;
  const retryableStatuses = new Set([408, 425, 429, 500, 502, 503, 504]);

  const pause = (milliseconds) =>
    new Promise((resolve) => window.setTimeout(resolve, milliseconds));

  const fetchSlide = async (file, maximumAttempts = 4) => {
    let lastError;

    for (let attempt = 1; attempt <= maximumAttempts; attempt += 1) {
      let response;

      try {
        response = await fetch(file);
      } catch (error) {
        lastError = error;
      }

      if (response?.ok) {
        return response.text();
      }

      if (response) {
        lastError = new Error(
          `Unable to load ${response.url || file}: HTTP ${response.status}`,
        );

        if (!retryableStatuses.has(response.status)) {
          throw lastError;
        }
      }

      if (attempt < maximumAttempts) {
        await pause(250 * 3 ** (attempt - 1));
      }
    }

    throw lastError || new Error(`Unable to load ${file}`);
  };

  const fetchSlides = async (slideFiles, concurrency = 6) => {
    const slides = new Array(slideFiles.length);
    let nextIndex = 0;

    const worker = async () => {
      while (nextIndex < slideFiles.length) {
        const index = nextIndex;
        nextIndex += 1;
        slides[index] = await fetchSlide(slideFiles[index]);
      }
    };

    const workerCount = Math.min(concurrency, slideFiles.length);
    await Promise.all(Array.from({ length: workerCount }, () => worker()));
    return slides;
  };

  if (!root || !Array.isArray(files) || files.length === 0) {
    throw new Error("Slide manifest is missing or empty.");
  }

  try {
    const slides = await fetchSlides(files);
    root.innerHTML = slides.join("\n");

    const presentation = document.createElement("script");
    presentation.src = "presentation.js";
    presentation.async = false;
    document.body.append(presentation);
  } catch (error) {
    console.error(error);
    root.innerHTML = `
      <section class="slide layout-quote">
        <div>
          <blockquote>The slide files could not be loaded.</blockquote>
          <cite>Run the deck through the included Rust server.</cite>
        </div>
      </section>`;
  }
})();

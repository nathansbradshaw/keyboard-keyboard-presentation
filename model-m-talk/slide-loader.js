/* global Reveal */

(async () => {
  const root = document.querySelector("#slide-root");
  const files = window.SLIDE_FILES;

  if (!root || !Array.isArray(files) || files.length === 0) {
    throw new Error("Slide manifest is missing or empty.");
  }

  try {
    const responses = await Promise.all(files.map((file) => fetch(file)));
    const failed = responses.find((response) => !response.ok);

    if (failed) {
      throw new Error(`Unable to load ${failed.url}: HTTP ${failed.status}`);
    }

    const slides = await Promise.all(responses.map((response) => response.text()));
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

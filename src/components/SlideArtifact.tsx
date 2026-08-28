import type { SlideCard } from "@/data/types";

export function SlideArtifact({
  slides,
  size = "lg",
}: {
  slides: SlideCard[];
  size?: "sm" | "lg";
  wash?: string;
}) {
  return (
    <div className={`leave slide-artifact size-${size}`}>
      <article className="slide-sheet">
        <header className="slide-sheet-bar">
          <span>Meeting next steps</span>
          <strong>Draft for seller review</strong>
        </header>
        <ol className="slide-sheet-grid">
          {slides.map((slide) => (
            <li key={slide.n}>
              <span>{String(slide.n).padStart(2, "0")}</span>
              <div>
                {slide.kicker ? <small>{slide.kicker}</small> : null}
                <h3>{slide.title}</h3>
                <p>{slide.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <footer>
          <span>Grok Bot</span>
          <span>Nothing sent</span>
        </footer>
      </article>
    </div>
  );
}

// Decorative depth behind a section: CSS only (gradients, no images), aria-hidden,
// hidden in high-contrast mode, glows freeze with "Stop animations" (see .depth in
// globals.css). The parent section needs `relative isolate`.
//
// Glows sit on headings (large text only needs 3:1); patterns fade out before body text.
// Strengths were set by measuring the background under every text element (AUDIT.md).

type Glow = {
  top: string;
  left: string;
  strength: number; // peak opacity of the orange at the center
  size?: string; // diameter, default min(95vw, 72rem)
  speed?: string; // one drift cycle
};

export default function Depth({
  grid,
  dots,
  lines,
  glows = [],
  fullWidth = false,
}: {
  grid?: boolean;
  dots?: "top" | "bottom" | "end";
  lines?: "start" | "end";
  glows?: Glow[];
  // For sections inside a max-width container: stretch the layer to the full screen width
  fullWidth?: boolean;
}) {
  return (
    <div aria-hidden="true" className={`depth ${fullWidth ? "depth-full" : ""}`}>
      {grid && <div className="hero-grid" />}
      {dots && <div className={`depth-dots depth-fade-${dots}`} />}
      {lines && <div className={`depth-lines depth-fade-${lines}`} />}
      {glows.map((g, i) => (
        <div
          key={i}
          className="glow"
          style={{
            top: g.top,
            left: g.left,
            ...(g.size && { width: g.size }),
            ["--glow-strength" as string]: g.strength,
            ["--glow-speed" as string]: g.speed ?? `${28 + i * 5}s`,
          }}
        />
      ))}
    </div>
  );
}

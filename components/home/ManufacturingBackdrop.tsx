type Part = "impeller" | "bracket" | "flange" | "gear";

/** Decorative only: a shared renderer discovers these inert, layout-neutral slots. */
export function ManufacturingBackdrop({ part }: { part: Part }) {
  return (
    <div className={`manufacturing-backdrop manufacturing-backdrop--${part}`} aria-hidden="true">
      <canvas data-manufacturing-part={part} />
    </div>
  );
}

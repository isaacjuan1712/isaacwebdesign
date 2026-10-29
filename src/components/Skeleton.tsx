// Placeholder shapes for content that isn't in the HTML yet. Purely visual: the area
// that holds a skeleton carries aria-busy, and the shapes themselves are hidden.

// A soft block in the surface color
export function Bone({ className = "" }: { className?: string }) {
  return <div className={`rounded-md bg-line/70 ${className}`} />;
}

// Fills its parent with the outline of a small screen: a top bar, a picture, a few lines
// of text and a button. Used where a lazy demo (phone screens, "what you get" tiles)
// will appear, so the area has the same size and shape before and after.
export function ScreenSkeleton() {
  return (
    <div aria-hidden="true" className="skeleton flex size-full flex-col gap-3 p-4 pt-10">
      <Bone className="h-3 w-1/3" />
      <Bone className="min-h-10 flex-1 rounded-xl" />
      <Bone className="h-3 w-4/5" />
      <Bone className="h-3 w-3/5" />
      <Bone className="mt-1 h-8 w-1/2 rounded-full" />
    </div>
  );
}

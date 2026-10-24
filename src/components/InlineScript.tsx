"use client";

// A <script> that runs while the browser parses the server HTML, before the first paint.
// In the browser React renders it as type="text/plain" (inert), which avoids React's
// "script tag inside a component" warning; suppressHydrationWarning accepts the
// type difference. Pattern from the Next.js guide "Preventing flash before hydration".
export default function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

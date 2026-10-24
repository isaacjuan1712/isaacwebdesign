import { NextResponse, type NextRequest } from "next/server";

// Language routing:
//   /…      → Hebrew (served from the /he/… pages without showing "/he" in the address)
//   /en/…   → English
//   /he/…   → redirected to /… so each page has a single Hebrew address
// The visitor's choice (the "locale" cookie, set by the language switcher) is used on the
// home page only: someone who picked English and comes back to "/" goes to "/en".
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/en" || pathname.startsWith("/en/")) return NextResponse.next();

  if (pathname === "/he" || pathname.startsWith("/he/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url, 308);
  }

  if (pathname === "/" && request.cookies.get("locale")?.value === "en") {
    const url = request.nextUrl.clone();
    url.pathname = "/en";
    return NextResponse.redirect(url, 307);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/he${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Skip Next.js internals and files with an extension (icons, images, robots.txt, sitemap.xml)
  matcher: ["/((?!_next/|api/|.*[.].*).*)"],
};

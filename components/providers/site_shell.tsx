"use client";

import { usePathname } from "next/navigation";
import { IntroProvider } from "@/components/providers/intro";
import { SmoothScroll } from "@/components/providers/smooth_scroll";
import { Preloader } from "@/components/preloader";

// App portals scroll inside their own panels, which Lenis would hijack; they keep native scrolling and skip the intro.
const PORTAL_PREFIXES = ["/admin", "/dashboard", "/tphl-forms", "/login", "/register", "/f/", "/payment"];

export function isPortalPath(pathname: string) {
  return PORTAL_PREFIXES.some((p) => pathname === p || pathname.startsWith(p.endsWith("/") ? p : `${p}/`));
}

/** Smooth scrolling and the intro screen for every public page of the site. */
export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (isPortalPath(pathname)) return <>{children}</>;

  return (
    <SmoothScroll>
      <IntroProvider>
        <Preloader />
        {children}
      </IntroProvider>
    </SmoothScroll>
  );
}

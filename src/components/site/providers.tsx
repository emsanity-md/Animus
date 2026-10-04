"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";

/**
 * next-themes has to set the class on <html> before paint, which means it
 * cannot run from a Server Component. This wrapper is the client boundary.
 *
 * The inline script it injects writes the stored theme onto <html> before
 * first paint, so there is no flash of the wrong palette — but it does mean
 * <html> must carry suppressHydrationWarning, since the server does not know
 * what the visitor chose.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}
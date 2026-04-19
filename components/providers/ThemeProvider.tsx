"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";
import { usePathname } from "next/navigation";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const pathname = usePathname();
  // Force light mode on landing page ("/") and login page ("/login")
  const isPublicPage = pathname === "/" || pathname === "/login" || pathname?.startsWith("/login/");
  
  return (
    <NextThemesProvider 
      {...props} 
      forcedTheme={isPublicPage ? "light" : undefined}
    >
      {children}
    </NextThemesProvider>
  );
}

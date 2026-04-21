"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";
import { usePathname } from "next/navigation";

const DEFAULT_THEME_STORAGE_KEY = 'georemind_theme_default';
const CURRENT_USER_KEY = 'georemind_current_user';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const pathname = usePathname();
  const [storageKey, setStorageKey] = React.useState(DEFAULT_THEME_STORAGE_KEY);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const userId = window.localStorage.getItem(CURRENT_USER_KEY);
    setStorageKey(userId ? `georemind_theme_${userId}` : DEFAULT_THEME_STORAGE_KEY);
  }, []);

  // Force light mode on landing page ("/") and login page ("/login")
  const isPublicPage = pathname === "/" || pathname === "/login" || pathname?.startsWith("/login/");
  
  return (
    <NextThemesProvider 
      {...props} 
      forcedTheme={isPublicPage ? "light" : undefined}
      storageKey={storageKey}
    >
      {children}
    </NextThemesProvider>
  );
}

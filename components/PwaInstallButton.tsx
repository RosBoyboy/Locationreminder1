"use client";

import { useState, useEffect, useCallback } from "react";
import { Smartphone } from "lucide-react";

type PwaPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

interface PwaInstallButtonProps {
  className?: string;
  onInstalledMessage?: string;
}

export default function PwaInstallButton({ className, onInstalledMessage }: PwaInstallButtonProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<PwaPromptEvent | null>(null);
  const [installState, setInstallState] = useState<"idle" | "ready" | "installed" | "unsupported">("idle");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Service worker registration may fail in unsupported environments.
      });
    }

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as PwaPromptEvent);
      setInstallState("ready");
      setMessage(null);
    };

    const handleAppInstalled = () => {
      setInstallState("installed");
      setMessage(onInstalledMessage || "App installed successfully!");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt as EventListener);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt as EventListener);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [onInstalledMessage]);

  const handleInstall = useCallback(async () => {
    if (installState === "installed") {
      setMessage("This app is already installed.");
      return;
    }

    if (deferredPrompt) {
      setMessage("Opening install prompt...");
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setInstallState("installed");
        setMessage(onInstalledMessage || "Installation accepted. Follow the browser prompt to finish.");
      } else {
        setInstallState("idle");
        setMessage("Install dismissed. Use your browser menu Add to Home Screen to install later.");
      }
      setDeferredPrompt(null);
      return;
    }

    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches || (navigator as any).standalone;

    if (isStandalone) {
      setInstallState("installed");
      setMessage("App is already installed.");
      return;
    }

    if (isIos) {
      setInstallState("unsupported");
      setMessage("Open Safari, tap Share, then choose Add to Home Screen.");
      return;
    }

    setInstallState("unsupported");
    setMessage("Install prompt not available. Use your browser menu and choose Add to Home Screen.");
  }, [deferredPrompt, installState, onInstalledMessage]);

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={handleInstall}
        className={className ?? "inline-flex items-center gap-2 bg-white/10 text-white font-semibold px-8 py-3.5 rounded-2xl border border-white/20 hover:bg-white/20 transition-all text-sm"}
      >
        <Smartphone size={16} />
        {installState === "installed" ? "Installed" : "Install PWA"}
      </button>
      {message && (
        <p className="text-xs text-slate-200 text-center max-w-xs leading-snug">{message}</p>
      )}
    </div>
  );
}

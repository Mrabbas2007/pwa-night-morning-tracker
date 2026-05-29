import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Download, X } from "lucide-react";
import { cn } from "../lib/utils";
import { useRegisterSW } from "virtual:pwa-register/react";

interface Props {
  isFa: boolean;
  isNight?: boolean;
}

export default function InstallPrompt({ isFa, isNight = true }: Props) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isDismissed, setIsDismissed] = useState(false);

  // Register service worker for offline support
  useRegisterSW({
    onRegistered(r) {
      console.log("SW Registered:", r);
    },
    onRegisterError(error) {
      console.log("SW registration error", error);
    },
  });

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("User accepted the install prompt");
    } else {
      console.log("User dismissed the install prompt");
    }

    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setIsDismissed(true);
  };

  const showPrompt = deferredPrompt !== null && !isDismissed;

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className={cn(
            "fixed z-50 bottom-24 p-4 rounded-2xl shadow-2xl border backdrop-blur-xl flex flex-col gap-3",
            isFa
              ? "right-6 sm:right-8 left-6 sm:left-auto"
              : "left-6 sm:left-8 right-6 sm:right-auto",
            isNight
              ? "bg-surface/90 border-white/10"
              : "bg-white/90 border-black/10",
          )}
          dir={isFa ? "rtl" : "ltr"}
        >
          <button
            onClick={handleDismiss}
            className={cn(
              "absolute top-2 transition-colors active:scale-95",
              isFa ? "left-2" : "right-2",
              isNight
                ? "text-secondary hover:text-foreground"
                : "text-muted hover:text-black",
            )}
            aria-label="Close"
          >
            <X size={16} />
          </button>

          <div className="flex items-center gap-4 mt-2">
            <div
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center border",
                isNight
                  ? "bg-black/50 border-white/10"
                  : "bg-black/5 border-black/10",
              )}
            >
              <Download
                size={24}
                className={isNight ? "text-primary" : "text-black"}
              />
            </div>
            <div className="flex flex-col">
              <span
                className={cn(
                  "font-semibold text-sm",
                  isNight ? "text-foreground" : "text-black",
                )}
              >
                {isFa ? "نصب وب‌اپلیکیشن" : "Install App"}
              </span>
              <span
                className={cn(
                  "text-xs leading-relaxed max-w-[200px]",
                  isNight ? "text-secondary" : "text-muted",
                )}
              >
                {isFa
                  ? "برای تجربه بهتر و استفاده آفلاین، اپلیکیشن را نصب کنید."
                  : "Install for a better experience and offline access."}
              </span>
            </div>
          </div>

          <button
            onClick={handleInstall}
            className="w-full py-2.5 bg-primary text-background font-medium rounded-lg text-sm transition-all active:scale-95 hover:opacity-90"
          >
            {isFa ? "نصب روی دستگاه" : "Install Now"}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

import { UI_INVITE_INITIAL_LOADING } from "@/lib/constants/messages.id";
import { CRITICAL_INVITE_PREFETCH_URLS } from "@/lib/critical-invite-assets";

const MAX_WAIT_MS = 20000;
const OVERLAY_FADE_MS = 420;

function preloadAsset(url: string, onComplete: () => void): Promise<void> {
  return new Promise((resolve) => {
    if (url.match(/\.(mp3|webm|wav|ogg)$/)) {
      const audio = new window.Audio();
      audio.oncanplaythrough = () => {
        onComplete();
        resolve();
      };
      audio.onerror = () => {
        onComplete();
        resolve();
      };
      audio.src = url;
      audio.load();
    } else {
      const img = new window.Image();
      img.onload = () => {
        onComplete();
        resolve();
      };
      img.onerror = () => {
        onComplete();
        resolve();
      };
      img.src = url;
    }
  });
}

type TInviteCriticalLoadGateProps = {
  children: React.ReactNode;
};

export function InviteCriticalLoadGate({ children }: TInviteCriticalLoadGateProps) {
  const [assetsReady, setAssetsReady] = useState(false);
  const [overlayGone, setOverlayGone] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let loadedCount = 0;
    const total = CRITICAL_INVITE_PREFETCH_URLS.length;
    
    if (!cancelled) setProgress(5);

    const onAssetComplete = () => {
      loadedCount++;
      if (!cancelled) {
        const actualProgress = Math.floor((loadedCount / total) * 95);
        setProgress((prev) => Math.max(prev, actualProgress));
      }
    };

    const load = async () => {
      try {
        await Promise.race([
          Promise.all(CRITICAL_INVITE_PREFETCH_URLS.map((url) => preloadAsset(url, onAssetComplete))),
          new Promise<void>((r) => {
            const crawlInterval = window.setInterval(() => {
              if (!cancelled) {
                setProgress(prev => {
                  if (prev < 90) return prev + 0.5;
                  return prev;
                });
              }
            }, 500);
            
            window.setTimeout(() => {
              window.clearInterval(crawlInterval);
              r();
            }, MAX_WAIT_MS);
          }),
        ]);
      } catch (e) {
        console.error("[Preload] error:", e);
      } finally {
        if (!cancelled) {
          setProgress(100);
          window.setTimeout(() => {
            if (!cancelled) setAssetsReady(true);
          }, 600);
        }
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!assetsReady) return;
    const id = window.setTimeout(() => setOverlayGone(true), OVERLAY_FADE_MS + 140);
    return () => window.clearTimeout(id);
  }, [assetsReady]);

  return (
    <>
      {assetsReady ? children : null}
      <AnimatePresence>
        {!overlayGone && (
          <motion.div
            key="loading-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            role="status"
            aria-live="polite"
            aria-busy={!assetsReady}
            className="fixed inset-0 z-[100000] flex flex-col items-center justify-center bg-[#fbfbfa]"
            suppressHydrationWarning
          >
            <div
              className="relative flex flex-col items-center gap-8 w-full max-w-[280px]"
              suppressHydrationWarning
            >
              {/* Animated Flower */}
              <div className="relative w-24 h-24 animate-zoom-in-out" suppressHydrationWarning>
                <Image 
                  src="/assets/opening/flower-1.png" 
                  alt="" 
                  fill 
                  priority
                  sizes="96px"
                  className="object-contain opacity-80"
                />
              </div>

              {/* Aesthetic Loading Text & Progress */}
              <div className="flex flex-col items-center gap-5 w-full" suppressHydrationWarning>
                <div className="flex flex-col items-center gap-2" suppressHydrationWarning>
                  <p 
                    className="text-base text-[var(--inv-primary)] opacity-60"
                    style={{ fontFamily: "serif", letterSpacing: "0.4em" }}
                  >
                    Loading Resource...
                  </p>
                </div>

                {/* Progress Bar Container */}
                <div className="w-full space-y-2 px-8" suppressHydrationWarning>
                  <div
                    className="h-[2px] w-full overflow-hidden rounded-full bg-neutral-200"
                    suppressHydrationWarning
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className="h-full bg-[var(--inv-primary)]"
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      suppressHydrationWarning
                    />
                  </div>
                  <p className="text-[10px] font-bold tracking-widest text-[var(--inv-primary)] opacity-50 text-center">
                    {progress}%
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}


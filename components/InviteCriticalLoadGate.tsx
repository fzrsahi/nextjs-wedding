"use client";

import { useEffect, useState } from "react";

import { UI_INVITE_INITIAL_LOADING } from "@/lib/constants/messages.id";
import { CRITICAL_INVITE_PREFETCH_URLS } from "@/lib/critical-invite-assets";

const MAX_WAIT_MS = 16_000;
const OVERLAY_FADE_MS = 420;

function preloadImage(url: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = url;
  });
}

type TInviteCriticalLoadGateProps = {
  children: React.ReactNode;
};

/**
 * Menahan tampilan undangan sampai font + gambar pembuka/prefetch utama ada di cache,
 * dengan overlay minimal di awal.
 */
export function InviteCriticalLoadGate({ children }: TInviteCriticalLoadGateProps) {
  const [assetsReady, setAssetsReady] = useState(false);
  const [overlayGone, setOverlayGone] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fontsReady =
      typeof document !== "undefined" && "fonts" in document
        ? document.fonts.ready.then(() => undefined).catch(() => undefined)
        : Promise.resolve();

    const load = async () => {
      await Promise.race([
        Promise.all([
          fontsReady,
          ...CRITICAL_INVITE_PREFETCH_URLS.map((url) => preloadImage(url)),
        ]),
        new Promise<void>((r) => {
          window.setTimeout(r, MAX_WAIT_MS);
        }),
      ]);
      if (!cancelled) setAssetsReady(true);
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
      {!overlayGone ? (
        <div
          role="status"
          aria-live="polite"
          aria-busy={!assetsReady}
          className={[
            "fixed inset-0 z-[100000] flex flex-col items-center justify-center",
            "bg-[#eef3f0] transition-opacity ease-out",
            assetsReady ? "pointer-events-none opacity-0" : "opacity-100",
          ].join(" ")}
          style={{ transitionDuration: `${OVERLAY_FADE_MS}ms` }}
        >
          <div className="flex flex-col items-center gap-6">
            <div className="h-[2px] w-14 overflow-hidden rounded-full bg-[rgb(36_92_72_/0.12)]">
              <div
                className={[
                  "h-full w-2/5 rounded-full bg-[rgb(36_92_72_/0.42)]",
                  assetsReady ? "" : "motion-safe:animate-pulse",
                ].join(" ")}
              />
            </div>
            <p className="text-[0.62rem] font-medium uppercase tracking-[0.42em] text-[rgb(36_92_72_/0.48)]">
              {UI_INVITE_INITIAL_LOADING}
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}

"use client";

import Image from "next/image";
import { Check, Copy, Landmark, MapPin, Wallet } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import type { SlideConfig } from "./CinematicScroll";

import {
  GIFT_ACCOUNTS,
  GIFT_DELIVERY_ADDRESS,
  GIFT_DELIVERY_LABEL,
  type TGiftAccount,
} from "@/lib/constants/gift-accounts";

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}

const EN_GIFT = {
  kicker: "Wedding Gift",
  intro:
    "Your presence is already our greatest gift. If you wish to send a blessing, please use one of the accounts below.",
  accountTypeBank: "Bank Transfer",
  accountTypeEwallet: "E-Wallet",
  accountName: "Account Name",
  accountNumber: "Account Number",
  copy: "Copy Number",
  copied: "Copied",
  copyFailed: "Copy failed",
  copiedToast: "Number copied to clipboard",
  copyFailToast: "Unable to copy number",
  sendGift: "Send a Physical Gift",
} as const;

function GiftCinematicSlide({ refs }: { refs: ((el: HTMLDivElement | null) => void)[] }) {
  const reduceMotion = useReducedMotion();
  const headingId = useId();
  const liveId = useId();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [liveMessage, setLiveMessage] = useState("");
  const clearCopiedTimerRef = useRef<number | null>(null);
  const clearLiveMessageTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (clearCopiedTimerRef.current !== null) {
        window.clearTimeout(clearCopiedTimerRef.current);
      }
      if (clearLiveMessageTimerRef.current !== null) {
        window.clearTimeout(clearLiveMessageTimerRef.current);
      }
    };
  }, []);

  const onCopy = useCallback(async (id: string, number: string) => {
    if (clearCopiedTimerRef.current !== null) {
      window.clearTimeout(clearCopiedTimerRef.current);
      clearCopiedTimerRef.current = null;
    }
    if (clearLiveMessageTimerRef.current !== null) {
      window.clearTimeout(clearLiveMessageTimerRef.current);
      clearLiveMessageTimerRef.current = null;
    }

    const ok = await copyToClipboard(number.replace(/\s/g, ""));
    if (ok) {
      setCopiedId(id);
      setLiveMessage(EN_GIFT.copiedToast);
      clearCopiedTimerRef.current = window.setTimeout(() => {
        setCopiedId((cur) => (cur === id ? null : cur));
        setLiveMessage("");
        clearCopiedTimerRef.current = null;
      }, 2200);
    } else {
      setLiveMessage(EN_GIFT.copyFailToast);
      clearLiveMessageTimerRef.current = window.setTimeout(() => {
        setLiveMessage("");
        clearLiveMessageTimerRef.current = null;
      }, 3200);
    }
  }, []);

  const renderProviderIcon = (acc: TGiftAccount) => {
    if (acc.category === "ewallet") {
      return <Wallet className="h-3 w-3 text-[#f3dac3]/88" aria-hidden />;
    }
    return <Landmark className="h-3 w-3 text-[#f3dac3]/88" aria-hidden />;
  };

  return (
    <div
      data-cinematic-allow-scroll
      className="absolute inset-0 z-30 flex items-center justify-center px-3 py-4 sm:px-4"
    >
      <p id={liveId} className="sr-only" aria-live="polite">
        {liveMessage}
      </p>

      <div
        ref={(el) => {
          refs[0]?.(el);
        }}
        className="relative w-full max-w-[430px] origin-center"
      >
        <div className="pointer-events-none absolute -left-8 top-10 z-[2] h-20 w-20 opacity-55">
          <Image
            src="/assets/opening/flower-1.webp"
            alt=""
            fill
            sizes="80px"
            className="object-contain animate-zoom-in-out"
            loading="lazy"
          />
        </div>
        <div className="pointer-events-none absolute -right-8 top-12 z-[2] h-20 w-20 opacity-55">
          <Image
            src="/assets/opening/flower-2.webp"
            alt=""
            fill
            sizes="80px"
            className="object-contain animate-zoom-in-out-delayed"
            loading="lazy"
          />
        </div>

        <div className="relative z-10">
        <header className="relative text-center">
          <div className="mx-auto w-[min(88vw,23rem)] rounded-[2.2rem] border border-[#ffe1c4]/18 bg-[radial-gradient(ellipse_at_center,rgba(28,8,14,0.8)_0%,rgba(28,8,14,0.56)_52%,rgba(9,42,31,0.22)_84%)] px-4 py-3 shadow-[0_16px_36px_rgba(0,0,0,0.34)] backdrop-blur-[1.5px]">
            <p
              data-cinematic-line
              className="text-[1.95rem] leading-none text-[#ffd8b5] animate-sway"
              style={{
                fontFamily: "'Brittany Signature', serif",
                textShadow:
                  "0 2px 2px rgba(23,5,9,0.92), 0 8px 22px rgba(0,0,0,0.86), 0 0 20px rgba(244,200,157,0.32)",
              }}
            >
              {EN_GIFT.kicker}
            </p>
            <h2
              id={headingId}
              data-cinematic-line
              className="mt-0.5 text-[1.08rem] font-bold leading-tight tracking-[0.14em] uppercase text-[#fff7e8] animate-glow-text"
              style={{
                fontFamily: "var(--font-cormorant), serif",
                textShadow:
                  "0 2px 1px rgba(28,8,14,0.95), 0 8px 20px rgba(0,0,0,0.86), 0 0 18px rgba(255,224,194,0.24)",
              }}
            >
            </h2>
            <div className="mx-auto mt-1.5 flex w-32 items-center justify-center gap-2">
              <span className="h-px flex-1 bg-[linear-gradient(90deg,transparent,rgba(255,231,202,0.8))]" />
              <span className="h-1.5 w-1.5 rotate-45 border border-[#ffe1c4]/80 bg-[#f4c89d]/70 shadow-[0_0_12px_rgba(244,200,157,0.72)]" />
              <span className="h-px flex-1 bg-[linear-gradient(90deg,rgba(255,231,202,0.8),transparent)]" />
            </div>
            <p
              data-cinematic-line
              className="mx-auto mt-2 px-2 text-center text-[0.62rem] leading-relaxed text-[#fff4e8]/96 animate-drift"
              style={{
                fontFamily: "var(--font-cormorant), serif",
                textShadow: "0 2px 8px rgba(0,0,0,0.86)",
              }}
            >
              {EN_GIFT.intro}
            </p>
          </div>
        </header>

        <motion.ul
          className="mt-3 grid grid-cols-2 gap-2.5 pr-0.5"
          initial={false}
          animate="show"
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: reduceMotion ? 0 : 0.1,
                delayChildren: reduceMotion ? 0 : 0.05,
              },
            },
          }}
        >
          {GIFT_ACCOUNTS.map((acc) => (
            <motion.li
              key={acc.id}
              variants={{
                hidden: { opacity: 0, y: reduceMotion ? 0 : 10, scale: reduceMotion ? 1 : 0.98 },
                show: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { duration: reduceMotion ? 0 : 0.34, ease: [0.16, 1, 0.3, 1] },
                },
              }}
              className="relative min-w-0 overflow-hidden rounded-2xl border border-[#f8dcc0]/28 bg-[linear-gradient(145deg,rgba(38,11,18,0.72)_0%,rgba(13,47,36,0.54)_100%)] px-2.5 py-2.5 shadow-[0_16px_34px_rgba(0,0,0,0.36),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-[1.5px]"
            >
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,225,196,0.74),transparent)]"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-[#f4c89d]/10 blur-xl"
                aria-hidden
              />
              <div className="flex h-full min-w-0 flex-col gap-1.5">
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="inline-flex max-w-full items-center gap-1 rounded-full border border-[#f8dcc0]/18 bg-[#120607]/26 px-1.5 py-0.5 text-[0.38rem] font-bold uppercase tracking-[0.14em] text-[#ffd8b5]/90">
                    {renderProviderIcon(acc)}
                    <span className="truncate">
                      {acc.category === "bank"
                        ? EN_GIFT.accountTypeBank
                        : EN_GIFT.accountTypeEwallet}
                    </span>
                  </p>
                  <p className="truncate text-[0.68rem] font-bold tracking-[0.04em] text-[#fff3e5] [text-shadow:0_2px_8px_rgba(0,0,0,0.72)]">
                    {acc.provider}
                  </p>
                  <p className="line-clamp-2 text-[0.45rem] leading-snug text-[#fff0df]/86">
                    <span className="font-semibold text-[#ffd8b5]">{EN_GIFT.accountName}:</span>{" "}
                    {acc.accountHolder}
                  </p>
                  <p className="text-[0.35rem] font-bold uppercase tracking-[0.18em] text-[#f4c89d]/74">
                    {EN_GIFT.accountNumber}
                  </p>
                  <p className="truncate font-mono text-[0.78rem] font-bold tracking-wide text-[#fff7e8] tabular-nums [text-shadow:0_2px_10px_rgba(0,0,0,0.78)] sm:text-[0.86rem]">
                    {acc.accountNumber}
                  </p>
                </div>
                <motion.button
                  data-cinematic-observe-ignore
                  type="button"
                  onClick={() => onCopy(acc.id, acc.accountNumber)}
                  aria-label={`${EN_GIFT.copy} ${acc.provider}`}
                  className="inline-flex w-full shrink-0 items-center justify-center gap-1 rounded-full border border-[#ffd8b5]/48 bg-[#f8dcc0]/12 px-2 py-1.5 text-[0.38rem] font-bold uppercase tracking-[0.12em] text-[#fff4e8] shadow-[0_8px_18px_rgba(0,0,0,0.3)] transition hover:bg-[#f8dcc0]/18 active:scale-95"
                >
                  {copiedId === acc.id ? (
                    <>
                      <Check className="h-3 w-3 text-[#c8e8d8]" aria-hidden />
                      {EN_GIFT.copied}
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 opacity-80" aria-hidden />
                      {EN_GIFT.copy}
                    </>
                  )}
                </motion.button>
              </div>
            </motion.li>
          ))}
        </motion.ul>

        <motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.38, delay: reduceMotion ? 0 : 0.08 }}
          className="mt-3 rounded-2xl border border-[#f8dcc0]/22 bg-[#120607]/30 px-3 py-2.5 shadow-[0_14px_30px_rgba(0,0,0,0.3)] backdrop-blur-[1.5px]"
        >
          <p className="text-[0.48rem] font-bold uppercase tracking-[0.22em] text-[#ffd8b5]/88">
            {EN_GIFT.sendGift}
          </p>
          <div className="mt-1.5 flex items-start gap-2">
            <MapPin className="mt-[1px] h-3.5 w-3.5 shrink-0 text-[#f4c89d]" aria-hidden />
            <p className="text-[0.54rem] leading-relaxed text-[#fff0df]/88">
              <span className="font-semibold text-[#fff7e8]">{GIFT_DELIVERY_LABEL}:</span>{" "}
              {GIFT_DELIVERY_ADDRESS}
            </p>
          </div>
        </motion.div>
        </div>
      </div>
    </div>
  );
}

export function createGiftSlide(): SlideConfig {
  return {
    id: "gift",
    refCount: 1,
    exitOrder: [{ refIndex: 0, type: "frame" }],
    enterOrder: [{ refIndex: 0, type: "frame" }],
    render: (refs) => <GiftCinematicSlide refs={refs} />,
  };
}

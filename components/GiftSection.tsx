"use client";

import { Check, Copy, Landmark, MapPin, Wallet } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useId, useState } from "react";

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
  title: "Gift Registry",
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

  const onCopy = useCallback(async (id: string, number: string) => {
    const ok = await copyToClipboard(number.replace(/\s/g, ""));
    if (ok) {
      setCopiedId(id);
      setLiveMessage(EN_GIFT.copiedToast);
      window.setTimeout(() => {
        setCopiedId((cur) => (cur === id ? null : cur));
        setLiveMessage("");
      }, 2200);
    } else {
      setLiveMessage(EN_GIFT.copyFailToast);
      window.setTimeout(() => setLiveMessage(""), 3200);
    }
  }, []);

  const renderProviderIcon = (acc: TGiftAccount) => {
    if (acc.category === "ewallet") {
      return <Wallet className="h-4 w-4 text-[#f3dac3]/88" aria-hidden />;
    }
    return <Landmark className="h-4 w-4 text-[#f3dac3]/88" aria-hidden />;
  };

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center px-3 py-4 sm:px-4">
      <p id={liveId} className="sr-only" aria-live="polite">
        {liveMessage}
      </p>

      <div
        ref={(el) => {
          refs[0]?.(el);
        }}
        className="relative w-full max-w-[360px] origin-center animate-float"
      >
        <div className="pointer-events-none absolute -left-6 top-8 z-[2] h-20 w-20 opacity-72">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/opening/flower-1.png"
            alt=""
            className="h-full w-full object-contain animate-zoom-in-out"
          />
        </div>
        <div className="pointer-events-none absolute -right-6 top-8 z-[2] h-20 w-20 opacity-72">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/opening/flower-2.png"
            alt=""
            className="h-full w-full object-contain animate-zoom-in-out-delayed"
          />
        </div>

        <div className="relative z-10">
        <header className="text-center">
          <p
            data-cinematic-line
            className="text-[1.2rem] leading-none text-[#8a2b3e]"
            style={{
              fontFamily: "'Brittany Signature', serif",
              textShadow: "0 2px 10px rgba(0,0,0,0.46)",
            }}
          >
            {EN_GIFT.kicker}
          </p>
          <h2
            id={headingId}
            data-cinematic-line
            className="mt-0.5 text-[0.9rem] font-semibold leading-tight tracking-[0.14em] uppercase text-[#f1dfcf]"
            style={{
              fontFamily: "var(--font-cormorant), serif",
              textShadow: "0 2px 10px rgba(0,0,0,0.45)",
            }}
          >
            {EN_GIFT.title}
          </h2>
          <div className="mx-auto mt-1 h-px w-20 bg-[linear-gradient(90deg,transparent,rgba(240,226,212,0.6),transparent)]" />
          <p
            data-cinematic-line
            className="mx-auto mt-1 max-w-[30ch] text-[0.54rem] leading-relaxed text-[#e7d8cb]/90"
            style={{
              fontFamily: "var(--font-cormorant), serif",
              textShadow: "0 1px 8px rgba(0,0,0,0.4)",
            }}
          >
            {EN_GIFT.intro}
          </p>
        </header>

        <motion.ul
          data-cinematic-observe-ignore
          className="mt-2 space-y-0 pr-0.5"
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
              className="border-b border-[#efe0d0]/14 py-1.5 last:border-b-0"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0 flex-1 space-y-1.5">
                  <p className="flex items-center gap-1 text-[0.44rem] font-semibold uppercase tracking-[0.2em] text-[#f0dccb]/66">
                    {renderProviderIcon(acc)}
                    {acc.category === "bank"
                      ? EN_GIFT.accountTypeBank
                      : EN_GIFT.accountTypeEwallet}
                  </p>
                  <p className="text-[0.68rem] font-semibold text-[#f6e9de]">{acc.provider}</p>
                  <p className="text-[0.5rem] text-[#e9ddd3]/82">
                    <span className="font-medium text-[#f4e7dc]">{EN_GIFT.accountName}:</span>{" "}
                    {acc.accountHolder}
                  </p>
                  <p className="text-[0.42rem] font-medium uppercase tracking-[0.18em] text-[#f0dccb]/66">
                    {EN_GIFT.accountNumber}
                  </p>
                  <p className="font-mono text-[0.76rem] font-semibold tracking-wide text-[#f7eadf] tabular-nums sm:text-[0.82rem]">
                    {acc.accountNumber}
                  </p>
                </div>
                <motion.button
                  data-cinematic-observe-ignore
                  type="button"
                  onClick={() => onCopy(acc.id, acc.accountNumber)}
                  aria-label={`${EN_GIFT.copy} ${acc.provider}`}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#ecddce]/26 px-2 py-1 text-[0.44rem] font-semibold uppercase tracking-[0.14em] text-[#f6ebdf]/94 transition"
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
          data-cinematic-observe-ignore
          initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.38, delay: reduceMotion ? 0 : 0.08 }}
          className="mt-2 border-t border-[#efe0d0]/16 pt-2"
        >
          <p className="text-[0.44rem] font-semibold uppercase tracking-[0.2em] text-[#f0dccb]/74">
            {EN_GIFT.sendGift}
          </p>
          <div className="mt-1.5 flex items-start gap-1.5">
            <MapPin className="mt-[1px] h-3.5 w-3.5 shrink-0 text-[#f1d7be]/82" aria-hidden />
            <p className="text-[0.5rem] leading-relaxed text-[#ece1d4]/84">
              <span className="font-medium text-[#f6eadf]">{GIFT_DELIVERY_LABEL}:</span>{" "}
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

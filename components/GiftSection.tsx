"use client";

import { Check, Copy } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useId, useState } from "react";

import { SectionScrollBlend } from "@/components/SectionScrollBlend";
import { PLACEHOLDER_GIFT_ACCOUNTS } from "@/lib/constants/gift-accounts";
import {
  UI_GIFT_ACCOUNT_NAME_LABEL,
  UI_GIFT_ACCOUNT_NUMBER_LABEL,
  UI_GIFT_BANK_LABEL,
  UI_GIFT_COPY_FAILED,
  UI_GIFT_COPY_NUMBER,
  UI_GIFT_COPIED,
  UI_GIFT_INTRO,
  UI_GIFT_KICKER,
  UI_GIFT_TITLE,
} from "@/lib/constants/messages.id";
import { SECTION_SCROLL_BLEND } from "@/lib/section-scroll-blends";

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

export function GiftSection() {
  const reduceMotion = useReducedMotion();
  const blend = SECTION_SCROLL_BLEND.gift;
  const headingId = useId();
  const liveId = useId();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [liveMessage, setLiveMessage] = useState("");

  const onCopy = useCallback(async (id: string, number: string) => {
    const ok = await copyToClipboard(number.replace(/\s/g, ""));
    if (ok) {
      setCopiedId(id);
      setLiveMessage(UI_GIFT_COPIED);
      window.setTimeout(() => {
        setCopiedId((cur) => (cur === id ? null : cur));
        setLiveMessage("");
      }, 2200);
    } else {
      setLiveMessage(UI_GIFT_COPY_FAILED);
      window.setTimeout(() => setLiveMessage(""), 3200);
    }
  }, []);

  return (
    <motion.section
      aria-labelledby={headingId}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: reduceMotion ? 0 : 0.65, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden px-5 py-16 sm:px-8 sm:py-20"
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(170deg,#f0ebe6_0%,#faf7f4_48%,#e8f0ea_100%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(rgb(36 92 72 / 0.04) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />
      <SectionScrollBlend top={blend.top} bottom={blend.bottom} />
      <div className="pointer-events-none absolute -left-16 top-20 h-40 w-40 opacity-[0.14]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/flowers/30.png" alt="" className="h-full w-full object-contain" />
      </div>
      <div className="pointer-events-none absolute -right-12 bottom-24 h-36 w-36 opacity-[0.12]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/flowers/24.png" alt="" className="h-full w-full object-contain" />
      </div>

      <p id={liveId} className="sr-only" aria-live="polite">
        {liveMessage}
      </p>

      <div className="relative z-10 mx-auto w-full max-w-lg">
        <header className="text-center">
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.32em] text-[var(--inv-primary)]/75">
            {UI_GIFT_KICKER}
          </p>
          <h2
            id={headingId}
            className="mt-2 text-[1.85rem] font-medium leading-tight tracking-tight text-[var(--inv-accent)] [font-family:var(--font-display)] sm:text-[2.05rem]"
          >
            {UI_GIFT_TITLE}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[var(--inv-ink-muted)]">
            {UI_GIFT_INTRO}
          </p>
        </header>

        <motion.ul
          className="mt-10 space-y-4"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
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
          {PLACEHOLDER_GIFT_ACCOUNTS.map((acc) => (
            <motion.li
              key={acc.id}
              variants={{
                hidden: { opacity: 0, y: reduceMotion ? 0 : 14, scale: reduceMotion ? 1 : 0.98 },
                show: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { duration: reduceMotion ? 0 : 0.45, ease: [0.16, 1, 0.3, 1] },
                },
              }}
              className="rounded-[3px] border border-[rgb(36_92_72_/_0.12)] bg-white/75 p-4 shadow-[0_14px_40px_rgba(36_92_72_/_0.06)] backdrop-blur-sm sm:p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1 space-y-2">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[#8a7568]">
                    {UI_GIFT_BANK_LABEL}
                  </p>
                  <p className="text-base font-semibold text-[var(--inv-primary)]">{acc.bankName}</p>
                  <p className="text-xs text-[var(--inv-ink-muted)]">
                    <span className="font-medium text-[var(--inv-ink)]">{UI_GIFT_ACCOUNT_NAME_LABEL}:</span>{" "}
                    {acc.accountHolder}
                  </p>
                  <p className="text-[0.65rem] font-medium uppercase tracking-[0.18em] text-[#8a7568]">
                    {UI_GIFT_ACCOUNT_NUMBER_LABEL}
                  </p>
                  <p className="font-mono text-lg font-semibold tracking-wide text-[var(--inv-ink)] tabular-nums sm:text-xl">
                    {acc.accountNumber}
                  </p>
                </div>
                <motion.button
                  type="button"
                  whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                  onClick={() => onCopy(acc.id, acc.accountNumber)}
                  aria-label={`${UI_GIFT_COPY_NUMBER} ${acc.bankName}`}
                  className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[var(--inv-primary)]/25 bg-[var(--inv-primary)]/6 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--inv-primary)] transition hover:border-[var(--inv-primary)]/40 hover:bg-[var(--inv-primary)]/10"
                >
                  {copiedId === acc.id ? (
                    <>
                      <Check className="h-4 w-4 text-[var(--inv-primary)]" aria-hidden />
                      {UI_GIFT_COPIED}
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 opacity-80" aria-hidden />
                      {UI_GIFT_COPY_NUMBER}
                    </>
                  )}
                </motion.button>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </motion.section>
  );
}

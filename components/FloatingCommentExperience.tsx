"use client";

import Image from "next/image";
import {
  Eye,
  EyeOff,
  MessageCircle,
  Send,
  User,
  X,
  Heart,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import {
  COMMENT_BODY_KEY_ANONYMOUS,
  COMMENT_BODY_KEY_MESSAGE,
  COMMENT_BODY_KEY_SLUG,
  COMMENT_FETCH_LIMIT,
  COMMENT_FLOATING_PREF_KEY,
  COMMENT_MAX_LENGTH,
} from "@/lib/constants/comments";
import {
  UI_COMMENT_ANONYMOUS_HELPER,
  UI_COMMENT_BUTTON,
  UI_COMMENT_CLOSE,
  UI_COMMENT_EMPTY,
  UI_COMMENT_ERROR_GENERIC,
  UI_COMMENT_ERROR_NETWORK,
  UI_COMMENT_FLOATING_LABEL,
  UI_COMMENT_FLOATING_OFF,
  UI_COMMENT_FLOATING_ON,
  UI_COMMENT_INTRO,
  UI_COMMENT_KICKER,
  UI_COMMENT_LIST_ARIA,
  UI_COMMENT_OPEN,
  UI_COMMENT_PLACEHOLDER,
  UI_COMMENT_SEND_AS_ANONYMOUS,
  UI_COMMENT_SENDING_AS,
  UI_COMMENT_SUBMIT,
  UI_COMMENT_SUBMITTING,
  UI_COMMENT_SUCCESS,
  UI_COMMENT_TITLE,
  UI_COMMENT_UNAVAILABLE,
  UI_COMMENT_WRITE_LABEL,
} from "@/lib/constants/messages.id";
import type { TGuestComment } from "@/lib/types/comment.types";

type TFloatingCommentExperienceProps = {
  guestName: string;
  slug: string;
  initialComments: TGuestComment[];
  commentsAvailable: boolean;
};

type TFloatingChip = {
  key: string;
  lane: number;
  duration: number;
  rotation: number;
  colorIndex: number;
  comment: TGuestComment;
};

const FLOATING_LANES = [-2, 0, 2, 4, 6] as const;
const MAX_FLOATING_CHIPS = 3;
const POLL_INTERVAL_MS = 18000;
const COMMENT_TIMEZONE = "Asia/Makassar";

function toTimestamp(value: string): number {
  const time = Date.parse(value);
  return Number.isNaN(time) ? 0 : time;
}

function sortComments(a: TGuestComment, b: TGuestComment): number {
  const delta = toTimestamp(b.createdAt) - toTimestamp(a.createdAt);
  if (delta !== 0) return delta;
  return b.sheetRowIndex - a.sheetRowIndex;
}

function mergeComments(comments: TGuestComment[]): TGuestComment[] {
  const map = new Map<string, TGuestComment>();

  for (const comment of comments) {
    const current = map.get(comment.id);
    if (!current || comment.sheetRowIndex > current.sheetRowIndex) {
      map.set(comment.id, comment);
    }
  }

  return Array.from(map.values())
    .sort(sortComments)
    .slice(0, COMMENT_FETCH_LIMIT);
}

function truncateFloatingMessage(message: string): string {
  const normalized = message.trim();
  if (normalized.length <= 76) return normalized;
  return `${normalized.slice(0, 73).trimEnd()}...`;
}

function formatCommentDate(createdAt: string): string {
  const parsed = new Date(createdAt);
  if (Number.isNaN(parsed.valueOf())) return "";
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: COMMENT_TIMEZONE,
  }).format(parsed);
}

export function FloatingCommentExperience({
  guestName,
  slug,
  initialComments,
  commentsAvailable,
}: TFloatingCommentExperienceProps) {
  const reduceMotion = useReducedMotion();
  const dialogTitleId = useId();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [comments, setComments] = useState<TGuestComment[]>(() =>
    mergeComments(initialComments),
  );
  const [isAvailable, setIsAvailable] = useState(commentsAvailable);
  const [message, setMessage] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [floatingEnabled, setFloatingEnabled] = useState(true);
  const [prefReady, setPrefReady] = useState(false);
  const [floatingChips, setFloatingChips] = useState<TFloatingChip[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [feedback, setFeedback] = useState("");
  const [website, setWebsite] = useState(""); // Honeypot field

  const [isFabExpanded, setIsFabExpanded] = useState(true);

  // Auto-collapse FAB after 5s or when scrolling
  useEffect(() => {
    if (!isFabExpanded) return;

    const timer = setTimeout(() => {
      setIsFabExpanded(false);
    }, 5000);

    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsFabExpanded(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isFabExpanded]);

  const handleFabClick = useCallback(() => {
    if (!isFabExpanded) {
      setIsFabExpanded(true);
    } else {
      setIsPanelOpen(true);
    }
  }, [isFabExpanded]);


  const commentsRef = useRef(comments);
  const seenIdsRef = useRef<Set<string>>(new Set(initialComments.map((item) => item.id)));
  const priorityQueueRef = useRef<string[]>([]);
  const cycleIndexRef = useRef(0);

  useEffect(() => {
    commentsRef.current = comments;
  }, [comments]);

  useEffect(() => {
    const discovered = new Set<string>();
    for (const comment of comments) {
      discovered.add(comment.id);
      if (!seenIdsRef.current.has(comment.id)) {
        priorityQueueRef.current.push(comment.id);
      }
    }
    seenIdsRef.current = discovered;
  }, [comments]);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(COMMENT_FLOATING_PREF_KEY);
      if (stored === "0") {
        setFloatingEnabled(false);
      }
    } catch {
      // Ignore storage read failures and keep the default.
    } finally {
      setPrefReady(true);
    }
  }, []);

  useEffect(() => {
    if (!prefReady) return;
    try {
      window.localStorage.setItem(
        COMMENT_FLOATING_PREF_KEY,
        floatingEnabled ? "1" : "0",
      );
    } catch {
      // Ignore storage write failures.
    }
  }, [floatingEnabled, prefReady]);

  useEffect(() => {
    if (!isPanelOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsPanelOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isPanelOpen]);

  useEffect(() => {
    if (!isPanelOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isPanelOpen]);

  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch("/api/comments", { cache: "no-store" });
      const data = (await res.json()) as {
        comments?: TGuestComment[];
        available?: boolean;
      };
      if (!res.ok) return;
      setIsAvailable(Boolean(data.available));
      if (Array.isArray(data.comments)) {
        const incomingComments = data.comments;
        setComments((current) => mergeComments([...incomingComments, ...current]));
      }
    } catch {
      // Polling should stay quiet.
    }
  }, []);

  useEffect(() => {
    void fetchComments();
  }, [fetchComments]);


  useEffect(() => {
    if (isPanelOpen || !prefReady || !floatingEnabled || reduceMotion) {
      setFloatingChips([]);
      return;
    }

    const timer = window.setInterval(() => {
      setFloatingChips((current) => {
        if (current.length >= MAX_FLOATING_CHIPS) return current;

        const sourcePool = commentsRef.current.slice(0, 12);
        if (sourcePool.length === 0) return current;

        let nextComment: TGuestComment | undefined;
        while (!nextComment && priorityQueueRef.current.length > 0) {
          const queuedId = priorityQueueRef.current.shift();
          nextComment = sourcePool.find((item) => item.id === queuedId);
        }

        if (!nextComment) {
          nextComment = sourcePool[cycleIndexRef.current % sourcePool.length];
          cycleIndexRef.current += 1;
        }

        if (!nextComment) return current;

        const usedLanes = new Set(current.map((item) => item.lane));
        const laneOptions = FLOATING_LANES.filter((lane) => !usedLanes.has(lane));
        const lanePool = laneOptions.length > 0 ? laneOptions : [...FLOATING_LANES];
        const lane = lanePool[Math.floor(Math.random() * lanePool.length)] ?? FLOATING_LANES[0];

        return [
          ...current,
          {
            key: `${nextComment.id}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            lane,
            duration: 8 + Math.random() * 4,
            rotation: -1.4 + Math.random() * 2.8,
            colorIndex: Math.floor(Math.random() * 5),
            comment: nextComment,
          },
        ];
      });
    }, 4800);

    return () => window.clearInterval(timer);
  }, [floatingEnabled, isPanelOpen, prefReady, reduceMotion]);

  const handlePanelClose = useCallback(() => {
    setIsPanelOpen(false);
    setStatus("idle");
    setFeedback("");
  }, []);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const trimmed = message.trim();
      if (!trimmed || status === "loading" || !isAvailable) return;

      setStatus("loading");
      setFeedback("");

      try {
        const res = await fetch("/api/comments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            [COMMENT_BODY_KEY_SLUG]: slug,
            [COMMENT_BODY_KEY_MESSAGE]: trimmed,
            [COMMENT_BODY_KEY_ANONYMOUS]: anonymous,
            website, // Send honeypot value
          }),
        });
        const data = (await res.json()) as {
          comment?: TGuestComment;
          error?: string;
        };

        if (!res.ok || !data.comment) {
          setStatus("err");
          setFeedback(data.error ?? UI_COMMENT_ERROR_GENERIC);
          return;
        }

        const createdComment = data.comment;
        setComments((current) => mergeComments([createdComment, ...current]));
        setMessage("");
        setAnonymous(false);
        setStatus("ok");
        setFeedback(UI_COMMENT_SUCCESS);
      } catch {
        setStatus("err");
        setFeedback(UI_COMMENT_ERROR_NETWORK);
      }
    },
    [anonymous, isAvailable, message, slug, status],
  );

  const visibleCount = comments.length;
  const submitDisabled =
    status === "loading" ||
    !isAvailable ||
    message.trim().length === 0 ||
    message.trim().length > COMMENT_MAX_LENGTH;

  const senderLabel = anonymous ? "Anonymous" : guestName;
  const floatingLabel = floatingEnabled
    ? UI_COMMENT_FLOATING_ON
    : UI_COMMENT_FLOATING_OFF;
  const floatingShouldRender =
    !isPanelOpen &&
    prefReady &&
    floatingEnabled &&
    !reduceMotion &&
    comments.length > 0;

  const recentComments = comments;

  return (
    <>
      <AnimatePresence>
        {floatingShouldRender ? (
          <div
            aria-hidden
            className="pointer-events-none fixed inset-0 z-[52] overflow-hidden"
          >
            {floatingChips.map((chip) => (
              <div
                key={chip.key}
                className="animate-floating-comment absolute bottom-[10rem] md:bottom-[8.5rem] right-[3rem]"
                style={{
                  animationDuration: `${chip.duration}s`,
                  marginRight: `${chip.lane}vw`,
                }}
                onAnimationEnd={() => {
                  setFloatingChips((current) =>
                    current.filter((item) => item.key !== chip.key),
                  );
                }}
              >
                <div
                  className="relative flex max-w-[65vw] items-center gap-2.5 rounded-full border border-white/40 bg-white/70 px-4 py-2.5 shadow-[0_8px_24px_rgba(0,0,0,0.06)] backdrop-blur-md sm:max-w-[16rem]"
                  style={{ 
                    transform: `rotate(${chip.rotation}deg)`,
                  }}
                >
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-[0.82rem] leading-snug text-[#2d3a33] [font-family:var(--font-cormorant),serif]">
                      &ldquo;{truncateFloatingMessage(chip.comment.message)}&rdquo;
                    </p>
                    <p className="mt-0.5 truncate text-[0.5rem] font-bold uppercase tracking-[0.2em] text-[#7b2332]/60">
                      {chip.comment.displayName}
                    </p>
                  </div>
                  
                  <div 
                    className={[
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-full shadow-sm transition-colors",
                      chip.colorIndex === 0 ? "bg-[#7b2332]/10 text-[#7b2332]" :
                      chip.colorIndex === 1 ? "bg-[#245c48]/10 text-[#245c48]" :
                      chip.colorIndex === 2 ? "bg-[#c9a882]/10 text-[#c9a882]" :
                      chip.colorIndex === 3 ? "bg-[#e89d81]/10 text-[#e89d81]" :
                      "bg-[#8a2436]/10 text-[#8a2436]"
                    ].join(" ")}
                  >
                    <MessageCircle className="h-3 w-3 fill-current" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {isPanelOpen ? (
          <motion.div
            key="comment-panel"
            className="fixed inset-0 z-[85]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.22 }}
          >
            <button
              type="button"
              aria-label={UI_COMMENT_CLOSE}
              className="absolute inset-0 bg-[linear-gradient(180deg,rgba(41,15,24,0.44)_0%,rgba(18,39,30,0.56)_100%)] backdrop-blur-[6px]"
              onClick={handlePanelClose}
            />

            <motion.section
              role="dialog"
              aria-modal="true"
              aria-labelledby={dialogTitleId}
              data-cinematic-observe-ignore
              className="absolute inset-0 overflow-hidden bg-[#fafafa]"
              initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduceMotion ? 0 : 18 }}
              transition={{ duration: reduceMotion ? 0 : 0.34, ease: [0.16, 1, 0.3, 1] }}
              onClick={(event) => event.stopPropagation()}
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
            >
              {/* Elegant Background Texture */}
              <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(#245c48_0.8px,transparent_0.8px)] [background-size:24px_24px]" />
              </div>

              <div className="pointer-events-none absolute -left-16 top-0 h-56 w-56 opacity-[0.08]">
                <Image
                  src="/assets/flowers/flower-new-1.webp"
                  alt=""
                  fill
                  className="object-contain"
                />
              </div>
              <div className="pointer-events-none absolute -right-16 bottom-24 h-64 w-64 opacity-[0.06]">
                <Image
                  src="/assets/flowers/flower-new-2.webp"
                  alt=""
                  fill
                  className="object-contain"
                />
              </div>

              <div className="relative z-10 flex h-full flex-col">
                <header className="px-6 pb-6 pt-10">
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="block text-[0.65rem] font-bold uppercase tracking-[0.4em] text-[#245c48]/50 mb-1">
                        Guest Book
                      </span>
                      <h2
                        id={dialogTitleId}
                        className="text-[2.6rem] leading-none text-[#1a1a1a]"
                        style={{ fontFamily: "'Brittany Signature', serif" }}
                      >
                        {UI_COMMENT_TITLE}
                      </h2>
                    </div>

                    <button
                      type="button"
                      onClick={handlePanelClose}
                      aria-label={UI_COMMENT_CLOSE}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-black/5 bg-white text-[#1a1a1a] shadow-[0_8px_16px_rgba(0,0,0,0.06)] transition active:scale-90"
                    >
                      <X className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setFloatingEnabled((current) => !current)}
                    className={[
                      "mt-6 flex w-full items-center justify-between gap-3 rounded-[1.25rem] border px-4 py-3 text-left transition active:scale-[0.99]",
                      floatingEnabled
                        ? "border-[#245c48]/14 bg-[#f6fbf8] text-[#245c48]"
                        : "border-gray-200 bg-gray-50 text-gray-500",
                    ].join(" ")}
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <span className={[
                        "flex h-10 w-10 items-center justify-center rounded-full border border-current/15 bg-white/80",
                        floatingEnabled ? "text-[#245c48]" : "text-gray-400"
                      ].join(" ")}>
                        {floatingEnabled ? <Eye className="h-4 w-4" strokeWidth={2} /> : <EyeOff className="h-4 w-4" strokeWidth={2} />}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[0.76rem] font-bold uppercase tracking-[0.24em]">
                          Floating Comments
                        </span>
                        <span className="mt-1 block text-[0.88rem] leading-relaxed [font-family:var(--font-cormorant),serif]">
                          {floatingEnabled ? "Visible on screen." : "Currently hidden."}
                        </span>
                      </span>
                    </span>

                    <span
                      className={[
                        "relative flex h-7 w-12 shrink-0 rounded-full border transition",
                        floatingEnabled
                          ? "border-[#245c48]/18 bg-[#245c48]"
                          : "border-gray-300 bg-gray-200",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "absolute left-1 top-1 h-4.5 w-4.5 rounded-full bg-white transition-transform",
                          floatingEnabled ? "translate-x-5" : "translate-x-0",
                        ].join(" ")}
                      />
                    </span>
                  </button>
                </header>

                <div
                  aria-label={UI_COMMENT_LIST_ARIA}
                  className="flex-1 min-h-0 overflow-y-auto px-5 pb-4"
                >
                  <div className="space-y-3">
                    {recentComments.length === 0 ? (
                      <div className="rounded-[1.7rem] border border-[#edd9c6]/75 bg-[#fbfbfa]/72 px-5 py-6 text-center shadow-[0_14px_30px_rgba(34,56,47,0.08)] backdrop-blur-sm">
                        <p className="text-[1rem] leading-relaxed text-[#53615a] [font-family:var(--font-cormorant),serif]">
                          {UI_COMMENT_EMPTY}
                        </p>
                      </div>
                    ) : (
                      recentComments.map((comment) => {
                        const formattedDate = formatCommentDate(comment.createdAt);

                        return (
                          <article
                            key={comment.id}
                            className="group relative overflow-hidden rounded-[2rem] border border-black/[0.03] bg-white p-6 shadow-[0_8px_20px_rgba(0,0,0,0.02)] transition-all hover:shadow-[0_12px_28px_rgba(0,0,0,0.04)]"
                          >
                            <div className="absolute -right-2 -top-2 opacity-[0.03] transition-transform group-hover:scale-110">
                              <Heart className="h-20 w-20 fill-current text-[#7b2332]" />
                            </div>

                            <div className="relative z-10">
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                  <div className="h-1.5 w-1.5 rounded-full bg-[#245c48]/40" />
                                  <p className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-[#245c48]/60">
                                    {comment.displayName}
                                  </p>
                                </div>
                                <span className="text-[0.6rem] font-medium tracking-wider text-gray-300">
                                  {formattedDate}
                                </span>
                              </div>

                              <p className="mt-3 text-[1.12rem] leading-[1.6] text-[#2d3a33] [font-family:var(--font-cormorant),serif]">
                                &ldquo;{comment.message}&rdquo;
                              </p>
                            </div>
                          </article>
                        );
                      })
                    )}
                  </div>
                </div>

                <div className="relative border-t border-black/[0.04] bg-white px-6 pb-[calc(env(safe-area-inset-bottom)+1.25rem)] pt-6">
                  <form onSubmit={handleSubmit} className="relative space-y-4" noValidate>
                    <div className="relative">
                      <textarea
                        id="guest-comment"
                        value={message}
                        onChange={(event) => {
                          setMessage(event.target.value);
                          if (status !== "idle") {
                            setStatus("idle");
                            setFeedback("");
                          }
                        }}
                        placeholder={UI_COMMENT_PLACEHOLDER}
                        maxLength={COMMENT_MAX_LENGTH}
                        rows={3}
                        disabled={!isAvailable || status === "loading"}
                        className="w-full resize-none rounded-[1.5rem] border border-black/[0.06] bg-[#fbfbfa] px-5 py-4 text-[1rem] leading-relaxed text-[#1a1a1a] shadow-sm transition placeholder:text-gray-400 focus:border-[#245c48]/30 focus:bg-white focus:ring-4 focus:ring-[#245c48]/5 [font-family:var(--font-cormorant),serif] disabled:opacity-50"
                      />
                      
                      <div className="absolute bottom-4 right-5 flex items-center gap-3">
                         <span className="text-[0.65rem] font-bold tabular-nums tracking-widest text-gray-300">
                          {message.trim().length}/{COMMENT_MAX_LENGTH}
                        </span>
                      </div>
                    </div>

                    {/* Honeypot field - hidden from humans */}
                    <div className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
                      <input
                        type="text"
                        name="website"
                        tabIndex={-1}
                        autoComplete="off"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => setAnonymous((current) => !current)}
                      disabled={!isAvailable || status === "loading"}
                      className={[
                        "flex w-full items-center justify-between gap-3 rounded-[1.25rem] border px-4 py-3 text-left transition active:scale-[0.99]",
                        anonymous
                          ? "border-[#7b2332]/22 bg-[#fff3f1] text-[#7b2332]"
                          : "border-[#245c48]/14 bg-[#f6fbf8] text-[#245c48]",
                        "disabled:cursor-not-allowed disabled:opacity-60",
                      ].join(" ")}
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-current/15 bg-white/80">
                          <User className="h-4 w-4" strokeWidth={2} aria-hidden />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-[0.76rem] font-semibold uppercase tracking-[0.24em]">
                            {UI_COMMENT_SEND_AS_ANONYMOUS}
                          </span>
                          <span className="mt-1 block text-[0.88rem] leading-relaxed [font-family:var(--font-cormorant),serif]">
                            {anonymous
                              ? UI_COMMENT_ANONYMOUS_HELPER
                              : `${UI_COMMENT_SENDING_AS} ${guestName}.`}
                          </span>
                        </span>
                      </span>

                      <span
                        className={[
                          "relative flex h-7 w-12 shrink-0 rounded-full border transition",
                          anonymous
                            ? "border-[#7b2332]/18 bg-[#7b2332]"
                            : "border-[#245c48]/15 bg-[#dcece5]",
                        ].join(" ")}
                        aria-hidden
                      >
                        <span
                          className={[
                            "absolute top-[2px] h-5 w-5 rounded-full bg-white shadow-sm transition",
                            anonymous ? "left-[24px]" : "left-[2px]",
                          ].join(" ")}
                        />
                      </span>
                    </button>

                    <button
                      type="submit"
                      disabled={submitDisabled}
                      className="flex w-full items-center justify-center gap-3 rounded-[1.25rem] bg-[#245c48] px-6 py-4 text-white shadow-[0_8px_20px_rgba(36,92,72,0.25)] transition active:scale-[0.98] disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none"
                    >
                      <Send className="h-4 w-4" />
                      <span className="text-[0.72rem] font-black uppercase tracking-[0.2em]">
                        {status === "loading" ? "Sending..." : "Send Wish"}
                      </span>
                    </button>

                    {feedback ? (
                      <p
                        role="status"
                        className={[
                          "rounded-xl px-4 py-2 text-[0.8rem] text-center",
                          status === "ok" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                        ].join(" ")}
                      >
                        {feedback}
                      </p>
                    ) : null}
                  </form>
                </div>
              </div>
            </motion.section>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        <motion.button
          key="comment-fab"
          type="button"
          onClick={handleFabClick}
          initial={{ opacity: 0, scale: 0.88, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.88, x: 20 }}
          className={[
            "group relative flex h-11 items-center rounded-full border border-[#cfe6db]/40 bg-[#245c48] text-white shadow-[0_8px_20px_rgba(36,92,72,0.3)] backdrop-blur-md transition-all duration-500 ease-in-out active:scale-95",
            isFabExpanded ? "px-4" : "w-11 justify-center px-0",
          ].join(" ")}
          aria-label={UI_COMMENT_OPEN}
        >
          <div className="flex h-5 w-5 shrink-0 items-center justify-center">
            <MessageCircle className="h-5 w-5 shrink-0" strokeWidth={2} aria-hidden />
          </div>
          <div
            className={[
              "flex items-center overflow-hidden whitespace-nowrap transition-all duration-500 ease-in-out",
              isFabExpanded ? "max-w-[120px] ml-2.5 opacity-100" : "max-w-0 ml-0 opacity-0",
            ].join(" ")}
          >
            <span className="pr-1 text-[10px] font-black uppercase tracking-widest drop-shadow-sm">
              Send Wishes
            </span>
          </div>
          {visibleCount > 0 ? (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full border border-[#245c48]/20 bg-white px-1.5 text-[9px] font-black uppercase text-[#7b2332] shadow-md transition-transform duration-300">
              {visibleCount > 99 ? "99+" : visibleCount}
            </span>
          ) : null}
        </motion.button>
      </AnimatePresence>
    </>
  );
}

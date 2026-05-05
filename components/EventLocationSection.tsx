import { CalendarDays, Clock, ExternalLink, MapPin } from "lucide-react";
import type { SlideConfig } from "./CinematicScroll";

import type { TEventScheduleBlock } from "@/lib/types/event.types";

function splitVenueCopy(venue: string) {
  const parts = venue
    .split(/\\n|\n/)
    .map((part) => part.trim())
    .filter(Boolean);

  return {
    name: parts[0] ?? "Hulontalo Ballroom",
    address: parts.slice(1).join(" ") || parts[0] || "",
  };
}

function formatTimeWithZone(time: string) {
  const trimmed = time.trim();
  if (!trimmed) return "WITA";
  return /\bWITA\b/i.test(trimmed) ? trimmed : `${trimmed} WITA`;
}

function formatEventDate(date: string) {
  const trimmed = date.trim();
  const match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(trimmed);
  if (!match) return trimmed;

  const [, day, month, year] = match;
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthIndex = Number(month) - 1;
  const monthName = monthNames[monthIndex];

  return monthName ? `${Number(day)} ${monthName} ${year}` : trimmed;
}

/**
 * Slide component for the Event Location & Time.
 * Uses the building illustration and maroon frame.
 */
export function createEventLocationSlide(
  akad: TEventScheduleBlock,
  resepsi: TEventScheduleBlock,
  showAkad: boolean,
  showResepsi: boolean
): SlideConfig {
  const primarySchedule = showResepsi ? resepsi : akad;
  const primaryVenue = splitVenueCopy(primarySchedule.venue);
  const mapUrl = primarySchedule.mapUrl || resepsi.mapUrl || akad.mapUrl;
  const scheduleItems = [
    showAkad ? akad : null,
    showResepsi ? resepsi : null,
  ].filter((item): item is TEventScheduleBlock => Boolean(item));

  return {
    id: "event-location",
    refCount: 3,
    exitOrder: [
      { refIndex: 1, type: "flower" },
      { refIndex: 2, type: "flower" },
      { refIndex: 0, type: "frame" },
    ],
    enterOrder: [
      { refIndex: 0, type: "frame" },
      { refIndex: 1, type: "flower" },
      { refIndex: 2, type: "flower" },
    ],
    render: (refs) => (
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          ref={refs[0]}
          className="relative origin-center animate-float"
          style={{
            width: "100%",
            marginTop: "-5%",
            marginBottom: "-5%",
          }}
        >
          {/* Frame image */}
          <img
            src="/assets/frame/date.jpg"
            alt=""
            onError={(e) => { e.currentTarget.src = "/assets/frame/date.png"; }}
            className="h-auto w-full animate-frame-pulse drop-shadow-[0_20px_45px_rgba(0,0,0,0.35)]"
          />

          {/* Content Area */}
          <div
            className="absolute flex flex-col items-center justify-center text-center"
            style={{
              top: "22%",
              bottom: "26%",
              left: "27%",
              right: "27%",
              padding: "0",
            }}
          >
            <div data-cinematic-line className="mb-[1.45cqw] flex flex-col items-center">
              <p
                className="text-[length:1.9cqw] font-semibold uppercase tracking-[0.34em] text-[#f4c89d]/86 animate-glow-text"
                style={{ fontFamily: "var(--font-cormorant), serif" }}
              >
                Location
              </p>
              <h2
                className="mt-[0.45cqw] whitespace-nowrap text-[length:4.05cqw] font-semibold leading-none tracking-[0.06em] text-[#fff4e8] drop-shadow-[0_3px_14px_rgba(0,0,0,0.6)]"
                style={{ fontFamily: "var(--font-cormorant), serif" }}
              >
                Wedding Venue
              </h2>
              <div className="mt-[1.05cqw] h-px w-[14cqw] bg-[linear-gradient(90deg,transparent,rgba(244,200,157,0.7),transparent)]" />
            </div>

            {/* Middle Section: Building Illustration */}
            <div className="relative z-10 -my-[1.2cqw] aspect-[2/1] w-[105%] opacity-100 group">
               <img 
                src="/assets/frame/gedung.jpg" 
                alt="Venue Illustration"
                onError={(e) => { e.currentTarget.src = "/assets/frame/gedung.png"; }}
                className="absolute inset-0 h-full w-full object-contain filter brightness-[2.5] contrast-[1.2] animate-breathe-deep drop-shadow-[0_0_10px_rgba(251,251,250,0.3)] transition-transform duration-700 group-hover:scale-105" 
              />
            </div>

            <div className="grid w-full grid-cols-1 gap-[0.9cqw]">
              {scheduleItems.map((item) => (
                <div
                  key={item.title}
                  data-cinematic-line
                  className="rounded-[1.5cqw] border border-[#f8dcc0]/22 bg-[#1c0810]/28 px-[1.45cqw] py-[1.05cqw] text-left shadow-[0_8px_18px_rgba(0,0,0,0.22)] backdrop-blur-[1px]"
                >
                  <p
                    className="text-[length:1.45cqw] font-bold uppercase tracking-[0.16em] text-[#f4c89d]/86"
                    style={{ fontFamily: "var(--font-cormorant), serif" }}
                  >
                    {item.title}
                  </p>
                  <div className="mt-[0.65cqw] flex flex-wrap items-center gap-x-[1.4cqw] gap-y-[0.55cqw] text-[#fff4e8]/92">
                    <span className="inline-flex items-center gap-[0.55cqw]">
                      <CalendarDays className="h-[1.55cqw] w-[1.55cqw] shrink-0 text-[#f4c89d]/80" strokeWidth={1.5} />
                      <span className="text-[length:1.45cqw] font-semibold leading-none">
                        {formatEventDate(item.date)}
                      </span>
                    </span>
                    <span className="inline-flex items-center gap-[0.55cqw]">
                      <Clock className="h-[1.55cqw] w-[1.55cqw] shrink-0 text-[#f4c89d]/80" strokeWidth={1.5} />
                      <span className="text-[length:1.45cqw] font-semibold leading-none">
                        {formatTimeWithZone(item.time)}
                      </span>
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div data-cinematic-line className="mt-[1.25cqw] flex w-full flex-col items-center rounded-[1.8cqw] border border-[#f8dcc0]/24 bg-[#100509]/34 px-[1.75cqw] py-[1.35cqw] shadow-[0_10px_24px_rgba(0,0,0,0.26),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-[1.5px]">
              <MapPin className="mb-[0.6cqw] h-[2.35cqw] w-[2.35cqw] text-[#f4c89d] animate-wiggle" strokeWidth={1.6} />
              <h3
                className="text-[length:2.35cqw] font-bold uppercase leading-tight tracking-[0.13em] text-[#fff7e8] animate-sway"
                style={{ fontFamily: "var(--font-cormorant), serif" }}
              >
                {primaryVenue.name}
              </h3>
              <p
                className="mt-[0.75cqw] text-[length:1.45cqw] font-medium leading-snug tracking-[0.02em] text-[#fff0df]/88 animate-drift"
                style={{ fontFamily: "var(--font-cormorant), serif" }}
              >
                {primaryVenue.address}
              </p>
              {mapUrl ? (
                <a
                  data-cinematic-observe-ignore
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-[1cqw] inline-flex items-center gap-[0.65cqw] rounded-full border border-[#ffd8b5]/45 bg-[#f8dcc0]/12 px-[1.95cqw] py-[0.85cqw] text-[length:1.3cqw] font-bold uppercase tracking-[0.14em] text-[#fff7e8] shadow-[0_6px_14px_rgba(0,0,0,0.24)] transition hover:bg-[#f8dcc0]/18"
                >
                  Open Maps
                  <ExternalLink className="h-[1.45cqw] w-[1.45cqw]" strokeWidth={1.7} />
                </a>
              ) : null}
            </div>
          </div>

          {/* Decorative Flowers (Refined Side placement) */}
          <div
            ref={refs[1]}
            className="absolute z-10 pointer-events-none"
            style={{ top: "25%", left: "-20%", width: "75%", aspectRatio: "1" }}
          >
            <img 
              src="/assets/flowers/bunga-ayat.webp" 
              alt="" 
              onError={(e) => { e.currentTarget.src = "/assets/flowers/bunga-ayat.webp"; }}
              className="absolute inset-0 h-full w-full object-contain animate-zoom-in-out" 
            />
          </div>
          <div
            ref={refs[2]}
            className="absolute z-10 pointer-events-none"
            style={{ top: "30%", right: "-20%", width: "75%", aspectRatio: "1" }}
          >
            <img 
              src="/assets/flowers/bunga-ayat.webp" 
              alt="" 
              onError={(e) => { e.currentTarget.src = "/assets/flowers/bunga-ayat.webp"; }}
              className="absolute inset-0 h-full w-full object-contain animate-zoom-in-out-delayed" 
            />
          </div>
        </div>
      </div>
    ),
  };
}

import type { TEventScheduleBlock } from "@/lib/types/event.types";

function readPublicEnv(key: string, fallback: string): string {
  const v = process.env[key];
  return v?.trim() ? v.trim() : fallback;
}

export function getAkadSchedule(): TEventScheduleBlock {
  return {
    title: readPublicEnv("NEXT_PUBLIC_AKAD_TITLE", "Akad Nikah"),
    date: readPublicEnv("NEXT_PUBLIC_AKAD_DATE", "—"),
    time: readPublicEnv("NEXT_PUBLIC_AKAD_TIME", "—"),
    venue: readPublicEnv("NEXT_PUBLIC_AKAD_VENUE", "Alamat akad (atur di .env)"),
    mapUrl: readPublicEnv("NEXT_PUBLIC_AKAD_MAP_URL", ""),
  };
}

export function getResepsiSchedule(): TEventScheduleBlock {
  return {
    title: readPublicEnv("NEXT_PUBLIC_RESEPSI_TITLE", "Resepsi"),
    date: readPublicEnv("NEXT_PUBLIC_RESEPSI_DATE", "—"),
    time: readPublicEnv("NEXT_PUBLIC_RESEPSI_TIME", "—"),
    venue: readPublicEnv(
      "NEXT_PUBLIC_RESEPSI_VENUE",
      "Alamat resepsi (atur di .env)",
    ),
    mapUrl: readPublicEnv("NEXT_PUBLIC_RESEPSI_MAP_URL", ""),
  };
}

export function getCoupleDisplayHeading(): string {
  return readPublicEnv("NEXT_PUBLIC_COUPLE_NAMES", "Nama Mempelai");
}

export function getGalleryAssetPaths(): string[] {
  const raw = process.env.NEXT_PUBLIC_GALLERY_PATHS?.trim();
  if (!raw) return [];
  return raw.split(",").map((s) => s.trim()).filter(Boolean);
}

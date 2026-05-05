import type { Metadata } from "next";


import { DevSheetsBanner } from "@/components/DevSheetsBanner";

import { InviteCriticalLoadGate } from "@/components/InviteCriticalLoadGate";
import { OpeningGate } from "@/components/OpeningGate";
import { getResolvedGalleryPaths } from "@/lib/gallery";
import {
  UI_GUEST_NOT_FOUND_DESC,
  UI_GUEST_NOT_FOUND_TITLE,
  UI_INVITE_LINK_INCOMPLETE_DESC,
  UI_INVITE_LINK_INCOMPLETE_TITLE,
  UI_OG_INCOMPLETE_DESCRIPTION,
  UI_OG_INCOMPLETE_TITLE,
  UI_OG_NOT_FOUND_DESCRIPTION,
  UI_OG_NOT_FOUND_TITLE,
  UI_OG_SITE_NAME,
  uiOgInviteDescription,
  uiOgInviteTitle,
} from "@/lib/constants/messages.id";
import {
  getAkadSchedule,
  getCoupleDisplayHeading,
  getResepsiSchedule,
} from "@/lib/event-config";
import { isAkadSectionVisible, isResepsiSectionVisible } from "@/lib/guest";
import { createLogger } from "@/lib/logger";
import { getGuestsData } from "@/lib/sheets";
import { normalizeInvitationQueryParam } from "@/lib/slug";

const log = createLogger("page:invitation");

export const dynamic = "force-dynamic";

/** Gambar pratinjau tautan (WhatsApp, dll.); berkas di `public/`. */
const OG_IMAGE_PATH = "/assets/gallery/gallery-moment-04.jpeg";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ to?: string }>;
}): Promise<Metadata> {
  const { to } = await searchParams;
  const slug = typeof to === "string" ? normalizeInvitationQueryParam(to) : "";
  const couple = getCoupleDisplayHeading();

  const sharedImage = {
    url: OG_IMAGE_PATH,
    width: 1200,
    height: 800,
    alt: `Undangan pernikahan ${couple}`,
  };

  const sharedOg = {
    siteName: UI_OG_SITE_NAME,
    locale: "id_ID" as const,
    type: "website" as const,
    images: [sharedImage],
  };

  if (!slug) {
    return {
      title: UI_OG_INCOMPLETE_TITLE,
      description: UI_OG_INCOMPLETE_DESCRIPTION,
      openGraph: {
        ...sharedOg,
        title: UI_OG_INCOMPLETE_TITLE,
        description: UI_OG_INCOMPLETE_DESCRIPTION,
      },
      twitter: {
        card: "summary_large_image",
        title: UI_OG_INCOMPLETE_TITLE,
        description: UI_OG_INCOMPLETE_DESCRIPTION,
        images: [OG_IMAGE_PATH],
      },
    };
  }

  const { guests } = await getGuestsData();
  const guest = guests.find((g) => g.slug === slug);

  if (!guest) {
    return {
      title: UI_OG_NOT_FOUND_TITLE,
      description: UI_OG_NOT_FOUND_DESCRIPTION,
      openGraph: {
        ...sharedOg,
        title: UI_OG_NOT_FOUND_TITLE,
        description: UI_OG_NOT_FOUND_DESCRIPTION,
      },
      twitter: {
        card: "summary_large_image",
        title: UI_OG_NOT_FOUND_TITLE,
        description: UI_OG_NOT_FOUND_DESCRIPTION,
        images: [OG_IMAGE_PATH],
      },
    };
  }

  const title = uiOgInviteTitle(guest.displayName);
  const description = uiOgInviteDescription();

  return {
    title,
    description,
    alternates: {
      canonical: `/?to=${encodeURIComponent(slug)}`,
    },
    openGraph: {
      ...sharedOg,
      title,
      description,
      url: `/?to=${encodeURIComponent(slug)}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE_PATH],
    },
  };
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ to?: string }>;
}) {
  const { to } = await searchParams;
  const slug = typeof to === "string" ? normalizeInvitationQueryParam(to) : "";

  if (!slug) {
    log.info("Invitation page opened without ?to=");
    return (
      <>
        <DevSheetsBanner />
        <main className="mx-auto max-w-xl p-6 font-sans text-sm text-neutral-800">
          <h1 className="text-base font-medium">{UI_INVITE_LINK_INCOMPLETE_TITLE}</h1>
          <p className="mt-2 text-neutral-600">{UI_INVITE_LINK_INCOMPLETE_DESC}</p>
        </main>
      </>
    );
  }

  const { guests } = await getGuestsData();
  const guest = guests.find((g) => g.slug === slug);

  if (!guest) {
    log.info("Guest not found for slug", { slug, guestCount: guests.length });
    return (
      <>
        <DevSheetsBanner />
        <main className="mx-auto max-w-xl p-6 font-sans text-sm text-neutral-800">
          <h1 className="text-base font-medium">{UI_GUEST_NOT_FOUND_TITLE}</h1>
          <p className="mt-2 text-neutral-600">{UI_GUEST_NOT_FOUND_DESC}</p>
        </main>
      </>
    );
  }

  const akad = getAkadSchedule();
  const resepsi = getResepsiSchedule();
  const galleryImagePaths = getResolvedGalleryPaths();

  return (
    <>
      <DevSheetsBanner />
      <InviteCriticalLoadGate>
        <OpeningGate
          guestName={guest.displayName}
          coupleHeading={getCoupleDisplayHeading()}
          akad={akad}
          resepsi={resepsi}
          showAkad={isAkadSectionVisible(guest.invitationKind)}
          showResepsi={isResepsiSectionVisible(guest.invitationKind)}
          slug={guest.slug}
          invitationKind={guest.invitationKind}
          initialRsvpRaw={guest.rsvpRaw}
          galleryImagePaths={galleryImagePaths}
        >
          <div className="min-h-screen" />
        </OpeningGate>
      </InviteCriticalLoadGate>
    </>
  );
}

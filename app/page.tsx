import type { Metadata } from "next";

import { CoupleStorySection } from "@/components/CoupleStorySection";
import { DetailAcaraSection } from "@/components/DetailAcaraSection";
import { DresscodeSection } from "@/components/DresscodeSection";
import { RsvpForm } from "@/components/RsvpForm";
import { DevSheetsBanner } from "@/components/DevSheetsBanner";
import { FloralScrollFrame } from "@/components/FloralScrollFrame";
import { InviteCriticalLoadGate } from "@/components/InviteCriticalLoadGate";
import { OpeningGate } from "@/components/OpeningGate";
import { QuotesSection } from "@/components/QuotesSection";
import { ClosingSection } from "@/components/ClosingSection";
import { GallerySection } from "@/components/GallerySection";
import { GiftSection } from "@/components/GiftSection";
import { VisualBlessingSection } from "@/components/VisualBlessingSection";
import { getCoupleStorySentence } from "@/lib/couple-story";
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
const OG_IMAGE_PATH = "/assets/opening/foto-berdua.jpeg";

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

  const title = uiOgInviteTitle(couple);
  const description = uiOgInviteDescription(guest.displayName);

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
  const coupleStorySentence = getCoupleStorySentence();
  const galleryImagePaths = getResolvedGalleryPaths();

  return (
    <>
      <DevSheetsBanner />
      <InviteCriticalLoadGate>
        <OpeningGate
          guestName={guest.displayName}
          coupleHeading={getCoupleDisplayHeading()}
        >
        <div className="relative scroll-smooth bg-[linear-gradient(185deg,#e8ece9_0%,#f4f1ee_18%,#eef3f0_42%,#f7f5f2_62%,#e9f0ec_88%,#e2eae6_100%)]">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_55%_at_50%_-8%,rgb(var(--inv-primary-rgb)/0.09),transparent_50%),radial-gradient(ellipse_90%_40%_at_100%_30%,rgb(var(--inv-accent-rgb)/0.06),transparent_45%),radial-gradient(ellipse_70%_50%_at_0%_70%,rgb(var(--inv-silver-rgb)/0.14),transparent_42%)]"
          />
          <div className="relative">
          <QuotesSection />
          <CoupleStorySection story={coupleStorySentence} />
          <VisualBlessingSection />
          <DetailAcaraSection
            showAkad={isAkadSectionVisible(guest.invitationKind)}
            showResepsi={isResepsiSectionVisible(guest.invitationKind)}
            akad={akad}
            resepsi={resepsi}
          />
          <DresscodeSection />
          <RsvpForm
            slug={guest.slug}
            invitationKind={guest.invitationKind}
            initialRsvpRaw={guest.rsvpRaw}
          />
          <GallerySection imagePaths={galleryImagePaths} />
          <GiftSection />
          <ClosingSection coupleHeading={getCoupleDisplayHeading()} />
          {/*
            Di atas konten (z-28) supaya bunga mengelilingi section; pointer-events-none.
            Harus setelah section agar stacking benar; tanpa transform di parent OpeningGate.
          */}
          <FloralScrollFrame />
          </div>
        </div>
        </OpeningGate>
      </InviteCriticalLoadGate>
    </>
  );
}

import { DetailAcaraSection } from "@/components/DetailAcaraSection";
import { DevSheetsBanner } from "@/components/DevSheetsBanner";
import { FloralScrollFrame } from "@/components/FloralScrollFrame";
import { OpeningGate } from "@/components/OpeningGate";
import { QuotesSection } from "@/components/QuotesSection";
import { VisualBlessingSection } from "@/components/VisualBlessingSection";
import {
  UI_GUEST_NOT_FOUND_DESC,
  UI_GUEST_NOT_FOUND_TITLE,
  UI_INVITE_LINK_INCOMPLETE_DESC,
  UI_INVITE_LINK_INCOMPLETE_TITLE,
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

  return (
    <>
      <DevSheetsBanner />
      <OpeningGate
        guestName={guest.displayName}
        coupleHeading={getCoupleDisplayHeading()}
      >
        <div className="relative scroll-smooth">
          <FloralScrollFrame />
          <QuotesSection />
          <VisualBlessingSection />
          <DetailAcaraSection
            showAkad={isAkadSectionVisible(guest.invitationKind)}
            showResepsi={isResepsiSectionVisible(guest.invitationKind)}
            akad={akad}
            resepsi={resepsi}
          />
        </div>
      </OpeningGate>
    </>
  );
}

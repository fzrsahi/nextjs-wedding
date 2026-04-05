import { DevSheetsBanner } from "@/components/DevSheetsBanner";
import { RsvpForm } from "@/components/RsvpForm";
import {
  UI_GUEST_NOT_FOUND_DESC,
  UI_GUEST_NOT_FOUND_TITLE,
  UI_INVITE_LINK_INCOMPLETE_DESC,
  UI_INVITE_LINK_INCOMPLETE_TITLE,
} from "@/lib/constants/messages.id";
import { getAssetUrl } from "@/lib/assets";
import {
  getAkadSchedule,
  getCoupleDisplayHeading,
  getGalleryAssetPaths,
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
  const slug =
    typeof to === "string" ? normalizeInvitationQueryParam(to) : "";

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

  log.info("Invitation rendered", {
    slug,
    invitationKind: guest.invitationKind,
  });

  const akad = getAkadSchedule();
  const resepsi = getResepsiSchedule();
  const galleryPaths = getGalleryAssetPaths();
  const heroPath = process.env.NEXT_PUBLIC_HERO_IMAGE_PATH?.trim();

  return (
    <>
      <DevSheetsBanner />
      <main className="mx-auto min-h-screen max-w-xl space-y-8 p-6 font-sans text-sm text-neutral-800">
        <header className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-neutral-500">
            Undangan pernikahan
          </p>
          <h1 className="text-lg font-medium">{getCoupleDisplayHeading()}</h1>
          <p className="pt-2 text-neutral-600">
            Kepada Yth.
            <br />
            <span className="font-medium text-neutral-900">
              {guest.displayName}
            </span>
          </p>
        </header>

        {heroPath ? (
          <div className="border border-neutral-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getAssetUrl(heroPath)}
              alt=""
              className="aspect-video w-full object-cover"
              fetchPriority="high"
            />
          </div>
        ) : null}

        <section aria-label="Backend data">
          <h2 className="mb-2 text-xs font-semibold uppercase text-neutral-400">
            Data tamu (sheet)
          </h2>
          <dl className="grid grid-cols-[8rem_1fr] gap-x-2 gap-y-1 text-xs">
            <dt className="text-neutral-500">Slug</dt>
            <dd>{guest.slug}</dd>
            <dt className="text-neutral-500">Tipe</dt>
            <dd>{guest.invitationKind}</dd>
            <dt className="text-neutral-500">Grup</dt>
            <dd>{guest.group || "—"}</dd>
            <dt className="text-neutral-500">Ket</dt>
            <dd>{guest.note || "—"}</dd>
            <dt className="text-neutral-500">Konfirmasi (raw)</dt>
            <dd className="break-all">{guest.rsvpRaw || "—"}</dd>
            <dt className="text-neutral-500">Link</dt>
            <dd className="break-all text-neutral-600">
              {guest.invitationLink || "—"}
            </dd>
          </dl>
        </section>

        {isAkadSectionVisible(guest.invitationKind) ? (
          <section>
            <h2 className="mb-2 text-xs font-semibold uppercase text-neutral-400">
              Akad
            </h2>
            <pre className="overflow-auto border border-neutral-200 bg-neutral-50 p-3 text-xs">
              {JSON.stringify(akad, null, 2)}
            </pre>
          </section>
        ) : null}

        {isResepsiSectionVisible(guest.invitationKind) ? (
          <section>
            <h2 className="mb-2 text-xs font-semibold uppercase text-neutral-400">
              Resepsi
            </h2>
            <pre className="overflow-auto border border-neutral-200 bg-neutral-50 p-3 text-xs">
              {JSON.stringify(resepsi, null, 2)}
            </pre>
          </section>
        ) : null}

        {galleryPaths.length > 0 ? (
          <section>
            <h2 className="mb-2 text-xs font-semibold uppercase text-neutral-400">
              Galeri (path)
            </h2>
            <ul className="list-inside list-disc text-xs text-neutral-600">
              {galleryPaths.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </section>
        ) : null}

        <RsvpForm
          slug={guest.slug}
          invitationKind={guest.invitationKind}
          initialRsvpRaw={guest.rsvpRaw}
        />
      </main>
    </>
  );
}

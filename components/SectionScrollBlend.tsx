/**
 * Lapisan gradasi di tepi atas/bawah section agar perpindahan warna saat scroll antar-section lebih halus & berlapis.
 */
export function SectionScrollBlend({
  top,
  bottom,
}: {
  top?: string;
  bottom?: string;
}) {
  return (
    <>
      {top ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-[4] h-32 sm:h-40"
          style={{
            background: `linear-gradient(180deg, ${top} 0%, color-mix(in srgb, ${top} 55%, transparent) 45%, color-mix(in srgb, ${top} 22%, transparent) 72%, transparent 100%)`,
          }}
        />
      ) : null}
      {bottom ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[4] h-36 sm:h-48"
          style={{
            background: `linear-gradient(180deg, transparent 0%, color-mix(in srgb, ${bottom} 28%, transparent) 40%, color-mix(in srgb, ${bottom} 62%, transparent) 68%, ${bottom} 100%)`,
          }}
        />
      ) : null}
    </>
  );
}

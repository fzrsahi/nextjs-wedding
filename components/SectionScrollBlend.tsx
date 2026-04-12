/**
 * Lapisan gradasi tipis di tepi atas/bawah section agar perpindahan warna saat scroll antar-section terasa halus.
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
          className="pointer-events-none absolute inset-x-0 top-0 z-[4] h-24 sm:h-28"
          style={{
            background: `linear-gradient(180deg, ${top} 0%, transparent 100%)`,
          }}
        />
      ) : null}
      {bottom ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[4] h-28 sm:h-36"
          style={{
            background: `linear-gradient(180deg, transparent 0%, ${bottom} 100%)`,
          }}
        />
      ) : null}
    </>
  );
}

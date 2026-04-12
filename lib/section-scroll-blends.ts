/**
 * Warna feather vertikal antar-section (scroll A → B terasa halus).
 * Nilai rgba: ujung strip lebih pekat, lalu transparan ke tengah section.
 */
export const SECTION_SCROLL_BLEND = {
  quotes: {
    bottom: "rgba(250, 247, 242, 0.9)",
  },
  couple: {
    top: "rgba(232, 242, 237, 0.55)",
    bottom: "rgba(226, 236, 230, 0.82)",
  },
  visual: {
    top: "rgba(249, 246, 242, 0.65)",
    bottom: "rgba(218, 230, 224, 0.75)",
  },
  detailAcara: {
    top: "rgba(232, 238, 233, 0.55)",
    bottom: "rgba(232, 234, 231, 0.78)",
  },
  dresscode: {
    top: "rgba(220, 228, 223, 0.7)",
    bottom: "rgba(253, 251, 248, 0.92)",
  },
  rsvp: {
    top: "rgba(253, 251, 248, 0.88)",
    bottom: "rgba(232, 238, 234, 0.8)",
  },
  gallery: {
    top: "rgba(252, 249, 246, 0.65)",
    bottom: "rgba(242, 236, 229, 0.88)",
  },
  gift: {
    top: "rgba(234, 238, 234, 0.6)",
    bottom: "rgba(198, 215, 208, 0.5)",
  },
  closing: {
    top: "rgba(236, 230, 223, 0.5)",
  },
} as const;

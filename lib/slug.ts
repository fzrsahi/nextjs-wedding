/**
 * Derives URL slug from display name (align spreadsheet LOWER + SUBSTITUTE for spaces).
 */
export function nameToSlug(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Normalizes `?to=` query value for lookup (lowercase, strip spaces). */
export function normalizeInvitationQueryParam(raw: string): string {
  return raw.trim().toLowerCase().replace(/\s+/g, "");
}

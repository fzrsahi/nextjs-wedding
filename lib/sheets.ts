import { google } from "googleapis";
import { unstable_cache } from "next/cache";
import { CACHE_TAG_GUESTS } from "@/lib/constants/cache";
import {
  DEFAULT_SHEET_TAB_NAME,
  SHEET_COL_INVITATION_LINK,
  SHEET_COL_RSVP,
  SHEET_GRID_END_COLUMN_EXCLUSIVE,
  SHEET_GRID_MAX_ROWS,
  SHEET_REQUIRED_HEADERS,
} from "@/lib/constants/sheets";
import {
  buildHeaderIndexMap,
  mapGuestFromSheetRow,
  parseInvitationKindOrDefault,
  type TGuest,
} from "@/lib/guest";
import { createLogger } from "@/lib/logger";
import type { TGuestsSheetData, TSheetTabInfo } from "@/lib/types/sheet.types";

const log = createLogger("sheets");

export type { TGuestsSheetData } from "@/lib/types/sheet.types";

export function isSheetsConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_SHEETS_SPREADSHEET_ID &&
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      process.env.GOOGLE_PRIVATE_KEY,
  );
}

function isDevLocalGuestsEnabled(): boolean {
  if (process.env.NODE_ENV !== "development") return false;
  const raw = process.env.DEV_USE_LOCAL_GUESTS?.trim().toLowerCase();
  if (!raw) return true;
  return raw !== "0" && raw !== "false" && raw !== "off" && raw !== "no";
}

function buildDevGuestsData(sheetTabTitle: string): TGuestsSheetData {
  const rawList = process.env.DEV_LOCAL_GUESTS?.trim();
  const defaultItems = [
    "Tamu Demo Utama|keduanya",
    "Keluarga Pria|akad",
    "Keluarga Wanita|resepsi",
  ];
  const items = rawList
    ? rawList
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean)
    : defaultItems;

  const guests: TGuest[] = items
    .map((item, idx) => {
      const [nameRaw, kindRaw] = item.split("|").map((v) => v?.trim() ?? "");
      if (!nameRaw) return null;
      const invitationKind = parseInvitationKindOrDefault(kindRaw);
      if (!invitationKind) return null;

      return {
        sheetRowIndex: idx + 2,
        indexNo: String(idx + 1),
        group: "DEV",
        displayName: nameRaw,
        note: "Local development guest",
        invitationKind,
        invitationLink: "",
        rsvpRaw: "",
        slug: nameRaw
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, ""),
      } satisfies TGuest;
    })
    .filter((g): g is TGuest => Boolean(g));

  return {
    guests,
    konfirmasiColumnIndex: -1,
    sheetTabTitle,
    sheetId: -1,
  };
}

function createSheetsClient() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!email || !key) {
    throw new Error("Google Sheets credentials are incomplete.");
  }
  const auth = new google.auth.JWT({
    email,
    key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return google.sheets({ version: "v4", auth });
}

async function fetchSheetTabs(
  sheets: ReturnType<typeof createSheetsClient>,
  spreadsheetId: string,
): Promise<TSheetTabInfo[]> {
  const meta = await sheets.spreadsheets.get({
    spreadsheetId,
    fields: "sheets(properties(sheetId,title))",
  });
  const out: TSheetTabInfo[] = [];
  for (const s of meta.data.sheets ?? []) {
    const p = s.properties;
    if (p?.sheetId != null && p.title) {
      out.push({ sheetId: p.sheetId, title: p.title });
    }
  }
  return out;
}

function collapseWhitespace(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

function resolveActiveTab(tabs: TSheetTabInfo[]): TSheetTabInfo {
  const gidRaw = process.env.GOOGLE_SHEETS_SHEET_GID?.trim();
  if (gidRaw) {
    const gid = parseInt(gidRaw, 10);
    if (Number.isNaN(gid)) {
      throw new Error(
        "GOOGLE_SHEETS_SHEET_GID must be a number (see #gid= in the sheet URL).",
      );
    }
    const found = tabs.find((t) => t.sheetId === gid);
    if (!found) {
      throw new Error(
        `No tab with gid=${gid}. Available: ${tabs.map((t) => `"${t.title}" (gid=${t.sheetId})`).join("; ")}`,
      );
    }
    return found;
  }

  const wanted = collapseWhitespace(
    process.env.GOOGLE_SHEETS_TAB_NAME?.trim() || DEFAULT_SHEET_TAB_NAME,
  );
  const exact = tabs.find((t) => t.title === wanted);
  if (exact) return exact;
  const fuzzy = tabs.find((t) => collapseWhitespace(t.title) === wanted);
  if (fuzzy) return fuzzy;

  throw new Error(
    `Tab "${wanted}" not found. Set GOOGLE_SHEETS_SHEET_GID or fix GOOGLE_SHEETS_TAB_NAME. Available: ${tabs.map((t) => `"${t.title}" (gid=${t.sheetId})`).join("; ")}`,
  );
}

async function readGridValues(
  sheets: ReturnType<typeof createSheetsClient>,
  spreadsheetId: string,
  sheetId: number,
): Promise<string[][] | null | undefined> {
  const batchRes = await sheets.spreadsheets.values.batchGetByDataFilter({
    spreadsheetId,
    requestBody: {
      dataFilters: [
        {
          gridRange: {
            sheetId,
            startRowIndex: 0,
            endRowIndex: SHEET_GRID_MAX_ROWS,
            startColumnIndex: 0,
            endColumnIndex: SHEET_GRID_END_COLUMN_EXCLUSIVE,
          },
        },
      ],
      majorDimension: "ROWS",
    },
  });

  const vr = batchRes.data.valueRanges?.[0]?.valueRange;
  return vr?.values as string[][] | undefined;
}

async function loadGuestsDataUncached(): Promise<TGuestsSheetData> {
  const fallbackTitle =
    process.env.GOOGLE_SHEETS_TAB_NAME?.trim() || DEFAULT_SHEET_TAB_NAME;

  if (isDevLocalGuestsEnabled()) {
    log.info("Using local dev guest data; skipping Google Sheets read");
    return buildDevGuestsData(fallbackTitle);
  }

  if (!isSheetsConfigured()) {
    return {
      guests: [],
      konfirmasiColumnIndex: -1,
      sheetTabTitle: fallbackTitle,
      sheetId: -1,
    };
  }

  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID!;
  const sheets = createSheetsClient();

  let tabs: TSheetTabInfo[];
  let activeTab: TSheetTabInfo;
  try {
    tabs = await fetchSheetTabs(sheets, spreadsheetId);
    activeTab = resolveActiveTab(tabs);
  } catch (e: unknown) {
    log.err("Failed to load spreadsheet metadata or resolve tab", e, {
      op: "resolveTab",
    });
    const err = e as { code?: number };
    if (err.code === 403) {
      throw new Error(
        "Google Sheets returned 403. Share the spreadsheet with the service account email and enable Google Sheets API for that GCP project.",
      );
    }
    throw e;
  }

  let rows: string[][] | null | undefined;
  try {
    rows = await readGridValues(sheets, spreadsheetId, activeTab.sheetId);
  } catch (e: unknown) {
    log.err("Failed to read grid values", e, {
      op: "readGridValues",
      sheetId: activeTab.sheetId,
    });
    const err = e as { code?: number };
    if (err.code === 403) {
      throw new Error(
        "Google Sheets returned 403 when reading values. Check sharing on the spreadsheet.",
      );
    }
    throw e;
  }

  if (!rows?.length) {
    return {
      guests: [],
      konfirmasiColumnIndex: -1,
      sheetTabTitle: activeTab.title,
      sheetId: activeTab.sheetId,
    };
  }

  const headers = (rows[0] as string[]).map((h) => String(h ?? ""));
  const col = buildHeaderIndexMap(headers);

  for (const key of SHEET_REQUIRED_HEADERS) {
    if (col[key] === undefined) {
      throw new Error(
        `Sheet header row must include columns: ${SHEET_REQUIRED_HEADERS.join(", ")}. Missing: "${key}".`,
      );
    }
  }
  if (col[SHEET_COL_INVITATION_LINK] === undefined) {
    throw new Error(
      `Sheet header row must include a "${SHEET_COL_INVITATION_LINK}" column.`,
    );
  }

  const konfirmasiColumnIndex = col[SHEET_COL_RSVP];
  const guests: TGuest[] = [];

  for (let i = 1; i < rows.length; i++) {
    const cells = (rows[i] as string[]).map((c) => String(c ?? ""));
    const sheetRowIndex = i + 1;
    const guest = mapGuestFromSheetRow(sheetRowIndex, cells, col);
    if (guest) guests.push(guest);
  }

  return {
    guests,
    konfirmasiColumnIndex,
    sheetTabTitle: activeTab.title,
    sheetId: activeTab.sheetId,
  };
}

export const getGuestsData = unstable_cache(
  async () => loadGuestsDataUncached(),
  ["wedding-guests-data"],
  { revalidate: 60, tags: [CACHE_TAG_GUESTS] },
);

export async function loadGuestsDataFresh(): Promise<TGuestsSheetData> {
  return loadGuestsDataUncached();
}

export async function updateGuestKonfirmasi(
  sheetId: number,
  sheetRowIndex: number,
  konfirmasiColumnIndex: number,
  value: string,
): Promise<void> {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  if (!spreadsheetId) throw new Error("GOOGLE_SHEETS_SPREADSHEET_ID is not set.");

  const sheets = createSheetsClient();
  const row0 = sheetRowIndex - 1;

  try {
    await sheets.spreadsheets.values.batchUpdateByDataFilter({
      spreadsheetId,
      requestBody: {
        valueInputOption: "USER_ENTERED",
        data: [
          {
            dataFilter: {
              gridRange: {
                sheetId,
                startRowIndex: row0,
                endRowIndex: row0 + 1,
                startColumnIndex: konfirmasiColumnIndex,
                endColumnIndex: konfirmasiColumnIndex + 1,
              },
            },
            majorDimension: "ROWS",
            values: [[value]],
          },
        ],
      },
    });
  } catch (e: unknown) {
    log.err("batchUpdateByDataFilter failed", e, {
      op: "updateGuestKonfirmasi",
      sheetId,
      sheetRowIndex,
      konfirmasiColumnIndex,
    });
    throw e;
  }
}

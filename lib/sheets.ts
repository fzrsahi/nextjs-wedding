import { google } from "googleapis";
import { unstable_cache } from "next/cache";
import {
  COMMENT_ANONYMOUS_DISPLAY_NAME,
  COMMENT_ANONYMOUS_FALSE,
  COMMENT_ANONYMOUS_TRUE,
  COMMENT_FETCH_LIMIT,
} from "@/lib/constants/comments";
import { CACHE_TAG_COMMENTS, CACHE_TAG_GUESTS } from "@/lib/constants/cache";
import {
  DEFAULT_COMMENTS_SHEET_TAB_NAME,
  DEFAULT_SHEET_TAB_NAME,
  SHEET_COMMENT_HEADERS,
  SHEET_COL_COMMENT_ANONYMOUS,
  SHEET_COL_COMMENT_CREATED_AT,
  SHEET_COL_COMMENT_DISPLAY_NAME,
  SHEET_COL_COMMENT_MARKER,
  SHEET_COL_COMMENT_MESSAGE,
  SHEET_COL_COMMENT_SENDER_NAME,
  SHEET_COL_COMMENT_SLUG,
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
import type { TGuestComment } from "@/lib/types/comment.types";
import type {
  TCommentSheetColumns,
  TCommentsSheetData,
  TGuestsSheetData,
  TSheetTabInfo,
} from "@/lib/types/sheet.types";

const log = createLogger("sheets");

let devCommentsStore: TGuestComment[] | null = null;

export type {
  TCommentsSheetData,
  TGuestsSheetData,
} from "@/lib/types/sheet.types";

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

function isDevLocalCommentsEnabled(): boolean {
  if (process.env.NODE_ENV !== "development") return false;
  const raw = process.env.DEV_USE_LOCAL_COMMENTS?.trim().toLowerCase();
  if (!raw) return isDevLocalGuestsEnabled();
  return raw !== "0" && raw !== "false" && raw !== "off" && raw !== "no";
}

function toDevSlug(nameRaw: string): string {
  return nameRaw
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
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
        slug: toDevSlug(nameRaw),
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

function normalizeCommentMessage(raw: string): string {
  return raw.replace(/\s+/g, " ").trim();
}

function isTruthyFlag(raw: string): boolean {
  const value = raw.trim().toLowerCase();
  return (
    value === COMMENT_ANONYMOUS_TRUE ||
    value === "true" ||
    value === "1" ||
    value === "yes"
  );
}

function buildCommentId(
  createdAt: string,
  slug: string,
  senderName: string,
  message: string,
): string {
  return [
    createdAt.trim(),
    slug.trim(),
    senderName.trim(),
    message.slice(0, 48).trim(),
  ].join("::");
}

function toTimestamp(value: string): number {
  const time = Date.parse(value);
  return Number.isNaN(time) ? 0 : time;
}

function sortGuestComments(a: TGuestComment, b: TGuestComment): number {
  const delta = toTimestamp(b.createdAt) - toTimestamp(a.createdAt);
  if (delta !== 0) return delta;
  return b.sheetRowIndex - a.sheetRowIndex;
}

function defaultDedicatedCommentColumns(): TCommentSheetColumns {
  return {
    markerColumnIndex: -1,
    createdAtColumnIndex: 0,
    slugColumnIndex: 1,
    displayNameColumnIndex: 2,
    senderNameColumnIndex: 3,
    anonymousColumnIndex: 4,
    messageColumnIndex: 5,
  };
}

function getCommentSheetColumns(
  col: ReturnType<typeof buildHeaderIndexMap>,
): TCommentSheetColumns | null {
  if (
    col[SHEET_COL_COMMENT_CREATED_AT] === undefined ||
    col[SHEET_COL_COMMENT_SLUG] === undefined ||
    col[SHEET_COL_COMMENT_DISPLAY_NAME] === undefined ||
    col[SHEET_COL_COMMENT_SENDER_NAME] === undefined ||
    col[SHEET_COL_COMMENT_ANONYMOUS] === undefined ||
    col[SHEET_COL_COMMENT_MESSAGE] === undefined
  ) {
    return null;
  }

  return {
    markerColumnIndex: col[SHEET_COL_COMMENT_MARKER] ?? -1,
    createdAtColumnIndex: col[SHEET_COL_COMMENT_CREATED_AT]!,
    slugColumnIndex: col[SHEET_COL_COMMENT_SLUG]!,
    displayNameColumnIndex: col[SHEET_COL_COMMENT_DISPLAY_NAME]!,
    senderNameColumnIndex: col[SHEET_COL_COMMENT_SENDER_NAME]!,
    anonymousColumnIndex: col[SHEET_COL_COMMENT_ANONYMOUS]!,
    messageColumnIndex: col[SHEET_COL_COMMENT_MESSAGE]!,
  };
}

function isCommentHeaderRow(cells: string[]): boolean {
  return SHEET_COMMENT_HEADERS.every(
    (header, index) =>
      collapseWhitespace(String(cells[index] ?? "")).toLowerCase() === header,
  );
}

function cellAt(cells: string[], index: number): string {
  if (index < 0) return "";
  return String(cells[index] ?? "").trim();
}

function mapCommentFromSheetRow(
  sheetRowIndex: number,
  cells: string[],
  columns: TCommentSheetColumns,
): TGuestComment | null {
  const createdAt = cellAt(cells, columns.createdAtColumnIndex);
  const slug = cellAt(cells, columns.slugColumnIndex);
  const displayName =
    cellAt(cells, columns.displayNameColumnIndex) || COMMENT_ANONYMOUS_DISPLAY_NAME;
  const senderName = cellAt(cells, columns.senderNameColumnIndex) || displayName;
  const isAnonymous =
    isTruthyFlag(cellAt(cells, columns.anonymousColumnIndex)) ||
    displayName.toLowerCase() === COMMENT_ANONYMOUS_DISPLAY_NAME.toLowerCase();
  const message = normalizeCommentMessage(
    cellAt(cells, columns.messageColumnIndex),
  );

  if (!message) return null;

  return {
    id: buildCommentId(createdAt, slug, senderName, message),
    sheetRowIndex,
    slug,
    displayName,
    senderName,
    isAnonymous,
    message,
    createdAt,
  };
}

function buildCommentsData(
  comments: TGuestComment[],
  sheetTabTitle: string,
  sheetId: number,
  storageMode: TCommentsSheetData["storageMode"],
  columns: TCommentSheetColumns | null,
): TCommentsSheetData {
  return {
    comments: comments.sort(sortGuestComments).slice(0, COMMENT_FETCH_LIMIT),
    sheetTabTitle,
    sheetId,
    isAvailable: storageMode !== "unavailable",
    storageMode,
    columns,
  };
}

function buildUnavailableCommentsData(sheetTabTitle: string): TCommentsSheetData {
  return {
    comments: [],
    sheetTabTitle,
    sheetId: -1,
    isAvailable: false,
    storageMode: "unavailable",
    columns: null,
  };
}

function parseCommentsFromRows(
  rows: string[][],
  columns: TCommentSheetColumns,
  startIndex: number,
): TGuestComment[] {
  const comments: TGuestComment[] = [];

  for (let i = startIndex; i < rows.length; i++) {
    const cells = (rows[i] as string[]).map((c) => String(c ?? ""));
    const sheetRowIndex = i + 1;
    const comment = mapCommentFromSheetRow(sheetRowIndex, cells, columns);
    if (comment) comments.push(comment);
  }

  return comments;
}

function columnNumberToLetter(columnNumber: number): string {
  let n = columnNumber;
  let out = "";
  while (n > 0) {
    const remainder = (n - 1) % 26;
    out = String.fromCharCode(65 + remainder) + out;
    n = Math.floor((n - 1) / 26);
  }
  return out;
}

function buildCommentAppendRow(
  columns: TCommentSheetColumns,
  createdAt: string,
  slug: string,
  displayName: string,
  senderName: string,
  isAnonymous: boolean,
  message: string,
): string[] {
  const lastIndex = Math.max(
    columns.markerColumnIndex,
    columns.createdAtColumnIndex,
    columns.slugColumnIndex,
    columns.displayNameColumnIndex,
    columns.senderNameColumnIndex,
    columns.anonymousColumnIndex,
    columns.messageColumnIndex,
  );

  const row = Array.from({ length: lastIndex + 1 }, () => "");
  if (columns.markerColumnIndex >= 0) {
    row[columns.markerColumnIndex] = SHEET_COL_COMMENT_MARKER;
  }
  row[columns.createdAtColumnIndex] = createdAt;
  row[columns.slugColumnIndex] = slug;
  row[columns.displayNameColumnIndex] = displayName;
  row[columns.senderNameColumnIndex] = senderName;
  row[columns.anonymousColumnIndex] = isAnonymous
    ? COMMENT_ANONYMOUS_TRUE
    : COMMENT_ANONYMOUS_FALSE;
  row[columns.messageColumnIndex] = message;

  return row;
}

function buildDevCommentsData(sheetTabTitle: string): TCommentsSheetData {
  if (!devCommentsStore) {
    devCommentsStore = [
      {
        sheetRowIndex: 2,
        slug: toDevSlug("Tamu Demo Utama"),
        displayName: "Tamu Demo Utama",
        senderName: "Tamu Demo Utama",
        isAnonymous: false,
        message: "Masya Allah, semoga acaranya lancar dan rumah tangganya penuh berkah.",
        createdAt: "2026-05-01T09:10:00+08:00",
      },
      {
        sheetRowIndex: 3,
        slug: toDevSlug("Keluarga Pria"),
        displayName: COMMENT_ANONYMOUS_DISPLAY_NAME,
        senderName: "Keluarga Pria",
        isAnonymous: true,
        message: "So happy for you both. Wishing a soft, beautiful, forever kind of love.",
        createdAt: "2026-05-02T18:24:00+08:00",
      },
      {
        sheetRowIndex: 4,
        slug: toDevSlug("Keluarga Wanita"),
        displayName: "Keluarga Wanita",
        senderName: "Keluarga Wanita",
        isAnonymous: false,
        message: "Barakallahu lakuma. Semoga jadi keluarga yang sakinah, mawaddah, warahmah.",
        createdAt: "2026-05-03T12:42:00+08:00",
      },
    ].map((comment) => ({
      ...comment,
      id: buildCommentId(
        comment.createdAt,
        comment.slug,
        comment.senderName,
        comment.message,
      ),
    }));
  }

  return buildCommentsData(
    [...devCommentsStore],
    sheetTabTitle,
    -1,
    "dedicated-tab",
    defaultDedicatedCommentColumns(),
  );
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

function resolveCommentsTab(tabs: TSheetTabInfo[]): TSheetTabInfo {
  const gidRaw = process.env.GOOGLE_SHEETS_COMMENTS_SHEET_GID?.trim();
  if (gidRaw) {
    const gid = parseInt(gidRaw, 10);
    if (Number.isNaN(gid)) {
      throw new Error(
        "GOOGLE_SHEETS_COMMENTS_SHEET_GID must be a number (see #gid= in the sheet URL).",
      );
    }
    const found = tabs.find((t) => t.sheetId === gid);
    if (!found) {
      throw new Error(
        `No comments tab with gid=${gid}. Available: ${tabs.map((t) => `"${t.title}" (gid=${t.sheetId})`).join("; ")}`,
      );
    }
    return found;
  }

  const wanted = collapseWhitespace(
    process.env.GOOGLE_SHEETS_COMMENTS_TAB_NAME?.trim() ||
      DEFAULT_COMMENTS_SHEET_TAB_NAME,
  );
  const exact = tabs.find((t) => t.title === wanted);
  if (exact) return exact;
  const fuzzy = tabs.find((t) => collapseWhitespace(t.title) === wanted);
  if (fuzzy) return fuzzy;

  throw new Error(
    `Comments tab "${wanted}" not found. Set GOOGLE_SHEETS_COMMENTS_SHEET_GID or fix GOOGLE_SHEETS_COMMENTS_TAB_NAME. Available: ${tabs.map((t) => `"${t.title}" (gid=${t.sheetId})`).join("; ")}`,
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

async function loadCommentsDataUncached(): Promise<TCommentsSheetData> {
  const fallbackTitle =
    process.env.GOOGLE_SHEETS_COMMENTS_TAB_NAME?.trim() ||
    DEFAULT_COMMENTS_SHEET_TAB_NAME;

  if (isDevLocalCommentsEnabled()) {
    return buildDevCommentsData(fallbackTitle);
  }

  if (!isSheetsConfigured()) {
    return buildUnavailableCommentsData(fallbackTitle);
  }

  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID!;
  const sheets = createSheetsClient();

  let tabs: TSheetTabInfo[];
  try {
    tabs = await fetchSheetTabs(sheets, spreadsheetId);
  } catch (e: unknown) {
    log.err("Failed to load spreadsheet metadata for comments", e, {
      op: "fetchTabsForComments",
    });
    return buildUnavailableCommentsData(fallbackTitle);
  }

  try {
    const commentsTab = resolveCommentsTab(tabs);
    const rows = await readGridValues(sheets, spreadsheetId, commentsTab.sheetId);
    if (!rows?.length) {
      return buildCommentsData(
        [],
        commentsTab.title,
        commentsTab.sheetId,
        "dedicated-tab",
        defaultDedicatedCommentColumns(),
      );
    }

    const headerCells = (rows[0] as string[]).map((c) => String(c ?? ""));
    const headerMap = buildHeaderIndexMap(headerCells);
    const headerColumns = getCommentSheetColumns(headerMap);
    const columns = headerColumns ?? defaultDedicatedCommentColumns();
    const startIndex = headerColumns ? 1 : isCommentHeaderRow(headerCells) ? 1 : 0;

    return buildCommentsData(
      parseCommentsFromRows(rows as string[][], columns, startIndex),
      commentsTab.title,
      commentsTab.sheetId,
      "dedicated-tab",
      columns,
    );
  } catch (e) {
    log.debug("Dedicated comment tab not used; checking inline guest sheet columns", {
      op: "resolveDedicatedComments",
      detail: e instanceof Error ? e.message : String(e),
    });
  }

  let activeTab: TSheetTabInfo;
  try {
    activeTab = resolveActiveTab(tabs);
  } catch (e: unknown) {
    log.err("Failed to resolve active guest tab for inline comments", e, {
      op: "resolveActiveTabForInlineComments",
    });
    return buildUnavailableCommentsData(fallbackTitle);
  }

  let activeRows: string[][] | null | undefined;
  try {
    activeRows = await readGridValues(sheets, spreadsheetId, activeTab.sheetId);
  } catch (e: unknown) {
    log.err("Failed to read active guest sheet for inline comments", e, {
      op: "readInlineCommentsGridValues",
      sheetId: activeTab.sheetId,
    });
    return buildUnavailableCommentsData(activeTab.title);
  }

  if (!activeRows?.length) {
    return buildUnavailableCommentsData(activeTab.title);
  }

  const headerCells = (activeRows[0] as string[]).map((c) => String(c ?? ""));
  const headerMap = buildHeaderIndexMap(headerCells);
  const inlineColumns = getCommentSheetColumns(headerMap);

  if (!inlineColumns) {
    return buildUnavailableCommentsData(activeTab.title);
  }

  return buildCommentsData(
    parseCommentsFromRows(activeRows as string[][], inlineColumns, 1),
    activeTab.title,
    activeTab.sheetId,
    "inline-main-tab",
    inlineColumns,
  );
}

export const getGuestsData = unstable_cache(
  async () => loadGuestsDataUncached(),
  ["wedding-guests-data"],
  { revalidate: 60, tags: [CACHE_TAG_GUESTS] },
);

export const getCommentsData = unstable_cache(
  async () => loadCommentsDataUncached(),
  ["wedding-comments-data"],
  { revalidate: 30, tags: [CACHE_TAG_COMMENTS] },
);

export async function loadGuestsDataFresh(): Promise<TGuestsSheetData> {
  return loadGuestsDataUncached();
}

export async function loadCommentsDataFresh(): Promise<TCommentsSheetData> {
  return loadCommentsDataUncached();
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

export async function appendGuestComment({
  commentsData,
  slug,
  displayName,
  senderName,
  isAnonymous,
  message,
}: {
  commentsData: Pick<
    TCommentsSheetData,
    "columns" | "sheetTabTitle" | "storageMode"
  >;
  slug: string;
  displayName: string;
  senderName: string;
  isAnonymous: boolean;
  message: string;
}): Promise<TGuestComment> {
  const createdAt = new Date().toISOString();
  const normalizedMessage = normalizeCommentMessage(message);
  const sheetTabTitle = commentsData.sheetTabTitle;

  if (isDevLocalCommentsEnabled()) {
    const base = buildDevCommentsData(sheetTabTitle).comments;
    if (!devCommentsStore) {
      devCommentsStore = [...base];
    }
    const nextRowIndex = Math.max(1, ...devCommentsStore.map((item) => item.sheetRowIndex)) + 1;
    const comment: TGuestComment = {
      id: buildCommentId(createdAt, slug, senderName, normalizedMessage),
      sheetRowIndex: nextRowIndex,
      slug,
      displayName,
      senderName,
      isAnonymous,
      message: normalizedMessage,
      createdAt,
    };
    devCommentsStore = [comment, ...devCommentsStore];
    return comment;
  }

  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  if (!spreadsheetId) throw new Error("GOOGLE_SHEETS_SPREADSHEET_ID is not set.");

  const columns = commentsData.columns;
  if (!columns || commentsData.storageMode === "unavailable") {
    throw new Error("Comment storage columns are unavailable.");
  }

  const sheets = createSheetsClient();
  const escapedSheetTitle = sheetTabTitle.replace(/'/g, "''");
  const rowValues = buildCommentAppendRow(
    columns,
    createdAt,
    slug,
    displayName,
    senderName,
    isAnonymous,
    normalizedMessage,
  );
  const rangeEnd = columnNumberToLetter(rowValues.length);

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `'${escapedSheetTitle}'!A:${rangeEnd}`,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        majorDimension: "ROWS",
        values: [rowValues],
      },
    });
  } catch (e) {
    log.err("Failed to append comment row", e, {
      op: "appendGuestComment",
      sheetTabTitle,
      storageMode: commentsData.storageMode,
    });
    throw e;
  }

  return {
    id: buildCommentId(createdAt, slug, senderName, normalizedMessage),
    sheetRowIndex: 0,
    slug,
    displayName,
    senderName,
    isAnonymous,
    message: normalizedMessage,
    createdAt,
  };
}

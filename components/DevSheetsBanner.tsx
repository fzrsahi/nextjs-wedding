import { isSheetsConfigured } from "@/lib/sheets";
import { UI_DEV_SHEETS_BANNER } from "@/lib/constants/messages.id";

/** Dev-only hint when Google Sheets env vars are missing. */
export function DevSheetsBanner() {
  if (process.env.NODE_ENV !== "development") return null;
  if (isSheetsConfigured()) return null;
  return (
    <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-xs text-amber-950 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-100">
      {UI_DEV_SHEETS_BANNER}
    </div>
  );
}

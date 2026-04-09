export const normalizeSheetUrl = (rawUrl: string): string => {
  const trimmedUrl = rawUrl.trim();
  if (!trimmedUrl) {
    return "";
  }

  try {
    const parsedUrl = new URL(trimmedUrl);
    const isGoogleSheet = parsedUrl.hostname === "docs.google.com";
    if (!isGoogleSheet || !parsedUrl.pathname.includes("/spreadsheets/")) {
      return trimmedUrl;
    }

    parsedUrl.searchParams.delete("rm");
    parsedUrl.hash = "";

    if (!parsedUrl.pathname.includes("/edit")) {
      parsedUrl.pathname = parsedUrl.pathname
        .replace(/\/(pubhtml|preview|htmlview)(\/)?$/, "/edit")
        .replace(/\/$/, "");
      if (!parsedUrl.pathname.includes("/edit")) {
        parsedUrl.pathname = `${parsedUrl.pathname}/edit`;
      }
    }

    return parsedUrl.toString();
  } catch {
    return trimmedUrl;
  }
};

const GOOGLE_SHEET_ID_PATTERN = /^[a-zA-Z0-9-_]{20,}$/;

export const extractGoogleSheetId = (sheetUrlOrId: string): string => {
  const trimmedValue = sheetUrlOrId.trim();
  if (!trimmedValue) {
    return "";
  }

  if (GOOGLE_SHEET_ID_PATTERN.test(trimmedValue) && !trimmedValue.includes("/")) {
    return trimmedValue;
  }

  const normalizedUrl = normalizeSheetUrl(trimmedValue);
  const directMatch = normalizedUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (directMatch?.[1]) {
    return directMatch[1];
  }

  try {
    const parsedUrl = new URL(normalizedUrl);
    const idFromQuery = parsedUrl.searchParams.get("id")?.trim() ?? "";
    if (GOOGLE_SHEET_ID_PATTERN.test(idFromQuery)) {
      return idFromQuery;
    }
  } catch {
    // URLとして解釈できない入力はそのまま失敗扱いにする
  }

  return "";
};

export const buildSheetUrlWithGid = (
  rawUrl: string,
  gid: string | undefined
): string => {
  const normalizedUrl = normalizeSheetUrl(rawUrl);
  if (!normalizedUrl) {
    return "";
  }

  try {
    const parsedUrl = new URL(normalizedUrl);
    if (gid) {
      parsedUrl.searchParams.set("gid", gid);
    }
    return parsedUrl.toString();
  } catch {
    return normalizedUrl;
  }
};

const SHIFTED_NUMBER_TO_DIGIT_MAP = {
  "!": "1",
  "@": "2",
  "#": "3",
  $: "4",
  "%": "5",
  "^": "6",
  "&": "7",
  "*": "8",
  "(": "9",
  ")": "0",
};

const toFullWidthDigits = (rawValue) => {
  return rawValue.replace(/[0-9]/g, (char) =>
    String.fromCharCode(char.charCodeAt(0) + 0xfee0)
  );
};

const toHalfWidthDigits = (rawValue) => {
  return rawValue.replace(/[０-９]/g, (char) =>
    String.fromCharCode(char.charCodeAt(0) - 0xfee0)
  );
};

const toFullWidthAlphabet = (rawValue) => {
  return rawValue.replace(/[A-Za-z]/g, (char) =>
    String.fromCharCode(char.charCodeAt(0) + 0xfee0)
  );
};

const toHalfWidthAlphabet = (rawValue) => {
  return rawValue.replace(/[Ａ-Ｚａ-ｚ]/g, (char) =>
    String.fromCharCode(char.charCodeAt(0) - 0xfee0)
  );
};

const formatBanchiValue = (rawValue, options = {}) => {
  const trimmed = rawValue.trim();
  if (!trimmed) {
    return "";
  }

  const shiftedNormalized = trimmed.replace(/[!@#$%^&*()]/g, (char) => {
    return SHIFTED_NUMBER_TO_DIGIT_MAP[char] ?? char;
  });
  const normalized = shiftedNormalized.normalize("NFKC");

  const normalizedAlphaNumeric = options.halfWidthAlphaNumeric
    ? toHalfWidthAlphabet(toHalfWidthDigits(normalized))
    : toFullWidthAlphabet(toFullWidthDigits(normalized));

  return normalizedAlphaNumeric.replace(
    /[-‐‑‒–—―ｰー]/g,
    options.halfWidthHyphen ? "-" : "－"
  );
};

export function normalizeBanchiValueAsHalfWidth(rawValue) {
  return formatBanchiValue(rawValue, {
    halfWidthAlphaNumeric: true,
    halfWidthHyphen: true,
  });
}

export function normalizeBanchiValueAsFullWidth(rawValue) {
  return formatBanchiValue(rawValue, {
    halfWidthAlphaNumeric: false,
    halfWidthHyphen: false,
  });
}

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

const ANY_KANJI_PATTERN = /[\u3400-\u4DBF\u4E00-\u9FFF々〆ヵヶ]/g;
const TRAILING_KANJI_PATTERN = /[\u3400-\u4DBF\u4E00-\u9FFF々〆ヵヶ]$/;
const HIRAGANA_BANCHI_SEPARATOR_PATTERN = /(ちょうめ|ばんち|ばん|ごう)/g;
const TRAILING_HIRAGANA_BANCHI_SEPARATOR_PATTERN = /(ちょうめ|ばんち|ばん|ごう)$/;
const DASH_VARIANT_PATTERN = /[-‐‑‒–—―ｰー－]+/g;
const TRAILING_DASH_VARIANT_PATTERN = /[-‐‑‒–—―ｰー－]$/;
const BANCHI_CALCULATOR_DIGIT_PATTERN = /^[0-9０-９]$/;
const WHITESPACE_PATTERN = /\s+/g;
const KANJI_NUMERAL_SEQUENCE_PATTERN = /[零〇一二三四五六七八九十百千壱弐参]+/g;
const KANJI_DIGIT_MAP = {
  零: 0,
  〇: 0,
  一: 1,
  二: 2,
  三: 3,
  四: 4,
  五: 5,
  六: 6,
  七: 7,
  八: 8,
  九: 9,
  壱: 1,
  弐: 2,
  参: 3,
};

const KANJI_UNIT_MAP = {
  十: 10,
  百: 100,
  千: 1000,
};

const parseKanjiNumeralSequence = (sequence) => {
  if (!/[十百千]/.test(sequence)) {
    return sequence
      .split("")
      .map((char) => String(KANJI_DIGIT_MAP[char] ?? ""))
      .join("");
  }

  let total = 0;
  let current = 0;

  for (const char of sequence) {
    if (Object.prototype.hasOwnProperty.call(KANJI_DIGIT_MAP, char)) {
      current = KANJI_DIGIT_MAP[char];
      continue;
    }

    const unit = KANJI_UNIT_MAP[char];
    if (unit) {
      total += (current || 1) * unit;
      current = 0;
    }
  }

  return String(total + current);
};

const normalizeKanjiNumerals = (rawValue) => {
  return rawValue.replace(KANJI_NUMERAL_SEQUENCE_PATTERN, (sequence) =>
    parseKanjiNumeralSequence(sequence)
  );
};

const formatBanchiValue = (rawValue, options = {}) => {
  const compacted = rawValue.replace(WHITESPACE_PATTERN, "");
  if (!compacted) {
    return "";
  }

  const shiftedNormalized = compacted.replace(/[!@#$%^&*()]/g, (char) => {
    return SHIFTED_NUMBER_TO_DIGIT_MAP[char] ?? char;
  });
  const normalized = normalizeKanjiNumerals(shiftedNormalized.normalize("NFKC"));

  const normalizedAlphaNumeric = options.halfWidthAlphaNumeric
    ? toHalfWidthAlphabet(toHalfWidthDigits(normalized))
    : toFullWidthAlphabet(toFullWidthDigits(normalized));

  const hyphen = options.halfWidthHyphen ? "-" : "－";

  const normalizedValue = normalizedAlphaNumeric
    .replace(HIRAGANA_BANCHI_SEPARATOR_PATTERN, hyphen)
    .replace(ANY_KANJI_PATTERN, hyphen)
    .replace(DASH_VARIANT_PATTERN, hyphen);

  if (options.preserveEdgeHyphen) {
    if (
      !TRAILING_DASH_VARIANT_PATTERN.test(compacted) &&
      (TRAILING_KANJI_PATTERN.test(compacted) ||
        TRAILING_HIRAGANA_BANCHI_SEPARATOR_PATTERN.test(compacted))
    ) {
      return normalizedValue.replace(new RegExp(`${hyphen}+$`, "g"), "");
    }

    return normalizedValue;
  }

  return normalizedValue.replace(new RegExp(`^${hyphen}+|${hyphen}+$`, "g"), "");
};

export function normalizeBanchiValueAsHalfWidth(rawValue) {
  return formatBanchiValue(rawValue, {
    halfWidthAlphaNumeric: true,
    halfWidthHyphen: false,
  });
}

export function normalizeBanchiValueAsFullWidth(rawValue) {
  return formatBanchiValue(rawValue, {
    halfWidthAlphaNumeric: false,
    halfWidthHyphen: false,
  });
}

export function normalizeBanchiValueForInputAsHalfWidth(rawValue) {
  return formatBanchiValue(rawValue, {
    halfWidthAlphaNumeric: true,
    halfWidthHyphen: false,
    preserveEdgeHyphen: true,
  });
}

export function normalizeBanchiValueForInputAsFullWidth(rawValue) {
  return formatBanchiValue(rawValue, {
    halfWidthAlphaNumeric: false,
    halfWidthHyphen: false,
    preserveEdgeHyphen: true,
  });
}

export function applyBanchiCalculatorKey(currentValue, key) {
  if (key === "backspace") {
    return currentValue.slice(0, -1);
  }

  if (key === "clear") {
    return "";
  }

  if (key === "dash") {
    return `${currentValue}－`;
  }

  if (BANCHI_CALCULATOR_DIGIT_PATTERN.test(key)) {
    return `${currentValue}${key}`;
  }

  return currentValue;
}

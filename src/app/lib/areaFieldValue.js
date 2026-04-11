export const AREA_FIELD_PREFIXES = Object.freeze({
  ooaza: "大字",
  aza: "字",
  koaza: "小字",
  departOoaza: "大字",
  departAza: "字",
  departKoaza: "小字",
  registryOoaza: "大字",
  registryAza: "字",
  registryKoaza: "小字",
});

export const isAreaFieldName = (fieldName) => {
  return Object.prototype.hasOwnProperty.call(AREA_FIELD_PREFIXES, fieldName);
};

const escapeRegExp = (value) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

export const formatAreaFieldValue = (fieldName, rawValue) => {
  const prefix = isAreaFieldName(fieldName) ? AREA_FIELD_PREFIXES[fieldName] : "";
  if (!prefix) {
    return rawValue;
  }

  const trimmed = rawValue.trim();
  if (!trimmed) {
    return "";
  }

  const normalizedBody = trimmed.replace(
    new RegExp(`^(?:${escapeRegExp(prefix)}[\\s　]*)+`),
    ""
  );
  if (!normalizedBody) {
    return "";
  }

  return `${prefix}${normalizedBody}`;
};

export const resolveAreaFieldValue = (fieldName, rawValue, isComposing) => {
  if (isComposing) {
    return rawValue;
  }

  return formatAreaFieldValue(fieldName, rawValue);
};

export const isNativeImeComposing = (nativeEvent) => {
  if (!nativeEvent || typeof nativeEvent !== "object") {
    return false;
  }

  return "isComposing" in nativeEvent && Boolean(nativeEvent.isComposing);
};

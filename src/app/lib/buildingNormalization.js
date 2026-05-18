export const toFullWidthAlphabet = (rawValue) => {
  return rawValue.replace(/[A-Za-z]/g, (char) =>
    String.fromCharCode(char.charCodeAt(0) + 0xfee0)
  );
};

export const normalizeBuildingValue = (rawValue) => {
  return toFullWidthAlphabet(rawValue);
};

export const normalizeBuildingSelectedSpacingAndDash = (
  rawValue,
  selectionStart,
  selectionEnd
) => {
  if (
    !Number.isInteger(selectionStart) ||
    !Number.isInteger(selectionEnd) ||
    selectionStart < 0 ||
    selectionEnd <= selectionStart ||
    selectionEnd > rawValue.length
  ) {
    return {
      value: rawValue,
      selectionStart,
      selectionEnd,
      changed: false,
    };
  }

  const selectedValue = rawValue.slice(selectionStart, selectionEnd);
  const normalizedSelectedValue = selectedValue
    .replace(/ /g, "　")
    .replace(/[-‐‑‒–—―−ｰー－]/g, "－");

  return {
    value:
      rawValue.slice(0, selectionStart) +
      normalizedSelectedValue +
      rawValue.slice(selectionEnd),
    selectionStart,
    selectionEnd: selectionStart + normalizedSelectedValue.length,
    changed: normalizedSelectedValue !== selectedValue,
  };
};

/**
 * IME候補確定に使われた Enter だけをフォーム移動対象から除外する。
 *
 * @param {{
 *   key: string;
 *   nativeIsComposing?: boolean;
 *   legacyKeyCode?: number | undefined;
 *   isFieldComposing?: boolean;
 * }} params
 * @returns {boolean}
 */
export function isImeNavigationSuppressed({
  key,
  nativeIsComposing = false,
  legacyKeyCode,
  isFieldComposing = false,
}) {
  if (key !== "Enter") {
    return false;
  }

  return nativeIsComposing || legacyKeyCode === 229 || isFieldComposing;
}

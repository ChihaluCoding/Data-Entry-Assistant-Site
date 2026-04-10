import test from "node:test";
import assert from "node:assert/strict";

import { isImeNavigationSuppressed } from "../src/app/lib/imeNavigationGuard.js";

test("IME確定Enterはフォーム移動抑止扱いになる", () => {
  assert.equal(
    isImeNavigationSuppressed({
      key: "Enter",
      nativeIsComposing: true,
      isFieldComposing: true,
    }),
    true
  );
});

test("Windows IMEの229コードもフォーム移動抑止扱いになる", () => {
  assert.equal(
    isImeNavigationSuppressed({
      key: "Enter",
      nativeIsComposing: false,
      legacyKeyCode: 229,
      isFieldComposing: false,
    }),
    true
  );
});

test("通常のEnterはフォーム移動を抑止しない", () => {
  assert.equal(
    isImeNavigationSuppressed({
      key: "Enter",
      nativeIsComposing: false,
      legacyKeyCode: 13,
      isFieldComposing: false,
    }),
    false
  );
});

test("矢印キーはIME抑止対象ではない", () => {
  assert.equal(
    isImeNavigationSuppressed({
      key: "ArrowDown",
      nativeIsComposing: true,
      legacyKeyCode: 229,
      isFieldComposing: true,
    }),
    false
  );
});

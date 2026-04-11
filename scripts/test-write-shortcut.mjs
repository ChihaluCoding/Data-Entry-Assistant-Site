import test from "node:test";
import assert from "node:assert/strict";

import { getWriteShortcutAction } from "../src/app/lib/writeShortcut.js";

test("Command/Ctrl + W は通常書き込み扱いになる", () => {
  assert.equal(
    getWriteShortcutAction({ key: "w", metaKey: true, ctrlKey: false, shiftKey: false, altKey: false }),
    "write"
  );
});

test("Command/Ctrl + Shift + W は上書き書き込み扱いになる", () => {
  assert.equal(
    getWriteShortcutAction({ key: "W", metaKey: false, ctrlKey: true, shiftKey: true, altKey: false }),
    "overwrite"
  );
});

test("Alt を含む場合はショートカットとして扱わない", () => {
  assert.equal(
    getWriteShortcutAction({ key: "w", metaKey: true, ctrlKey: false, shiftKey: false, altKey: true }),
    null
  );
});

test("修飾キーなしの w は対象外", () => {
  assert.equal(
    getWriteShortcutAction({ key: "w", metaKey: false, ctrlKey: false, shiftKey: false, altKey: false }),
    null
  );
});

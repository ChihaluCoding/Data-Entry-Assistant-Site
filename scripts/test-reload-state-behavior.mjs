import test from "node:test";
import assert from "node:assert/strict";

import {
  getReloadStateBehavior,
  isReloadPersistenceEnabled,
} from "../src/app/lib/reloadStateBehavior.js";

test("保持オンは keep に変換される", () => {
  assert.equal(getReloadStateBehavior(true), "keep");
});

test("保持オフは reset に変換される", () => {
  assert.equal(getReloadStateBehavior(false), "reset");
});

test("keep は保持オンとして扱う", () => {
  assert.equal(isReloadPersistenceEnabled("keep"), true);
});

test("未知の値は保持オフとして扱う", () => {
  assert.equal(isReloadPersistenceEnabled("unexpected"), false);
});

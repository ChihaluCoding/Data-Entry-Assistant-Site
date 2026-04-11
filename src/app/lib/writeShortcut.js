export const getWriteShortcutAction = (eventLike) => {
  if (!eventLike || typeof eventLike !== "object") {
    return null;
  }

  if (eventLike.altKey) {
    return null;
  }

  const hasPrimaryModifier = Boolean(eventLike.metaKey) || Boolean(eventLike.ctrlKey);
  if (!hasPrimaryModifier) {
    return null;
  }

  const key = String(eventLike.key || "").toLowerCase();
  if (key !== "w") {
    return null;
  }

  return eventLike.shiftKey ? "overwrite" : "write";
};

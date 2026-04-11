export const getReloadStateBehavior = (isEnabled) => {
  return isEnabled ? "keep" : "reset";
};

export const isReloadPersistenceEnabled = (behavior) => {
  return behavior === "keep";
};

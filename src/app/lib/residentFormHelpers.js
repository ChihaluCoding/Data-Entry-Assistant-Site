export const FULL_WIDTH_SPACE = "　";

export const RESIDENT_REGISTRY_SYNC_FIELD_PAIRS = [
  ["departName", "registryName"],
  ["departPrefecture", "registryPrefecture"],
  ["departCity", "registryCity"],
  ["departTown", "registryTown"],
  ["departOoaza", "registryOoaza"],
  ["departAza", "registryAza"],
  ["departKoaza", "registryKoaza"],
  ["departBanchi", "registryBanchi"],
  ["departBuilding", "registryBuilding"],
];

export function joinWithFullWidthSpace(parts) {
  return parts.filter(Boolean).join(FULL_WIDTH_SPACE);
}

export function toFullWidthSpace(value) {
  return value.replace(/ /g, FULL_WIDTH_SPACE);
}

export function isResidentEditableNameField(fieldName) {
  return fieldName === "departName" || fieldName === "registryName";
}

export function copyDepartValueToRegistryField(formData, registryFieldName) {
  const pair = RESIDENT_REGISTRY_SYNC_FIELD_PAIRS.find(
    ([, registryField]) => registryField === registryFieldName
  );
  if (!pair) {
    return formData;
  }

  const [departFieldName] = pair;
  return {
    ...formData,
    [registryFieldName]: formData[departFieldName] ?? "",
  };
}

export function syncCheckedRegistryFieldsWithDepart(formData, checkedFields) {
  return RESIDENT_REGISTRY_SYNC_FIELD_PAIRS.reduce(
    (nextFormData, [departField, registryField]) => {
      if (!checkedFields[registryField]) {
        return nextFormData;
      }

      return {
        ...nextFormData,
        [registryField]: nextFormData[departField] ?? "",
      };
    },
    formData
  );
}

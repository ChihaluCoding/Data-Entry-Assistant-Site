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

export function getSurnameFromResidentName(name) {
  const normalizedName = toFullWidthSpace(name);
  const separatorIndex = normalizedName.indexOf(FULL_WIDTH_SPACE);
  if (separatorIndex < 0) {
    return normalizedName;
  }

  return normalizedName.slice(0, separatorIndex);
}

export function getGivenNameFromResidentName(name) {
  const normalizedName = toFullWidthSpace(name);
  const separatorIndex = normalizedName.indexOf(FULL_WIDTH_SPACE);
  if (separatorIndex < 0) {
    return "";
  }

  return normalizedName.slice(separatorIndex + FULL_WIDTH_SPACE.length);
}

export function syncRegistrySurnameWithDepartName(formData) {
  const departSurname = getSurnameFromResidentName(formData.departName ?? "");
  const registryGivenName = getGivenNameFromResidentName(
    formData.registryName ?? ""
  );

  return {
    ...formData,
    registryName: joinWithFullWidthSpace([departSurname, registryGivenName]),
  };
}

export function normalizeRegistryNameInputWithSyncedSurname(inputName, departName) {
  const normalizedInputName = toFullWidthSpace(inputName);
  const departSurname = getSurnameFromResidentName(departName ?? "");

  if (!departSurname) {
    return normalizedInputName;
  }

  if (normalizedInputName === departSurname) {
    return departSurname;
  }

  const prefixedSeparator = `${departSurname}${FULL_WIDTH_SPACE}`;
  if (normalizedInputName.startsWith(prefixedSeparator)) {
    return normalizedInputName;
  }

  if (normalizedInputName.startsWith(departSurname)) {
    const typedGivenName = normalizedInputName.slice(departSurname.length);
    return joinWithFullWidthSpace([departSurname, typedGivenName]);
  }

  const typedGivenName =
    getGivenNameFromResidentName(normalizedInputName) || normalizedInputName;
  return joinWithFullWidthSpace([departSurname, typedGivenName]);
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

export function syncCheckedRegistryFieldsWithDepart(
  formData,
  checkedFields,
  options = {}
) {
  const syncedFormData = RESIDENT_REGISTRY_SYNC_FIELD_PAIRS.reduce(
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

  if (
    options.isRegistrySurnameSyncEnabled &&
    !checkedFields.registryName
  ) {
    return syncRegistrySurnameWithDepartName(syncedFormData);
  }

  return syncedFormData;
}

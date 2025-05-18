const STORAGE_KEY_PREFIX = "calendar_selections";

export const getStorageKey = (careerId?: string) => {
  if (!careerId) return STORAGE_KEY_PREFIX;
  return `${STORAGE_KEY_PREFIX}_${careerId}`;
};

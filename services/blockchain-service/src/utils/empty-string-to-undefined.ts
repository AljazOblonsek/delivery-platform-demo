export const emptyStringToUndefined = (value: unknown): unknown => {
  if (typeof value !== 'string') {
    return value;
  }

  if (value.trim() === '') {
    return undefined;
  }

  return value;
};

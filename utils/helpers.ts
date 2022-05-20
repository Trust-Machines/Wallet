export const safeParseFloat = (str: string) => {
  const value = Number.parseFloat(str);

  return Number.isNaN(value) ? 0 : value;
};
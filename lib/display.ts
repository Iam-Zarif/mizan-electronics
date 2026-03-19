export type SupportedLocale = "bn" | "en";

export const getEmptyFieldText = (
  locale: SupportedLocale,
  labelEn: string,
  labelBn: string,
) => (locale === "en" ? `${labelEn} empty` : `${labelBn} খালি`);

export const getValueOrEmpty = (
  value: string | null | undefined,
  locale: SupportedLocale,
  labelEn: string,
  labelBn: string,
) => {
  const normalized = value?.trim();
  if (normalized) return normalized;
  return getEmptyFieldText(locale, labelEn, labelBn);
};


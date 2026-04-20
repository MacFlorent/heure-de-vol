import { parseISO, isValid, formatISO } from "date-fns";

export function IsoStringToDate(stringValue: string | null): Date | null {
  if (stringValue === null) return null;
  const date = parseISO(stringValue.trim());
  return isValid(date) ? date : null;
}

export function dateToIsoString(dateValue: Date | null): string {
  if (dateValue === null || !isValid(dateValue)) return "";
  return formatISO(dateValue, { representation: "date" });
}

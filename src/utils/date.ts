import { parseISO, isValid } from "date-fns";

export function parseIsoWithDefault(value: string | null | undefined, defaultValue: Date = new Date()): Date {
    const date = parseISO(String(value ?? ""));
    return isValid(date) ? date : defaultValue;
}
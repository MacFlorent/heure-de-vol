import { DECIMAL_FRACTION_DIGITS } from "@/constants";

export function stringToNumber(stringValue: string | null, maximumFractionDigits: number): number {
  if (stringValue === null) return NaN;

  const stringValueCleaned = stringValue.trim().replace(/,/g, ".").replace(/[^0-9.]/g, "");
  let numberValue = parseFloat(stringValueCleaned);

  if (!isNaN(numberValue)) {
    const multiplier = Math.pow(10, maximumFractionDigits);
    numberValue = Math.round(numberValue * multiplier) / multiplier;
  }

  return numberValue;
}

export function stringToInteger(stringValue: string | null): number {
  return stringToNumber(stringValue, 0);
}

export function stringToDecimal(stringValue: string | null): number {
  return stringToNumber(stringValue, DECIMAL_FRACTION_DIGITS);
}

export function numberToString(numberValue: number | null, maximumFractionDigits: number): string {
  if (numberValue === null || isNaN(numberValue)) return "";

  return new Intl.NumberFormat(navigator.language, {
    minimumFractionDigits: 0,
    maximumFractionDigits: maximumFractionDigits,
    useGrouping: false,
  }).format(numberValue);
}

export function integerToString(numberValue: number | null): string {
  return numberToString(numberValue, 0);
}

export function decimalToString(numberValue: number | null): string {
  return numberToString(numberValue, DECIMAL_FRACTION_DIGITS);
}
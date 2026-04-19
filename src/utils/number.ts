export function stringToNumber(value: string, maximumFractionDigits: number): number {
  const valueString = value.trim().replace(/,/g, ".").replace(/[^0-9.]/g, "");
  let valueNumber = parseFloat(valueString);

  if (!isNaN(valueNumber)) {
    const multiplier = Math.pow(10, maximumFractionDigits);
    valueNumber = Math.round(valueNumber * multiplier) / multiplier;
  }

  return valueNumber;
}

export function numberToString(value: number, maximumFractionDigits: number): string {
  if (isNaN(value)) return "";
  return new Intl.NumberFormat(navigator.language, {
    minimumFractionDigits: 0,
    maximumFractionDigits: maximumFractionDigits,
    useGrouping: false,
  }).format(value);
}

export function parseDate(dateString: string): Date {
  return new Date(dateString);
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}
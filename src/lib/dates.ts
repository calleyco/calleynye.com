export function formatWritingDate(date: string, options?: Intl.DateTimeFormatOptions): string {
  return new Date(`${date}T00:00:00.000Z`).toLocaleDateString("en-US", {
    timeZone: "UTC",
    ...options,
  });
}

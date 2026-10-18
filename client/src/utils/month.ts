// UTC, to match how the server defines the current month
export const currentMonth = (): string => new Date().toISOString().slice(0, 7);

export const MONTH_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;

export const monthLabel = (month: string): string => {
  const [year, m] = month.split("-").map(Number);
  return new Date(Date.UTC(year, m - 1, 1)).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
};

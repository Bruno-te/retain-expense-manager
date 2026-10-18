export const MONTH_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;

export const currentMonth = () => new Date().toISOString().slice(0, 7);

// Half-open range [start, end) in UTC, so the 1st of the next month is excluded
export const monthRange = (month) => {
  const [year, m] = month.split("-").map(Number);
  return {
    start: new Date(Date.UTC(year, m - 1, 1)),
    end: new Date(Date.UTC(year, m, 1)),
  };
};

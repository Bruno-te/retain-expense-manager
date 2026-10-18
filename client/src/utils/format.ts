export const formatAmount = (value: number): string =>
  value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

// Dates are stored as UTC midnight, so display them in UTC. Using the local
// time zone would show the previous day for users west of UTC.
export const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

export const formatPaymentMethod = (method: string): string => {
  const text = method.replace(/_/g, " ");
  return text.charAt(0).toUpperCase() + text.slice(1);
};

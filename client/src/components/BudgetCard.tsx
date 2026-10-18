import { useState, type FormEvent } from "react";
import { saveBudgetRequest } from "../api/dashboardApi";
import { ApiError } from "../api/client";
import { formatAmount } from "../utils/format";
import type { BudgetStatus, DashboardData } from "../types";

// Record<BudgetStatus, ...> makes TypeScript fail the build if a status is
// ever added to the type without a display style being added here too.
const STATUS_STYLES: Record<
  BudgetStatus,
  { label: string; badge: string; bar: string }
> = {
  within: { label: "Within budget", badge: "text-bg-success", bar: "bg-success" },
  approaching: {
    label: "Approaching limit",
    badge: "text-bg-warning",
    bar: "bg-warning",
  },
  over: { label: "Over budget", badge: "text-bg-danger", bar: "bg-danger" },
  no_budget: { label: "No budget set", badge: "text-bg-secondary", bar: "bg-secondary" },
};

interface BudgetCardProps {
  data: DashboardData;
  onSaved: () => void;
}

const BudgetCard = ({ data, onSaved }: BudgetCardProps) => {
  const [limit, setLimit] = useState(data.budget === null ? "" : String(data.budget));
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const style = STATUS_STYLES[data.status];

  let percent = 0;
  if (data.budget !== null) {
    if (data.budget > 0) {
      percent = Math.min(100, Math.round((data.totalSpent / data.budget) * 100));
    } else if (data.totalSpent > 0) {
      percent = 100;
    }
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const value = Number(limit);
    if (limit === "" || Number.isNaN(value) || value < 0) {
      setError("Enter a budget of 0 or more");
      return;
    }

    setError(null);
    setSaving(true);
    try {
      await saveBudgetRequest(data.month, value);
      onSaved();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save budget");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card shadow-sm h-100">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h5 mb-0">Monthly budget</h2>
          <span className={`badge ${style.badge}`}>{style.label}</span>
        </div>

        {data.budget !== null && (
          <>
            <div
              className="progress mb-2"
              role="progressbar"
              aria-valuenow={percent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Budget used"
            >
              <div className={`progress-bar ${style.bar}`} style={{ width: `${percent}%` }}>
                {percent}%
              </div>
            </div>
            <p className="small text-muted">
              {formatAmount(data.totalSpent)} of {formatAmount(data.budget)} spent
              {data.status === "over" && data.remaining !== null && (
                <strong className="text-danger">
                  {" "}
                  &middot; over by {formatAmount(Math.abs(data.remaining))}
                </strong>
              )}
            </p>
          </>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {error && (
            <div className="alert alert-danger py-2" role="alert">
              {error}
            </div>
          )}
          <label htmlFor="budget-limit" className="form-label small mb-1">
            {data.budget === null ? "Set a budget for this month" : "Update this month's budget"}
          </label>
          <div className="input-group">
            <input
              id="budget-limit"
              type="number"
              min="0"
              step="0.01"
              className="form-control"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BudgetCard;

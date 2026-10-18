import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useDashboard } from "../hooks/useDashboard";
import StatCard from "../components/StatCard";
import BudgetCard from "../components/BudgetCard";
import CategoryBreakdown from "../components/CategoryBreakdown";
import { formatAmount, formatDate } from "../utils/format";
import { MONTH_PATTERN, currentMonth, monthLabel } from "../utils/month";

const DashboardPage = () => {
  const { user } = useAuth();
  // The selected month is a view setting for this page only, not an expense
  // filter, so it stays in local state. Expense filtering lives in Redux.
  const [month, setMonth] = useState(currentMonth());
  const { data, error, loading, reload } = useDashboard(month);

  const handleMonthChange = (value: string) => {
    if (MONTH_PATTERN.test(value)) setMonth(value);
  };

  return (
    <>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-4">
        <div>
          <h1 className="h3 mb-0">Welcome, {user?.name}</h1>
          <div className="text-muted">{monthLabel(month)}</div>
        </div>
        <div className="d-flex gap-2 align-items-center">
          <label htmlFor="month" className="visually-hidden">
            Month
          </label>
          <input
            id="month"
            type="month"
            className="form-control"
            value={month}
            onChange={(e) => handleMonthChange(e.target.value)}
          />
          <Link to="/expenses/new" className="btn btn-primary text-nowrap">
            Add expense
          </Link>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger d-flex justify-content-between align-items-center">
          <span>{error}</span>
          <button className="btn btn-sm btn-outline-danger" onClick={reload}>
            Retry
          </button>
        </div>
      )}

      {!data && loading && (
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {data && (
        <div style={{ opacity: loading ? 0.6 : 1 }}>
          <div className="row g-3 mb-3">
            <div className="col-12 col-md-6 col-xl-3">
              <StatCard
                label="Total spent"
                value={formatAmount(data.totalSpent)}
                detail={`${data.expenseCount} ${data.expenseCount === 1 ? "expense" : "expenses"}`}
              />
            </div>
            <div className="col-12 col-md-6 col-xl-3">
              <StatCard
                label="Remaining budget"
                value={data.remaining === null ? "No budget" : formatAmount(data.remaining)}
                detail={data.budget === null ? "Set a budget below" : `of ${formatAmount(data.budget)}`}
                valueClassName={
                  data.remaining !== null && data.remaining < 0 ? "text-danger" : ""
                }
              />
            </div>
            <div className="col-12 col-md-6 col-xl-3">
              <StatCard
                label="Highest expense"
                value={data.highestExpense ? formatAmount(data.highestExpense.amount) : "-"}
                detail={data.highestExpense?.title ?? "No expenses yet"}
              />
            </div>
            <div className="col-12 col-md-6 col-xl-3">
              <BudgetCard key={data.month} data={data} onSaved={reload} />
            </div>
          </div>

          <div className="row g-3">
            <div className="col-12 col-lg-7">
              <CategoryBreakdown
                categories={data.spendingByCategory}
                totalSpent={data.totalSpent}
              />
            </div>
            <div className="col-12 col-lg-5">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h2 className="h5 mb-0">Recent expenses</h2>
                    <Link to="/expenses" className="small">
                      View all
                    </Link>
                  </div>
                  {data.recentExpenses.length === 0 ? (
                    <p className="text-muted mb-0">No expenses this month.</p>
                  ) : (
                    <ul className="list-group list-group-flush">
                      {data.recentExpenses.map((expense) => (
                        <li
                          key={expense._id}
                          className="list-group-item px-0 d-flex justify-content-between"
                        >
                          <div>
                            <div>{expense.title}</div>
                            <div className="small text-muted">
                              {expense.category.name} &middot; {formatDate(expense.date)}
                            </div>
                          </div>
                          <div className="fw-semibold">{formatAmount(expense.amount)}</div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardPage;

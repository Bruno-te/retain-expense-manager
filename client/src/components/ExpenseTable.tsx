import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchExpenses } from "../store/expensesSlice";
import { formatAmount, formatDate, formatPaymentMethod } from "../utils/format";

const ExpenseTable = () => {
  const dispatch = useAppDispatch();
  const { items, status, error } = useAppSelector((state) => state.expenses);

  if (status === "failed") {
    return (
      <div className="alert alert-danger d-flex justify-content-between align-items-center">
        <span>{error}</span>
        <button
          className="btn btn-sm btn-outline-danger"
          onClick={() => dispatch(fetchExpenses())}
        >
          Retry
        </button>
      </div>
    );
  }

  if ((status === "idle" || status === "loading") && items.length === 0) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="card card-body text-center text-muted py-5">
        No expenses match your filters.
      </div>
    );
  }

  return (
    <div
      className="table-responsive card shadow-sm"
      style={{ opacity: status === "loading" ? 0.6 : 1 }}
    >
      <table className="table table-hover align-middle mb-0">
        <thead className="table-light">
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Date</th>
            <th>Payment</th>
            <th className="text-end">Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.map((expense) => (
            <tr key={expense._id}>
              <td>
                <div>{expense.title}</div>
                {expense.notes && (
                  <div className="small text-muted">{expense.notes}</div>
                )}
              </td>
              <td>
                <span className="badge text-bg-secondary">
                  {expense.category.name}
                </span>
              </td>
              <td className="text-nowrap">{formatDate(expense.date)}</td>
              <td>{formatPaymentMethod(expense.paymentMethod)}</td>
              <td className="text-end fw-semibold">
                {formatAmount(expense.amount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseTable;

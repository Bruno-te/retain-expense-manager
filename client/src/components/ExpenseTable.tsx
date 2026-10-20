import { useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchExpenses } from "../store/expensesSlice";
import { setPage } from "../store/filtersSlice";
import { deleteExpenseRequest } from "../api/expenseApi";
import { ApiError } from "../api/client";
import ConfirmDialog from "./ConfirmDialog";
import { formatAmount, formatDate, formatPaymentMethod } from "../utils/format";
import type { Expense } from "../types";

const ExpenseTable = () => {
  const dispatch = useAppDispatch();
  const { items, status, error } = useAppSelector((state) => state.expenses);
  const page = useAppSelector((state) => state.filters.page);

  const [pending, setPending] = useState<Expense | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const closeDialog = () => {
    setPending(null);
    setDeleteError(null);
  };

  const confirmDelete = async () => {
    if (!pending) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteExpenseRequest(pending._id);
      setPending(null);
      // If that was the only row on this page, step back a page. Changing the
      // page triggers the refetch itself; otherwise refetch directly.
      if (items.length === 1 && page > 1) {
        dispatch(setPage(page - 1));
      } else {
        dispatch(fetchExpenses());
      }
    } catch (err) {
      setDeleteError(
        err instanceof ApiError ? err.message : "Could not delete expense"
      );
    } finally {
      setDeleting(false);
    }
  };

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
    <>
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
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((expense) => (
              <tr key={expense._id}>
                <td>
                  <div>
                    <Link
                      to={`/expenses/${expense._id}`}
                      className="text-decoration-none fw-semibold"
                    >
                      {expense.title}
                    </Link>
                  </div>
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
                <td className="text-end text-nowrap">
                  <Link
                    to={`/expenses/${expense._id}/edit`}
                    className="btn btn-sm btn-outline-primary me-2"
                  >
                    Edit
                  </Link>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => setPending(expense)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pending && (
        <ConfirmDialog
          title="Delete expense"
          message={`Delete "${pending.title}"? This cannot be undone.`}
          confirmLabel="Delete"
          busy={deleting}
          error={deleteError}
          onConfirm={confirmDelete}
          onCancel={closeDialog}
        />
      )}
    </>
  );
};

export default ExpenseTable;

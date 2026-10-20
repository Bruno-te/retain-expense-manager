import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteExpenseRequest, getExpenseRequest } from "../api/expenseApi";
import { ApiError } from "../api/client";
import ConfirmDialog from "../components/ConfirmDialog";
import { formatAmount, formatDate, formatPaymentMethod } from "../utils/format";
import type { Expense } from "../types";

const ExpenseDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [expense, setExpense] = useState<Expense | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    getExpenseRequest(id)
      .then(({ expense }) => {
        if (!cancelled) setExpense(expense);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : "Could not load expense");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteExpenseRequest(id);
      navigate("/expenses");
    } catch (err) {
      setDeleteError(err instanceof ApiError ? err.message : "Could not delete expense");
      setDeleting(false);
    }
  };

  if (error) {
    return (
      <div className="alert alert-danger">
        {error} <Link to="/expenses">Back to expenses</Link>
      </div>
    );
  }

  if (!expense) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-lg-8">
        <Link to="/expenses" className="small">
          &larr; Back to expenses
        </Link>
        <div className="card shadow-sm mt-2">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
              <div>
                <h1 className="h3 mb-1">{expense.title}</h1>
                <span className="badge text-bg-secondary">{expense.category.name}</span>
              </div>
              <div className="fs-2 fw-bold">{formatAmount(expense.amount)}</div>
            </div>

            <dl className="row mb-4">
              <dt className="col-sm-4">Date</dt>
              <dd className="col-sm-8">{formatDate(expense.date)}</dd>

              <dt className="col-sm-4">Payment method</dt>
              <dd className="col-sm-8">{formatPaymentMethod(expense.paymentMethod)}</dd>

              <dt className="col-sm-4">Notes</dt>
              <dd className="col-sm-8">
                {expense.notes ? expense.notes : <span className="text-muted">No notes</span>}
              </dd>

              <dt className="col-sm-4">Added on</dt>
              <dd className="col-sm-8">{formatDate(expense.createdAt)}</dd>
            </dl>

            <div className="d-flex gap-2">
              <Link to={`/expenses/${expense._id}/edit`} className="btn btn-primary">
                Edit
              </Link>
              <button
                className="btn btn-outline-danger"
                onClick={() => {
                  setDeleteError(null);
                  setConfirming(true);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {confirming && (
        <ConfirmDialog
          title="Delete expense"
          message={`Delete "${expense.title}"? This cannot be undone.`}
          confirmLabel="Delete"
          busy={deleting}
          error={deleteError}
          onConfirm={handleDelete}
          onCancel={() => setConfirming(false)}
        />
      )}
    </div>
  );
};

export default ExpenseDetailPage;

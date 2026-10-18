import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ExpenseForm from "../components/ExpenseForm";
import { getExpenseRequest, updateExpenseRequest } from "../api/expenseApi";
import { ApiError } from "../api/client";
import type { Expense, ExpenseInput } from "../types";

const EditExpensePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [expense, setExpense] = useState<Expense | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  const handleSubmit = async (input: ExpenseInput) => {
    if (!id) return;
    await updateExpenseRequest(id, input);
    navigate("/expenses");
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
        <h1 className="h3 mb-3">Edit expense</h1>
        <div className="card shadow-sm">
          <div className="card-body">
            <ExpenseForm
              initial={expense}
              submitLabel="Save changes"
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditExpensePage;

import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useCategories } from "../hooks/useCategories";
import { ApiError } from "../api/client";
import { formatPaymentMethod } from "../utils/format";
import {
  PAYMENT_METHODS,
  type Expense,
  type ExpenseInput,
  type PaymentMethod,
} from "../types";

interface ExpenseFormProps {
  initial?: Expense;
  submitLabel: string;
  onSubmit: (input: ExpenseInput) => Promise<void>;
}

const today = (): string => new Date().toISOString().slice(0, 10);

const ExpenseForm = ({ initial, submitLabel, onSubmit }: ExpenseFormProps) => {
  const { categories } = useCategories();

  const [title, setTitle] = useState(initial?.title ?? "");
  const [amount, setAmount] = useState(initial ? String(initial.amount) : "");
  const [category, setCategory] = useState(initial?.category._id ?? "");
  const [date, setDate] = useState(
    initial ? initial.date.slice(0, 10) : today()
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    initial?.paymentMethod ?? "cash"
  );
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const validate = (): string | null => {
    if (!title.trim()) return "Title is required";
    const value = Number(amount);
    if (!amount || Number.isNaN(value) || value <= 0) {
      return "Amount must be greater than 0";
    }
    if (!category) return "Please choose a category";
    if (!date) return "Date is required";
    return null;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const problem = validate();
    if (problem) {
      setError(problem);
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        amount: Number(amount),
        category,
        date,
        paymentMethod,
        notes: notes.trim(),
      });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save expense");
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="mb-3">
        <label htmlFor="title" className="form-label">
          Title
        </label>
        <input
          id="title"
          type="text"
          className="form-control"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="row g-3 mb-3">
        <div className="col-12 col-md-6">
          <label htmlFor="amount" className="form-label">
            Amount
          </label>
          <input
            id="amount"
            type="number"
            min="0.01"
            step="0.01"
            className="form-control"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="col-12 col-md-6">
          <label htmlFor="date" className="form-label">
            Date
          </label>
          <input
            id="date"
            type="date"
            className="form-control"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-12 col-md-6">
          <label htmlFor="category" className="form-label">
            Category
          </label>
          <select
            id="category"
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select a category</option>
            {categories.map((item) => (
              <option key={item._id} value={item._id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-12 col-md-6">
          <label htmlFor="method" className="form-label">
            Payment method
          </label>
          <select
            id="method"
            className="form-select"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
          >
            {PAYMENT_METHODS.map((method) => (
              <option key={method} value={method}>
                {formatPaymentMethod(method)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="notes" className="form-label">
          Notes <span className="text-muted">(optional)</span>
        </label>
        <textarea
          id="notes"
          className="form-control"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <div className="d-flex gap-2">
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Saving..." : submitLabel}
        </button>
        <Link to="/expenses" className="btn btn-outline-secondary">
          Cancel
        </Link>
      </div>
    </form>
  );
};

export default ExpenseForm;

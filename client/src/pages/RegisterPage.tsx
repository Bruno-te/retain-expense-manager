import { useState, type FormEvent } from "react";
import { Link, Navigate } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import { useAuth } from "../context/useAuth";
import { ApiError } from "../api/client";

const RegisterPage = () => {
  const { register, isAuthenticated, isLoading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isLoading && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setSubmitting(true);
    try {
      await register(name.trim(), email, password);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Sign up failed");
      setSubmitting(false);
    }
  };

  return (
    <AuthCard
      title="Create your account"
      footer={
        <span>
          Already have an account? <Link to="/login">Log in</Link>
        </span>
      }
    >
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            id="name"
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="confirm" className="form-label">
            Confirm password
          </label>
          <input
            id="confirm"
            type="password"
            className="form-control"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>
        <button type="submit" className="btn btn-primary w-100" disabled={submitting}>
          {submitting ? "Creating account..." : "Sign up"}
        </button>
      </form>
    </AuthCard>
  );
};

export default RegisterPage;

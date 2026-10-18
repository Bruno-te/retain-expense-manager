import { useState, type FormEvent } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import { useAuth } from "../context/useAuth";
import { ApiError } from "../api/client";

interface LocationState {
  from?: { pathname: string };
}

const LoginPage = () => {
  const { login, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const from = (location.state as LocationState | null)?.from?.pathname ?? "/";

  // Once login succeeds, isAuthenticated flips to true and this redirect fires
  if (!isLoading && isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Login failed");
      setSubmitting(false);
    }
  };

  return (
    <AuthCard
      title="Log in to Retain"
      footer={
        <span>
          No account yet? <Link to="/register">Sign up</Link>
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
            autoComplete="current-password"
          />
        </div>
        <button type="submit" className="btn btn-primary w-100" disabled={submitting}>
          {submitting ? "Logging in..." : "Log in"}
        </button>
      </form>
    </AuthCard>
  );
};

export default LoginPage;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({
    email: "demo@billflow.app",
    password: "password",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(form);
      nav("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="auth-page">
      <div className="auth-panel">
        <div className="auth-brand">
          <div className="brand-mark">B</div>
          <div>
            <strong>BillFlow</strong>
            <span>Modern invoicing</span>
          </div>
        </div>
        <div className="auth-copy">
          <div className="eyebrow">WORKSPACE ACCESS</div>
          <h1>Welcome back.</h1>
          <p>
            Manage clients, invoices and payment status from one focused
            workspace.
          </p>
        </div>
        <form onSubmit={submit} className="form-stack">
          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </label>
          {error && <div className="alert error">{error}</div>}
          <button className="primary full" disabled={busy}>
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p className="auth-footer">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </div>
      <div className="auth-visual">
        <div className="visual-card">
          <span className="visual-label">MONTHLY REVENUE</span>
          <strong>$48,290</strong>
          <div className="visual-line">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
          <small>+18.4% from last month</small>
        </div>
        <div className="visual-note">
          <span>01</span>
          <div>
            <strong>Simple by design</strong>
            <p>
              Everything you need to send professional invoices without the
              clutter.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await register(form);
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
          <div className="eyebrow">GET STARTED</div>
          <h1>Create your workspace.</h1>
          <p>
            Set up a secure account and start organizing your invoicing
            workflow.
          </p>
        </div>
        <form onSubmit={submit} className="form-stack">
          <label>
            Full name
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </label>
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
              minLength="6"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </label>
          {error && <div className="alert error">{error}</div>}
          <button className="primary full" disabled={busy}>
            {busy ? "Creating…" : "Create account"}
          </button>
        </form>
        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
      <div className="auth-visual register-visual">
        <div className="visual-note large">
          <span>02</span>
          <div>
            <strong>Built for real workflows</strong>
            <p>
              Clients, invoices, tax calculations, status tracking and premium
              branding — connected through a REST API.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

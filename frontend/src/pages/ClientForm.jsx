import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { api } from "../api";
import { ArrowLeft, Save } from "../components/Icons";
const empty = { name: "", email: "", phone: "", billingAddress: "" };
export default function ClientForm() {
  const { id } = useParams();
  const edit = Boolean(id);
  const nav = useNavigate();
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (edit)
      api("/clients")
        .then((cs) => {
          const c = cs.find((x) => x._id === id);
          if (c)
            setForm({
              name: c.name,
              email: c.email,
              phone: c.phone,
              billingAddress: c.billingAddress,
            });
        })
        .catch((e) => setError(e.message));
  }, [id]);
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (edit)
        await api(`/clients/${id}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
      else
        await api("/clients", { method: "POST", body: JSON.stringify(form) });
      nav("/clients");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="page narrow">
      <Link className="back-link" to="/clients">
        <ArrowLeft size={16} /> Back to clients
      </Link>
      <div className="form-page-head">
        <div>
          <div className="eyebrow">CLIENTS</div>
          <h1>{edit ? "Edit client" : "Add a client"}</h1>
          <p>
            {edit
              ? "Update billing contact details."
              : "Create a billing contact for your workspace."}
          </p>
        </div>
      </div>
      <form className="section-card form-card" onSubmit={submit}>
        <div className="form-grid">
          <label>
            Client name
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              placeholder="Acme Studio"
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              placeholder="billing@acme.com"
            />
          </label>
          <label>
            Phone
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
              placeholder="+91 98765 43210"
            />
          </label>
          <label>
            Billing address
            <textarea
              value={form.billingAddress}
              onChange={(e) =>
                setForm({ ...form, billingAddress: e.target.value })
              }
              required
              placeholder="Street, city, postal code"
            />
          </label>
        </div>
        {error && <div className="alert error">{error}</div>}
        <div className="form-actions">
          <Link className="secondary" to="/clients">
            Cancel
          </Link>
          <button className="primary" disabled={busy}>
            <Save size={17} />
            {busy ? "Saving…" : edit ? "Save changes" : "Create client"}
          </button>
        </div>
      </form>
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import { ArrowLeft, Plus, Trash2, Save } from "../components/Icons";
const blank = { description: "", quantity: 1, unitPrice: 0 };
export default function InvoiceForm() {
  const nav = useNavigate();
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState({
    invoiceNumber: `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`,
    clientId: "",
    items: [{ ...blank }],
    taxPercent: 18,
    dueDate: "",
    status: "draft",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    api("/clients")
      .then((cs) => {
        setClients(cs);
        if (cs[0]) setForm((f) => ({ ...f, clientId: cs[0]._id }));
      })
      .catch((e) => setError(e.message));
  }, []);
  const subtotal = useMemo(
    () =>
      form.items.reduce(
        (s, i) => s + Number(i.quantity || 0) * Number(i.unitPrice || 0),
        0,
      ),
    [form.items],
  );
  const tax = (subtotal * Number(form.taxPercent || 0)) / 100;
  const total = subtotal + tax;
  const updateItem = (idx, key, value) =>
    setForm((f) => ({
      ...f,
      items: f.items.map((it, i) => (i === idx ? { ...it, [key]: value } : it)),
    }));
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.clientId)
      return setError("Please add a client before creating an invoice.");
    if (!form.dueDate) return setError("Please select a due date.");
    setBusy(true);
    try {
      await api("/invoices", { method: "POST", body: JSON.stringify(form) });
      nav("/invoices");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="page">
      <Link className="back-link" to="/invoices">
        <ArrowLeft size={16} /> Back to invoices
      </Link>
      <div className="page-head compact">
        <div>
          <div className="eyebrow">NEW INVOICE</div>
          <h1>Create invoice</h1>
          <p>Build a clear, itemized invoice for your client.</p>
        </div>
      </div>
      {error && <div className="alert error">{error}</div>}
      <form onSubmit={submit}>
        <div className="invoice-builder">
          <section className="section-card">
            <div className="card-title">
              <h2>Invoice details</h2>
              <span>Step 1</span>
            </div>
            <div className="form-grid">
              <label>
                Invoice number
                <input
                  value={form.invoiceNumber}
                  onChange={(e) =>
                    setForm({ ...form, invoiceNumber: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Client
                <select
                  value={form.clientId}
                  onChange={(e) =>
                    setForm({ ...form, clientId: e.target.value })
                  }
                  required>
                  <option value="">Select client</option>
                  {clients.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Due date
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) =>
                    setForm({ ...form, dueDate: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Status
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value })
                  }>
                  <option value="draft">Draft</option>
                  <option value="sent">Sent</option>
                </select>
              </label>
            </div>
          </section>
          <section className="section-card">
            <div className="card-title">
              <div>
                <h2>Line items</h2>
                <p>Add the products or services being billed.</p>
              </div>
              <button
                type="button"
                className="secondary"
                onClick={() =>
                  setForm((f) => ({ ...f, items: [...f.items, { ...blank }] }))
                }>
                <Plus size={16} /> Add item
              </button>
            </div>
            <div className="line-items">
              <div className="line-head">
                <span>Description</span>
                <span>Qty</span>
                <span>Unit price</span>
                <span>Total</span>
                <span />
              </div>
              {form.items.map((item, idx) => (
                <div className="line-row" key={idx}>
                  <input
                    placeholder="Website development"
                    value={item.description}
                    onChange={(e) =>
                      updateItem(idx, "description", e.target.value)
                    }
                    required
                  />
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(idx, "quantity", e.target.value)
                    }
                    required
                  />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) =>
                      updateItem(idx, "unitPrice", e.target.value)
                    }
                    required
                  />
                  <strong>
                    $
                    {(
                      Number(item.quantity || 0) * Number(item.unitPrice || 0)
                    ).toFixed(2)}
                  </strong>
                  <button
                    type="button"
                    className="icon-btn danger"
                    disabled={form.items.length === 1}
                    onClick={() =>
                      setForm((f) => ({
                        ...f,
                        items: f.items.filter((_, i) => i !== idx),
                      }))
                    }>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </section>
          <section className="section-card summary-card">
            <div className="tax-field">
              <label>
                Tax rate (%)
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={form.taxPercent}
                  onChange={(e) =>
                    setForm({ ...form, taxPercent: e.target.value })
                  }
                />
              </label>
            </div>
            <div className="totals">
              <div>
                <span>Subtotal</span>
                <strong>${subtotal.toFixed(2)}</strong>
              </div>
              <div>
                <span>Tax</span>
                <strong>${tax.toFixed(2)}</strong>
              </div>
              <div className="grand">
                <span>Total</span>
                <strong>${total.toFixed(2)}</strong>
              </div>
            </div>
          </section>
        </div>
        <div className="form-actions">
          <Link className="secondary" to="/invoices">
            Cancel
          </Link>
          <button className="primary" disabled={busy}>
            <Save size={17} />
            {busy ? "Creating…" : "Create invoice"}
          </button>
        </div>
      </form>
    </div>
  );
}

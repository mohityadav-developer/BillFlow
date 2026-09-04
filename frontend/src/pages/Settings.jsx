import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api, assetUrl } from "../api";
import { Upload, Crown, ShieldCheck } from "../components/Icons";
export default function Settings() {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setBusy(true);
    setError("");
    setMessage("");
    const data = new FormData();
    data.append("logo", file);
    try {
      await api("/profile/logo", { method: "POST", body: data });
      setMessage("Logo uploaded successfully.");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="page narrow">
      <div className="eyebrow">SETTINGS</div>
      <h1>Workspace settings</h1>
      <p className="page-subtitle">Manage your account and invoice branding.</p>
      <section className="section-card settings-card">
        <div className="settings-head">
          <div className="avatar large">{user?.name?.[0]?.toUpperCase()}</div>
          <div>
            <h2>{user?.name}</h2>
            <p>{user?.email}</p>
          </div>
          <span className={`role-tag ${user?.role}`}>
            {user?.role === "premium" ? "Premium" : "Free"}
          </span>
        </div>
      </section>
      <section className="section-card settings-card">
        <div className="card-title">
          <div>
            <h2>Invoice branding</h2>
            <p>Upload a logo to display on printable invoices.</p>
          </div>
          <div className="side-icon">
            <Crown size={18} />
          </div>
        </div>
        {user?.role === "premium" ? (
          <form onSubmit={submit} className="upload-area">
            <label className="upload-box">
              <Upload size={20} />
              <strong>{file ? file.name : "Choose logo image"}</strong>
              <span>PNG, JPG or WebP · max 2 MB</span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </label>
            {error && <div className="alert error">{error}</div>}
            {message && <div className="alert success">{message}</div>}
            <button className="primary" disabled={!file || busy}>
              {busy ? "Uploading…" : "Upload logo"}
            </button>
          </form>
        ) : (
          <div className="upgrade-box">
            <div>
              <ShieldCheck size={20} />
            </div>
            <div>
              <strong>Premium feature</strong>
              <p>
                Custom invoice branding is restricted to premium users and
                enforced by the API.
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useExpenses } from "../hooks/useExpenses";
export default function Account() {
  const { expenses, income, categories, setCategories, settings, setSettings } =
    useExpenses();
  const [newCategory, setNewCategory] = useState("");
  const navigate = useNavigate();
  function exportCsv() {
    const rows = [
      ["Type", "Name", "Category / Source", "Date", "Amount", "Payment method"],
      ...expenses.map((e) => [
        "Expense",
        e.name,
        e.category,
        e.date,
        String(e.amount),
        e.paymentMethod || "",
      ]),
      ...income.map((i) => [
        "Income",
        i.name,
        i.source,
        i.date,
        String(i.amount),
        "",
      ]),
    ];
    const content = rows
      .map((row) => row.map((v) => `"${v.replaceAll('"', '""')}"`).join(","))
      .join("\r\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([content], { type: "text/csv" }));
    link.download = "spendly-transactions.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  }
  function del() {
    if (
      !window.confirm(
        "Delete all locally stored Spendly data from this device? This cannot be undone.",
      )
    )
      return;
    localStorage.clear();
    navigate("/");
  }
  return (
    <div className="page-wrap">
      <div className="page-heading">
        <div>
          <span className="eyebrow">YOUR PREFERENCES</span>
          <h1>Settings</h1>
          <p>Manage your profile, data, and how Spendly works for you.</p>
        </div>
      </div>
      <div className="settings-layout">
        <div className="settings-main">
          <section className="panel settings-panel">
            <div className="panel-heading">
              <div>
                <h2>Profile</h2>
                <p>Your personal account details</p>
              </div>
            </div>
            <div className="profile-banner">
              <span className="avatar large">
                {String(settings.name || "G")
                  .slice(0, 1)
                  .toUpperCase()}
              </span>
              <div>
                <b>{settings.name || "Guest account"}</b>
                <small>{settings.email || "Using Spendly as a guest"}</small>
              </div>
              <span className="status-pill">
                {settings.email ? "Member" : "Guest"}
              </span>
            </div>
            <div className="form-grid two">
              <label>
                Full name
                <input
                  value={String(settings.name || "")}
                  onChange={(e) =>
                    setSettings((s) => ({ ...s, name: e.target.value }))
                  }
                />
              </label>
              <label>
                Email address
                <input
                  type="email"
                  value={String(settings.email || "")}
                  onChange={(e) =>
                    setSettings((s) => ({ ...s, email: e.target.value }))
                  }
                  placeholder="you@example.com"
                />
              </label>
            </div>
            <p className="inline-note">
              Profile changes save automatically on this device.
            </p>
          </section>
          <section className="panel settings-panel">
            <div className="panel-heading">
              <div>
                <h2>Preferences</h2>
                <p>Make Spendly feel right for you</p>
              </div>
            </div>
            <label>
              Display currency
              <select
                value={String(settings.currency || "PHP")}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, currency: e.target.value }))
                }
              >
                {[
                  ["PHP", "Philippine peso (₱)"],
                  ["USD", "US dollar ($)"],
                  ["EUR", "Euro (€)"],
                  ["GBP", "Pound sterling (£)"],
                  ["JPY", "Japanese yen (¥)"],
                ].map(([c, n]) => (
                  <option key={c} value={c}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
            <div className="setting-toggle">
              <span>
                <b>Dark mode</b>
                <small>Use a darker appearance across the app</small>
              </span>
              <input
                type="checkbox"
                checked={Boolean(settings.darkMode)}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, darkMode: e.target.checked }))
                }
              />
            </div>
            <div className="setting-toggle">
              <span>
                <b>Weekly spending alerts</b>
                <small>Show an alert when you exceed your weekly budget</small>
              </span>
              <input
                type="checkbox"
                checked={Boolean(settings.weeklyAlert)}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, weeklyAlert: e.target.checked }))
                }
              />
            </div>
          </section>
          <section className="panel settings-panel">
            <div className="panel-heading">
              <div>
                <h2>Categories</h2>
                <p>Keep categories relevant to your spending</p>
              </div>
            </div>
            <form
              className="category-add"
              onSubmit={(e) => {
                e.preventDefault();
                if (
                  newCategory.trim() &&
                  !categories.includes(newCategory.trim())
                )
                  setCategories((c) => [...c, newCategory.trim()]);
                setNewCategory("");
              }}
            >
              <input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="New category"
              />
              <button className="button secondary">Add category</button>
            </form>
            <div className="category-chips">
              {categories.map((c) => (
                <span key={c}>
                  {c}
                  {![
                    "Food",
                    "Transport",
                    "Housing",
                    "Utilities",
                    "Health",
                    "Entertainment",
                    "Savings",
                    "Other",
                  ].includes(c) && (
                    <button
                      onClick={() =>
                        setCategories((list) => list.filter((x) => x !== c))
                      }
                      aria-label={`Remove ${c}`}
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
            </div>
          </section>
          <section className="panel settings-panel">
            <div className="panel-heading">
              <div>
                <h2>Export your data</h2>
                <p>Download a copy of your transaction history</p>
              </div>
            </div>
            <div className="export-row">
              <span>
                <b>CSV spreadsheet</b>
                <small>
                  Expenses and income · {expenses.length + income.length}{" "}
                  records
                </small>
              </span>
              <button className="button secondary" onClick={exportCsv}>
                Download CSV
              </button>
            </div>
            <div className="export-row">
              <span>
                <b>PDF report</b>
                <small>Print or save your records as a PDF</small>
              </span>
              <button
                className="button secondary"
                onClick={() => window.print()}
              >
                Export PDF
              </button>
            </div>
          </section>
          <section className="panel settings-panel">
            <div className="panel-heading">
              <div>
                <h2>Privacy & security</h2>
                <p>Understand where your information is stored</p>
              </div>
            </div>
            <p className="privacy-copy">
              This prototype stores your information in your browser on this
              device. No account server, encrypted sync, password reset email,
              or verified login is connected yet. Avoid entering sensitive
              financial credentials.
            </p>
            <div className="export-row">
              <span>
                <b>Privacy policy</b>
                <small>Review how this demo handles local data.</small>
              </span>
              <button
                className="button secondary"
                onClick={() =>
                  window.alert(
                    "Spendly demo stores transaction data in local browser storage only. No backend or third-party sharing is configured.",
                  )
                }
              >
                Read policy
              </button>
            </div>
            <div className="export-row danger-row">
              <span>
                <b>Delete local data</b>
                <small>
                  Remove your profile and all saved transactions from this
                  device.
                </small>
              </span>
              <button className="button danger-button" onClick={del}>
                Delete data
              </button>
            </div>
          </section>
        </div>
        <aside className="settings-aside">
          <div className="help-card">
            <span className="help-icon">✦</span>
            <h3>Your data, your call.</h3>
            <p>
              Export a local copy at any time. Your activity is saved on this
              device.
            </p>
            <button className="text-link" onClick={exportCsv}>
              Export my data →
            </button>
          </div>
          <div className="help-card">
            <span className="help-icon">ⓘ</span>
            <h3>Need a hand?</h3>
            <p>
              Tap the tutorial icon at the top of any page for a quick overview.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

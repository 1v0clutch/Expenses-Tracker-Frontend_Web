import { useMemo, useState } from "react";
import { useExpenses } from "../hooks/useExpenses";
import { money } from "./helpers";
export default function Expenses() {
  const {
    expenses,
    addExpense,
    updateExpense,
    deleteExpense,
    categories,
    settings,
  } = useExpenses();
  const [query, setQuery] = useState(""),
    [category, setCategory] = useState("All categories"),
    [method, setMethod] = useState("All methods"),
    [sort, setSort] = useState("newest"),
    [editing, setEditing] = useState<string | null>(null),
    [name, setName] = useState(""),
    [amount, setAmount] = useState(""),
    [date, setDate] = useState(new Date().toISOString().slice(0, 10)),
    [cat, setCat] = useState("Food"),
    [payment, setPayment] = useState("Card"),
    [note, setNote] = useState("");
  const visible = useMemo(
    () =>
      expenses
        .filter(
          (e) =>
            (e.name.toLowerCase().includes(query.toLowerCase()) ||
              e.category.toLowerCase().includes(query.toLowerCase())) &&
            (category === "All categories" || e.category === category) &&
            (method === "All methods" ||
              (e.paymentMethod || "Card") === method),
        )
        .sort((a, b) =>
          sort === "newest"
            ? b.date.localeCompare(a.date)
            : sort === "oldest"
              ? a.date.localeCompare(b.date)
              : sort === "highest"
                ? b.amount - a.amount
                : a.amount - b.amount,
        ),
    [expenses, query, category, method, sort],
  );
  const total = visible.reduce((s, e) => s + e.amount, 0);
  function clear() {
    setEditing(null);
    setName("");
    setAmount("");
    setDate(new Date().toISOString().slice(0, 10));
    setCat("Food");
    setPayment("Card");
    setNote("");
  }
  function submit(e: React.FormEvent) {
    e.preventDefault();
    const value = Number(amount);
    if (!name.trim() || value <= 0) return;
    const item = {
      name: name.trim(),
      amount: value,
      date,
      category: cat,
      paymentMethod: payment,
      notes: note,
    };
    if (editing) updateExpense(editing, item);
    else addExpense(item);
    clear();
  }
  function edit(e: (typeof expenses)[number]) {
    setEditing(e.id);
    setName(e.name);
    setAmount(String(e.amount));
    setDate(e.date);
    setCat(e.category);
    setPayment(e.paymentMethod || "Card");
    setNote(e.notes || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  return (
    <div className="page-wrap">
      <div className="page-heading">
        <div>
          <span className="eyebrow">YOUR TRANSACTION HISTORY</span>
          <h1>Transactions</h1>
          <p>Keep every purchase organized and easy to find.</p>
        </div>
        <button
          className="button primary"
          onClick={() => document.getElementById("expense-name")?.focus()}
        >
          ＋ Add expense
        </button>
      </div>
      <form className="panel expense-form" onSubmit={submit}>
        <div className="panel-heading">
          <div>
            <h2>{editing ? "Edit transaction" : "Add a transaction"}</h2>
            <p>Fill in the details of your expense.</p>
          </div>
          {editing && (
            <button type="button" className="text-button" onClick={clear}>
              Cancel edit
            </button>
          )}
        </div>
        <div className="form-grid">
          <label>
            Description
            <input
              id="expense-name"
              placeholder="e.g. Weekly groceries"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label>
            Amount
            <input
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </label>
          <label>
            Category
            <select value={cat} onChange={(e) => setCat(e.target.value)}>
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label>
            Date
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </label>
          <label>
            Payment method
            <select
              value={payment}
              onChange={(e) => setPayment(e.target.value)}
            >
              {["Card", "Cash", "Bank transfer", "E-wallet", "Other"].map(
                (c) => (
                  <option key={c}>{c}</option>
                ),
              )}
            </select>
          </label>
          <label>
            Notes <span className="optional">optional</span>
            <input
              placeholder="Add a note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </label>
        </div>
        <button className="button primary" type="submit">
          {editing ? "Save changes" : "Save transaction"}
        </button>
      </form>
      <section className="panel table-panel">
        <div className="panel-heading">
          <div>
            <h2>All transactions</h2>
            <p>
              {visible.length} entries · {money(total, settings.currency)} total
            </p>
          </div>
          <span className="status-pill">{expenses.length} records</span>
        </div>
        <div className="filter-row">
          <input
            className="search-input"
            placeholder="⌕  Search transactions"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>All categories</option>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select value={method} onChange={(e) => setMethod(e.target.value)}>
            <option>All methods</option>
            {["Card", "Cash", "Bank transfer", "E-wallet", "Other"].map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="highest">Highest amount</option>
            <option value="lowest">Lowest amount</option>
          </select>
        </div>
        {visible.length ? (
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Transaction</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Payment</th>
                  <th>Amount</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {visible.map((e) => (
                  <tr key={e.id}>
                    <td>
                      <b>{e.name}</b>
                      {e.notes && <small>{e.notes}</small>}
                    </td>
                    <td>
                      <span className="category-tag">{e.category}</span>
                    </td>
                    <td>
                      {new Date(e.date + "T00:00:00").toLocaleDateString("en", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td>{e.paymentMethod || "Card"}</td>
                    <td className="amount-cell">
                      {money(e.amount, settings.currency)}
                    </td>
                    <td className="row-actions">
                      <button onClick={() => edit(e)}>Edit</button>
                      <button
                        onClick={() => deleteExpense(e.id)}
                        aria-label={`Delete ${e.name}`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">No matching transactions yet.</div>
        )}
      </section>
    </div>
  );
}

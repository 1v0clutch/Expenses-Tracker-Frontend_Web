import { useState } from "react";
import { useExpenses } from "../hooks/useExpenses";
import { money, monthMatch } from "./helpers";
export default function Cashflow() {
  const { income, expenses, addIncome, deleteIncome, settings } = useExpenses();
  const [name, setName] = useState(""),
    [amount, setAmount] = useState(""),
    [date, setDate] = useState(new Date().toISOString().slice(0, 10)),
    [source, setSource] = useState("Salary");
  const monthlyIncome = income
      .filter((i) => monthMatch(i.date))
      .reduce((s, i) => s + i.amount, 0),
    monthlyExpense = expenses
      .filter((e) => monthMatch(e.date))
      .reduce((s, e) => s + e.amount, 0);
  const max = Math.max(monthlyIncome, monthlyExpense, 1);
  return (
    <div className="page-wrap">
      <div className="page-heading">
        <div>
          <span className="eyebrow">MONEY IN · MONEY OUT</span>
          <h1>Cashflow</h1>
          <p>See how your income and spending move together.</p>
        </div>
      </div>
      <div className="stat-grid three">
        <article className="stat-card">
          <span>Income this month</span>
          <strong>{money(monthlyIncome, settings.currency)}</strong>
          <small className="positive">{income.length} income entries</small>
        </article>
        <article className="stat-card">
          <span>Expenses this month</span>
          <strong>{money(monthlyExpense, settings.currency)}</strong>
          <small>
            {expenses.filter((e) => monthMatch(e.date)).length} transactions
          </small>
        </article>
        <article className="stat-card feature-stat">
          <span>Net cashflow</span>
          <strong>
            {money(monthlyIncome - monthlyExpense, settings.currency)}
          </strong>
          <small>
            {monthlyIncome >= monthlyExpense
              ? "More coming in than going out"
              : "Spending is above income"}
          </small>
        </article>
      </div>
      <div className="dashboard-grid">
        <section className="panel cashflow-chart">
          <div className="panel-heading">
            <div>
              <h2>Income vs. expenses</h2>
              <p>Current month summary</p>
            </div>
            <span className="status-pill good">This month</span>
          </div>
          <div className="comparison-bars">
            <div>
              <span>
                Income <b>{money(monthlyIncome, settings.currency)}</b>
              </span>
              <i>
                <em style={{ width: `${(monthlyIncome / max) * 100}%` }} />
              </i>
            </div>
            <div>
              <span>
                Expenses <b>{money(monthlyExpense, settings.currency)}</b>
              </span>
              <i>
                <em
                  className="expense-fill"
                  style={{ width: `${(monthlyExpense / max) * 100}%` }}
                />
              </i>
            </div>
          </div>
          <div className="cashflow-insight">
            {monthlyIncome >= monthlyExpense
              ? "You have a positive cashflow this month. Keep building your savings."
              : "Your expenses are higher than your income this month. Review your category budgets."}
          </div>
        </section>
        <section className="panel income-form">
          <div className="panel-heading">
            <div>
              <h2>Add income</h2>
              <p>Record salary or other earnings.</p>
            </div>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (+amount <= 0 || !name.trim()) return;
              addIncome({ name: name.trim(), amount: +amount, date, source });
              setName("");
              setAmount("");
            }}
          >
            <label>
              Income source
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Monthly salary"
                required
              />
            </label>
            <div className="form-grid two">
              <label>
                Amount
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  required
                />
              </label>
              <label>
                Type
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                >
                  {[
                    "Salary",
                    "Freelance",
                    "Business",
                    "Investment",
                    "Other",
                  ].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
            </div>
            <label>
              Date
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </label>
            <button className="button primary full">Add income</button>
          </form>
        </section>
        <section className="panel activity-panel">
          <div className="panel-heading">
            <div>
              <h2>Income history</h2>
              <p>All income sources</p>
            </div>
          </div>
          {income.length ? (
            income.map((i) => (
              <div className="activity-row" key={i.id}>
                <span className="activity-icon income-icon">↙</span>
                <span className="activity-name">
                  <b>{i.name}</b>
                  <small>
                    {i.source} ·{" "}
                    {new Date(i.date + "T00:00:00").toLocaleDateString()}
                  </small>
                </span>
                <strong className="positive">
                  +{money(i.amount, settings.currency)}
                </strong>
                <button
                  className="icon-button"
                  onClick={() => deleteIncome(i.id)}
                  aria-label="Delete income"
                >
                  ×
                </button>
              </div>
            ))
          ) : (
            <div className="empty-state">
              No income added. Add salary or other income to see your cashflow.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

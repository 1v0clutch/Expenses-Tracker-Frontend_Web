import { useState } from "react";
import { useExpenses } from "../hooks/useExpenses";
import { money, monthMatch } from "./helpers";
export default function Planned() {
  const {
    planned,
    addPlannedExpense,
    deletePlannedExpense,
    expenses,
    budgets,
    saveBudget,
    categories,
    settings,
  } = useExpenses();
  const [payroll, setPayroll] = useState(""),
    [foodPct, setFoodPct] = useState("25"),
    [housingPct, setHousingPct] = useState("30"),
    [transportPct, setTransportPct] = useState("10"),
    [name, setName] = useState(""),
    [amount, setAmount] = useState(""),
    [category, setCategory] = useState("Savings"),
    [error, setError] = useState("");
  function autoPlan(e: React.FormEvent) {
    e.preventDefault();
    const total = Number(payroll);
    if (total <= 0) return;
    const values: [[string, string], [string, string], [string, string]] = [
      ["Food", foodPct],
      ["Housing", housingPct],
      ["Transport", transportPct],
    ];
    values.forEach(([cat, p]) =>
      saveBudget(cat, Math.round((total * Number(p)) / 100)),
    );
    setError("Essentials budgets have been updated from your payroll.");
  }
  function addGoal(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || Number(amount) <= 0) return;
    addPlannedExpense({
      name: name.trim(),
      amount: Number(amount),
      category,
      priority: "Medium",
    });
    setName("");
    setAmount("");
  }
  return (
    <div className="page-wrap">
      <div className="page-heading">
        <div>
          <span className="eyebrow">PLANS THAT FIT YOUR LIFE</span>
          <h1>Plans & budgets</h1>
          <p>Set limits, make room for goals, and track what’s left.</p>
        </div>
      </div>
      <div className="dashboard-grid plan-grid">
        <section className="panel payroll-panel">
          <div className="panel-heading">
            <div>
              <h2>Build a plan from your paycheck</h2>
              <p>
                Choose an income amount and set your essentials percentages.
              </p>
            </div>
            <span className="status-pill">Quick setup</span>
          </div>
          <form onSubmit={autoPlan}>
            <label>
              Monthly payroll
              <input
                type="number"
                min="1"
                step="0.01"
                placeholder="e.g. 50000"
                value={payroll}
                onChange={(e) => setPayroll(e.target.value)}
              />
            </label>
            <div className="allocation-grid">
              <label>
                Food %
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={foodPct}
                  onChange={(e) => setFoodPct(e.target.value)}
                />
              </label>
              <label>
                Housing %
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={housingPct}
                  onChange={(e) => setHousingPct(e.target.value)}
                />
              </label>
              <label>
                Transport %
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={transportPct}
                  onChange={(e) => setTransportPct(e.target.value)}
                />
              </label>
            </div>
            <p className="inline-note">
              Percentages are yours to adjust. Update other category budgets
              below after applying.
            </p>
            <button className="button primary">
              Automatically set essentials
            </button>
            {error && <span className="form-success">{error}</span>}
          </form>
        </section>
        <section className="panel extra-money">
          <span className="eyebrow">EXTRA MONEY</span>
          <h2>Give your savings a job.</h2>
          <p>
            Keep an amount set aside for one-off spending. Add a savings goal
            below and track it alongside your category budgets.
          </p>
          <div className="extra-total">
            {money(
              planned.reduce((s, p) => s + p.amount, 0),
              settings.currency,
            )}
            <small>planned for goals</small>
          </div>
        </section>
        <section className="panel budget-panel">
          <div className="panel-heading">
            <div>
              <h2>Monthly category budgets</h2>
              <p>Set spending limits and track actuals</p>
            </div>
            <span className="status-pill">{budgets.length} limits</span>
          </div>
          {categories.map((cat) => {
            const budget = budgets.find((b) => b.category === cat);
            const actual = expenses
              .filter((e) => monthMatch(e.date) && e.category === cat)
              .reduce((s, e) => s + e.amount, 0);
            const pct = budget ? (actual / budget.limit) * 100 : 0;
            return (
              <div className="budget-row" key={cat}>
                <div className="budget-row-top">
                  <span>
                    <b>{cat}</b>
                    {budget && (
                      <small>
                        {money(
                          Math.max(0, budget.limit - actual),
                          settings.currency,
                        )}{" "}
                        remaining
                      </small>
                    )}
                  </span>
                  <div>
                    {budget && (
                      <b className={pct > 100 ? "overspent-text" : ""}>
                        {money(actual, settings.currency)}{" "}
                        <small>
                          / {money(budget.limit, settings.currency)}
                        </small>
                      </b>
                    )}
                    <input
                      aria-label={`${cat} monthly limit`}
                      type="number"
                      min="0"
                      placeholder="Set limit"
                      value={budget?.limit || ""}
                      onChange={(e) => saveBudget(cat, Number(e.target.value))}
                    />
                  </div>
                </div>
                {budget && (
                  <div className="progress-track">
                    <i
                      className={pct > 100 ? "over-limit" : ""}
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>
                )}
                {budget && pct > 100 && (
                  <small className="overspent-text">
                    Over budget by{" "}
                    {money(actual - budget.limit, settings.currency)}
                  </small>
                )}
              </div>
            );
          })}
        </section>
        <section className="panel goal-panel">
          <div className="panel-heading">
            <div>
              <h2>Savings goals</h2>
              <p>Plan purchases and future milestones</p>
            </div>
          </div>
          <form className="goal-form" onSubmit={addGoal}>
            <label>
              Goal name
              <input
                placeholder="e.g. Emergency fund"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>
            <label>
              Target amount
              <input
                type="number"
                min="1"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </label>
            <label>
              Category
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <button className="button primary">Add goal</button>
          </form>
          {planned.length ? (
            planned.map((p) => (
              <div className="goal-row" key={p.id}>
                <span className="goal-check">✦</span>
                <div>
                  <b>{p.name}</b>
                  <small>{p.category} · Goal</small>
                </div>
                <strong>{money(p.amount, settings.currency)}</strong>
                <button
                  className="icon-button"
                  onClick={() => deletePlannedExpense(p.id)}
                  aria-label={`Delete ${p.name}`}
                >
                  ×
                </button>
              </div>
            ))
          ) : (
            <div className="empty-state">No savings goals yet.</div>
          )}
        </section>
      </div>
    </div>
  );
}

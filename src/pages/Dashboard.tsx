import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useExpenses } from "../hooks/useExpenses";
import { money, monthMatch, weekMatch } from "./helpers";
export default function Dashboard() {
  const { expenses, income, budgets, planned, settings } = useExpenses();
  const thisMonth = expenses.filter((e) => monthMatch(e.date));
  const thisWeek = expenses.filter((e) => weekMatch(e.date));
  const spent = thisMonth.reduce((s, e) => s + e.amount, 0);
  const earned = income
    .filter((i) => monthMatch(i.date))
    .reduce((s, i) => s + i.amount, 0);
  const balance = earned - spent;
  const weekSpend = thisWeek.reduce((s, e) => s + e.amount, 0);
  const monthlyLimit = budgets.reduce((s, b) => s + b.limit, 0);
  const categories = useMemo(
    () =>
      Object.entries(
        thisMonth.reduce<Record<string, number>>(
          (a, e) => ({ ...a, [e.category]: (a[e.category] || 0) + e.amount }),
          {},
        ),
      ).sort((a, b) => b[1] - a[1]),
    [thisMonth],
  );
  const recent = expenses.slice(0, 5);
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const daily = days.map((_, idx) =>
    thisWeek
      .filter((e) => {
        const d = new Date(e.date).getDay();
        return (d + 6) % 7 === idx;
      })
      .reduce((s, e) => s + e.amount, 0),
  );
  const max = Math.max(...daily, 1);
  return (
    <div className="page-wrap">
      <div className="page-heading">
        <div>
          <span className="eyebrow">YOUR MONEY AT A GLANCE</span>
          <h1>
            Good morning, {String(settings.name || "there").split(" ")[0]}{" "}
            <span>✦</span>
          </h1>
          <p>Here’s your financial picture for this month.</p>
        </div>
        <Link to="/app/expenses" className="button primary">
          ＋ Add expense
        </Link>
      </div>
      <div className="stat-grid">
        <article className="stat-card feature-stat">
          <span>
            Available balance <i>ⓘ</i>
          </span>
          <strong>{money(balance, settings.currency)}</strong>
          <small>
            {balance >= 0
              ? "Income minus expenses this month"
              : "You spent more than your income"}
          </small>
          <div className="sparkline">▁ ▂ ▃ ▂ ▄ ▅ ▄ ▆ ▇</div>
        </article>
        <article className="stat-card">
          <span>Income this month</span>
          <strong>{money(earned, settings.currency)}</strong>
          <small className="positive">↗ {income.length} income entries</small>
        </article>
        <article className="stat-card">
          <span>Expenses this month</span>
          <strong>{money(spent, settings.currency)}</strong>
          <small>{thisMonth.length} transactions</small>
        </article>
        <article className="stat-card">
          <span>Weekly spending</span>
          <strong>{money(weekSpend, settings.currency)}</strong>
          <small className={weekSpend > 0 ? "neutral" : "positive"}>
            {weekSpend > 0 ? "Across the last 7 days" : "You’re all caught up"}
          </small>
        </article>
      </div>
      <div className="dashboard-grid">
        <section className="panel weekly-panel">
          <div className="panel-heading">
            <div>
              <h2>This week</h2>
              <p>Daily spending and your budget status</p>
            </div>
            <span
              className={`status-pill ${monthlyLimit && spent > monthlyLimit ? "danger" : "good"}`}
            >
              {monthlyLimit && spent > monthlyLimit
                ? "Over budget"
                : "On track"}
            </span>
          </div>
          <div className="week-chart">
            {daily.map((v, i) => (
              <div className="week-column" key={i}>
                <span className="week-bar-value">
                  {v ? money(v, settings.currency) : ""}
                </span>
                <div className="week-bar-wrap">
                  <i style={{ height: `${Math.max(5, (v / max) * 100)}%` }} />
                </div>
                <span>{days[i]}</span>
              </div>
            ))}
          </div>
          <div className="budget-track-label">
            <span>Monthly plan usage</span>
            <b>
              {money(spent, settings.currency)}{" "}
              {monthlyLimit
                ? `/ ${money(monthlyLimit, settings.currency)}`
                : "spent"}
            </b>
          </div>
          <div className="progress-track">
            <i
              style={{
                width: `${monthlyLimit ? Math.min(100, (spent / monthlyLimit) * 100) : 0}%`,
              }}
            />
          </div>
          {monthlyLimit ? (
            <small className="muted">
              {money(Math.max(0, monthlyLimit - spent), settings.currency)}{" "}
              remaining ·{" "}
              {spent > monthlyLimit
                ? "Monthly budget exceeded"
                : "You are within your budget"}
            </small>
          ) : (
            <small className="muted">
              Set category budgets to track your monthly limit.
            </small>
          )}
        </section>
        <section className="panel category-panel">
          <div className="panel-heading">
            <div>
              <h2>Top categories</h2>
              <p>Where your money went this month</p>
            </div>
            <Link to="/app/planned">Manage budgets →</Link>
          </div>
          {categories.length ? (
            categories.slice(0, 4).map(([name, value], i) => (
              <div className="category-row" key={name}>
                <div>
                  <span className={`category-dot dot-${i % 4}`} />
                  <b>{name}</b>
                  <span>{money(value, settings.currency)}</span>
                </div>
                <div className="progress-track">
                  <i
                    style={{
                      width: `${Math.max(4, (value / Math.max(spent, 1)) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              Add your first expense to see a category breakdown.
            </div>
          )}
          <Link className="text-link" to="/app/expenses">
            View all transactions →
          </Link>
        </section>
        <section className="panel activity-panel">
          <div className="panel-heading">
            <div>
              <h2>Recent activity</h2>
              <p>Your latest transactions</p>
            </div>
            <Link to="/app/expenses">See all →</Link>
          </div>
          {recent.length ? (
            recent.map((e) => (
              <div className="activity-row" key={e.id}>
                <span className="activity-icon">
                  {e.category === "Food" ? "◉" : "↗"}
                </span>
                <span className="activity-name">
                  <b>{e.name}</b>
                  <small>
                    {e.category} ·{" "}
                    {new Date(e.date + "T00:00:00").toLocaleDateString("en", {
                      month: "short",
                      day: "numeric",
                    })}
                  </small>
                </span>
                <strong>−{money(e.amount, settings.currency)}</strong>
              </div>
            ))
          ) : (
            <div className="empty-state">
              No transactions yet. <Link to="/app/expenses">Add one</Link>
            </div>
          )}
        </section>
        <section className="panel goals-panel">
          <div className="panel-heading">
            <div>
              <h2>Your next steps</h2>
              <p>Keep your plans moving forward</p>
            </div>
            <Link to="/app/planned">View plans →</Link>
          </div>
          {planned.length ? (
            planned.slice(0, 3).map((p) => (
              <div className="goal-row" key={p.id}>
                <span className="goal-check">✓</span>
                <div>
                  <b>{p.name}</b>
                  <small>
                    {p.category} · {p.priority} priority
                  </small>
                </div>
                <strong>{money(p.amount, settings.currency)}</strong>
              </div>
            ))
          ) : (
            <div className="empty-state">
              Give a goal a name and start planning.{" "}
              <Link to="/app/planned">Create a plan</Link>
            </div>
          )}
          <Link className="button secondary full" to="/app/cashflow">
            Review cashflow →
          </Link>
        </section>
      </div>
    </div>
  );
}

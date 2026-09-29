import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useExpenses } from "../hooks/useExpenses";

const links = [
  ["/app", "⌂", "Overview"],
  ["/app/expenses", "↗", "Transactions"],
  ["/app/planned", "▤", "Budgets"],
  ["/app/cashflow", "⌁", "Cashflow"],
  ["/app/account", "⚙", "Settings"],
];
export default function Layout() {
  const [open, setOpen] = useState(false);
  const { settings, setSettings } = useExpenses();
  const navigate = useNavigate();
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link className="brand" to="/">
          <span className="brand-icon">S</span> Spendly
        </Link>
        <span className="nav-caption">WORKSPACE</span>
        <nav>
          {links.map(([to, icon, label]) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/app"}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              <span>{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="side-tip">
            <b>Make every dollar count</b>
            <span>Your money plan starts with a little awareness.</span>
          </div>
          <div className="sidebar-account-actions">
          <button
            className="profile-chip"
            onClick={() => navigate("/app/account")}
          >
            <span className="avatar">
              {String(settings.name || "G")
                .slice(0, 1)
                .toUpperCase()}
            </span>
            <span>
              <b>{settings.name || "Guest account"}</b>
              <small>{settings.email || "Local device"}</small>
            </span>
            <span>⌄</span>
          </button>
          <button className="sidebar-logout" onClick={() => navigate("/logout")}>↪ Log out</button>
          </div>
        </div>
      </aside>
      <div className="app-main">
        <header className="app-topbar">
          <button className="mobile-menu" onClick={() => setOpen((v) => !v)}>
            ☰
          </button>
          <span>
            {new Date().toLocaleDateString("en", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </span>
          <div className="top-actions">
            <button
              title="Tutorial"
              onClick={() =>
                window.alert(
                  "Welcome to Spendly. Use the sidebar to explore your transactions, budgets, cashflow, and settings.",
                )
              }
            >
              ⓘ
            </button>
            <button
              title="Toggle dark mode"
              onClick={() =>
                setSettings((s) => ({ ...s, darkMode: !s.darkMode }))
              }
            >
              {settings.darkMode ? "☀" : "☾"}
            </button>
            <span className="avatar">
              {String(settings.name || "G")
                .slice(0, 1)
                .toUpperCase()}
            </span>
          </div>
        </header>
        {open && (
          <nav className="mobile-nav">
            {links.map(([to, icon, label]) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/app"}
                onClick={() => setOpen(false)}
              >
                {icon} &nbsp; {label}
              </NavLink>
            ))}
            <button onClick={() => navigate("/logout")}>↪ &nbsp; Log out</button>
          </nav>
        )}
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

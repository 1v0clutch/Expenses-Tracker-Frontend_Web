import { useState } from "react";
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import Planned from "./pages/Planned";
import Cashflow from "./pages/Cashflow";
import Account from "./pages/Account";
import { useExpenses } from "./hooks/useExpenses";

function Landing() {
  return (
    <div className="landing">
      <header className="landing-nav">
        <Link className="brand" to="/">
          <span className="brand-icon">S</span> Spendly
        </Link>
        <nav>
          <a href="#features">Features</a>
          <a href="#preview">Preview</a>
          <a href="#mobile">Mobile</a>
        </nav>
        <div>
          <Link className="nav-login" to="/login">
            Log in
          </Link>
          <Link className="button primary small" to="/register">
            Get started free
          </Link>
        </div>
      </header>
      <section className="hero">
        <span className="eyebrow">
          ✦ Your money, with a little more clarity
        </span>
        <h1>
          Take control of your
          <br />
          spending.
        </h1>
        <p>
          Know where your money goes, plan what matters, and make confident
          decisions every day.
        </p>
        <div className="hero-actions">
          <Link to="/register" className="button primary">
            Get started free <span>→</span>
          </Link>
          <a className="button secondary" href="#preview">
            Explore the dashboard
          </a>
        </div>
        <div className="preview-frame" id="preview">
          <div className="preview-top">
            <div>
              <span className="dots">● ● ●</span>
              <span> spendly / overview</span>
            </div>
            <span>October overview</span>
          </div>
          <div className="preview-content">
            <aside>
              <b>◈ Spendly</b>
              <span className="selected">▦ &nbsp; Overview</span>
              <span>↗ &nbsp; Transactions</span>
              <span>▤ &nbsp; Budgets</span>
              <span>⌁ &nbsp; Cashflow</span>
            </aside>
            <div className="preview-main">
              <div className="preview-welcome">
                Good morning, Sarah <span>✦ All caught up</span>
              </div>
              <div className="preview-cards">
                <div>
                  <small>Available balance</small>
                  <strong>$8,420.50</strong>
                  <i>↑ 12.8% this month</i>
                </div>
                <div>
                  <small>Monthly spending</small>
                  <strong>$2,850.20</strong>
                  <i>On track with your plan</i>
                </div>
                <div>
                  <small>Saved this month</small>
                  <strong>$1,240.00</strong>
                  <i>Keep it going</i>
                </div>
              </div>
              <div className="preview-lower">
                <div className="chart-box">
                  <b>Cash flow</b>
                  <small>Income vs. expenses</small>
                  <div className="bar-chart">
                    {[38, 60, 45, 78, 53, 89, 68, 100, 72, 88, 62, 80].map(
                      (h, i) => (
                        <span key={i} style={{ height: `${h}%` }} />
                      ),
                    )}
                  </div>
                  <div className="chart-labels">
                    <span>May</span>
                    <span>Jun</span>
                    <span>Jul</span>
                    <span>Aug</span>
                    <span>Sep</span>
                    <span>Oct</span>
                  </div>
                </div>
                <div className="activity-box">
                  <b>Recent activity</b>
                  {[
                    ["◉", "Groceries", "$84.20"],
                    ["↗", "Monthly salary", "+$3,400"],
                    ["◉", "Coffee shop", "$12.50"],
                  ].map(([icon, n, a]) => (
                    <div key={n}>
                      <span>
                        {icon} &nbsp;{n}
                      </span>
                      <b>{a}</b>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="feature-section" id="features">
        <span className="eyebrow">MADE FOR REAL LIFE</span>
        <h2>Everything you need to spend smarter</h2>
        <p className="section-intro">
          A calmer way to see the whole picture and stay on top of the details.
        </p>
        <div className="features">
          {[
            [
              "⌁",
              "Know your cash flow",
              "See income and expenses together with a clear picture of what is coming in and going out.",
            ],
            [
              "▤",
              "Budgets that make sense",
              "Set category limits, track progress, and get a heads up before you go over.",
            ],
            [
              "◷",
              "Every transaction in reach",
              "Search, sort, and filter your activity. Keep payment methods and notes together.",
            ],
            [
              "♧",
              "Spending alerts",
              "Stay aware of weekly and monthly spending with simple, useful indicators.",
            ],
            [
              "✦",
              "Flexible income planning",
              "Track a regular paycheck alongside freelance and other income sources.",
            ],
            [
              "⇩",
              "Your data stays yours",
              "Export your records as CSV or PDF whenever you need them.",
            ],
          ].map(([icon, title, body]) => (
            <article key={title}>
              <span>{icon}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="mobile-promo" id="mobile">
        <div>
          <span className="eyebrow">SPENDLY ON THE GO</span>
          <h2>
            Your money picture,
            <br />
            wherever you are.
          </h2>
          <p>
            Log a purchase, check your budget, and keep your cash flow close at
            hand.
          </p>
          <Link to="/register" className="button primary">
            Create your free account →
          </Link>
        </div>
        <div className="phone-preview">
          <div className="phone-notch" />
          <small>GOOD AFTERNOON</small>
          <h3>Your overview</h3>
          <div className="phone-balance">
            <small>Available balance</small>
            <b>₱48,250.00</b>
            <span>↑ 8.2% this month</span>
          </div>
          <div className="phone-ring">₱24,800</div>
          <div className="phone-lines">
            <i />
            <i />
            <i />
          </div>
        </div>
      </section>
      <footer className="landing-footer">
        <Link className="brand" to="/">
          <span className="brand-icon">S</span> Spendly
        </Link>
        <span>Clear money habits start here.</span>
        <Link to="/login">Log in</Link>
      </footer>
    </div>
  );
}
function Logout() {
  const navigate = useNavigate();
  const { settings } = useExpenses();
  return (
    <div className="logout-page">
      <section className="logout-card">
        <Link className="brand" to="/"><span className="brand-icon">S</span> Spendly</Link>
        <span className="logout-mark">✓</span>
        <span className="eyebrow">SESSION ENDED</span>
        <h1>You’re signed out</h1>
        <p>Your {settings.email ? "local profile" : "guest account"} and saved data stay on this browser. You can continue where you left off next time.</p>
        <button className="button primary auth-submit" onClick={() => navigate("/login")}>Continue on this device</button>
        <Link className="text-link" to="/">Back to landing page</Link>
      </section>
    </div>
  );
}
function Auth({
  mode,
}: {
  mode: "login" | "register" | "forgot" | "verify" | "reset";
}) {
  const [stage, setStage] = useState(mode);
  const [error, setError] = useState("");
  const [accepted, setAccepted] = useState(false);
  const navigate = useNavigate();
  const { settings, setSettings } = useExpenses();
  const titles = {
    login: "Welcome back",
    register: "Create your account",
    forgot: "Reset your password",
    verify: "Check your inbox",
    reset: "Choose a new password",
  };
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (stage === "register" && !accepted) {
      setError("Please agree to the Privacy Policy to continue.");
      return;
    }
    const form = new FormData(e.currentTarget as HTMLFormElement);
    const email = String(form.get("email") || "");
    if (stage === "forgot") {
      setError("");
      setStage("verify");
      return;
    }
    if (stage === "verify") {
      setError("");
      setStage("reset");
      return;
    }
    if (stage === "reset") {
      setError("");
      setStage("login");
      return;
    }
    if (stage === "login" && settings.email && email.toLowerCase() !== settings.email.toLowerCase()) {
      setError("This demo only has a local profile on this browser. Continue as guest or use the saved email.");
      return;
    }
    setSettings((s) => ({
      ...s,
      name: stage === "login" ? (s.name || "Guest") : String(form.get("name") || "Guest"),
      email: stage === "login" ? s.email : email,
    }));
    navigate("/app");
  }
  return (
    <div className="auth-page">
      <section className="auth-story">
        <Link className="brand light" to="/">
          <span className="brand-icon">S</span> Spendly
        </Link>
        <div className="auth-story-copy">
          <span className="eyebrow">A clearer view of your money</span>
          <h1>
            {stage === "register"
              ? "Make room for what matters."
              : "Smart spending starts with a clear picture."}
          </h1>
          <p>
            Bring your plans, everyday spending, and income together in one
            simple place.
          </p>
        </div>
        <div className="story-quote">
          <b>“Small steps add up to big changes.”</b>
          <span>One clear view. Better money habits.</span>
        </div>
      </section>
      <section className="auth-form-side">
        <form className="auth-form" onSubmit={submit}>
          <Link to="/" className="auth-back">
            ← Back to Spendly
          </Link>
          <span className="eyebrow">
            {stage === "login" ? "YOUR ACCOUNT" : "GET STARTED"}
          </span>
          <h2>{titles[stage]}</h2>
          <p>
            {stage === "login"
              ? "Sign in to pick up where you left off."
              : "A few details and you’re ready to go."}
          </p>
          {(stage === "login" || stage === "register") && (
            <>
              {stage === "register" && (
                <label>
                  Full name
                  <input name="name" placeholder="Your name" required />
                </label>
              )}
              <label>
                Email address
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                />
              </label>
              {stage !== "register" && null}
              <label>
                Password
                <input
                  name="password"
                  type="password"
                  placeholder="At least 8 characters"
                  required
                  minLength={8}
                />
              </label>
              {stage === "register" && (
                <label className="check-label">
                  <input
                    type="checkbox"
                    checked={accepted}
                    onChange={(e) => setAccepted(e.target.checked)}
                  />
                  <span>
                    I agree to the <a href="#privacy">Privacy Policy</a>
                  </span>
                </label>
              )}
              {stage === "login" && (
                <div className="remember-row">
                  <label className="check-label">
                    <input type="checkbox" defaultChecked />
                    <span>Remember me</span>
                  </label>
                  <button
                    type="button"
                    className="text-button"
                    onClick={() => setStage("forgot")}
                  >
                    Forgot password?
                  </button>
                </div>
              )}
            </>
          )}
          {stage === "forgot" && (
            <label>
              Email address
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                required
              />
            </label>
          )}
          {stage === "verify" && (
            <label>
              6-digit verification code
              <input
                name="code"
                inputMode="numeric"
                placeholder="000000"
                maxLength={6}
                required
              />
            </label>
          )}
          {stage === "reset" && (
            <>
              <label>
                New password
                <input name="password" type="password" minLength={8} required />
              </label>
              <label>
                Confirm password
                <input name="confirm" type="password" minLength={8} required />
              </label>
            </>
          )}
          {error && <p className="form-error">{error}</p>}
          <button className="button primary auth-submit" type="submit">
            {stage === "login"
              ? "Sign in"
              : stage === "register"
                ? "Create account"
                : stage === "forgot"
                  ? "Send reset code"
                  : stage === "verify"
                    ? "Verify code"
                    : "Save new password"}
          </button>
          {stage === "login" && (
            <button
              className="button secondary auth-submit"
              type="button"
              onClick={() => {
                if (!settings.email) setSettings((s) => ({ ...s, name: s.name || "Guest", email: "" }));
                navigate("/app");
              }}
            >
              Continue as guest
            </button>
          )}
          <div className="auth-switch">
            {stage === "login" ? (
              <>
                New to Spendly? <Link to="/register">Create an account</Link>
              </>
            ) : stage === "register" ? (
              <>
                Already have an account? <Link to="/login">Sign in</Link>
              </>
            ) : (
              <button
                type="button"
                className="text-button"
                onClick={() => setStage("login")}
              >
                Back to sign in
              </button>
            )}
          </div>
          <p className="demo-note">
            Demo mode: account actions are stored on this device. Email
            verification requires a connected service.
          </p>
        </form>
      </section>
    </div>
  );
}
function AppRoutes() {
  const { settings } = useExpenses();
  return (
    <div className={settings.darkMode ? "dark" : ""}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Auth mode="login" />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<Auth mode="register" />} />
        <Route path="/forgot-password" element={<Auth mode="forgot" />} />
        <Route path="/verify" element={<Auth mode="verify" />} />
        <Route path="/reset-password" element={<Auth mode="reset" />} />
        <Route path="/app" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="planned" element={<Planned />} />
          <Route path="cashflow" element={<Cashflow />} />
          <Route path="account" element={<Account />} />
        </Route>
        <Route path="*" element={<Landing />} />
      </Routes>
    </div>
  );
}
export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

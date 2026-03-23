import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError("");
    try {
      await login(email, password);
      const redirectTo = (location.state as { from?: string } | null)?.from || "/";
      navigate(redirectTo);
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const message = (err as any)?.response?.data?.message;
      setError(typeof message === "string" && message ? message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-md px-4 py-10">
      <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Sign In</h1>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="mt-4 w-full rounded-lg border border-slate-300 px-3 py-2"
          required
        />
        <div className="mt-3 w-full">
          <div className="relative">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        <button
          className="mt-4 w-full rounded-lg bg-slate-900 px-3 py-2 font-semibold text-white disabled:opacity-50"
          disabled={submitting}
        >
          {submitting ? "Signing in..." : "Login"}
        </button>
        <div className="mt-3 flex items-center justify-between gap-4">
          <p className="text-sm text-slate-600">Forgot password?</p>
          <Link
            to="/forgot-password"
            className="text-sm font-semibold text-slate-900 hover:underline"
          >
            Reset
          </Link>
        </div>
        <p className="mt-4 text-sm text-slate-600">
          New user?{" "}
          <Link to="/signup" className="font-semibold text-slate-900">
            Create account
          </Link>
        </p>
      </form>
    </section>
  );
};

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    setMessage(null);
    // Demo only: backend password reset is not implemented in this project yet.
    setTimeout(() => {
      setSubmitting(false);
      setMessage("Password reset link is not available in this demo. Please login using your email/password.");
    }, 600);
  };

  return (
    <section className="mx-auto w-full max-w-md px-4 py-10">
      <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Reset password</h1>
        <p className="mt-2 text-sm text-slate-600">
          Enter your email and we will send a reset link.
        </p>

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="mt-4 w-full rounded-lg border border-slate-300 px-3 py-2"
          required
          type="email"
        />

        {message && <p className="mt-3 text-sm text-amber-800">{message}</p>}

        <button
          className="mt-4 w-full rounded-lg bg-slate-900 px-3 py-2 font-semibold text-white disabled:opacity-50"
          disabled={submitting}
        >
          {submitting ? "Sending..." : "Send reset link"}
        </button>

        <div className="mt-4 flex items-center justify-between gap-4 text-sm">
          <Link
            to="/login"
            className="font-semibold text-slate-900 hover:underline"
            onClick={() => navigate("/login")}
          >
            Back to login
          </Link>
          <Link to="/signup" className="font-semibold text-slate-900 hover:underline">
            Create account
          </Link>
        </div>
      </form>
    </section>
  );
};


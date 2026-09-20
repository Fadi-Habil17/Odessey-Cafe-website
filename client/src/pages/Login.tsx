import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, LogIn, AlertCircle } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login({ email, password });
      navigate("/admin", { replace: true });
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "تعذر تسجيل الدخول، تحقق من البيانات وحاول مجدداً"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen flex items-center justify-center bg-aegean-900 px-4 font-cairo"
    >
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto rounded-full bg-aegean-800 border-2 border-gold-400 flex items-center justify-center mb-3">
            <Lock size={22} className="text-gold-300" />
          </div>
          <h1 className="text-marble-50 font-extrabold text-2xl">
            لوحة إدارة Odessey
          </h1>
          <p className="text-aegean-300 text-sm mt-1">
            تسجيل دخول خاص بالأدمن فقط
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-marble-50 rounded-2xl shadow-card p-6 space-y-4"
        >
          {error && (
            <div className="flex items-start gap-2 bg-wine-50 border border-wine-200 text-wine-700 text-sm rounded-lg p-3">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-aegean-700 mb-1">
              البريد الإلكتروني
            </label>
            <div className="relative">
              <Mail
                size={16}
                className="absolute top-1/2 -translate-y-1/2 right-3 text-aegean-400"
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@odessey.cafe"
                className="w-full bg-marble-100 border border-gold-200 rounded-lg py-2 pr-9 pl-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400/60"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-aegean-700 mb-1">
              كلمة المرور
            </label>
            <div className="relative">
              <Lock
                size={16}
                className="absolute top-1/2 -translate-y-1/2 right-3 text-aegean-400"
              />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-marble-100 border border-gold-200 rounded-lg py-2 pr-9 pl-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400/60"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-wine-600 hover:bg-wine-700 disabled:opacity-60 text-marble-50 font-bold py-2.5 rounded-lg transition-colors"
          >
            <LogIn size={16} />
            {isSubmitting ? "جاري الدخول..." : "تسجيل الدخول"}
          </button>
        </form>
      </div>
    </div>
  );
}

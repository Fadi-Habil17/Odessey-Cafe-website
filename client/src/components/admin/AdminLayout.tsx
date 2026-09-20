import type { ReactNode } from "react";
import { LogOut, LayoutGrid, ExternalLink } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const { admin, logout } = useAuth();

  return (
    <div dir="rtl" className="min-h-screen bg-marble-100 font-cairo">
      <header className="bg-aegean-900 text-marble-50 sticky top-0 z-20 shadow-card">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutGrid size={20} className="text-gold-300" />
            <div>
              <h1 className="font-extrabold text-lg leading-tight">
                لوحة إدارة Odessey
              </h1>
              <p className="text-xs text-aegean-300">
                مرحباً، {admin?.username}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-xs text-gold-200 hover:text-gold-300 border border-gold-400/30 px-3 py-1.5 rounded-full"
            >
              <ExternalLink size={14} />
              عرض الموقع
            </a>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-xs bg-wine-600 hover:bg-wine-700 px-3 py-1.5 rounded-full transition-colors"
            >
              <LogOut size={14} />
              تسجيل الخروج
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <h2 className="text-xl font-bold text-aegean-900 mb-4">{title}</h2>
        {children}
      </main>
    </div>
  );
}

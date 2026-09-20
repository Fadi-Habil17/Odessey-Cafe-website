import { Link } from "react-router-dom";
import { MapPin, Phone, Instagram, Clock3 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-6 bg-[#3E2A1D] text-[#F5F0E8]">
      <div className="greek-key-divider" />
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <div className="mb-4 flex items-center gap-3">
            <img
              src="/Logo.jpg"
              alt="Odessey Cafe logo"
              className="h-11 w-11 rounded-full border border-[#DAB383] bg-[#F5F0E8] object-contain p-1"
            />
            <div>
              <h3 className="font-display text-3xl leading-none tracking-[0.08em] text-[#F5F0E8]">
                ODYSSEY
              </h3>
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#DAB383]">
                CAFE
              </p>
            </div>
          </div>
          <p className="max-w-xs leading-relaxed text-[#F5F0E8]/75">
            مقهى دافئ وحديث يعكس ضيافة مدينة سلمية، والقهوة العربية، ومجتمع يجمع
            الناس.
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.26em] text-[#DAB383]">
            زيارة
          </h4>
          <ul className="space-y-3 text-[#F5F0E8]/80">
            <li className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 text-[#DAB383]" />
              سلمية-شارع البريد-سنتر النحاس
            </li>
            <li className="flex items-start gap-2">
              <Phone size={16} className="mt-0.5 text-[#DAB383]" />
              963968469738+
            </li>
            <li className="flex items-start gap-2">
              <Instagram size={16} className="mt-0.5 text-[#DAB383]" />
              @odyssey.cafe
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.26em] text-[#DAB383]">
            ساعات العمل
          </h4>
          <ul className="space-y-3 text-[#F5F0E8]/80">
            <li className="flex items-center gap-2">
              <Clock3 size={16} className="text-[#DAB383]" />
              يومياً: 9:00 ص - 1:00 ص
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.26em] text-[#DAB383]">
            تابعنا
          </h4>
          <div className="flex flex-wrap gap-3 text-[#F5F0E8]">
            <a
              href="#"
              className="border border-[#DAB383]/60 px-3 py-2 text-[10px] uppercase tracking-[0.2em] transition-colors hover:bg-[#DAB383]/10"
            >
              إنستغرام
            </a>
            <a
              target="_blank"
              href="https://www.facebook.com/profile.php?id=61576812714366"
              className="border border-[#DAB383]/60 px-3 py-2 text-[10px] uppercase tracking-[0.2em] transition-colors hover:bg-[#DAB383]/10"
            >
              فيسبوك
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-[#DAB383]/20">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-4 py-4 text-center text-[11px] uppercase tracking-[0.2em] text-[#F5F0E8]/60">
          <span>© {new Date().getFullYear()} Odyssey Cafe</span>
          <Link
            to="/admin/login"
            className="text-[#DAB383] transition-opacity hover:opacity-80"
          >
            ·
          </Link>
        </div>
      </div>
    </footer>
  );
}

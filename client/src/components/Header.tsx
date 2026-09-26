import { Search, ShoppingBag } from "lucide-react";

interface HeaderProps {
  cartCount: number;
  onSearchChange: (value: string) => void;
  onCartClick: () => void;
}

export default function Header({
  cartCount,
  onSearchChange,
  onCartClick,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-[#DAB383]/70 bg-[#F5F0E8]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
        <div className="flex items-center gap-3">
          <img
            src="/Logo.jpg"
            alt="Odessey Cafe logo"
            className="h-12 w-12 shrink-0 rounded-full border border-[#DAB383] bg-[#3E2A1D] object-contain p-1 shadow-card"
          />
          <div>
            <h1 className="font-display text-2xl leading-none tracking-[0.08em] text-[#3E2A1D] sm:text-[2rem]">
              ODEYSSEY
            </h1>
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#754E2E]">
              CAFE
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-start">
          {/* حقل البحث */}
          <div className="flex items-center flex-1 sm:flex-initial rounded-full border border-[#DAB383]/80 bg-[#F5F0E8] px-3 py-2 text-sm text-[#3E2A1D] transition-colors focus-within:border-[#754E2E]">
            <Search size={15} className="ml-2 shrink-0 text-[#754E2E]" />
            <input
              type="text"
              placeholder="ابحث عن طلبك..."
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full sm:w-36 min-w-0 bg-transparent text-sm text-[#3E2A1D] outline-none placeholder:text-[#3E2A1D]/45"
            />
          </div>

          {/* زر السلة */}
          <button
            onClick={onCartClick}
            className="relative flex shrink-0 items-center justify-center rounded-full border border-[#DAB383] bg-[#E8DDCC] p-2.5 text-[#3E2A1D] transition-transform hover:-translate-y-0.5 active:scale-95"
            aria-label="Open cart"
          >
            <ShoppingBag size={17} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#754E2E] text-[10px] font-bold text-[#F5F0E8]">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

import type { Category } from "../types";

interface CategoryBarProps {
  categories: Category[];
  activeCategory: string;
  onSelect: (categoryId: string) => void;
}

export default function CategoryBar({
  categories,
  activeCategory,
  onSelect,
}: CategoryBarProps) {
  return (
    <div className="sticky top-[72px] z-20 border-b border-[#DAB383]/65 bg-[#F5F0E8]/90 backdrop-blur-md md:top-[70px]">
      <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4 py-3 scrollbar-hide">
        {categories.map((cat) => {
          const isActive = cat.id === activeCategory;
          const label = cat.nameAr || cat.nameEn || "قسم";

          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className={`shrink-0 whitespace-nowrap border px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition-all duration-200 ${
                isActive
                  ? "border-[#754E2E] bg-[#754E2E] text-[#F5F0E8] shadow-card"
                  : "border-[#DAB383]/80 bg-[#F5F0E8] text-[#3E2A1D] hover:border-[#754E2E] hover:text-[#754E2E]"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

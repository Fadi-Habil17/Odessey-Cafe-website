import { Plus } from "lucide-react";
import type { MenuItem } from "../types";

interface ProductCardProps {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
}

export default function ProductCard({ item, onAdd }: ProductCardProps) {
  const name = item.nameAr || item.nameEn || "منتج";
  const description = item.descriptionAr;

  return (
    <div className="group flex h-full flex-col overflow-hidden border border-[#DAB383]/70 bg-[#F5F0E8] shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-[#754E2E]">
      <div className="relative h-44 w-full overflow-hidden bg-[#E8DDCC] sm:h-48">
        <img
          src={item.imageUrl}
          alt={name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {item.isFeatured && (
          <span className="absolute right-2 top-2 bg-[#754E2E] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#F5F0E8]">
            مميز
          </span>
        )}
        {!item.isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#3E2A1D]/60">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#F5F0E8]">
              غير متوفر
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3.5">
        <h3 className="font-display text-2xl leading-none text-[#3E2A1D]">
          {name}
        </h3>

        <p className="mt-2 flex-1 text-xs leading-relaxed text-[#3E2A1D]/70">
          {description}
        </p>

        <div className="mt-4 flex items-center justify-between gap-2">
          <span className="font-display text-2xl leading-none text-[#754E2E]">
            {item.price.toLocaleString("en-US")} {item.currency}
          </span>
          <button
            onClick={() => onAdd(item)}
            disabled={!item.isAvailable}
            className="inline-flex items-center gap-1 border border-[#754E2E] bg-[#754E2E] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#F5F0E8] transition-colors hover:bg-[#3E2A1D] disabled:cursor-not-allowed disabled:border-[#DAB383]/60 disabled:bg-[#E8DDCC] disabled:text-[#3E2A1D]/50"
          >
            <Plus size={14} />
            أضف
          </button>
        </div>
      </div>
    </div>
  );
}

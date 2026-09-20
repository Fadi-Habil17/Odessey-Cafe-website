import ProductCard from "./ProductCard";
import type { MenuItem } from "../types";

interface ProductGridProps {
  items: MenuItem[];
  loading: boolean;
  onAdd: (item: MenuItem) => void;
}

export default function ProductGrid({
  items,
  loading,
  onAdd,
}: ProductGridProps) {
  if (loading) {
    return (
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-5 px-4 py-6 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-72 animate-pulse rounded-[1.2rem] border border-[#DAB383]/40 bg-[#E8DDCC]"
          />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="editorial-panel rounded-[1.4rem] border border-[#DAB383]/60 p-10">
          <p className="font-display text-4xl text-[#3E2A1D]">
            لا توجد أصناف في هذا القسم حالياً
          </p>
          <p className="mt-3 text-sm uppercase tracking-[0.2em] text-[#754E2E]">
            جرّب قسمًا آخر أو عدّل بحثك.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-2 gap-5 px-4 py-6 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((item) => (
        <ProductCard key={item._id} item={item} onAdd={onAdd} />
      ))}
    </div>
  );
}

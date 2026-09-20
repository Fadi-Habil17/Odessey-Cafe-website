import { Pencil, Trash2, EyeOff } from "lucide-react";
import type { Category, MenuItem } from "../../types";

interface AdminItemsTableProps {
  items: MenuItem[];
  categories: Category[];
  isLoading: boolean;
  onEdit: (item: MenuItem) => void;
  onDelete: (item: MenuItem) => void;
}

export default function AdminItemsTable({
  items,
  categories,
  isLoading,
  onEdit,
  onDelete,
}: AdminItemsTableProps) {
  function categoryName(categoryId: string) {
    return categories.find((c) => c.id === categoryId)?.nameAr || categoryId;
  }

  if (isLoading) {
    return (
      <div className="bg-marble-50 rounded-xl border border-gold-100 p-8 text-center text-aegean-400">
        جاري التحميل...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-marble-50 rounded-xl border border-gold-100 p-8 text-center text-aegean-400">
        لا توجد أصناف بعد. اضغط "إضافة صنف جديد" للبدء.
      </div>
    );
  }

  return (
    <div className="bg-marble-50 rounded-xl border border-gold-100 overflow-hidden">
      {/* Desktop table */}
      <table className="w-full text-sm hidden md:table">
        <thead className="bg-aegean-900 text-marble-100 text-xs">
          <tr>
            <th className="text-right px-4 py-3 font-semibold">الصورة</th>
            <th className="text-right px-4 py-3 font-semibold">الاسم</th>
            <th className="text-right px-4 py-3 font-semibold">القسم</th>
            <th className="text-right px-4 py-3 font-semibold">السعر</th>
            <th className="text-right px-4 py-3 font-semibold">الحالة</th>
            <th className="text-right px-4 py-3 font-semibold">إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id} className="border-t border-gold-100 hover:bg-marble-100/60">
              <td className="px-4 py-2">
                <img
                  src={item.imageUrl}
                  alt={item.nameAr}
                  className="w-12 h-12 rounded-lg object-cover"
                />
              </td>
              <td className="px-4 py-2 font-semibold text-aegean-900">
                {item.nameAr}
              </td>
              <td className="px-4 py-2 text-aegean-600">
                {categoryName(item.categoryId)}
              </td>
              <td className="px-4 py-2 font-bold text-wine-700">
                {item.price.toLocaleString("ar")} {item.currency}
              </td>
              <td className="px-4 py-2">
                {item.isAvailable ? (
                  <span className="text-xs bg-olive-100 text-olive-700 px-2 py-1 rounded-full">
                    متوفر
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs bg-aegean-100 text-aegean-500 px-2 py-1 rounded-full w-fit">
                    <EyeOff size={12} /> غير متوفر
                  </span>
                )}
              </td>
              <td className="px-4 py-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit(item)}
                    className="p-1.5 rounded-full bg-aegean-100 text-aegean-700 hover:bg-aegean-200"
                    aria-label="تعديل"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => onDelete(item)}
                    className="p-1.5 rounded-full bg-wine-50 text-wine-600 hover:bg-wine-100"
                    aria-label="حذف"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile cards */}
      <div className="md:hidden divide-y divide-gold-100">
        {items.map((item) => (
          <div key={item._id} className="p-3 flex items-center gap-3">
            <img
              src={item.imageUrl}
              alt={item.nameAr}
              className="w-14 h-14 rounded-lg object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-aegean-900 text-sm truncate">
                {item.nameAr}
              </p>
              <p className="text-xs text-aegean-500">
                {categoryName(item.categoryId)}
              </p>
              <p className="text-sm font-bold text-wine-700 mt-0.5">
                {item.price.toLocaleString("ar")} {item.currency}
              </p>
            </div>
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => onEdit(item)}
                className="p-1.5 rounded-full bg-aegean-100 text-aegean-700"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={() => onDelete(item)}
                className="p-1.5 rounded-full bg-wine-50 text-wine-600"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

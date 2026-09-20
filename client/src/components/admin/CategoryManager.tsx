import { useState, type FormEvent } from "react";
import { Plus, Pencil, Trash2, Check, X, AlertCircle } from "lucide-react";
import type { AdminCategory } from "../../types";
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "../../services/api";

interface CategoryManagerProps {
  categories: AdminCategory[];
  onChanged: () => void; // called after any successful create/update/delete to refresh parent data
}

const emptyDraft = { slug: "", nameAr: "", nameEn: "", sortOrder: 0 };

export default function CategoryManager({ categories, onChanged }: CategoryManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState(emptyDraft);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  function startAdd() {
    setDraft(emptyDraft);
    setEditingId(null);
    setIsAdding(true);
    setError("");
  }

  function startEdit(cat: AdminCategory) {
    setDraft({ slug: cat.slug, nameAr: cat.nameAr, nameEn: cat.nameEn, sortOrder: cat.sortOrder });
    setEditingId(cat._id);
    setIsAdding(true);
    setError("");
  }

  function cancel() {
    setIsAdding(false);
    setEditingId(null);
    setDraft(emptyDraft);
    setError("");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!draft.slug || !draft.nameAr || !draft.nameEn) {
      setError("الرجاء تعبئة المعرّف (slug) والاسم بالعربي والإنجليزي");
      return;
    }

    setIsSaving(true);
    try {
      if (editingId) {
        await updateCategory(editingId, draft);
      } else {
        await createCategory(draft);
      }
      cancel();
      onChanged();
    } catch (err: any) {
      setError(err?.response?.data?.message || "تعذر حفظ القسم");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(cat: AdminCategory) {
    if (!confirm(`هل أنت متأكد من حذف قسم "${cat.nameAr}"؟`)) return;
    try {
      await deleteCategory(cat._id);
      onChanged();
    } catch (err: any) {
      alert(err?.response?.data?.message || "تعذر حذف القسم");
    }
  }

  return (
    <div className="bg-marble-50 rounded-xl border border-gold-100 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-aegean-900">الأقسام</h3>
        {!isAdding && (
          <button
            onClick={startAdd}
            className="flex items-center gap-1.5 text-xs bg-aegean-800 hover:bg-wine-600 text-marble-50 px-3 py-1.5 rounded-full transition-colors"
          >
            <Plus size={14} />
            قسم جديد
          </button>
        )}
      </div>

      {isAdding && (
        <form
          onSubmit={handleSubmit}
          className="bg-marble-100 border border-gold-200 rounded-lg p-3 mb-3 space-y-2"
        >
          {error && (
            <div className="flex items-center gap-2 text-wine-700 text-xs">
              <AlertCircle size={14} />
              {error}
            </div>
          )}
          <div className="grid grid-cols-2 gap-2">
            <input
              placeholder="المعرّف (slug) مثل: desserts"
              value={draft.slug}
              onChange={(e) => setDraft((d) => ({ ...d, slug: e.target.value.trim() }))}
              className="bg-marble-50 border border-gold-200 rounded-lg py-1.5 px-2 text-xs col-span-2 sm:col-span-1"
              disabled={!!editingId}
            />
            <input
              type="number"
              placeholder="ترتيب العرض"
              value={draft.sortOrder}
              onChange={(e) => setDraft((d) => ({ ...d, sortOrder: Number(e.target.value) }))}
              className="bg-marble-50 border border-gold-200 rounded-lg py-1.5 px-2 text-xs"
            />
            <input
              placeholder="الاسم بالعربي"
              value={draft.nameAr}
              onChange={(e) => setDraft((d) => ({ ...d, nameAr: e.target.value }))}
              className="bg-marble-50 border border-gold-200 rounded-lg py-1.5 px-2 text-xs"
            />
            <input
              placeholder="الاسم بالإنجليزي"
              value={draft.nameEn}
              onChange={(e) => setDraft((d) => ({ ...d, nameEn: e.target.value }))}
              className="bg-marble-50 border border-gold-200 rounded-lg py-1.5 px-2 text-xs"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-1 text-xs bg-olive-600 hover:bg-olive-700 text-marble-50 px-3 py-1.5 rounded-full"
            >
              <Check size={14} />
              {isSaving ? "جاري الحفظ..." : "حفظ"}
            </button>
            <button
              type="button"
              onClick={cancel}
              className="flex items-center gap-1 text-xs bg-aegean-100 text-aegean-700 px-3 py-1.5 rounded-full"
            >
              <X size={14} />
              إلغاء
            </button>
          </div>
        </form>
      )}

      <ul className="space-y-1.5">
        {categories.map((cat) => (
          <li
            key={cat._id}
            className="flex items-center justify-between bg-marble-100 rounded-lg px-3 py-2 text-sm"
          >
            <div>
              <span className="font-semibold text-aegean-900">{cat.nameAr}</span>
              <span className="text-aegean-400 text-xs mr-2">({cat.slug})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => startEdit(cat)}
                className="p-1.5 rounded-full bg-aegean-100 text-aegean-700 hover:bg-aegean-200"
              >
                <Pencil size={12} />
              </button>
              <button
                onClick={() => handleDelete(cat)}
                className="p-1.5 rounded-full bg-wine-50 text-wine-600 hover:bg-wine-100"
              >
                <Trash2 size={12} />
              </button>
            </div>
          </li>
        ))}
        {categories.length === 0 && (
          <p className="text-xs text-aegean-400 text-center py-3">لا توجد أقسام بعد</p>
        )}
      </ul>
    </div>
  );
}

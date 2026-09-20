import { useEffect, useState, type FormEvent } from "react";
import { X, Upload, Save, AlertCircle } from "lucide-react";
import type { Category, MenuItem, MenuItemFormData } from "../../types";

interface ItemFormModalProps {
  isOpen: boolean;
  categories: Category[];
  editingItem: MenuItem | null; // null = "add new" mode
  onClose: () => void;
  onSubmit: (data: MenuItemFormData) => Promise<void>;
}

const emptyForm: MenuItemFormData = {
  nameAr: "",
  nameEn: "",
  descriptionAr: "",
  price: 0,
  currency: "ل.س",
  categoryId: "",
  isAvailable: true,
  isFeatured: false,
  imageFile: null,
  imageUrl: "",
};

export default function ItemFormModal({
  isOpen,
  categories,
  editingItem,
  onClose,
  onSubmit,
}: ItemFormModalProps) {
  const [form, setForm] = useState<MenuItemFormData>(emptyForm);
  const [preview, setPreview] = useState<string>("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate the form when opening in "edit" mode, reset when opening in "add" mode
  useEffect(() => {
    if (editingItem) {
      setForm({
        nameAr: editingItem.nameAr,
        nameEn: editingItem.nameEn || "",
        descriptionAr: editingItem.descriptionAr,
        price: editingItem.price,
        currency: editingItem.currency,
        categoryId: editingItem.categoryId,
        isAvailable: editingItem.isAvailable,
        isFeatured: !!editingItem.isFeatured,
        imageFile: null,
        imageUrl: editingItem.imageUrl,
      });
      setPreview(editingItem.imageUrl);
    } else {
      setForm({ ...emptyForm, categoryId: categories[0]?.id || "" });
      setPreview("");
    }
    setError("");
  }, [editingItem, isOpen, categories]);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm((f) => ({ ...f, imageFile: file }));
    setPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.nameAr || !form.descriptionAr || !form.categoryId || form.price <= 0) {
      setError("الرجاء تعبئة جميع الحقول المطلوبة (الاسم، الوصف، القسم، والسعر أكبر من صفر)");
      return;
    }
    if (!editingItem && !form.imageFile) {
      setError("الرجاء رفع صورة للصنف");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(form);
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || "حدث خطأ، حاول مجدداً");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-aegean-900/60 backdrop-blur-sm" onClick={onClose} />

      <form
        onSubmit={handleSubmit}
        dir="rtl"
        className="relative bg-marble-50 rounded-2xl max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-aegean-900 px-5 py-4 flex items-center justify-between z-10">
          <h2 className="text-marble-50 font-bold text-lg">
            {editingItem ? "تعديل الصنف" : "إضافة صنف جديد"}
          </h2>
          <button type="button" onClick={onClose} className="text-marble-50 hover:text-gold-300">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {error && (
            <div className="flex items-start gap-2 bg-wine-50 border border-wine-200 text-wine-700 text-sm rounded-lg p-3">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Image upload */}
          <div>
            <label className="block text-xs font-semibold text-aegean-700 mb-1">
              صورة الصنف
            </label>
            <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gold-300 rounded-xl h-32 cursor-pointer overflow-hidden bg-marble-100 hover:border-gold-400 transition-colors">
              {preview ? (
                <img src={preview} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <span className="flex flex-col items-center gap-1 text-aegean-400 text-xs">
                  <Upload size={20} />
                  اضغط لرفع صورة
                </span>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          </div>

          {/* Name AR */}
          <div>
            <label className="block text-xs font-semibold text-aegean-700 mb-1">
              اسم الصنف (عربي) *
            </label>
            <input
              type="text"
              required
              value={form.nameAr}
              onChange={(e) => setForm((f) => ({ ...f, nameAr: e.target.value }))}
              placeholder="مثال: طبق أوليمبوس الخاص"
              className="w-full bg-marble-100 border border-gold-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400/60"
            />
          </div>

          {/* Name EN */}
          <div>
            <label className="block text-xs font-semibold text-aegean-700 mb-1">
              اسم الصنف (إنجليزي) — اختياري
            </label>
            <input
              type="text"
              value={form.nameEn}
              onChange={(e) => setForm((f) => ({ ...f, nameEn: e.target.value }))}
              placeholder="Olympus Special Platter"
              className="w-full bg-marble-100 border border-gold-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400/60"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-aegean-700 mb-1">
              الوصف / المكونات *
            </label>
            <textarea
              required
              rows={3}
              value={form.descriptionAr}
              onChange={(e) => setForm((f) => ({ ...f, descriptionAr: e.target.value }))}
              placeholder="مثال: 4 قطع دجاج، بطاطا، صوصات متنوعة..."
              className="w-full bg-marble-100 border border-gold-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400/60 resize-none"
            />
          </div>

          {/* Price + Currency */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-aegean-700 mb-1">
                السعر *
              </label>
              <input
                type="number"
                required
                min={0}
                value={form.price || ""}
                onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))}
                className="w-full bg-marble-100 border border-gold-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400/60"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-aegean-700 mb-1">
                العملة
              </label>
              <select
                value={form.currency}
                onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))}
                className="w-full bg-marble-100 border border-gold-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400/60"
              >
                <option value="ل.س">ل.س</option>
                <option value="$">$</option>
              </select>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-aegean-700 mb-1">
              القسم *
            </label>
            <select
              required
              value={form.categoryId}
              onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
              className="w-full bg-marble-100 border border-gold-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400/60"
            >
              <option value="" disabled>
                اختر قسماً
              </option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nameAr}
                </option>
              ))}
            </select>
          </div>

          {/* Toggles */}
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm text-aegean-700 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isAvailable}
                onChange={(e) => setForm((f) => ({ ...f, isAvailable: e.target.checked }))}
                className="w-4 h-4 accent-wine-600"
              />
              متوفر حالياً
            </label>
            <label className="flex items-center gap-2 text-sm text-aegean-700 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => setForm((f) => ({ ...f, isFeatured: e.target.checked }))}
                className="w-4 h-4 accent-gold-500"
              />
              الأكثر طلباً (مميز)
            </label>
          </div>
        </div>

        <div className="sticky bottom-0 bg-marble-50 border-t border-gold-200 p-4 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg border border-aegean-200 text-aegean-700 font-semibold hover:bg-aegean-50"
          >
            إلغاء
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-wine-600 hover:bg-wine-700 disabled:opacity-60 text-marble-50 font-bold"
          >
            <Save size={16} />
            {isSubmitting ? "جاري الحفظ..." : "حفظ"}
          </button>
        </div>
      </form>
    </div>
  );
}

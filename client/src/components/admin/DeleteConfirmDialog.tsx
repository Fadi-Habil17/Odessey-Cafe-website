import { AlertTriangle, X } from "lucide-react";

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  itemName: string;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmDialog({
  isOpen,
  itemName,
  isDeleting,
  onCancel,
  onConfirm,
}: DeleteConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-aegean-900/60 backdrop-blur-sm" onClick={onCancel} />

      <div dir="rtl" className="relative bg-marble-50 rounded-2xl max-w-sm w-full shadow-2xl p-6 text-center">
        <button
          onClick={onCancel}
          className="absolute top-4 left-4 text-aegean-400 hover:text-aegean-600"
        >
          <X size={18} />
        </button>

        <div className="w-14 h-14 mx-auto rounded-full bg-wine-50 flex items-center justify-center mb-3">
          <AlertTriangle size={24} className="text-wine-600" />
        </div>

        <h3 className="font-bold text-aegean-900 text-lg mb-1">تأكيد الحذف</h3>
        <p className="text-sm text-aegean-500 mb-6">
          هل أنت متأكد من حذف "<span className="font-semibold text-aegean-700">{itemName}</span>"؟
          <br />
          لا يمكن التراجع عن هذا الإجراء.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-lg border border-aegean-200 text-aegean-700 font-semibold hover:bg-aegean-50"
          >
            إلغاء
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 py-2.5 rounded-lg bg-wine-600 hover:bg-wine-700 disabled:opacity-60 text-marble-50 font-bold"
          >
            {isDeleting ? "جاري الحذف..." : "حذف نهائياً"}
          </button>
        </div>
      </div>
    </div>
  );
}

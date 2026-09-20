import { ShoppingBag, X, Minus, Plus, Trash2 } from "lucide-react";
import type { CartItem } from "../types";

interface FloatingCartProps {
  isOpen: boolean;
  cartItems: CartItem[];
  onToggle: () => void;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onRemove: (id: string) => void;
}

export default function FloatingCart({
  isOpen,
  cartItems,
  onToggle,
  onIncrease,
  onDecrease,
  onRemove,
}: FloatingCartProps) {
  const totalCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, i) => sum + i.quantity * i.price,
    0
  );
  const currency = cartItems[0]?.currency ?? "ل.س";

  return (
    <>
      {/* Floating button */}
      {!isOpen && totalCount > 0 && (
        <button
          onClick={onToggle}
          className="fixed bottom-5 left-5 z-40 flex items-center gap-2 bg-wine-600 hover:bg-wine-700 text-marble-50 px-5 py-3 rounded-full shadow-lg shadow-wine-900/30 transition-transform hover:scale-105"
        >
          <ShoppingBag size={20} />
          <span className="font-bold text-sm">
            {totalCount} صنف · {totalPrice.toLocaleString("ar")} {currency}
          </span>
        </button>
      )}

      {/* Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-aegean-900/50 backdrop-blur-sm"
            onClick={onToggle}
          />
          <div className="relative w-full max-w-sm bg-marble-50 h-full shadow-2xl flex flex-col animate-in slide-in-from-left">
            <div className="flex items-center justify-between p-4 border-b border-gold-200 bg-aegean-900 text-marble-50">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <ShoppingBag size={20} className="text-gold-300" />
                طلبك من أوديسي
              </h2>
              <button onClick={onToggle} className="p-1 hover:text-gold-300">
                <X size={22} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cartItems.length === 0 && (
                <p className="text-center text-aegean-400 mt-10">
                  سلتك فارغة، أضف أطباقك اليونانية المفضلة!
                </p>
              )}
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-3 bg-marble-100 border border-gold-100 rounded-xl p-2"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.nameAr}
                    className="w-16 h-16 rounded-lg object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-aegean-900 truncate">
                      {item.nameAr}
                    </p>
                    <p className="text-xs text-wine-700 font-bold mt-0.5">
                      {item.price.toLocaleString("ar")} {item.currency}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={() => onDecrease(item._id)}
                        className="w-6 h-6 flex items-center justify-center rounded-full bg-aegean-800 text-marble-50"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-sm font-semibold w-5 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onIncrease(item._id)}
                        className="w-6 h-6 flex items-center justify-center rounded-full bg-aegean-800 text-marble-50"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemove(item._id)}
                    className="p-1.5 text-wine-500 hover:text-wine-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            {cartItems.length > 0 && (
              <div className="p-4 border-t border-gold-200 bg-marble-50">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-aegean-600 font-medium">
                    الإجمالي
                  </span>
                  <span className="font-extrabold text-lg text-wine-700">
                    {totalPrice.toLocaleString("ar")} {currency}
                  </span>
                </div>
                <button className="w-full bg-wine-600 hover:bg-wine-700 text-marble-50 font-bold py-3 rounded-full transition-colors shadow-card">
                  تأكيد الطلب
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

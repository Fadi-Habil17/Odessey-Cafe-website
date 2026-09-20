import { X } from "lucide-react";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-aegean-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-marble-50 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
        <div className="bg-aegean-900 px-5 py-4 flex items-center justify-between">
          <h2 className="text-marble-50 font-bold text-lg">
            من نحن — Odessey
          </h2>
          <button onClick={onClose} className="text-marble-50 hover:text-gold-300">
            <X size={20} />
          </button>
        </div>
        <div className="greek-key-divider" />
        <div className="p-5 text-sm leading-relaxed text-aegean-700 space-y-3">
          <p>
            مرحباً بكم في <span className="font-bold text-wine-700">Odessey</span>،
            رحلة نكهات مستوحاة من الحضارة الإغريقية القديمة، حيث تلتقي
            الأصالة اليونانية بأطباقنا الشرقية المحلية.
          </p>
          <p>
            نقدّم تشكيلة واسعة من الوجبات، السندويشات، البيتزا، البرغر،
            المقبلات، والمشروبات — جميعها مُحضّرة بعناية لتمنحكم تجربة
            أوليمبية لا تُنسى.
          </p>
          <p className="text-aegean-500 text-xs">
            نُسعد بزيارتكم يومياً ضمن أوقات دوامنا المُعلنة أعلاه.
          </p>
        </div>
      </div>
    </div>
  );
}

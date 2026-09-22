import { Clock, Info } from "lucide-react";
import type { WorkingHours } from "../types";

interface TopBannerProps {
  workingHours?: WorkingHours;
  onAboutClick: () => void;
}

const defaultHours: WorkingHours = {
  label: "الدوام الصيفي",
  hours: "9:00 ص - 11:00 ل",
};

export default function TopBanner({
  workingHours = defaultHours,
  onAboutClick,
}: TopBannerProps) {
  return (
    <div className="bg-[#3E2A1D] text-[#F5F0E8] text-sm tracking-[0.14em] uppercase">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5">
        <div className="flex items-center gap-2 text-[#DAB383]">
          <Clock size={15} />
          <span className="hidden text-[#F5F0E8]/85 sm:inline">
            {workingHours.label}:
          </span>
          <span className="font-semibold tracking-[0.12em]">
            {workingHours.hours}
          </span>
        </div>

        <button
          onClick={onAboutClick}
          className="flex items-center gap-1.5 border border-[#DAB383]/55 px-3 py-1.5 text-[10px] font-semibold text-[#DAB383] transition-colors hover:bg-[#DAB383]/10"
        >
          <Info size={13} />
          <span>من نحن</span>
        </button>
      </div>
      <div className="greek-key-divider" />
    </div>
  );
}

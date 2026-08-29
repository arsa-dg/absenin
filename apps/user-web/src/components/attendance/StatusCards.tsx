import { formatAttendanceTime } from "../../lib/utils";
import type { AttendanceItem } from "../../types/attendance";

interface StatusCardsProps {
  todayRecord: AttendanceItem | null;
  fetching: boolean;
}

export function StatusCards({ todayRecord, fetching }: StatusCardsProps) {
  const isClockedIn = Boolean(todayRecord?.clockIn);
  const isClockedOut = Boolean(todayRecord?.clockOut);

  const clockInFormatted = todayRecord?.clockIn
    ? formatAttendanceTime(todayRecord.clockIn).time
    : "--:--";

  const clockOutFormatted = todayRecord?.clockOut
    ? formatAttendanceTime(todayRecord.clockOut).time
    : "--:--";

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 flex flex-col justify-between">
        <div>
          <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">
            Clock In
          </span>
          <p className="text-lg font-bold text-slate-800 mt-0.5">
            {fetching ? "..." : clockInFormatted}
          </p>
        </div>
        <span
          className={`text-[11px] font-medium mt-1 ${
            isClockedIn ? "text-emerald-600" : "text-slate-400"
          }`}
        >
          {isClockedIn ? "Tercatat" : "Belum Absen"}
        </span>
      </div>

      <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 flex flex-col justify-between">
        <div>
          <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">
            Clock Out
          </span>
          <p className="text-lg font-bold text-slate-800 mt-0.5">
            {fetching ? "..." : clockOutFormatted}
          </p>
        </div>
        <span
          className={`text-[11px] font-medium mt-1 ${
            isClockedOut ? "text-blue-600" : "text-slate-400"
          }`}
        >
          {isClockedOut ? "Tercatat" : "Belum Absen"}
        </span>
      </div>
    </div>
  );
}
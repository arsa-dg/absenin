interface WorkingDurationProps {
  clockIn?: string;
  clockOut?: string | null;
  currentTime: Date;
}

export function WorkingDuration({ clockIn, clockOut, currentTime }: WorkingDurationProps) {
  if (!clockIn || clockOut) return null;

  const start = new Date(clockIn).getTime();
  const now = currentTime.getTime();
  const diffMs = Math.max(0, now - start);

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  return (
    <div className="bg-slate-100/70 border border-slate-200/80 rounded-lg p-2.5 text-center">
      <span className="text-[11px] text-slate-500 font-medium">Durasi Kerja Hari Ini: </span>
      <span className="text-xs font-bold text-slate-800 font-mono">
        {hours} Jam {minutes} Menit
      </span>
    </div>
  );
}
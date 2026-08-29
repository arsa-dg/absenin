interface LiveClockProps {
  currentTime: Date;
}

export function LiveClock({ currentTime }: LiveClockProps) {
  const displayDate = currentTime.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const displayTime = currentTime.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return (
    <div className="text-center">
      <p className="text-xs font-mono uppercase text-slate-500 font-semibold tracking-wider">
        {displayDate}
      </p>
      <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight my-1.5 font-mono">
        {displayTime}
      </h1>
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
        Dalam Radius Kantor
      </span>
    </div>
  );
}
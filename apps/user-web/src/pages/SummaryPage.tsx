import { useEffect, useState } from "react";
import { Card } from "../components/Card";
import { api } from "../lib/api";
import { formatAttendanceTime } from "../lib/utils";
import type { AttendanceItem, AttendanceResponse } from "../types/attendance";

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function SummaryPage() {
  const todayStr = new Date().toISOString().split("T")[0];
  const now = new Date();
  const firstDayOfMonthStr = formatDate(new Date(now.getFullYear(), now.getMonth(), 1));

  const [startDate, setStartDate] = useState(firstDayOfMonthStr);
  const [endDate, setEndDate] = useState(todayStr);
  const [records, setRecords] = useState<AttendanceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = async (start: string, end: string) => {
    setError(null);
    setLoading(true);

    try {
      const res = await api.get<AttendanceResponse>("/attendance", {
        params: {
          startDate: start,
          endDate: end,
        },
      });

      const list = res.data?.attendances || [];
      setRecords(list);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message  || "Gagal memuat rekap absensi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary(startDate, endDate);
  }, []);

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSummary(startDate, endDate);
  };

  const calculateDuration = (inIso?: string, outIso?: string | null) => {
    if (!inIso || !outIso) return "-";
    const start = new Date(inIso).getTime();
    const end = new Date(outIso).getTime();
    const diffMs = Math.max(0, end - start);

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}j ${minutes}m`;
  };

  return (
    <div className="h-full flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-6 flex flex-col gap-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            Rekap Absensi
          </h2>
        </div>

        <form
          onSubmit={handleFilterSubmit}
          className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-end bg-slate-50 border border-slate-200/80 p-3.5 rounded-xl"
        >
          <div className="flex flex-col gap-1 sm:col-span-2">
            <label className="font-mono text-[10px] uppercase font-bold text-slate-600">
              Dari Tanggal
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="border border-slate-300 rounded-lg p-2 text-xs font-sans bg-white focus:outline-slate-800"
            />
          </div>

          <div className="flex flex-col gap-1 sm:col-span-2">
            <label className="font-mono text-[10px] uppercase font-bold text-slate-600">
              Sampai Tanggal
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              className="border border-slate-300 rounded-lg p-2 text-xs font-sans bg-white focus:outline-slate-800"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 px-3 rounded-lg font-sans text-xs font-semibold hover:bg-neutral-800 transition cursor-pointer disabled:opacity-50 sm:col-span-1"
          >
            {loading ? "..." : "FILTER"}
          </button>
        </form>

        {error && (
          <div className="bg-red-50 text-red-800 border border-red-200 p-2.5 rounded text-center font-sans text-xs font-semibold">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-2.5 max-h-[420px] overflow-y-auto pr-1">
          {loading ? (
            <div className="py-12 text-center text-slate-400 font-sans text-xs">
              Memuat data absensi...
            </div>
          ) : records.length === 0 ? (
            <div className="py-12 text-center text-slate-400 font-sans text-xs">
              Tidak ada riwayat absensi pada rentang tanggal ini.
            </div>
          ) : (
            records.map((item, index) => {
              const inFormatted = formatAttendanceTime(item.clockIn);
              const outFormatted = item.clockOut
                ? formatAttendanceTime(item.clockOut)
                : null;
              const duration = calculateDuration(item.clockIn, item.clockOut);

              return (
                <div
                  key={item.date || index}
                  className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-center justify-between"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="font-mono text-xs font-bold text-slate-800">
                      {inFormatted.date}
                    </span>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono">
                      <span>
                        In: <strong className="text-slate-700">{inFormatted.time}</strong>
                      </span>
                      <span>|</span>
                      <span>
                        Out:{" "}
                        <strong className="text-slate-700">
                          {outFormatted ? outFormatted.time : "--:--"}
                        </strong>
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        item.clockOut
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {item.clockOut ? "Selesai" : "Sedang Kerja"}
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">
                      Durasi: {duration}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>
    </div>
  );
}
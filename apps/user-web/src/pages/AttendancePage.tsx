import { useEffect, useState } from "react";
import { Card } from "../components/Card";
import { api } from "../lib/api";
import { formatAttendanceTime } from "../lib/utils";
import { LiveClock } from "../components/attendance/LiveClock";
import { StatusCards } from "../components/attendance/StatusCards";
import { WorkingDuration } from "../components/attendance/WorkingDuration";

interface AttendanceItem {
  date: string;
  clockIn: string;
  clockOut?: string | null;
}

interface AttendanceResponse {
  userId: string;
  attendances: AttendanceItem[];
}

export default function AttendancePage() {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [todayRecord, setTodayRecord] = useState<AttendanceItem | null>(null);
  const [fetching, setFetching] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchTodayAttendance = async () => {
    try {
      setFetching(true);
      const todayStr = new Date().toISOString().split("T")[0];
      
      const res = await api.get<AttendanceResponse>("/attendance", {
        params: {
          startDate: todayStr,
          endDate: todayStr,
        },
      });

      const record = res.data?.attendances?.[0] || null;
      setTodayRecord(record);
    } catch {
      setTodayRecord(null);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchTodayAttendance();
  }, []);

  const handleClick = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const res = await api.post("/attendance");
      const data = res.data;

      const timestamp = data?.clockOut || data?.clockIn;
      const { date, time } = formatAttendanceTime(timestamp);
      const type = data?.clockOut ? "pulang" : "masuk";

      setSuccess(`Berhasil absen ${type} tanggal ${date} pukul ${time}`);
      await fetchTodayAttendance();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message  || "Attendance failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <Card className="w-full max-w-xl p-6 flex flex-col gap-5">
        <LiveClock currentTime={currentTime} />

        <StatusCards todayRecord={todayRecord} fetching={fetching} />

        <WorkingDuration
          clockIn={todayRecord?.clockIn}
          clockOut={todayRecord?.clockOut}
          currentTime={currentTime}
        />

        {error && (
          <div className="bg-red-50 text-red-800 border border-red-200 p-2.5 rounded text-center font-sans text-sm font-semibold">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 text-green-800 border border-green-200 p-2.5 rounded text-center font-sans text-sm font-semibold">
            {success}
          </div>
        )}

        <button
          type="button"
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-lg font-sans text-sm hover:bg-neutral-800 transition-colors font-semibold mt-2 cursor-pointer disabled:opacity-50"
          onClick={handleClick}
        >
          {loading ? "PROCESSING..." : "ABSEN"}
        </button>
      </Card>
    </div>
  );
}
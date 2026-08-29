export function formatAttendanceTime(isoString?: string | null) {
  if (!isoString) {
    return { date: "-", time: "-" };
  }

  const dateObj = new Date(isoString);

  const date = dateObj.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const time = dateObj.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return { date, time };
}
export interface AttendanceItem {
  date: string;
  clockIn: string;
  clockOut?: string | null;
}

export interface AttendanceResponse {
  userId: string;
  attendances: AttendanceItem[];
}
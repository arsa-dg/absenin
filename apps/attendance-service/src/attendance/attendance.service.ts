import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { AttendanceRepository } from './attendance.repository';

@Injectable()
export class AttendanceService {
  constructor(
    private readonly attendanceRepository: AttendanceRepository,
  ) {}

  async create(userId: string) {
    const now = new Date();

    const todayAttendance = await this.attendanceRepository.findByUserIdDate(userId, now);
    if (!todayAttendance) {
      try {
        await this.attendanceRepository.create({
          userId,
          date: now,
          clockIn: now,
        });
        return;
      } catch (error: any) {
        if (error?.code === '23505') {
          throw new ConflictException('Attendance record already created for today.');
        }
        throw error;
      }
    }

    if (todayAttendance.clockOut) {
      throw new BadRequestException('You have already clocked out for today')
    }
    
    await this.attendanceRepository.update(todayAttendance.id, { clockOut: now });
  }
}

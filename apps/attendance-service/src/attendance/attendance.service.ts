import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { AttendanceRepository } from './attendance.repository';
import { AttendanceResponseDto, GetAllAttendanceRequestDto, GetAllAttendanceResponseDto } from './attendance.dto';
import { Attendance } from './attendance.entity';
import { UserRole } from '../user/user.constant';

@Injectable()
export class AttendanceService {
  constructor(
    private readonly attendanceRepository: AttendanceRepository,
  ) {}

  async create(userId: string): Promise<AttendanceResponseDto> {
    const now = new Date();

    const todayAttendance = await this.attendanceRepository.findByUserIdDate(userId, now);
    if (!todayAttendance) {
      try {
        const result = await this.attendanceRepository.create({
          userId,
          date: now,
          clockIn: now,
        });
        return this.toAttendanceResponseDto(result);
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
    
    const result = await this.attendanceRepository.update(todayAttendance.id, { clockOut: now });
    if (!result) {
      throw new NotFoundException('Attendance not found');
    }

    return this.toAttendanceResponseDto(result);
  }

  async findAll(
    currentUser: { userId: string; role: string },
    data: GetAllAttendanceRequestDto,
  ): Promise<GetAllAttendanceResponseDto> {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const startDate: string = data.startDate ?? this.formatDate(firstDayOfMonth);
    const endDate: string = data.endDate ?? this.formatDate(now);

    if (startDate > endDate) {
      throw new BadRequestException('startDate cannot be after endDate');
    }

    const targetUserId = currentUser.role === UserRole.USER ? currentUser.userId :
      (data.userId ? data.userId : currentUser.userId);

    const attendances = await this.attendanceRepository.findAllByUserIdDateRange(
      targetUserId,
      startDate,
      endDate,
    )
    return this.toGetAllAttendanceResponseDto(currentUser.role, targetUserId, attendances);
  }

  private toAttendanceResponseDto(attendance: Attendance): AttendanceResponseDto {
    const res: AttendanceResponseDto = {
      date: attendance.date,
      clockIn: attendance.clockIn
    }
    if (attendance.clockOut) {
      res.clockOut = attendance.clockOut
    }

    return res
  }

  private toGetAllAttendanceResponseDto(
    role: string,
    userId: string, 
    attendances: Attendance[],
  ): GetAllAttendanceResponseDto {
    let responseUserId;
    if (role === UserRole.ADMIN) {
      responseUserId = userId
    }

    const attendancesDto: AttendanceResponseDto[] = attendances.map(
    (attendance: Attendance): AttendanceResponseDto => ({
      date: attendance.date,
      clockIn: attendance.clockIn,
      clockOut: attendance.clockOut,
    }))

    return {
      userId: responseUserId,
      attendances: attendancesDto,
    };
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

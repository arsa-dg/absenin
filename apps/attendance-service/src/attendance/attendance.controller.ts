import { Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, RoleGuard } from '../auth/auth.guard';
import { AttendanceService } from './attendance.service';
import { CurrentUser, Roles } from '../auth/auth.decorator';
import { UserRole } from '../user/user.constant';

@Controller('attendance')
@UseGuards(JwtAuthGuard, RoleGuard)
export class AttendanceController {
  constructor(
    private readonly attendanceService: AttendanceService,
  ) {}

  @Post()
  async create(
    @CurrentUser('userId') userId: string
  ) {
    await this.attendanceService.create(userId);
    return { message:"success" }
  }
}

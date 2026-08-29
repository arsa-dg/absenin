import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth.guard';
import { AttendanceService } from './attendance.service';
import { CurrentUser } from '../auth/auth.decorator';
import { GetAllAttendanceRequestDto } from './attendance.dto';

@Controller('attendance')
@UseGuards(JwtAuthGuard)
export class AttendanceController {
  constructor(
    private readonly attendanceService: AttendanceService,
  ) {}

  @Post()
  create(
    @CurrentUser('userId') userId: string
  ) {
    return this.attendanceService.create(userId);
  }

  @Get()
  findAll(
    @CurrentUser() currentUser: { userId: string; role: string },
    @Query() query: GetAllAttendanceRequestDto,
  ) {
    return this.attendanceService.findAll(currentUser, query);
  }
}

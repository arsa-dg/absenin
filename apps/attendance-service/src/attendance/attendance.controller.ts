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
  async create(
    @CurrentUser('userId') userId: string
  ) {
    await this.attendanceService.create(userId);
    return { message:"success" }
  }

  @Get()
  findAll(
    @CurrentUser() currentUser: { userId: string; role: string },
    @Query() query: GetAllAttendanceRequestDto,
  ) {
    return this.attendanceService.findAll(currentUser, query);
  }
}

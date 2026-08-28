import { Module } from '@nestjs/common';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { AttendanceRepository } from './attendance.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from './attendance.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Attendance,
    ]),
  ],
  controllers: [AttendanceController],
  providers: [
    AttendanceService,
    AttendanceRepository,
  ]
})
export class AttendanceModule {}

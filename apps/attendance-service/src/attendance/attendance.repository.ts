import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Between } from 'typeorm';

import { Attendance } from './attendance.entity';

@Injectable()
export class AttendanceRepository {
  constructor(
    @InjectRepository(Attendance)
    private readonly repository: Repository<Attendance>,
  ) {}

  async create(Attendance: Partial<Attendance>): Promise<Attendance> {
    const entity = this.repository.create(Attendance);
    return this.repository.save(entity);
  }

  async findAllByUserIdDateRange(
    userId: string,
    startDate: string,
    endDate: string,
  ): Promise<Attendance[]> {
    const whereCondition: any = {
      date: Between(startDate, endDate),
      userId,
    };

    return this.repository.find({
      where: whereCondition,
      order: {
        date: 'DESC',
      },
    });
  }

  async findByUserIdDate(userId: string, date: Date): Promise<Attendance | null> {
    return this.repository.findOne({
      where: {
        userId,
        date
      },
    });
  }

  async update(
    id: string,
    data: Partial<Attendance>,
  ): Promise<Attendance | null> {
    const attendance = await this.repository.preload({
      id,
      ...data,
    });
    if (!attendance) {
      return null;
    }

    return this.repository.save(attendance);
  }
}
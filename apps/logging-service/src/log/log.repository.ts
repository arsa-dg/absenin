import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Log } from './log.entity';

@Injectable()
export class LogRepository {
  constructor(
    @InjectRepository(Log)
    private readonly repository: Repository<Log>,
  ) {}
  
  async create(log: Partial<Log>): Promise<Log> {
    const entity = this.repository.create(log);
    return this.repository.save(entity);
  }
}
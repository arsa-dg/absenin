import { Injectable } from '@nestjs/common';
import { LogRepository } from './log.repository';
import { Log } from './log.entity';
import { randomUUID } from 'crypto';

export interface LogPayload {
  service: string;
  action: string;
  userId: string;
  occurredAt: string;
  updatedFields: string[];
  changes: Record<string, any>;
}

@Injectable()
export class LogService {
  constructor(
    private readonly logRepository: LogRepository,
  ) {}

  async create(payload: LogPayload) {
    await this.logRepository.create(this.toLog(payload));
  }

  private toLog(data: LogPayload): Partial<Log> {
    return {
      service: data.service,
      action: data.action,
      userId: data.userId,
      occurredAt: new Date(data.occurredAt),
      updatedFields: data.updatedFields,
      changes: data.changes,
    }
  }
}
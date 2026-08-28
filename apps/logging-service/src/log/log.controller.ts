import { Controller } from '@nestjs/common';
import { EventPattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { LogService } from './log.service';
import type { LogPayload } from './log.service';

@Controller()
export class LogController {
  constructor(private readonly logService: LogService) {}

  @EventPattern('PROFILE_UPDATE')
  async handleProfileUpdated(
    @Payload() data: LogPayload,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      await this.logService.create(data);
      channel.ack(originalMsg);
    } catch (error) {
      console.error('Failed to persist log message:', error);
      channel.nack(originalMsg, false, false);
    }
  }
}
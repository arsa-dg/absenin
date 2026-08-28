import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672'],
        queue: 'log_queue',
        noAck: false,
        queueOptions: {
          durable: true,
        },
      },
    },
  );

  await app.listen();
  console.log('Logging service is listening on log_queue');
}
bootstrap();

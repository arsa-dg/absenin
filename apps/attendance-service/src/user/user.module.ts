import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { HasherModule } from '../common/hasher/hasher.module';
import { RabbitmqModule } from '../common/rabbitmq/rabbitmq.module';
import { MinioModule } from '../common/minio/minio.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    HasherModule,
    RabbitmqModule,
    MinioModule,
  ],
  controllers: [UserController],
  providers: [
    UserRepository,
    UserService,
  ],
  exports: [
    UserRepository,
    UserService,
  ],
})
export class UserModule {}

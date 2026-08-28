import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from './auth.entity';
import { AuthRepository } from './auth.repository';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { HasherService } from './hasher.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Auth,
    ]),
    UserModule,
    PassportModule,
    JwtModule.register({
      global: true,
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository,
    HasherService,
  ],
  exports: [
    HasherService
  ],
})
export class AuthModule {}

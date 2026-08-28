import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { AuthResponseDto, LoginDto } from './auth.dto';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { HasherService } from './hasher.service';
import { UserRepository } from '../user/user.repository';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly userRepository: UserRepository,
    private readonly hasherService: HasherService,
    private readonly jwtService: JwtService,
  ) {}

  async login(data: LoginDto): Promise<AuthResponseDto> {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email/password');
    }

    const validPassword = await this.hasherService.compare(data.password, user.password)
    if (!validPassword) {
      throw new UnauthorizedException('Invalid email/password')
    }

    const sid = randomUUID();
    const token = await this.createToken(user.id, sid, user.role);
    const hashedRefreshToken = await this.hasherService.hash(token.refreshToken);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate()+7);

    await this.authRepository.create({
      id: sid,
      userId: user.id,
      refreshToken: hashedRefreshToken,
      expiresAt: expiresAt
    })
   
    return token;
  }

  async refresh() {

  }

  async logout() {

  }

  private async createToken(
    userId: string,
    sid: string,
    role: string,
  ): Promise<AuthResponseDto> {
    const accessToken = await this.jwtService.signAsync({
      sub: userId,
      role: role,
      type: 'access'
    }, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: (process.env.JWT_ACCESS_EXPIRES_IN ??
        '15m') as JwtSignOptions['expiresIn'],
    })

    const refreshToken = await this.jwtService.signAsync({
      sub: userId,
      sid: sid,
      type: 'refresh'
    }, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN ??
        '7d') as JwtSignOptions['expiresIn'],
    })
    
    return {
      accessToken,
      refreshToken
    }
  }
}

import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResponseDto, LoginDto } from './auth.dto';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  async login(
    @Body()
    data: LoginDto,
    @Res({ passthrough: true })
    response: Response,
  ) {
    const token = await this.authService.login(data);
    this.setCookie(response, token);

    return { message:"success" }
  }

  @Post('refresh')
  refresh() {
  }

  @Post('logout')
  logout() {
  }

  private setCookie(
    response: Response,
    token: AuthResponseDto,
  ) {
    response.cookie(
      'access_token',
      token.accessToken,
      {
        ...this.commonCookieOptions(),
        maxAge: 15 * 60 * 1000,
      },
    );

    response.cookie(
      'refresh_token',
      token.refreshToken,
      {
        ...this.commonCookieOptions(),
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/auth',
      },
    );
  }

  private commonCookieOptions() {
    return {
      httpOnly: true,
      secure: true,
      sameSite: 'none' as const,
    };
  }
}

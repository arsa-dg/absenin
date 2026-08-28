import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResponseDto, LoginDto } from './auth.dto';
import type { Request, Response } from 'express';

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
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true })
    response: Response,
  ) {
    const refreshToken = request.cookies?.refresh_token;
    if (!refreshToken) {
      return response.status(401).json({ message: 'Refresh token missing' });
    }

    const newToken = await this.authService.refresh(refreshToken);
    this.setCookie(response, newToken);

    return { message:"success" }
  }

  @Post('logout')
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true })
    response: Response,
  ) {
    const refreshToken = request.cookies?.refresh_token;
    if (refreshToken) {
      await this.authService.logout(refreshToken);
    }

    this.clearCookie(response);

    return { message:"success" }
  }

  private setCookie(response: Response,token: AuthResponseDto) {
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

  private clearCookie(response: Response) {
    response.clearCookie('access_token');
    response.clearCookie('refresh_token', {path: '/auth'});
  }

  private commonCookieOptions() {
    return {
      httpOnly: true,
      secure: true,
      sameSite: 'none' as const,
    };
  }
}

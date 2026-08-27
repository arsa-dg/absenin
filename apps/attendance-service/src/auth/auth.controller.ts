import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  login(
    @Body()
    data: LoginDto,
  ) {

  }

  @Post('refresh')
  refresh() {
  }

  @Post('logout')
  logout() {
  }
}

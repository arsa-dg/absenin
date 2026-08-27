import { Injectable } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { AuthResponseDto, LoginDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
  ) {}

  async login(data: LoginDto) {
  }

  async refresh() {

  }

  async logout() {

  }
}

import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, UseGuards } from '@nestjs/common';

import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { JwtAuthGuard, RoleGuard } from '../auth/auth.guard';
import { CurrentUser, Roles } from '../auth/auth.decorator';
import { UserRole } from './user.constant';

@Controller('user')
@UseGuards(JwtAuthGuard, RoleGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Get('/me')
  async profile(
    @CurrentUser('userId') userId: string
  ) {
    return this.userService.findById(userId);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  create(
    @Body()
    data: CreateUserDto,
  ) {
    return this.userService.create(data);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  findById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.userService.findById(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body()
    data: UpdateUserDto,
  ) {
    return this.userService.update(id, data);
  }
}

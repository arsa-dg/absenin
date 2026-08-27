import { Body, Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';

import { UserService } from './user.service';
import { CreateUserDto } from './user.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Post()
  create(
    @Body()
    data: CreateUserDto,
  ) {
    return this.userService.create(data);
  }

  @Get(':id')
  findById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.userService.findById(id);
  }
}

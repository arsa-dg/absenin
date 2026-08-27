import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';

import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './user.dto';

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

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body()
    data: UpdateUserDto,
  ) {

  }
}

import { Body, Controller, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, ParseUUIDPipe, Patch, Post, Sse, UploadedFile, UseGuards, UseInterceptors, MessageEvent } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdatePasswordDto, UpdateProfileDto, UpdateUserDto } from './user.dto';
import { JwtAuthGuard, RoleGuard } from '../auth/auth.guard';
import { CurrentUser, Roles } from '../auth/auth.decorator';
import { UserRole } from './user.constant';
import { FileInterceptor } from '@nestjs/platform-express';
import { Observable } from 'rxjs';

@Controller('user')
@UseGuards(JwtAuthGuard, RoleGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Get()
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.userService.findAll();
  }

  @Sse('stream')
  @Roles(UserRole.ADMIN)
  stream(): Observable<MessageEvent> {
    return this.userService.getStream();
  }
  
  @Get('me')
  profile(
    @CurrentUser('userId') userId: string
  ) {
    return this.userService.findById(userId);
  }

  @Patch('me')
  updateProfile(
    @CurrentUser('userId') userId: string,
    @Body()
    data: UpdateProfileDto,
  ) {
    return this.userService.update(userId, this.toUpdatedUserDto(data));
  }

  @Patch('me/password')
  updatePassword(
    @CurrentUser('userId') userId: string,
    @Body()
    data: UpdatePasswordDto,
  ) {
    return this.userService.updatePassword(userId, data);
  }

  @Patch('me/photo')
  @UseInterceptors(FileInterceptor('file'))
  uploadPhoto(
    @CurrentUser('userId') userId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.userService.updatePhoto(userId, file);
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

  private toUpdatedUserDto(user: UpdateProfileDto): UpdateUserDto {
    return {
      phone: user.phone,
    }
  }
}

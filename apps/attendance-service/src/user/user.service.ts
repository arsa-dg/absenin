import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './user.dto';
import { User } from './user.entity';
import { HasherService } from '../hasher/hasher.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hasherService: HasherService,
  ) {}

  async create(data: CreateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await this.hasherService.hash(data.password);

    const user = await this.userRepository.create({
      ...data,
      password: hashedPassword,
    });
    if (!user) {
      throw new InternalServerErrorException('Failed to create user');
    }

    return this.toUserResponse(user);
  }

  async findById(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.toUserResponse(user)
  }

  async update(id: string, data: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.userRepository.update(id, data);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.toUserResponse(user)
  }

  private toUserResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      position: user.position,
      photoURL: user.photoKey, // todo: transform to url
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }
}

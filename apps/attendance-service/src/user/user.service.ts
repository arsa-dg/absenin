import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRepository } from './user.repository';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
  ) {}

  async create(data: CreateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

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
    return this.toUserResponse({
      id: '00000000-0000-0000-0000-000000000000',
      email: 'some@mail.com',
      password: 'somepassword',
      name: 'somename',
      phone: '6281234567890',
      position: 'someposition',
      photoKey: 'somephotokey',
      role: 'user',
      createdAt: new Date('2026-08-25T10:00:00Z'),
      updatedAt: new Date('2026-08-25T10:00:00Z'),
    });
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

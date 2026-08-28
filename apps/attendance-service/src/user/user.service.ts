import { ConflictException, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './user.dto';
import { User } from './user.entity';
import { HasherService } from '../hasher/hasher.service';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hasherService: HasherService,
    @Inject('LOG_SERVICE') private readonly logClient: ClientProxy,
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

    const { changes, updatedFields } = this.toChangesAndUpdatedFields(data);
    this.logClient.emit('PROFILE_UPDATE', {
      service: 'attendance-service',
      action: 'PROFILE_UPDATE',
      userId: id,
      timestamp: new Date().toISOString(),
      updatedFields,
      changes,
    })

    return this.toUserResponse(user)
  }

  private toChangesAndUpdatedFields(data: Record<string, any> | null | undefined): { 
    changes: Record<string, any>; 
    updatedFields: string[]; 
  } {
    if (!data || typeof data !== 'object') {
      return { changes: {}, updatedFields: [] };
    }

    const changes = Object.entries(data).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, any>);

    return {
      changes,
      updatedFields: Object.keys(changes),
    }
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

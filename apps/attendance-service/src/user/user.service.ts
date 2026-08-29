import { BadRequestException, ConflictException, Inject, Injectable, InternalServerErrorException, NotFoundException, MessageEvent } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto, FindAllUserResponseDto, UpdatePasswordDto, UpdateUserDto, UserResponseDto } from './user.dto';
import { User } from './user.entity';
import { HasherService } from '../common/hasher/hasher.service';
import { ClientProxy } from '@nestjs/microservices';
import { MinioService } from '../common/minio/minio.service';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class UserService {
  private readonly sseClient = new Subject<MessageEvent>();
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hasherService: HasherService,
    @Inject('LOG_SERVICE') private readonly logClient: ClientProxy,
    private readonly minioService: MinioService,
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

  async findAll(): Promise<FindAllUserResponseDto> {
    const users = await this.userRepository.findAll();
    return this.toFindAllUserResponseDto(users)
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

    this.emitLogAndNotification(id, data);
    return this.toUserResponse(user);
  }

  async updatePassword(id: string, data: UpdatePasswordDto): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const validPassword = await this.hasherService.compare(data.oldPassword, user.password)
    if (!validPassword) {
      throw new BadRequestException('Invalid old password')
    }

    const newPassword = await this.hasherService.hash(data.newPassword);
    const updateData: Partial<User> = {
      password: newPassword,
    }

    const updatedUser = await this.userRepository.update(id, updateData);
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    this.emitLogAndNotification(id, updateData);
    return this.toUserResponse(updatedUser);
  }

  async updatePhoto(id: string, data: Express.Multer.File): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const fileName = await this.minioService.uploadPhoto(data);
    const publicUrl = this.minioService.getPublicUrl(fileName);
    const updateData: Partial<User> = {
      photoKey: publicUrl,
    }
    
    const updatedUser = await this.userRepository.update(id, updateData);
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    this.emitLogAndNotification(id, updateData);
    return this.toUserResponse(updatedUser);
  }

  getStream(): Observable<MessageEvent> {
    return this.sseClient.asObservable();
  }

  private emitLogAndNotification(userId: string, data: Record<string, any> | null | undefined) {
    const { changes, updatedFields } = this.toChangesAndUpdatedFields(data);
    const d = {
      service: 'attendance-service',
      action: 'PROFILE_UPDATE',
      userId: userId,
      occurredAt: new Date().toISOString(),
      updatedFields: updatedFields,
      changes: changes,
    }
    this.logClient.emit('PROFILE_UPDATE', d);
    this.sseClient.next({data: d, type: 'profile_update_event'});
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
        acc[key] = key === 'password' ? '**MASKED**' : value;
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
      photoURL: user.photoKey,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }

  private toFindAllUserResponseDto(users: User[]): FindAllUserResponseDto {
    const res: UserResponseDto[] = users.map((user: User): UserResponseDto => this.toUserResponse(user))
    return {
      users: res,
    }
  }
}

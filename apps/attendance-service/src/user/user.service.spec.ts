import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './user.dto';
import { UserRole } from './user.constant';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed_somepassword'),
}));

describe('UserService', () => {
  let service: UserService;

  const mockRepository = {
    create: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(),
    update: jest.fn(),
  };

  const mockRepositoryUserResult: User = {
    id: '00000000-0000-0000-0000-000000000000',
    email: 'some@mail.com',
    password: 'somepassword',
    name: 'somename',
    phone: '6281234567890',
    position: 'someposition',
    photoKey: 'somephotokey',
    role: UserRole.USER,
    createdAt: new Date('2026-08-25T10:00:00Z'),
    updatedAt: new Date('2026-08-25T10:00:00Z'),
  }
  const mockServiceUserResponse: UserResponseDto = {
    id: '00000000-0000-0000-0000-000000000000',
    email: 'some@mail.com',
    name: 'somename',
    phone: '6281234567890',
    position: 'someposition',
    photoURL: 'somephotokey',
    createdAt: new Date('2026-08-25T10:00:00Z'),
    updatedAt: new Date('2026-08-25T10:00:00Z'),
  }
  const updateUserDto: UpdateUserDto = {
    name: 'updatedname',
    phone: '6281234567891',
    position: 'updatedposition',
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createUserDto: CreateUserDto = {
      email: 'some@mail.com',
      password: 'somepassword',
      name: 'somename',
      phone: '6281234567890',
      position: 'someposition',
    };

    it('should throw ConflictException when email already exists', async () => {
      mockRepository.findByEmail.mockResolvedValue(mockRepositoryUserResult);

      await expect(service.create(createUserDto)).rejects.toThrow(ConflictException);

      expect(mockRepository.findByEmail).toHaveBeenCalledWith(createUserDto.email);
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException when user creation fails', async () => {
      mockRepository.findByEmail.mockResolvedValue(null);
      mockRepository.create.mockResolvedValue(null);

      await expect(service.create(createUserDto)).rejects.toThrow(InternalServerErrorException);

      expect(mockRepository.findByEmail).toHaveBeenCalledWith(createUserDto.email);
      expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10);
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: 'hashed_somepassword',
      });
    });

    it('should hash password and create a user successfully', async () => {
      mockRepository.findByEmail.mockResolvedValue(null);
      mockRepository.create.mockResolvedValue(mockRepositoryUserResult);

      const result = await service.create(createUserDto);
      expect(result).toEqual(mockServiceUserResponse);

      expect(mockRepository.findByEmail).toHaveBeenCalledWith(createUserDto.email);
      expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10);
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: 'hashed_somepassword',
      });
    });
  })

  describe('findById', () => {
    it('should throw NotFoundException when user does not exist', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(
        service.findById('10000000-0000-0000-0000-000000000001')
      ).rejects.toThrow(NotFoundException);

      expect(mockRepository.findById).toHaveBeenCalledWith('10000000-0000-0000-0000-000000000001');
    });
    
    it('should return user when user exists', async () => {
      mockRepository.findById.mockResolvedValue(mockRepositoryUserResult);

      const result = await service.findById('00000000-0000-0000-0000-000000000000');
      expect(result).toEqual(mockServiceUserResponse);

      expect(mockRepository.findById).toHaveBeenCalledWith('00000000-0000-0000-0000-000000000000');
    });
  });

  describe('update', () => {
    it('should throw NotFoundException when user does not exist', async () => {
      mockRepository.update.mockResolvedValue(null);

      await expect(
        service.update('00000000-0000-0000-0000-000000000000', updateUserDto)
      ).rejects.toThrow(NotFoundException);

      expect(mockRepository.update).toHaveBeenCalledWith('00000000-0000-0000-0000-000000000000', updateUserDto);
    });
    
    it('should return user when user exists', async () => {
      mockRepository.update.mockResolvedValue(mockRepositoryUserResult);

      const result = await service.update('00000000-0000-0000-0000-000000000000', updateUserDto);
      expect(result).toEqual(mockServiceUserResponse);

      expect(mockRepository.update).toHaveBeenCalledWith('00000000-0000-0000-0000-000000000000', updateUserDto);
    });
  });
});

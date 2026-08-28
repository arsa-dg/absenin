import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { UserRepository } from '../user/user.repository';
import { HasherService } from './hasher.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.entity';
import { UserRole } from '../user/user.constant';
import { AuthResponseDto, LoginDto } from './auth.dto';
import { InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { Auth } from './auth.entity';

describe('AuthService', () => {
  let service: AuthService;

  const mockAuthRepository = {
    create: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
  };
  const mockUserRepository = {
    findByEmail: jest.fn(),
    findById: jest.fn(),
  };
  const mockHasherService = {
    hash: jest.fn(),
    compare: jest.fn(),
  }
  const mockJWTService = {
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
  }

  const mockLoginDto: LoginDto = {
    email: 'some@mail.com',
    password: 'somepassword',
  }
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
  const mockRepositoryAuthResult: Auth = {
    id: '00000000-0000-0000-0000-000000000000',
    userId: '00000000-0000-0000-0000-000000000000',
    refreshToken: 'hashed_refreshtoken',
    user: mockRepositoryUserResult,
    expiresAt: new Date('2026-08-25T10:00:00Z'),
    revokedAt: new Date('2026-08-25T10:00:00Z'),
    createdAt: new Date('2026-08-25T10:00:00Z'),
    updatedAt: new Date('2026-08-25T10:00:00Z'),
  }
  const mockServiceAuthResponse: AuthResponseDto = {
    accessToken: 'accessToken',
    refreshToken: 'refreshToken',
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: AuthRepository,
          useValue: mockAuthRepository,
        },
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
        {
          provide: HasherService,
          useValue: mockHasherService,
        },
        {
          provide: JwtService,
          useValue: mockJWTService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should throw UnauthorizedException when email not found', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(service.login(mockLoginDto)).rejects.toThrow(UnauthorizedException);  

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(mockLoginDto.email);
      expect(mockHasherService.compare).not.toHaveBeenCalled();
      expect(mockJWTService.signAsync).not.toHaveBeenCalledTimes(2);
      expect(mockHasherService.hash).not.toHaveBeenCalled();
      expect(mockAuthRepository.create).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when password not match', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(mockRepositoryUserResult);
      mockHasherService.compare.mockResolvedValue(false);

      await expect(service.login(mockLoginDto)).rejects.toThrow(UnauthorizedException);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(mockLoginDto.email);
      expect(mockHasherService.compare).toHaveBeenCalledWith(mockLoginDto.password, mockRepositoryUserResult.password);
      expect(mockJWTService.signAsync).not.toHaveBeenCalledTimes(2);
      expect(mockHasherService.hash).not.toHaveBeenCalled();
      expect(mockAuthRepository.create).not.toHaveBeenCalled();
    });

    it('should create access and refresh token and store session', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(mockRepositoryUserResult);
      mockHasherService.compare.mockResolvedValue(true);
      mockJWTService.signAsync.mockResolvedValueOnce('accessToken').mockResolvedValueOnce('refreshToken');
      mockHasherService.hash.mockResolvedValue('hashed_refreshtoken');
      mockAuthRepository.create.mockResolvedValue(mockRepositoryAuthResult);

      const result = await service.login(mockLoginDto);
      expect(result).toEqual(mockServiceAuthResponse);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(mockLoginDto.email);
      expect(mockHasherService.compare).toHaveBeenCalledWith(mockLoginDto.password, mockRepositoryUserResult.password);
      expect(mockJWTService.signAsync).toHaveBeenCalledTimes(2);
      expect(mockHasherService.hash).toHaveBeenCalled();
      expect(mockAuthRepository.create).toHaveBeenCalled();
    });
  })

  describe('refresh', () => {
    it('should throw UnauthorizedException when invalid refresh token', async () => {
      mockJWTService.verifyAsync.mockRejectedValueOnce(new Error('Invalid token'));

      await expect(service.refresh('refreshToken')).rejects.toThrow(UnauthorizedException);

      expect(mockJWTService.verifyAsync).toHaveBeenCalled();
      expect(mockAuthRepository.findById).not.toHaveBeenCalled();
      expect(mockHasherService.compare).not.toHaveBeenCalled();
      expect(mockUserRepository.findById).not.toHaveBeenCalled();
      expect(mockJWTService.signAsync).not.toHaveBeenCalledTimes(2);
      expect(mockHasherService.hash).not.toHaveBeenCalled();
      expect(mockAuthRepository.update).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when session not found', async () => {
      mockJWTService.verifyAsync.mockResolvedValueOnce({ sid: '00000000-0000-0000-0000-000000000000' });
      mockAuthRepository.findById.mockResolvedValueOnce(null);

      await expect(service.refresh('refreshToken')).rejects.toThrow(UnauthorizedException);

      expect(mockJWTService.verifyAsync).toHaveBeenCalled();
      expect(mockAuthRepository.findById).toHaveBeenCalled();
      expect(mockHasherService.compare).not.toHaveBeenCalled();
      expect(mockUserRepository.findById).not.toHaveBeenCalled();
      expect(mockJWTService.signAsync).not.toHaveBeenCalledTimes(2);
      expect(mockHasherService.hash).not.toHaveBeenCalled();
      expect(mockAuthRepository.update).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when session expired', async () => {
      mockJWTService.verifyAsync.mockResolvedValueOnce({ sid: '00000000-0000-0000-0000-000000000000' });
      mockAuthRepository.findById.mockResolvedValueOnce(mockRepositoryAuthResult);

      await expect(service.refresh('refreshToken')).rejects.toThrow(UnauthorizedException);

      expect(mockJWTService.verifyAsync).toHaveBeenCalled();
      expect(mockAuthRepository.findById).toHaveBeenCalled();
      expect(mockHasherService.compare).not.toHaveBeenCalled();
      expect(mockUserRepository.findById).not.toHaveBeenCalled();
      expect(mockJWTService.signAsync).not.toHaveBeenCalledTimes(2);
      expect(mockHasherService.hash).not.toHaveBeenCalled();
      expect(mockAuthRepository.update).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when invalid refresh token', async () => {
      mockJWTService.verifyAsync.mockResolvedValueOnce({ sid: '00000000-0000-0000-0000-000000000000' });
      mockAuthRepository.findById.mockResolvedValueOnce({
        ...mockRepositoryAuthResult,
        expiresAt: new Date(),
      });
      mockHasherService.compare.mockResolvedValueOnce(false);

      await expect(service.refresh('refreshToken')).rejects.toThrow(UnauthorizedException);

      expect(mockJWTService.verifyAsync).toHaveBeenCalled();
      expect(mockAuthRepository.findById).toHaveBeenCalled();
      expect(mockHasherService.compare).toHaveBeenCalled();
      expect(mockUserRepository.findById).not.toHaveBeenCalled();
      expect(mockJWTService.signAsync).not.toHaveBeenCalledTimes(2);
      expect(mockHasherService.hash).not.toHaveBeenCalled();
      expect(mockAuthRepository.update).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when invalid user', async () => {
      mockJWTService.verifyAsync.mockResolvedValueOnce({ sid: '00000000-0000-0000-0000-000000000000' });
      mockAuthRepository.findById.mockResolvedValueOnce({
        ...mockRepositoryAuthResult,
        expiresAt: new Date(),
      });
      mockHasherService.compare.mockResolvedValueOnce(true);
      mockUserRepository.findById.mockResolvedValueOnce(null);

      await expect(service.refresh('refreshToken')).rejects.toThrow(UnauthorizedException);

      expect(mockJWTService.verifyAsync).toHaveBeenCalled();
      expect(mockAuthRepository.findById).toHaveBeenCalled();
      expect(mockHasherService.compare).toHaveBeenCalled();
      expect(mockUserRepository.findById).toHaveBeenCalled();
      expect(mockJWTService.signAsync).not.toHaveBeenCalledTimes(2);
      expect(mockHasherService.hash).not.toHaveBeenCalled();
      expect(mockAuthRepository.update).not.toHaveBeenCalled();
    });

    it('should create new access and refresh token and store session', async () => {
      mockJWTService.verifyAsync.mockResolvedValueOnce({ sid: '00000000-0000-0000-0000-000000000000' });
      mockAuthRepository.findById.mockResolvedValueOnce({
        ...mockRepositoryAuthResult,
        expiresAt: new Date(),
      });
      mockHasherService.compare.mockResolvedValueOnce(true);
      mockUserRepository.findById.mockResolvedValueOnce(mockRepositoryUserResult);
      mockJWTService.signAsync.mockResolvedValueOnce('accessToken').mockResolvedValueOnce('refreshToken');
      mockHasherService.hash.mockResolvedValue('hashed_refreshtoken');
      mockAuthRepository.update.mockResolvedValue(mockRepositoryAuthResult);

      const result = await service.refresh('refreshToken');
      expect(result).toEqual(mockServiceAuthResponse);

      expect(mockJWTService.verifyAsync).toHaveBeenCalled();
      expect(mockAuthRepository.findById).toHaveBeenCalled();
      expect(mockHasherService.compare).toHaveBeenCalled();
      expect(mockUserRepository.findById).toHaveBeenCalled();
      expect(mockJWTService.signAsync).toHaveBeenCalledTimes(2);
      expect(mockHasherService.hash).toHaveBeenCalled();
      expect(mockAuthRepository.update).toHaveBeenCalled();
    });
  })

  describe('logout', () => {
    it('should early return', async () => {
      mockJWTService.verifyAsync.mockRejectedValueOnce(new Error('Invalid token'));

      await service.logout('refreshToken');

      expect(mockJWTService.verifyAsync).toHaveBeenCalled();
    });
    
    it('should revoke session', async () => {
      mockJWTService.verifyAsync.mockResolvedValueOnce({ sid: '00000000-0000-0000-0000-000000000000' });
      mockAuthRepository.update.mockResolvedValue(mockRepositoryAuthResult);

      await service.logout('refreshToken');

      expect(mockJWTService.verifyAsync).toHaveBeenCalled();
      expect(mockAuthRepository.update).toHaveBeenCalled();
    });
  })
});

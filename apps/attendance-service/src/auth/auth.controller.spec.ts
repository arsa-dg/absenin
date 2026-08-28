import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthResponseDto, LoginDto } from './auth.dto';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;

  const mockService = {
    login: jest.fn(),
    refresh: jest.fn(),
    logout: jest.fn(),
  }
  const mockRequest = {
    cookies: { refresh_token: 'refreshToken' },
  };
  const mockResponse = {
    cookie: jest.fn(),
    clearCookie: jest.fn(),
  };

  const mockAuthResponse: AuthResponseDto = {
    accessToken: 'accessToken',
    refreshToken: 'refreshToken',
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockService,
        },
      ]
    }).compile();

    controller = module.get<AuthController>(AuthController);
    jest.clearAllMocks();
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'budi@company.com',
      password: 'password',
    }

    it('should set auth cookies', async () => {
      mockService.login.mockResolvedValue(mockAuthResponse);

      await controller.login(loginDto, mockResponse as any);

      expect(mockService.login).toHaveBeenCalledWith(loginDto);
      expect(mockResponse.cookie).toHaveBeenCalledTimes(2);
    });
  });

  describe('refresh', () => {
    it('should throw UnauthorizedException when refresh token is missing', async () => {
      await expect(
        controller.refresh({cookies: {}} as any, mockResponse as any)
      ).rejects.toThrow(UnauthorizedException);

      expect(mockService.refresh).not.toHaveBeenCalled();
      expect(mockResponse.cookie).not.toHaveBeenCalled();
    });
    
    it('should set auth cookies', async () => {
      mockService.refresh.mockResolvedValue(mockAuthResponse);

      await controller.refresh(mockRequest as any, mockResponse as any);

      expect(mockService.refresh).toHaveBeenCalledWith('refreshToken');
      expect(mockResponse.cookie).toHaveBeenCalledTimes(2);
    });
  });

  describe('logout', () => {
    it('should clear cookies', async () => {
      mockService.logout.mockResolvedValue(mockAuthResponse);

      await controller.logout(mockRequest as any, mockResponse as any);

      expect(mockService.logout).toHaveBeenCalledWith('refreshToken');
      expect(mockResponse.clearCookie).toHaveBeenCalledTimes(2);
    });
  });
});

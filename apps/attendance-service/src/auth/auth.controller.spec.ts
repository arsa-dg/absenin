import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthResponseDto, LoginDto } from './auth.dto';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  const mockService = {
    login: jest.fn(),
  }
  const mockResponse = {
    cookie: jest.fn(),
  };

  const mockAuthResponse: AuthResponseDto = {
    accessToken: 'accesstoken',
    refreshToken: 'refrestoken',
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
      expect(
        mockResponse.cookie,
      ).toHaveBeenCalledTimes(2);
    });
  });
});

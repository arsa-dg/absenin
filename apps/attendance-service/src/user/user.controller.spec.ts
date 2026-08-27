import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto, UserResponseDto } from './user.dto';

describe('UserController', () => {
  let controller: UserController;

  const mockService = {
    create: jest.fn(),
    findById: jest.fn(),
  };

  const mockUserResponse: UserResponseDto = {
    id: '00000000-0000-0000-0000-000000000000',
    email: 'some@mail.com',
    name: 'somename',
    phone: '6281234567890',
    position: 'someposition',
    photoURL: 'somephotokey',
    createdAt: new Date('2026-08-25T10:00:00Z'),
    updatedAt: new Date('2026-08-25T10:00:00Z'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockService,
        },
      ]
    }).compile();

    controller = module.get<UserController>(UserController);
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

    it('should call userService.create and return the created user', async () => {
      mockService.create.mockResolvedValue(mockUserResponse);

      const result = await controller.create(createUserDto);
      expect(result).toEqual(mockUserResponse);

      expect(mockService.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findById', () => {
    const userId = '00000000-0000-0000-0000-000000000000';

    it('should call userService.findById and return the user', async () => {
      mockService.findById.mockResolvedValue(mockUserResponse);

      const result = await controller.findById(userId);
      expect(result).toEqual(mockUserResponse);

      expect(mockService.findById).toHaveBeenCalledWith(userId);
    });
  });
});

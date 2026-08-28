import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';

describe('AttendanceController', () => {
  let controller: AttendanceController;

  const mockService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttendanceController],
      providers: [
        {
          provide: AttendanceService,
          useValue: mockService,
        },
      ]
    }).compile();

    controller = module.get<AttendanceController>(AttendanceController);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should call attendanceService.create with the user ID and return success', async () => {
      mockService.create.mockResolvedValue(undefined);

      await controller.create('00000000-0000-0000-0000-000000000000');

      expect(mockService.create).toHaveBeenCalled();
    });
  });
});

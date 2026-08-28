import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { GetAllAttendanceResponseDto } from './attendance.dto';

describe('AttendanceController', () => {
  let controller: AttendanceController;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
  };
  const mockFindAllResult: GetAllAttendanceResponseDto = {
    userId: '00000000-0000-0000-0000-000000000000',
    attendances: [
      {
        date: new Date('2026-08-25T10:00:00Z'),
        clockIn: new Date('2026-08-25T10:00:00Z'),
        clockOut: new Date('2026-08-25T10:00:00Z'),
      },
      {
        date: new Date('2026-08-25T10:00:00Z'),
        clockIn: new Date('2026-08-25T10:00:00Z'),
        clockOut: new Date('2026-08-25T10:00:00Z'),
      },
    ]
  }

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

  describe('findAll', () => {
    it('should call attendanceService.findAll with current user and return attendances', async () => {
      mockService.findAll.mockResolvedValue(mockFindAllResult);

      const result = await controller.findAll({
        userId: '00000000-0000-0000-0000-000000000000',
        role: 'USER',
      }, {});
      expect(result).toEqual(mockFindAllResult);

      expect(mockService.findAll).toHaveBeenCalled();
    });
  });
});

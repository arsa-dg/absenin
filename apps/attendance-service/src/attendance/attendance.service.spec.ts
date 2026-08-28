import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceService } from './attendance.service';
import { AttendanceRepository } from './attendance.repository';
import { Attendance } from './attendance.entity';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { User } from '../user/user.entity';
import { UserRole } from '../user/user.constant';
import { GetAllAttendanceResponseDto } from './attendance.dto';

describe('AttendanceService', () => {
  let service: AttendanceService;

  const mockRepository = {
    create: jest.fn(),
    findAllByUserIdDateRange: jest.fn(),
    findByUserIdDate: jest.fn(),
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
  const mockRepositoryResult: Attendance = {
    id: '00000000-0000-0000-0000-000000000000',
    userId: '00000000-0000-0000-0000-000000000000',
    user: mockRepositoryUserResult,
    date: new Date('2026-08-25T10:00:00Z'), 
    clockIn: new Date('2026-08-25T10:00:00Z'),
    createdAt: new Date('2026-08-25T10:00:00Z'),
    updatedAt: new Date('2026-08-25T10:00:00Z'),
  }
  const mockFindAllResult: GetAllAttendanceResponseDto = {
    userId: '00000000-0000-0000-0000-000000000000',
    attendances: [
      {
        date: new Date('2026-08-25T10:00:00Z'),
        clockIn: new Date('2026-08-25T10:00:00Z'),
      },
    ]
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttendanceService,
        {
          provide: AttendanceRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<AttendanceService>(AttendanceService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should throw ConflictException when attendance already created', async () => {
      mockRepository.findByUserIdDate.mockResolvedValue(null);
      const uniqueConstraintError = { code: '23505' };
      mockRepository.create.mockRejectedValue(uniqueConstraintError);

      await expect(service.create('00000000-0000-0000-0000-000000000000')).rejects.toThrow(ConflictException);
      
      expect(mockRepository.findByUserIdDate).toHaveBeenCalled();
      expect(mockRepository.create).toHaveBeenCalled();
    });

    it('should create attendance successfully', async () => {
      mockRepository.findByUserIdDate.mockResolvedValue(null);
      mockRepository.create.mockResolvedValue(mockRepositoryResult);

      await service.create('00000000-0000-0000-0000-000000000000');
      
      expect(mockRepository.findByUserIdDate).toHaveBeenCalled();
      expect(mockRepository.create).toHaveBeenCalled();
    });
    
    it('should throw ConflictException when attendance already created', async () => {
      mockRepository.findByUserIdDate.mockResolvedValue({
        ...mockRepositoryResult,
        clockOut: new Date('2026-08-25T10:00:00Z'),
      });

      await expect(service.create('00000000-0000-0000-0000-000000000000')).rejects.toThrow(BadRequestException);
      
      expect(mockRepository.findByUserIdDate).toHaveBeenCalled();
    });

    it('should update attendance clock out successfully', async () => {
      mockRepository.findByUserIdDate.mockResolvedValue(mockRepositoryResult);
      mockRepository.update.mockResolvedValue(mockRepositoryResult);

      await service.create('00000000-0000-0000-0000-000000000000');

      expect(mockRepository.findByUserIdDate).toHaveBeenCalled();
      expect(mockRepository.update).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should throw BadRequestException when date invalid', async () => {
      await expect(service.findAll({
        userId: '00000000-0000-0000-0000-000000000000',
        role: 'USER',
      }, {
        startDate: '2026-08-31',
        endDate: '2026-08-28',
      })).rejects.toThrow(BadRequestException);
      
      expect(mockRepository.findAllByUserIdDateRange).not.toHaveBeenCalled();
    });
    
    it('should findAll successfully', async () => {
      mockRepository.findAllByUserIdDateRange.mockResolvedValue([
        mockRepositoryResult,
      ]);

      const result = await service.findAll({
        userId: '00000000-0000-0000-0000-000000000000',
        role: 'ADMIN',
      }, {});
      expect(result).toEqual(mockFindAllResult);
      
      expect(mockRepository.findAllByUserIdDateRange).toHaveBeenCalled();
    });
  })
});

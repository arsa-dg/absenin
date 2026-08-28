import { IsDateString, IsOptional, IsUUID } from "class-validator";

export class GetAllAttendanceRequestDto {
  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}

export class AttendanceResponseDto {
  date!: Date;
  clockIn!: Date;
  clockOut?: Date | null;
}

export class GetAllAttendanceResponseDto {
  userId?: string | null;
  attendances!: AttendanceResponseDto[];
}

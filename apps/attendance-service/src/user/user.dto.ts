import { IsEmail, IsOptional, IsPhoneNumber, IsString, MaxLength } from "class-validator";

export class CreateUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;

  @IsString()
  @MaxLength(30)
  name!: string;

  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  position?: string;
}

export class UserResponseDto {
  id!: string;
  email!: string;
  name!: string;
  phone?: string | null;
  position?: string | null;
  photoURL?: string | null;
  createdAt!: Date;
  updatedAt!: Date;
}

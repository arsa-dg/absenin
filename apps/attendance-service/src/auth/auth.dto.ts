import { IsEmail, IsString } from "class-validator";

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;
}

export class AuthResponseDto {
  access_token!: string;
  refresh_token!: string;
}

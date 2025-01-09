import { IsEmail, IsString, MinLength } from "class-validator";

// For sign in and sign up
export class AuthWithPasswordDto {
  @IsEmail()
  email: string;
  @IsString()
  @MinLength(8)
  password: string;
}
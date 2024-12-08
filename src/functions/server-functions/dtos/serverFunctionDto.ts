import { IsNotEmpty, IsString } from 'class-validator';

export class ServerFunctionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  code: string;
}

import { IsNotEmpty, IsString } from 'class-validator';

export class CreateServerFunctionDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  
  @IsString()
  @IsNotEmpty()
  code: string;
}

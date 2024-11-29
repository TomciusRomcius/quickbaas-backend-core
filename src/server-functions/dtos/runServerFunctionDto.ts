import { IsNotEmpty, IsString } from 'class-validator';

export class RunServerFunctionDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

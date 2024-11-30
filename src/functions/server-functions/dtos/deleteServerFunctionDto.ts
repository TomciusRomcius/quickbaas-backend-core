import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteServerFunctionDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

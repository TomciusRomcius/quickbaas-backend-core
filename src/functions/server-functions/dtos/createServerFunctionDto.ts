import { IsNotEmpty } from 'class-validator';
import { ServerFunctionDto } from './serverFunctionDto';

export class CreateServerFunctionDto {
  @IsNotEmpty()
  functions: ServerFunctionDto[];
}

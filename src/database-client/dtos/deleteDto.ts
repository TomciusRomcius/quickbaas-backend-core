import { IsOptional } from 'class-validator';

export class DeleteDto {
  @IsOptional()
  path: string;
}

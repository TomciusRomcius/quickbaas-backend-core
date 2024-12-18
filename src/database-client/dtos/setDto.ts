import { IsOptional, IsString } from 'class-validator';

export class SetDto {
  @IsString()
  path: string;
  @IsOptional()
  value: unknown;
}

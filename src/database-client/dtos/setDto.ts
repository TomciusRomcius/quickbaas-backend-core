import { IsOptional, IsString } from 'class-validator';

export class SetDto {
  @IsOptional()
  path: string;
  @IsOptional()
  value: unknown;
}

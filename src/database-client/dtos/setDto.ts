import { IsNotEmpty, IsString } from "class-validator";

export class SetDto {
  @IsString()
  path: string;
  @IsNotEmpty()
  value: unknown;
}
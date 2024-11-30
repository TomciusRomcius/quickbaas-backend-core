import { IsNotEmpty, IsString } from "class-validator";

export class UpdateMiddlewareDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  newName?: string;

  newCode?: string;
}
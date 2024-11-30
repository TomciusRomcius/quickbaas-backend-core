import { IsNotEmpty, IsString } from "class-validator";

export class DeleteMiddlewareDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
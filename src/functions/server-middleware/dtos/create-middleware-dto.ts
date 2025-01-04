import { IsDefined, IsNotEmpty, IsString } from "class-validator";

export class CreateMiddlewareDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsDefined()
  runsOn: {
    database: boolean,
    auth: boolean,
  };
}
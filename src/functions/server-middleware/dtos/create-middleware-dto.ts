import { Type } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';

export class Middleware {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsDefined()
  runsOn: {
    database: boolean;
    auth: boolean;
  };
}

export class CreateMiddlewareDto {
  @IsArray()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Middleware)
  middlewares: Middleware[];
}

import { IsIn, IsObject } from 'class-validator';

export class SetDatabaseRulesDto {
  @IsObject()
  rules?: any;
}

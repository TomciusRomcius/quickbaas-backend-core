import { IsObject, IsString } from 'class-validator';

export class CreateCollectionDto {
  @IsString()
  collectionName: string;
  @IsObject()
  datatypes: {};
}

import { Injectable } from '@nestjs/common';
import { CreateCollectionDto } from './dtos/createCollectionDto';
import mongoose, { Model, Schema } from 'mongoose';
import { GetAllDocumentsDto } from './dtos/getAllDocumentsDto';
import { InsertDocumentDto } from './dtos/insertDocumentDto';
import { parseSchema } from './utils';

@Injectable()
export class CollectionsService {
  models = new Map<string, Model<any>>();
  onModuleInit() {
    const modelNames = mongoose.modelNames();
    modelNames.forEach((modelName) => {
      this.models.set(modelName, mongoose.model(modelName));
    });
  }

  async createCollection(createCollectionDto: CreateCollectionDto) {
    const schemaStructure = parseSchema(createCollectionDto.datatypes);
    console.log(schemaStructure);
    const schema = new Schema(schemaStructure);

    if (!this.models.get(createCollectionDto.collectionName)) {
      const model = mongoose.model(createCollectionDto.collectionName, schema);
      this.models.set(createCollectionDto.collectionName, model);
    } else {
      throw new Error('Collection already exists!');
    }
  }

  async getAllDocuments(getAllDto: GetAllDocumentsDto) {
    const model = this.models.get(getAllDto.collectionName);
    if (!model) {
      throw new Error('Collection not found!');
    } else {
      return await model.find();
    }
  }

  async insertDocument(insertDocumentDto: InsertDocumentDto) {
    const model = this.models.get(insertDocumentDto.collectionName);
    if (!model) {
      throw new Error('Collection not found!');
    }

    const document = await new model(insertDocumentDto.document);
    const err = document.validateSync();

    if (err) {
      throw new Error('err');
    } else {
      await document.save();
    }
  }
}

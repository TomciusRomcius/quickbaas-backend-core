import { Body, Controller, Get, Post } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dtos/createCollectionDto';
import { GetAllDocumentsDto } from './dtos/getAllDocumentsDto';
import { InsertDocumentDto } from './dtos/insertDocumentDto';

@Controller('collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  // TODO: add admin guard
  @Get()
  async getAllCollections() {}
 
  @Post()
  async createCollection(@Body() createCollectionDto: CreateCollectionDto) {
    await this.collectionsService.createCollection(createCollectionDto);
  }

  async deleteTable() {}

  async getAllDocuments(@Body() getAllDocumentsDto: GetAllDocumentsDto) {
    return await this.collectionsService.getAllDocuments(getAllDocumentsDto);
  }

  async insertDocument(@Body() insertDocumentDto: InsertDocumentDto) {
    await this.collectionsService.insertDocument(insertDocumentDto);
  }
}

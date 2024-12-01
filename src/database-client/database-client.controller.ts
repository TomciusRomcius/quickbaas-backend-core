import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { SetDto } from './dtos/setDto';
import { DeleteDto } from './dtos/deleteDto';
import { DatabaseClientOperationService } from 'src/database-client-operation/database-client-operation.service';

@Controller('database-client')
export class DatabaseClientController {
  constructor(
    private readonly databaseClientOperationService: DatabaseClientOperationService,
  ) {}

  @Post('get')
  public async get(@Body() getDto: DeleteDto) {
    return await this.databaseClientOperationService.get(getDto);
  }

  @Post('set')
  public async set(@Body() setDto: SetDto) {
    this.databaseClientOperationService.set(setDto);
  }

  @Post('push')
  public async push(@Body() setDto: SetDto) {
    this.databaseClientOperationService.push(setDto);
  }

  @Delete('delete')
  public async delete(@Body() deleteDto: DeleteDto) {
    this.databaseClientOperationService.delete(deleteDto);
  }
}

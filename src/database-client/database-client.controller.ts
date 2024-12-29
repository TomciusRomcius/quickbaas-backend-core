import { Body, Controller, Delete, Post } from '@nestjs/common';
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
    const result = await this.databaseClientOperationService.get(getDto);
    return {
      result: result,
    };
  }

  @Post('set')
  public async set(@Body() setDto: SetDto) {
    await this.databaseClientOperationService.set(setDto);
  }

  @Post('push')
  public async push(@Body() setDto: SetDto) {
    // Returns and id
    const id = await this.databaseClientOperationService.push(setDto);
    return { id: id };
  }

  @Delete('delete')
  public async delete(@Body() deleteDto: DeleteDto) {
    await this.databaseClientOperationService.delete(deleteDto);
  }
}

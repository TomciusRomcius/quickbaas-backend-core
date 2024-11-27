import { Body, Controller, Delete, Post } from '@nestjs/common';
import { DatabaseClientService } from './database-client.service';
import { SetDto } from './dtos/setDto';
import { DeleteDto } from './dtos/deleteDto';

@Controller('database-client')
export class DatabaseClientController {
  constructor(private readonly databaseClientService: DatabaseClientService) {}

  @Post('set')
  public async set(@Body() setDto: SetDto) {
    this.databaseClientService.set(setDto);
  }

  @Post('push')
  public async push(@Body() setDto: SetDto) {
    this.databaseClientService.push(setDto);
  }

  @Delete('delete')
  public async delete(@Body() deleteDto: DeleteDto) {
    this.databaseClientService.delete(deleteDto);
  }
}

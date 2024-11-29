import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ServerFunctionsService } from './server-functions.service';
import { CreateServerFunctionDto } from './dtos/createServerFunctionDto';
import { RunServerFunctionDto } from './dtos/runServerFunctionDto';
import { AdminGuard } from 'src/common/utils/admin.guard';
import { DeleteServerFunctionDto } from './dtos/deleteServerFunctionDto';

// TODO: add auth guards
@Controller('server-functions')
export class ServerFunctionsController {
  constructor(
    private readonly serverFunctionsService: ServerFunctionsService,
  ) {}

  @Post('create')
  @UseGuards(AdminGuard)
  public createServerFunction(
    @Body() createServerFunctionDto: CreateServerFunctionDto,
  ) {
    return this.serverFunctionsService.createServerFunction(createServerFunctionDto);
  }

  @Post('run')
  public runServerFunction(@Body() runServerFunctionDto: RunServerFunctionDto) {
    return this.serverFunctionsService.runServerFunction(runServerFunctionDto);
  }

  @Post('delete')
  @UseGuards(AdminGuard)
  public deleteServerFunction(@Body() deleteServerFunctionDto: DeleteServerFunctionDto) {
    this.serverFunctionsService.deleteServerFunction(deleteServerFunctionDto);
  }
}

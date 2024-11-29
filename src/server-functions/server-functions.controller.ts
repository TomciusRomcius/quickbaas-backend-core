import { Body, Controller, Post } from '@nestjs/common';
import { ServerFunctionsService } from './server-functions.service';
import { CreateServerFunctionDto } from './dtos/createServerFunctionDto';
import { RunServerFunctionDto } from './dtos/runServerFunctionDto';

// TODO: add auth guards
@Controller('server-functions')
export class ServerFunctionsController {
  constructor(
    private readonly serverFunctionsService: ServerFunctionsService,
  ) {}

  @Post('create')
  public createServerFunction(
    @Body() createServerFunctionDto: CreateServerFunctionDto,
  ) {
    return this.serverFunctionsService.createServerFunction(createServerFunctionDto);
  }

  @Post('run')
  public runServerFunction(@Body() runServerFunctionDto: RunServerFunctionDto) {
    return this.serverFunctionsService.runServerFunction(runServerFunctionDto);
  }
}

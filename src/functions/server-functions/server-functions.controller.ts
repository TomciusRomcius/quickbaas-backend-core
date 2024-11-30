import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ServerFunctionsService } from './server-functions.service';
import { CreateServerFunctionDto } from './dtos/createServerFunctionDto';
import { AdminGuard } from 'src/common/utils/admin.guard';
import { DeleteServerFunctionDto } from './dtos/deleteServerFunctionDto';
import { Request, Response } from 'express';

// TODO: add auth guards
@Controller('server-functions')
export class ServerFunctionsController {
  constructor(
    private readonly serverFunctionsService: ServerFunctionsService,
  ) {}

  @Post('get')
  @UseGuards(AdminGuard)
  public getServerFunctions() {
    return this.serverFunctionsService.getServerFunctions();
  }
  
  @Post('create')
  @UseGuards(AdminGuard)
  public createServerFunction(
    @Body() createServerFunctionDto: CreateServerFunctionDto,
  ) {
    return this.serverFunctionsService.createServerFunction(
      createServerFunctionDto,
    );
  }

  @Post('run')
  public runServerFunction(@Req() req: Request, @Res() res: Response) {
    this.serverFunctionsService.runServerFunction(req, res);
  }

  @Post('delete')
  @UseGuards(AdminGuard)
  public deleteServerFunction(
    @Body() deleteServerFunctionDto: DeleteServerFunctionDto,
  ) {
    this.serverFunctionsService.deleteServerFunction(deleteServerFunctionDto);
  }
}

import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ServerMiddlewareService } from './server-middleware.service';
import { AdminGuard } from 'src/common/utils/admin.guard';
import { CreateMiddlewareDto } from './dtos/create-middleware-dto';

// TODO: api route for getting middleware
@Controller('server-middleware')
export class ServerMiddlewareController {
  constructor(
    private readonly serverMiddlewareService: ServerMiddlewareService,
  ) {}

  @Post('get')
  @UseGuards(AdminGuard)
  public async getAllMiddleware() {
    return await this.serverMiddlewareService.getAllMiddleware();
  }

  @Post('create')
  @UseGuards(AdminGuard)
  public async createMiddleware(
    @Body() createMiddlewareDto: CreateMiddlewareDto,
  ) {
    await this.serverMiddlewareService.createMiddleware(createMiddlewareDto);
  }
}

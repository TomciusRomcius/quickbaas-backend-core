import { Injectable } from '@nestjs/common';
import { CreateMiddlewareDto } from './dtos/createMiddlewareDto';
import ServerMiddlewareModel from 'src/common/models/serverMiddlewareModel';
import { MiddlewareFunctionWrapper } from '../utils/middleware-function-wrapper';
import ServerFunction from '../utils/server-function';
import { DatabaseClientOperationService } from 'src/database-client-operation/database-client-operation.service';

@Injectable()
export class ServerMiddlewareService {
  public middlewares: MiddlewareFunctionWrapper[] = [];

  constructor(private databaseClientService: DatabaseClientOperationService) {}

  public async getAllMiddleware() {
    const dbMiddlewares = await ServerMiddlewareModel.find();
    this.middlewares = [];
    dbMiddlewares.forEach((middleware) => {
      console.log('new');
      const context = {
        databaseClientService: this.databaseClientService,
      };
      this.middlewares.push(
        new MiddlewareFunctionWrapper(
          new ServerFunction(middleware.name, middleware.code, context),
        ),
      );
    });
  }

  public async createMiddleware(createMiddlewareDto: CreateMiddlewareDto) {
    const middleware = await new ServerMiddlewareModel({
      name: createMiddlewareDto.name,
      code: createMiddlewareDto.code,
      executesOn: createMiddlewareDto.executesOn,
    });

    await middleware.save();
  }

  public async updateMiddleware() {}

  public async deleteMiddleware() {}
}

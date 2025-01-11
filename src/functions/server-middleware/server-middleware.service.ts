import { Injectable } from '@nestjs/common';
import ServerMiddlewareModel from 'src/common/models/serverMiddlewareModel';
import { MiddlewareFunctionWrapper } from '../utils/middleware-function-wrapper';
import ServerFunction from '../utils/server-function';
import { DatabaseClientOperationService } from 'src/database-client-operation/database-client-operation.service';
import { CreateMiddlewareDto } from './dtos/create-middleware-dto';

@Injectable()
export class ServerMiddlewareService {
  public middlewares: MiddlewareFunctionWrapper[] = [];

  constructor(private databaseClientService: DatabaseClientOperationService) {}

  public async getAllMiddlewareNames() {
    const dbMiddlewares = await ServerMiddlewareModel.find({}, { name: true });
    return dbMiddlewares.map((middleware) => middleware.name);
  }

  public async createMiddleware(createMiddlewareDto: CreateMiddlewareDto) {
    const promises = [];
    console.log(createMiddlewareDto.middlewares);
    createMiddlewareDto.middlewares.forEach((middleware) => {
      const fn = async () => {
        await ServerMiddlewareModel.findOneAndUpdate(
          {
            name: middleware.name,
          },
          {
            code: middleware.code,
            runsOn: middleware.runsOn,
          },
          { upsert: true },
        );
      };
      promises.push(fn());
    });

    await Promise.all(promises);
  }
}

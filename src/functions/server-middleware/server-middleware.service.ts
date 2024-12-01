import { Injectable } from '@nestjs/common';
import { CreateMiddlewareDto } from './dtos/createMiddlewareDto';
import ServerMiddlewareModel from 'src/common/models/serverMiddlewareModel';
import { MiddlewareFunctionWrapper } from '../utils/middleware-function-wrapper';
import ServerFunction from '../utils/server-function';
import { DatabaseClientOperationService } from 'src/database-client-operation/database-client-operation.service';
import { UpdateMiddlewareDto } from './dtos/updateMiddlewareDto';
import { DeleteMiddlewareDto } from './dtos/deleteMiddlewareDto';

@Injectable()
export class ServerMiddlewareService {
  public middlewares: MiddlewareFunctionWrapper[] = [];

  constructor(private databaseClientService: DatabaseClientOperationService) {}

  public async getAllMiddleware() {
    const dbMiddlewares = await ServerMiddlewareModel.find();
    this.middlewares = [];
    dbMiddlewares.forEach((middleware) => {
      const context = {
        databaseClientService: this.databaseClientService,
      };
      this.middlewares.push(
        new MiddlewareFunctionWrapper(
          new ServerFunction(middleware.name, middleware.code, context),
          middleware.runsOn,
        ),
      );
    });
  }

  public async createMiddleware(createMiddlewareDto: CreateMiddlewareDto) {
    const middleware = await new ServerMiddlewareModel({
      name: createMiddlewareDto.name,
      code: createMiddlewareDto.code,
      runsOn: createMiddlewareDto.runsOn,
    });

    await middleware.save();
  }

  public async updateMiddleware(updateMiddlewareDto: UpdateMiddlewareDto) {
    const dto = updateMiddlewareDto;
    // TODO: holy make this cleaner please
    if (dto.newCode) {
      await ServerMiddlewareModel.findOneAndUpdate(
        { name: updateMiddlewareDto.name },
        {
          name: dto.newName || dto.name,
        },
      );
    } else {
      await ServerMiddlewareModel.findOneAndUpdate(
        { name: updateMiddlewareDto.name },
        {
          name: dto.newName || dto.name,
          code: dto.newCode,
        },
      );
    }
  }

  public async deleteMiddleware(deleteMiddlewareDto: DeleteMiddlewareDto) {
    await ServerMiddlewareModel.findOneAndDelete({
      name: deleteMiddlewareDto.name,
    });
  }
}

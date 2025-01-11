import { Injectable } from '@nestjs/common';
import ServerMiddlewareModel from 'src/common/models/serverMiddlewareModel';
import { MiddlewareFunctionWrapper } from '../utils/middleware-function-wrapper';
import { CreateMiddlewareDto } from './dtos/create-middleware-dto';
import SandboxedFunction from 'src/common/utils/sandboxedFunction';

@Injectable()
export class ServerMiddlewareService {
  public middlewares: MiddlewareFunctionWrapper[] = [];

  // TODO: test this
  public async refreshMiddlewareFunctions() {
    const dbMiddlewares = await ServerMiddlewareModel.find({});
    for (let dbMiddleware of dbMiddlewares) {
      const foundMiddleware = this.middlewares.find((el) => el.getName());
      // If middleware exists, replace the middlewares code if the code has changed
      if (foundMiddleware) {
        const foundFunction = foundMiddleware.getSandboxedFunction();
        if (foundFunction.userCode !== dbMiddleware.code) {
          foundMiddleware.setSandboxedFunction(
            new SandboxedFunction(dbMiddleware.code),
          );
        }
      }
      // Else create new middleware
      else {
        const middleware = new MiddlewareFunctionWrapper(
          dbMiddleware.name,
          new SandboxedFunction(dbMiddleware.code),
          dbMiddleware.runsOn,
        );
        this.middlewares.push(middleware);
      }
    }
  }

  public async getAllMiddlewareNames() {
    const dbMiddlewares = await ServerMiddlewareModel.find({}, { name: true });
    return dbMiddlewares.map((middleware) => middleware.name);
  }

  public async createMiddleware(createMiddlewareDto: CreateMiddlewareDto) {
    const promises = [];
    createMiddlewareDto.middlewares.forEach((middleware) => {
      const fn = async () => {
        const res = await ServerMiddlewareModel.findOneAndUpdate(
          {
            name: middleware.name,
          },
          {
            code: middleware.code,
            runsOn: middleware.runsOn,
          },
          { upsert: true, new: true },
        );
      };
      promises.push(fn());
    });

    await Promise.all(promises);
  }
}

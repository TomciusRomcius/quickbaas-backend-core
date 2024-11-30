import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseClientService } from 'src/database-client/database-client.service';
import { CreateServerFunctionDto } from './dtos/createServerFunctionDto';
import ServerFunctionModel from 'src/common/models/serverFunctionModel';
import { DeleteServerFunctionDto } from './dtos/deleteServerFunctionDto';
import ServerFunction from '../utils/server-function';
import { Request, Response } from 'express';

@Injectable()
export class ServerFunctionsService {
  serverFunctions = new Map<string, ServerFunction>();

  constructor(private databaseClientService: DatabaseClientService) {}

  async onModuleInit() {
    const fns = await ServerFunctionModel.find();
    fns.forEach((fn) => {
      this.serverFunctions.set(
        fn.name,
        new ServerFunction(fn.name, fn.code, {
          databaseClientService: this.databaseClientService,
        }),
      );
    });
  }

  public async getServerFunctions() {
    const fnNames: string[] = [];

    for (const [key, value] of this.serverFunctions) {
      fnNames.push(key);
    }

    return fnNames;
  }

  public async createServerFunction(
    createServerFunctionDto: CreateServerFunctionDto,
  ) {
    const fn = new ServerFunction(
      createServerFunctionDto.name,
      createServerFunctionDto.code,
      {
        databaseClientService: this.databaseClientService,
      },
    );

    const dbFn = await new ServerFunctionModel({
      name: createServerFunctionDto.name,
      code: createServerFunctionDto.code,
    });
    dbFn.save();

    this.serverFunctions.set(fn.name, fn);
  }

  public async runServerFunction(req: Request, res: Response) {
    if (!req.body['name'] || typeof req.body['name'] !== 'string') {
      throw new BadRequestException('You must provide the server function name');
    }
    const fn = this.serverFunctions.get(req.body['name']);
    if (!fn) {
      throw new NotFoundException(
        'Server function with the specified name does not exist',
      );
    }

    const result = fn.run(req, res);
  }

  public deleteServerFunction(
    deleteServerFunctionDto: DeleteServerFunctionDto,
  ) {
    if (!this.serverFunctions.delete(deleteServerFunctionDto.name)) {
      return new NotFoundException(
        'Server function with the specified name does not exist',
      );
    } else {
      ServerFunctionModel.deleteOne({ name: deleteServerFunctionDto.name });
    }
  }
}

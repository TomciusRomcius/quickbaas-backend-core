import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseClientService } from 'src/database-client/database-client.service';
import { CreateServerFunctionDto } from './dtos/createServerFunctionDto';
import ServerFunction from './features/server-function';
import ServerFunctionModel from 'src/common/models/serverFunctionModel';
import { RunServerFunctionDto } from './dtos/runServerFunctionDto';
import { DeleteServerFunctionDto } from './dtos/deleteServerFunctionDto';

@Injectable()
export class ServerFunctionsService {
  serverFunctions = new Map<string, ServerFunction>();

  constructor(private databaseClientService: DatabaseClientService) {}

  async onModuleInit() {
    const fns = await ServerFunctionModel.find();
    fns.forEach((fn) => {
      this.serverFunctions.set(fn.name, new ServerFunction(fn.name, fn.code));
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
    );

    const dbFn = await new ServerFunctionModel({
      name: createServerFunctionDto.name,
      code: createServerFunctionDto.code,
    });
    dbFn.save();

    this.serverFunctions.set(fn.name, fn);
  }

  public runServerFunction(runServerFunctionDto: RunServerFunctionDto) {
    const fn = this.serverFunctions.get(runServerFunctionDto.name);
    if (!fn) {
      throw new NotFoundException(
        'Server function with the specified name does not exist',
      );
    }

    const result = fn.run();
    return result;
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

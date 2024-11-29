import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseClientService } from 'src/database-client/database-client.service';
import { CreateServerFunctionDto } from './dtos/createServerFunctionDto';
import ServerFunction from './features/server-function';
import { RunServerFunctionDto } from './dtos/runServerFunctionDto';
import { DeleteServerFunctionDto } from './dtos/deleteServerFunctionDto';

@Injectable()
export class ServerFunctionsService {
  serverFunctions = new Map<string, ServerFunction>();

  constructor(private databaseClientService: DatabaseClientService) {}

  public createServerFunction(
    createServerFunctionDto: CreateServerFunctionDto,
  ) {
    const fn = new ServerFunction(
      createServerFunctionDto.name,
      createServerFunctionDto.code,
    );

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
    }
  }
}

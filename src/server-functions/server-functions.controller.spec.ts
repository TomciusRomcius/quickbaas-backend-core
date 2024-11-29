import { Test, TestingModule } from '@nestjs/testing';
import { ServerFunctionsController } from './server-functions.controller';
import { ServerFunctionsService } from './server-functions.service';

describe('ServerFunctionsController', () => {
  let controller: ServerFunctionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServerFunctionsController],
      providers: [ServerFunctionsService],
    }).compile();

    controller = module.get<ServerFunctionsController>(ServerFunctionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

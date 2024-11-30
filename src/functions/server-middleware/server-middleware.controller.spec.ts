import { Test, TestingModule } from '@nestjs/testing';
import { ServerMiddlewareController } from './server-middleware.controller';
import { ServerMiddlewareService } from './server-middleware.service';

describe('ServerMiddlewareController', () => {
  let controller: ServerMiddlewareController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServerMiddlewareController],
      providers: [ServerMiddlewareService],
    }).compile();

    controller = module.get<ServerMiddlewareController>(ServerMiddlewareController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

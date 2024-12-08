import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseClientController } from './database-client.controller';

describe('DatabaseClientController', () => {
  let controller: DatabaseClientController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DatabaseClientController],
    }).compile();

    controller = module.get<DatabaseClientController>(DatabaseClientController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

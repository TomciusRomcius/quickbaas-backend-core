import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseClientController } from './database-client.controller';
import { DatabaseClientService } from './database-client.service';

describe('DatabaseClientController', () => {
  let controller: DatabaseClientController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DatabaseClientController],
      providers: [DatabaseClientService],
    }).compile();

    controller = module.get<DatabaseClientController>(DatabaseClientController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

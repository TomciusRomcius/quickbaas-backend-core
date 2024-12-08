import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseRulesController } from './database-rules.controller';

describe('DatabaseRulesController', () => {
  let controller: DatabaseRulesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DatabaseRulesController],
    }).compile();

    controller = module.get<DatabaseRulesController>(DatabaseRulesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

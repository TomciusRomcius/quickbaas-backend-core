import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseClientOperationService } from './database-client-operation.service';

describe('DatabaseClientOperationService', () => {
  let service: DatabaseClientOperationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DatabaseClientOperationService],
    }).compile();

    service = module.get<DatabaseClientOperationService>(DatabaseClientOperationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { ServerFunctionsService } from './server-functions.service';

describe('ServerFunctionsService', () => {
  let service: ServerFunctionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServerFunctionsService],
    }).compile();

    service = module.get<ServerFunctionsService>(ServerFunctionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

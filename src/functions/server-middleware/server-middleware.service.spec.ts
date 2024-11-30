import { Test, TestingModule } from '@nestjs/testing';
import { ServerMiddlewareService } from './server-middleware.service';

describe('ServerMiddlewareService', () => {
  let service: ServerMiddlewareService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServerMiddlewareService],
    }).compile();

    service = module.get<ServerMiddlewareService>(ServerMiddlewareService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

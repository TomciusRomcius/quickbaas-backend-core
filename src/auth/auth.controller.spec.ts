import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Response } from 'express';

describe('AuthController', () => {
  let controller: AuthController;
  let mockAuthService: Partial<AuthService>;

  const generateResponse = () => {
    return {
      cookie: jest.fn(),
      send: jest.fn(),
    } as any as Response;
  };

  beforeEach(async () => {
    mockAuthService = {
      signInWithPassword: jest.fn(),
      signUpWithPassword: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should call signUpWithPassword on the service', async () => {
    const res = generateResponse();
    const dto = { email: 'email@gmail.com', password: 'password' };
    controller.signUpWithPassword(res, dto);
    expect(mockAuthService.signUpWithPassword).toHaveBeenCalledWith(dto);
  });

  it('should call signInWithPassword on the service', async () => {
    const res = generateResponse();
    const dto = { email: 'email@gmail.com', password: 'password' };
    controller.signInWithPassword(res, dto);
    expect(mockAuthService.signInWithPassword).toHaveBeenCalledWith(dto);
  });
});

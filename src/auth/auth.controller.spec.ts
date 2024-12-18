import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let mockAuthService: Partial<AuthService>;

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

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call signUpWithPassword on the service', async () => {
    const dto = { email: 'email@gmail.com', password: 'password' };
    controller.signUpWithPassword(dto);
    expect(mockAuthService.signUpWithPassword).toHaveBeenCalledWith(dto);
  });

  it('should call signInWithPassword on the service', async () => {
    const dto = { email: 'email@gmail.com', password: 'password' };
    controller.signInWithPassword(dto);
    expect(mockAuthService.signInWithPassword).toHaveBeenCalledWith(dto);
  });
});

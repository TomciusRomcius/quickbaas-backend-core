import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthWithPasswordDto } from './dto/auth-with-password-dto';
import User from 'src/common/models/userModel';
import JWT from 'src/common/utils/jwt';
import * as crypto from 'src/common/utils/crypto';
import {
  NotFoundException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';

jest.mock('src/common/models/userModel');
jest.mock('src/common/utils/jwt');
jest.mock('src/common/utils/crypto');

describe('AuthService', () => {
  let service: AuthService;
  const mockUser = {
    email: 'test@example.com',
    password: 'hashedPassword',
    id: '123',
  };
  const mockDto: AuthWithPasswordDto = {
    email: 'test@example.com',
    password: 'password123',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  describe('signInWithPassword', () => {
    it('should return JWT token for valid credentials', async () => {
      jest.spyOn(User, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(crypto, 'comparePasswords').mockResolvedValue(true);
      jest.spyOn(JWT, 'sign').mockReturnValue('mockToken');

      const result = await service.signInWithPassword(mockDto);

      expect(result).toBe('mockToken');
      expect(User.findOne).toHaveBeenCalledWith({ email: mockDto.email });
      expect(crypto.comparePasswords).toHaveBeenCalledWith(
        mockDto.password,
        mockUser.password,
      );
      expect(JWT.sign).toHaveBeenCalledWith({
        email: mockUser.email,
        id: mockUser.id,
        exp: expect.any(Number),
      });
    });

    it('should throw NotFoundException for non-existent user', async () => {
      jest.spyOn(User, 'findOne').mockResolvedValue(null);

      await expect(service.signInWithPassword(mockDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      jest.spyOn(User, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(crypto, 'comparePasswords').mockResolvedValue(false);

      await expect(service.signInWithPassword(mockDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('signUpWithPassword', () => {
    it('should create user and return a JWT token', async () => {
      jest.spyOn(crypto, 'hash').mockResolvedValue('hashedPassword');
      jest.spyOn(User, 'create').mockResolvedValue(mockUser as any);
      jest.spyOn(JWT, 'sign').mockReturnValue('mockToken');

      const result = await service.signUpWithPassword(mockDto);

      expect(result).toBe('mockToken');
      expect(crypto.hash).toHaveBeenCalledWith(mockDto.password);
      expect(User.create).toHaveBeenCalledWith({
        email: mockDto.email,
        password: 'hashedPassword',
      });
      expect(JWT.sign).toHaveBeenCalledWith({
        email: mockUser.email,
        id: mockUser.id,
        exp: expect.any(Number),
      });
    });

    it('should throw InternalServerErrorException on creation failure', async () => {
      jest.spyOn(crypto, 'hash').mockResolvedValue('hashedPassword');
      jest.spyOn(User, 'create').mockRejectedValue(new Error());

      await expect(service.signUpWithPassword(mockDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});

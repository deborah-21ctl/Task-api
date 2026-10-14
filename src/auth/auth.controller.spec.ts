import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller.js';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service.js';
import { VerifyEmailDto } from './dto/verify-email.dto/verify-email.dto.js';
import { vi } from 'vitest';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: { verifyEmail: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],

      providers: [
        {
          provide: AuthService,
          useValue: {
            verifyEmail: vi.fn(),
          },
        },

        {
          provide: JwtService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should pass the email verification request to the auth service', async () => {
    const dto: VerifyEmailDto = {
      email: 'test@example.com',
      otp: '123456',
    };
    authService.verifyEmail.mockResolvedValue({
      message: 'Email verified successfully',
    });

    await expect(controller.verifyEmail(dto)).resolves.toEqual({
      message: 'Email verified successfully',
    });
    expect(authService.verifyEmail).toHaveBeenCalledWith(dto);
  });
});
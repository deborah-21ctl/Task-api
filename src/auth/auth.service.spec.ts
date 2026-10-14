import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service.js';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity/user.entity.js';
import { vi } from 'vitest';
import * as bcrypt from 'bcrypt';
import { EmailService } from './email/email.service.js';

describe('AuthService', () => {
  let service: AuthService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        AuthService,

        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOne: vi.fn(),
            create: vi.fn(),
            save: vi.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: vi.fn(),
          },
        },
        {
          provide: EmailService,
          useValue: {
            sentOtpEmail: vi.fn(),
            sendVerificationEmail: vi.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should register a new user', async () => {
    const repository = module.get(getRepositoryToken(UserEntity));

    vi.mocked(repository.findOne).mockResolvedValue(null);

    vi.mocked(repository.create).mockReturnValue({
      id: 1,
      fullName: 'Jordan Smith',
      phoneNumber: '+14155552671',
      email: 'test@example.com',
      password: 'hashed-password',
      isEmailVerified: false,
    } as UserEntity);

    vi.mocked(repository.save).mockResolvedValue({
      id: 1,
      fullName: 'Jordan Smith',
      phoneNumber: '+14155552671',
      email: 'test@example.com',
      password: 'hashed-password',
      isEmailVerified: false,
    } as UserEntity);

    const result = await service.register({
      fullName: 'Jordan Smith',
      phoneNumber: '+14155552671',
      email: 'test@example.com',
      password: 'MySecurePass123!',
    });

    expect(result).toEqual({
      id: 1,
      fullName: 'Jordan Smith',
      phoneNumber: '+14155552671',
      email: 'test@example.com',
      message:
        'A verification code has been sent to your email. Enter the OTP to verify your email and complete registration.',
    });
    expect(
      module.get(EmailService).sendVerificationEmail,
    ).toHaveBeenCalledWith('test@example.com', expect.any(String));
  });

  it('should reject duplicate email', async () => {
    const repository = module.get(getRepositoryToken(UserEntity));

    vi.mocked(repository.findOne).mockResolvedValue({
      id: 1,
      email: 'test@example.com',
      password: 'hashed-password',
    } as UserEntity);

    await expect(
      service.register({
        fullName: 'Jordan Smith',
        phoneNumber: '+14155552671',
        email: 'test@example.com',
        password: 'MySecurePass123!',
      }),
    ).rejects.toThrow('User with this email already exists');
  });

  it('should reject a common password during registration', async () => {
    const repository = module.get(getRepositoryToken(UserEntity));
    vi.mocked(repository.findOne).mockResolvedValue(null);

    await expect(
      service.register({
        fullName: 'Jordan Smith',
        phoneNumber: '+14155552671',
        email: 'test@example.com',
        password: 'Password123!',
      }),
    ).rejects.toThrow('Choose a less common password.');

    expect(repository.create).not.toHaveBeenCalled();
  });

  it('should login a user with correct credentials', async () => {
    const repository = module.get(getRepositoryToken(UserEntity));
    const jwtService = module.get(JwtService);
    vi.mocked(repository.findOne).mockResolvedValue({
      id: 1,
      email: 'test@example.com',
      password: await bcrypt.hash('password123', 10),
      isEmailVerified: true,
    } as UserEntity);
    vi.mocked(jwtService.sign).mockReturnValue('fake-token');
    const result = await service.login({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(result).toEqual({ access_token: 'fake-token' });
  });

  it('should reject an incorrect password', async () => {
    const repository = module.get(getRepositoryToken(UserEntity));

    vi.mocked(repository.findOne).mockResolvedValue({
      id: 1,
      email: 'test@example.com',
      password: await bcrypt.hash('correct-password', 10),
    } as UserEntity);

    await expect(
      service.login({
        email: 'test@example.com',
        password: 'wrong-password',
      }),
    ).rejects.toThrow('Invalid email or password');
  });

  it('should reject login until the email is verified', async () => {
    const repository = module.get(getRepositoryToken(UserEntity));
    vi.mocked(repository.findOne).mockResolvedValue({
      id: 1,
      email: 'test@example.com',
      password: await bcrypt.hash('password123', 10),
      isEmailVerified: false,
    } as UserEntity);

    await expect(
      service.login({
        email: 'test@example.com',
        password: 'password123',
      }),
    ).rejects.toThrow('Please verify your email before logging in');
  });

  it('should verify an email with a valid code', async () => {
    const repository = module.get(getRepositoryToken(UserEntity));
    const user = {
      id: 1,
      email: 'test@example.com',
      isEmailVerified: false,
      emailVerificationOtp: await bcrypt.hash('123456', 10),
      emailVerificationOtpExpiresAt: new Date(Date.now() + 60_000),
    } as UserEntity;
    vi.mocked(repository.findOne).mockResolvedValue(user);
    vi.mocked(repository.save).mockResolvedValue(user);

    const result = await service.verifyEmail({
      email: 'test@example.com',
      otp: '123456',
    });

    expect(result).toEqual({ message: 'Email verified successfully' });
    expect(user.isEmailVerified).toBe(true);
    expect(user.emailVerificationOtp).toBeNull();
    expect(user.emailVerificationOtpExpiresAt).toBeNull();
  });
});

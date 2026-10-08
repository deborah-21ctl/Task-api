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
      email: 'test@example.com',
      password: 'hashed-password',
    } as UserEntity);

    vi.mocked(repository.save).mockResolvedValue({
      id: 1,
      email: 'test@example.com',
      password: 'hashed-password',
    } as UserEntity);

    const result = await service.register({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(result).toEqual({
      id: 1,
      email: 'test@example.com',
    });
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
        email: 'test@example.com',
        password: 'password123',
      }),
    ).rejects.toThrow('User with this email already exists');
  });

  it('should login a user with correct credentials', async () => {
    const repository = module.get(getRepositoryToken(UserEntity));
    const jwtService = module.get(JwtService);
    vi.mocked(repository.findOne).mockResolvedValue({
      id: 1,
      email: 'test@example.com',
      password: await bcrypt.hash('password123', 10),
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
});

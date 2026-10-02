import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity/user.entity.js';
import { RegisterDto } from './dto/register.dto/register.dto.js';
import { LoginDto } from './dto/login.dto/login.dto.js';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = this.userRepository.create({
      email: dto.email,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);
    return {
      id: savedUser.id,
      email: savedUser.email,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const PasswordsMatches = await bcrypt.compare
    (dto.password, user.password);

    if (!PasswordsMatches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = this.jwtService.sign({

        sub: user.id,
        email: user.email,
      });


      return {
        access_token: token,
      };
    }
  }


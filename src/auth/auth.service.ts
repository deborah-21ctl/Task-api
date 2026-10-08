import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity/user.entity.js';
import { RegisterDto } from './dto/register.dto/register.dto.js';
import { LoginDto } from './dto/login.dto/login.dto.js';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from './email/email.service.js';
import { Role } from './enums/role.enum.js';
// import { randomInt } from 'node:crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    private readonly jwtService: JwtService,
    private readonly emailservice: EmailService,
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
     role: Role.USER
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

    const PasswordsMatches = await bcrypt.compare(dto.password, user.password);

    if (!PasswordsMatches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role : user.role,
    });

    return {
      access_token: token,
    };
  }
  async forgotPassword(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
    });
    if (!user) {
      return {
        message: 'if the email exists, a password OTP has been sent',
      };
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordOtp = await bcrypt.hash(otp, 10);

    user.resetPasswordOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await this.userRepository.save(user);
    await this.emailservice.sentOtpEmail(user.email, otp);

    return {
      message: ' if this email exits, this a reset OTP has been sent',
    };
  }

  async resetPassword(email: string, otp: string, newPassword: string) {
    const user = await this.userRepository.findOne({
      where: { email },
    });
    if (!user) {
      throw new BadRequestException('Invalid or expired OTP');
    }
    if (
      !user.resetPasswordOtp ||
      !user.resetPasswordOtpExpiresAt ||
      user.resetPasswordOtpExpiresAt < new Date()
    ) {
      throw new BadRequestException('Invalid or expired OTP');
    }
    user.password = await bcrypt.hash(newPassword, 10);

    user.resetPasswordOtp = null
    user.resetPasswordOtpExpiresAt = null

    await this.userRepository.save(user)

    return {
      message : 'password reset successfully'
    }
  }
}

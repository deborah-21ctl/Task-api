import { Controller, Post, Body, Req, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto/register.dto.js';
import { LoginDto } from './dto/login.dto/login.dto.js';
import { ResetPasswordDto } from './dto/reset-password.dto/reset-password.dto.js';
import { ForgotPasswordDto } from './dto/forgot-password.dto/forgot-password.dto.js';
import type { AuthRequest } from './types/auth-request/auth-request.interface.js';
import { JwtGuard } from './guards/jwt/jwt.guard.js';
import { Roles } from './decorators/roles/roles.decorator.js';
import { RolesGuard } from './guards/roles/roles.guard.js';
import { Role } from './enums/role.enum.js';

import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
// import { EmailService } from './email/email.service.js';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,

    // private readonly emailService: EmailService,
  ) {}

  @ApiOperation({
    summary: 'Register an account',
    description: 'Creates a user account and returns its public ID and email.',
  })
  @ApiCreatedResponse({ description: 'The account was created successfully.' })
  @ApiBadRequestResponse({
    description: 'The email or password failed validation.',
  })
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @ApiOperation({
    summary: 'Log in',
    description: 'Validates credentials and returns a JWT access token.',
  })
  @ApiCreatedResponse({
    description: 'Login succeeded.',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string', example: 'eyJhbGciOi...' },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'The email or password failed validation.',
  })
  @ApiUnauthorizedResponse({
    description: 'The email or password is incorrect.',
  })
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get the current user',
    description:
      'Returns the ID and email encoded in the authenticated access token.',
  })
  @ApiOkResponse({
    description: 'The authenticated user’s token claims.',
    schema: {
      type: 'object',
      properties: {
        sub: { type: 'number', example: 1 },
        email: { type: 'string', example: 'user@example.com' },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'The access token is invalid or expired.',
  })
  @ApiForbiddenResponse({ description: 'A bearer access token is required.' })
  @Get('me')
  @UseGuards(JwtGuard)
  me(@Req() request: AuthRequest) {
    return request.user;
  }

  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.email, dto.otp, dto.newPassword);
  }

  @ApiBearerAuth()
  @Get('post-admin')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  adminTest() {
    return {
      message: 'you are admin',
    };
  }

  // @Get ('test-email')
  // async testEmail(){
  //   await this.emailService.sentOtpEmail(
  //     process.env.SMTP_USER!,
  //     '123456'

  //   );

  //   return{
  //     message: 'Test email was sent successfully'
  //   }
  // }
}

import { Controller, Post, Body, Req, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto/register.dto.js';
import { LoginDto } from './dto/login.dto/login.dto.js';
import type { AuthRequest } from './types/auth-request/auth-request.interface.js';
import { JwtGuard } from './guards/jwt/jwt.guard.js';
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

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
}

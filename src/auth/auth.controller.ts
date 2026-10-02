import { Controller,Post, Body, Req, UseGuards ,Get} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto/register.dto.js';
import { LoginDto } from './dto/login.dto/login.dto.js';
import type { AuthRequest } from './types/auth-request/auth-request.interface.js';
import { JwtGuard } from './guards/jwt/jwt.guard.js';
import { ApiBearerAuth } from '@nestjs/swagger';
@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    } 
    @Post('login')
    async login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }


@ApiBearerAuth()   
@Get('me')
@UseGuards(JwtGuard)
me(@Req() request: AuthRequest) {
  return request.user;
}
}
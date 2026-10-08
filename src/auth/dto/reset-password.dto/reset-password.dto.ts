import { IsEmail, IsString, Length, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({ example: 'user@example.com', description: 'Account email address.' })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123456',
    minLength: 6,
    maxLength: 6,
    description: 'Six-digit password-reset code.',
  })
  @IsString()
  @Length(6, 6)
  otp: string;

  @ApiProperty({
    example: 'NewPassword123!',
    minLength: 8,
    description: 'The new account password.',
  })
  @IsString()
  @MinLength(8)
  newPassword: string;
}
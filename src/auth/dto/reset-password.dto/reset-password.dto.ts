import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Account email address.',
  })
  @IsEmail({}, { message: 'Please provide a valid email address.' })
  email: string;

  @ApiProperty({
    example: '123456',
    minLength: 6,
    maxLength: 6,
    description: 'Six-digit password-reset code.',
  })
  @IsString({ message: 'Verification code must be a string.' })
  @Matches(/^\d{6}$/, {
    message: 'Verification code must contain exactly six digits.',
  })
  otp: string;

  @ApiProperty({
    example: 'NewPassword123!',
    minLength: 16,
    maxLength: 72,
    description:
      'Password must be at least 16 characters and include uppercase, lowercase, a number, and a special character, with no spaces.',
  })
  @IsString({ message: 'Password must be a string.' })
  @MinLength(16, {
    message: 'Password must contain at least 16 characters.',
  })
  @MaxLength(72, {
    message: 'Password must not exceed 72 characters.',
  })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s])\S+$/, {
    message:
      'Password must include uppercase and lowercase letters, a number, and a special character, with no spaces.',
  })
  newPassword: string;
}
import { IsEmail, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail({}, { message: 'Please provide a valid email address.' })
  email: string;

  @ApiProperty({
    example: '123456',
    minLength: 6,
    maxLength: 6,
    description: 'The six-digit verification code sent by email.',
  })
  @IsString({ message: 'Verification code must be a string.' })
  @Matches(/^\d{6}$/, {
    message: 'Verification code must contain exactly six digits.',
  })
  otp: string;
}

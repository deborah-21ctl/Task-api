import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'ebun@example.com', description: 'User email' })
  @IsEmail({}, { message: 'Please provide a valid email address.' })
  email: string;

  @ApiProperty({
    example: 'MySecurePass123!',
    description: 'Password used when registering.',
    minLength: 1,
    maxLength: 72,
  })
  @IsString({ message: 'Password must be a string.' })
  @MinLength(1, { message: 'Password is required.' })
  @MaxLength(72, {
    message: 'Password must not exceed 72 characters.',
  })
  password: string;
}
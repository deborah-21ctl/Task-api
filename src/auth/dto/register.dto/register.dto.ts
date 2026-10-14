import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'Jordan Smith',
    maxLength: 100,
    description: 'The full name of the new account holder.',
  })
  @IsString({ message: 'Full name must be a string.' })
  @IsNotEmpty({ message: 'Full name is required.' })
  @Matches(/\S/, { message: 'Full name cannot be blank.' })
  @MaxLength(100, { message: 'Full name must not exceed 100 characters.' })
  fullName: string;

  @ApiProperty({
    example: '+14155552671',
    description: 'Phone number in international format, including country code.',
  })
  @IsPhoneNumber(undefined, {
    message: 'Please provide a valid international phone number.',
  })
  phoneNumber: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address for the new account.',
  })
  @IsEmail({}, { message: 'Please provide a valid email address.' })
  email: string;

  @ApiProperty({
    example: 'MySecurePass123!',
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
  password: string;
}

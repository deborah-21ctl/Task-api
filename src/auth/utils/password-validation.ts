import { BadRequestException } from '@nestjs/common';

const COMMON_PASSWORDS = new Set([
  'password123!',
  'password123',
  'password',
  'password1',
  'password1234',
  '12345678',
  '123456789',
  'qwerty123',
  'admin123',
  'letmein',
  'welcome123',
  'iloveyou',
]);

export function validatePasswordStrength(password: string): void {
  const normalisedPassword = password.trim().toLowerCase();

  if (COMMON_PASSWORDS.has(normalisedPassword)) {
    throw new BadRequestException({
      message: 'Choose a less common password.',
      errors: {
        password: ['This password is too common. Please choose another.'],
      },
    });
  }
}

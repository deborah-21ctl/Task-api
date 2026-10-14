import { HttpExceptionFilter } from './http-exception.filter.js';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('HttpExceptionFilter', () => {
  it('should be defined', () => {
    expect(new HttpExceptionFilter()).toBeDefined();
  });

  it('marks error responses as unsuccessful', () => {
    const json = vi.fn();
    const status = vi.fn().mockReturnValue({ json });
    const host = {
      switchToHttp: () => ({
        getResponse: () => ({ status }),
        getRequest: () => ({ url: '/projects/999' }),
      }),
    };

    new HttpExceptionFilter().catch(
      new NotFoundException('Project not found'),
      host as never,
    );

    expect(status).toHaveBeenCalledWith(404);
    expect(json).toHaveBeenCalledWith({
      statusCode: 404,
      success: false,
      message: 'Project not found',
      path: '/projects/999',
    });
  });

  it('preserves field validation errors in the response', () => {
    const json = vi.fn();
    const status = vi.fn().mockReturnValue({ json });
    const host = {
      switchToHttp: () => ({
        getResponse: () => ({ status }),
        getRequest: () => ({ url: '/auth/register' }),
      }),
    };

    new HttpExceptionFilter().catch(
      new BadRequestException({
        message: 'Validation failed',
        errors: { password: ['Password must contain at least 16 characters.'] },
      }),
      host as never,
    );

    expect(json).toHaveBeenCalledWith({
      statusCode: 400,
      success: false,
      message: 'Validation failed',
      errors: { password: ['Password must contain at least 16 characters.'] },
      path: '/auth/register',
    });
  });
});

import type {
  CallHandler,
  ExecutionContext,
} from '@nestjs/common';
import { lastValueFrom, of } from 'rxjs';
import { ApiResponse } from '../../responses/api-response.js';
import { ApiResponseInterceptor } from './api-response.interceptor.js';

describe('ApiResponseInterceptor', () => {
  const interceptor = new ApiResponseInterceptor();

  function createContext(statusCode: number): ExecutionContext {
    return {
      switchToHttp: () => ({
        getResponse: () => ({ statusCode }),
      }),
    } as ExecutionContext;
  }

  it('wraps success results with the HTTP status and default message', async () => {
    const result = await lastValueFrom(
      interceptor.intercept(createContext(200), {
        handle: () => of({ id: 1 }),
      } as CallHandler),
    );

    expect(result).toEqual(
      new ApiResponse(200, true, 'Request successful', { id: 1 }),
    );
  });

  it('uses the endpoint message and wraps remaining fields as data', async () => {
    const result = await lastValueFrom(
      interceptor.intercept(createContext(201), {
        handle: () =>
          of({ message: 'Password reset successfully', reset: true }),
      } as CallHandler),
    );

    expect(result).toEqual(
      new ApiResponse(201, true, 'Password reset successfully', {
        reset: true,
      }),
    );
  });
});

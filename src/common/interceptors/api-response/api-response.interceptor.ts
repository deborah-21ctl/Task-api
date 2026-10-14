import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '../../responses/api-response.js';

const DEFAULT_SUCCESS_MESSAGE = 'Request successful';

// Only plain objects should be inspected for a message; arrays and null are response data.
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

@Injectable()
export class ApiResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse> {
    // Read the route's HTTP status (for example, 200 for GET or 201 for POST).
    const response = context.switchToHttp().getResponse<{
      statusCode: number;
    }>();

    // next.handle() is the controller result; map it into the shared response shape.
    return next.handle().pipe(
      map((body: unknown) => {
        if (isRecord(body)) {
          // Reuse a controller's message and put its other fields in data.
          const message =
            typeof body.message === 'string'
              ? body.message
              : DEFAULT_SUCCESS_MESSAGE;
          const data = Object.fromEntries(
            Object.entries(body).filter(([key]) => key !== 'message'),
          );

          return new ApiResponse(
            response.statusCode,
            true,
            message,
            Object.keys(data).length > 0 ? data : undefined,
          );
        }

        return new ApiResponse(
          response.statusCode,
          true,
          DEFAULT_SUCCESS_MESSAGE,
          body,
        );
      }),
    );
  }
}

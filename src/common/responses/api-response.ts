export class ApiResponse<T = unknown> {
  constructor(
    // The HTTP response code, not a custom application-specific code.
    readonly statusCode: number,
    // True for successful responses and false for errors.
    readonly success: boolean,
    readonly message: string,
    // Original endpoint result; optional when the endpoint only returns a message.
    readonly data?: T,
  ) {}
}

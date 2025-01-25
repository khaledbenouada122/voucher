import { HttpException } from '@nestjs/common';
import { throwError } from 'rxjs';

export function handelException(message: string) {
  try {
    if (typeof message !== 'object') {
      return throwError(
        () =>
          new HttpException(message, 500, {
            cause: message,
            description: message,
          })
      );
    }
    const exception = JSON.parse(message);
    let errorMessages = exception;

    if (typeof errorMessages === 'string') {
      try {
        errorMessages = JSON.parse(exception.message); // Parse the string to an array
      } catch (error) {
        // If parsing fails, we can split it into an array (fallback approach)
        errorMessages = errorMessages.split(',');
      }
    }

    // Clean the messages by removing escaped quotes and trimming
    const cleanedMessages = errorMessages.map((msg: string) => msg.replace(/\\"/g, '').trim());
    return throwError(
      () =>
        new HttpException(cleanedMessages, exception.statusCode, {
          cause: exception.cause,
          description: exception.description,
        })
    );
  } catch (error) {
    return throwError(
      () =>
        new HttpException(error.message, 500, {
          cause: error.message,
          description: error.message,
        })
    );
  }

  // Parse the exception.message if it's a string that looks like a JSON array
}
